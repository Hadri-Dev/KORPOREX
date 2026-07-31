"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import { Check } from "lucide-react";
import {
  changeNameSchema,
  computeChangeNamePricing,
  CHANGE_NAME_PRICES,
  MINUTE_BOOK_ADDON_FEE,
  EXTRA_NUANS_FEE,
  type ChangeNameSubmission,
} from "@/lib/changeNameSchema";
import { JURISDICTION_LABELS, type Jurisdiction } from "@/lib/pricing";
import { LEGAL_ENDINGS } from "@/lib/legalEndings";
import { Field, BackBtn, NextBtn, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";

const STEP_LABELS = ["Jurisdiction", "Corporation", "New name", "Contact", "Billing"];

// Fully clickable stepper — every step navigates directly. On final submit,
// onInvalid (below) jumps the user to the first step that has an error, so
// free navigation never lets a required field be silently skipped.
function WizardStepper({ step, onGo }: { step: number; onGo: (n: number) => void }) {
  return (
    <ol className="flex items-center mb-8">
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const current = n === step;
        return (
          <li key={label} className={n < STEP_LABELS.length ? "flex items-center flex-1" : "flex items-center"}>
            <button
              type="button"
              onClick={() => onGo(n)}
              aria-current={current ? "step" : undefined}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold shrink-0 border-2 transition-colors ${
                  done
                    ? "bg-navy-900 border-navy-900 text-white"
                    : current
                      ? "bg-navy-900 border-gold-500 text-white ring-2 ring-gold-500/30"
                      : "bg-white border-gray-300 text-gray-400 hover:border-navy-900 hover:text-navy-900"
                }`}
              >
                {done ? <Check size={14} /> : n}
              </span>
              <span
                className={`hidden sm:inline text-xs font-semibold whitespace-nowrap transition-colors ${
                  current ? "text-navy-900" : done ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </button>
            {n < STEP_LABELS.length && (
              <span className={`mx-2 sm:mx-3 h-0.5 flex-1 rounded transition-colors ${done ? "bg-navy-900" : "bg-gray-200"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

const JURISDICTIONS: Array<{
  value: Jurisdiction;
  name: string;
  statute: string;
  registry: string;
  govFee: string;
}> = [
  {
    value: "ontario",
    name: "Ontario Corporation",
    statute: "Articles of Amendment · OBCA s.168",
    registry: "Filed with the Ontario Business Registry. Government fee $150 plus Ontario NUANS, both included.",
    govFee: "$150",
  },
  {
    value: "federal",
    name: "Federal Corporation",
    statute: "Articles of Amendment (Form 4) · CBCA s.173",
    registry: "Filed with Corporations Canada. Government fee $200 plus federal NUANS, both included.",
    govFee: "$200",
  },
];

const INCLUDED = [
  "Preparation of the Articles of Amendment (name change)",
  "Government filing fee included (ON $150 / Federal $200)",
  "One (1) NUANS name search report included",
  "Name pre-screening for availability and distinctiveness",
  "Updated Certificate and Articles of Amendment",
];

export default function ChangeNameBody() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ChangeNameSubmission>({
    resolver: zodResolver(changeNameSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "ontario", corpName: "", corpNumber: "", businessNumber: "" },
      companyKey: "",
      newCorpName: "",
      newLegalEnding: undefined,
      effectiveDate: "",
      specialResolutionPassed: false,
      specialResolutionDate: "",
      updateMinuteBook: false,
      contact: {
        contactFirstName: "",
        contactLastName: "",
        contactEmail: "",
        contactPhone: "",
        contactRole: "",
      },
      billingName: "",
      billingAddress: { street: "", city: "", region: "", postalCode: "", country: "CA" },
    },
  });

  const { handleSubmit, trigger, watch, register, setValue, formState: { errors } } = form;
  const jurisdiction = watch("corporation.jurisdiction");
  const updateMinuteBook = watch("updateMinuteBook");
  const region = watch("billingAddress.region") || "";
  const country = watch("billingAddress.country") || "CA";

  const pricing = computeChangeNamePricing({
    jurisdiction,
    updateMinuteBook: !!updateMinuteBook,
    billingCountry: country,
    billingRegion: region,
  });

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof ChangeNameSubmission | string>> = {
      1: ["corporation.jurisdiction"],
      2: ["corporation", "companyKey"],
      3: [
        "newCorpName",
        "newLegalEnding",
        "effectiveDate",
        "specialResolutionPassed",
        "specialResolutionDate",
      ],
      4: ["contact"],
    };
    const fields = fieldsByStep[step];
    if (fields) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const valid = await trigger(fields as any);
      if (!valid) return;
    }
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onFinalSubmit(data: ChangeNameSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/change-name-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "change-name", payload: data }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? "Submission failed.");
      window.location.href = json.url;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed.");
      setSubmitting(false);
    }
  }

  function goTo(n: number) {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // If the final submit fails validation, jump to the earliest step whose
  // fields have an error (fields on other steps aren't visible otherwise).
  function onInvalid(errs: typeof errors) {
    if (errs.corporation?.jurisdiction) return goTo(1);
    if (errs.corporation || errs.companyKey) return goTo(2);
    if (
      errs.newCorpName ||
      errs.newLegalEnding ||
      errs.effectiveDate ||
      errs.specialResolutionPassed ||
      errs.specialResolutionDate
    )
      return goTo(3);
    if (errs.contact) return goTo(4);
    if (errs.billingName || errs.billingAddress) return goTo(5);
  }

  const taxPctLabel = pricing.taxRate === 0.14975 ? "14.975" : (pricing.taxRate * 100).toFixed(0);

  return (
    <FormProvider {...form}>
      <section className="bg-cream-50 py-8 px-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-4">
            Change of Business Name
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Legally change your corporation&apos;s name in Ontario or federally in Canada. We prepare
            and file the Articles of Amendment, run the required NUANS name search, and issue your
            updated certificate — the government filing fee and one NUANS search are included in one
            flat price.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            <span className="font-semibold text-navy-900">
              ${CHANGE_NAME_PRICES.ontario.toFixed(2)} (Ontario) / ${CHANGE_NAME_PRICES.federal.toFixed(2)} (Federal) CAD
            </span>{" "}
            + HST. Government filing fee and one NUANS search included. Filed within 1 to 2 business days.
          </p>
          <div className="mt-4 p-3 bg-amber-50 border-l-3 border-gold-500 text-xs text-amber-900 leading-relaxed">
            <strong>Required by statute:</strong> a corporate name change must be authorized by a{" "}
            <strong>special resolution</strong> of the shareholders (two-thirds of the votes cast).
            Korporex prepares and files the Articles of Amendment; the resolution must be passed
            before filing.
          </div>
        </div>
      </section>

      <section className="bg-white py-12 px-6">
        <div className="max-w-xl mx-auto">
          <WizardStepper step={step} onGo={goTo} />

          {/* STEP 1 — Jurisdiction */}
          {step === 1 && (
            <div>
              <button
                type="button"
                onClick={() => router.push("/services")}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 mb-8 transition-colors"
              >
                ← Back to services
              </button>
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Choose your corporation type</h2>
              <p className="text-gray-500 text-sm mb-8">
                Your jurisdiction determines the registry, the statute, and the government fee, all
                included in your flat price.
              </p>

              <div className="space-y-4">
                {JURISDICTIONS.map((j) => {
                  const selected = jurisdiction === j.value;
                  return (
                    <button
                      key={j.value}
                      type="button"
                      onClick={() => setValue("corporation.jurisdiction", j.value, { shouldValidate: true })}
                      className={`w-full text-left border-2 rounded-lg p-5 transition-all ${
                        selected ? "border-navy-900 bg-cream-50 shadow-sm" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-serif text-xl font-semibold text-navy-900">{j.name}</p>
                          <p className="text-xs font-medium text-gold-600 uppercase tracking-wide mt-0.5 mb-2">
                            {j.statute}
                          </p>
                          <p className="text-sm text-gray-600 leading-relaxed">{j.registry}</p>
                        </div>
                        <span
                          className={`shrink-0 mt-1 w-5 h-5 rounded-full border-2 ${
                            selected ? "border-navy-900 bg-navy-900" : "border-gray-300"
                          } flex items-center justify-center`}
                        >
                          {selected && <span className="w-2 h-2 rounded-full bg-white" />}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-navy-900 mt-3">
                        ${CHANGE_NAME_PRICES[j.value].toFixed(2)} <span className="font-medium text-gray-500">+ HST</span>
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 border border-gray-200 rounded-lg p-5 bg-cream-50/40">
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">
                  What&apos;s included in the flat price
                </p>
                <ul className="space-y-2">
                  {INCLUDED.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check size={14} className="text-navy-900 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 mt-3">
                  One NUANS name search is included. Each additional search (for a further name choice)
                  is ${EXTRA_NUANS_FEE.toFixed(2)} + HST.
                </p>
              </div>

              <button
                type="button"
                onClick={() => gotoStep(2)}
                className="w-full bg-navy-900 text-white font-medium py-3.5 text-sm tracking-wide hover:bg-navy-800 transition-colors mt-6"
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2 — Corporation */}
          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Your corporation</h2>
              <p className="text-gray-500 text-sm mb-8">
                Tell us which {jurisdiction === "federal" ? "federal" : "Ontario"} corporation is changing its name.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <CorporationIdSection errors={errors.corporation} lockedJurisdiction={jurisdiction} />
                <Field
                  label="Company Key *"
                  error={errors.companyKey?.message}
                  hint={
                    jurisdiction === "federal"
                      ? "The confidential Corporate Key from Corporations Canada that authorizes online filings for your corporation."
                      : "The confidential Company Key issued by the Ontario Business Registry that authorizes online filings for your corporation."
                  }
                >
                  <input type="text" {...register("companyKey")} className={iCls} placeholder="e.g. 1a2b3c4d5e" />
                </Field>
                <NextBtn />
              </form>
            </div>
          )}

          {/* STEP 3 — New name */}
          {step === 3 && (
            <div>
              <BackBtn onClick={() => setStep(2)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">The new name</h2>
              <p className="text-gray-500 text-sm mb-6">
                This is the name we&apos;ll clear through NUANS and file on the Articles of Amendment.
              </p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(4); }} className="space-y-5">
                <Field
                  label="New corporate name *"
                  error={errors.newCorpName?.message}
                  hint="The distinctive part of the name, without the legal ending."
                >
                  <input type="text" {...register("newCorpName")} className={iCls} placeholder="Acme Holdings" />
                </Field>
                <Field label="New legal ending *" error={errors.newLegalEnding?.message}>
                  <select {...register("newLegalEnding")} className={sCls}>
                    <option value="">Select…</option>
                    {LEGAL_ENDINGS.map((le) => (
                      <option key={le} value={le}>{le}</option>
                    ))}
                  </select>
                </Field>

                <div className="p-3 bg-amber-50 border-l-3 border-gold-500 text-xs text-amber-900 leading-relaxed">
                  Your price includes <strong>one NUANS name search</strong>. If the name isn&apos;t
                  available or is too similar to an existing name, we&apos;ll flag it and help you pick
                  an alternative. Each additional NUANS search is <strong>${EXTRA_NUANS_FEE.toFixed(2)} + HST</strong>.
                </div>

                <Field
                  label="Effective date *"
                  error={errors.effectiveDate?.message}
                  hint="When the name change should take effect (on or after the filing date)."
                >
                  <input type="date" {...register("effectiveDate")} className={iCls} />
                </Field>

                <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30 space-y-4">
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">Special resolution</p>
                  <label className="flex items-start gap-3 text-sm cursor-pointer">
                    <input type="checkbox" {...register("specialResolutionPassed")} className="mt-1 accent-navy-900" />
                    <span className="text-gray-700">
                      I confirm a <strong>special resolution</strong> authorizing this name change has
                      been passed by the shareholders entitled to vote (two-thirds majority).
                    </span>
                  </label>
                  {errors.specialResolutionPassed?.message && (
                    <p className="text-xs text-red-500">{errors.specialResolutionPassed.message}</p>
                  )}
                  <Field
                    label="Resolution date *"
                    error={errors.specialResolutionDate?.message}
                    hint="Date the special resolution was signed / passed."
                  >
                    <input type="date" {...register("specialResolutionDate")} className={iCls} />
                  </Field>
                </div>

                {/* Optional minute-book add-on */}
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">Optional add-on</p>
                  <label
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      updateMinuteBook ? "border-navy-900 bg-cream-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input type="checkbox" {...register("updateMinuteBook")} className="mt-1 accent-navy-900" />
                    <span className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">
                        Update the minute book to reflect the new name
                      </span>
                      <span className="text-xs text-gray-500">
                        We prepare the directors&apos; and shareholders&apos; resolutions and update
                        your corporate records so everything matches the new name.
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-navy-900 whitespace-nowrap">
                      +${MINUTE_BOOK_ADDON_FEE} <span className="font-medium text-gray-500">+HST</span>
                    </span>
                  </label>
                </div>

                <NextBtn />
              </form>
            </div>
          )}

          {/* STEP 4 — Contact */}
          {step === 4 && (
            <div>
              <BackBtn onClick={() => setStep(3)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Contact</h2>
              <p className="text-gray-500 text-sm mb-8">Who should we reach out to with questions about this filing.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(5); }} className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name *" error={errors.contact?.contactFirstName?.message}>
                    <input type="text" {...register("contact.contactFirstName")} className={iCls} />
                  </Field>
                  <Field label="Last name *" error={errors.contact?.contactLastName?.message}>
                    <input type="text" {...register("contact.contactLastName")} className={iCls} />
                  </Field>
                </div>
                <Field label="Email *" error={errors.contact?.contactEmail?.message}>
                  <input type="email" autoComplete="email" {...register("contact.contactEmail")} className={iCls} />
                </Field>
                <Field label="Phone *" error={errors.contact?.contactPhone?.message}>
                  <input type="tel" autoComplete="tel" {...register("contact.contactPhone")} className={iCls} />
                </Field>
                <Field label="Your role" error={errors.contact?.contactRole?.message} hint="Optional — e.g. director, corporate secretary, accountant.">
                  <input type="text" {...register("contact.contactRole")} className={iCls} />
                </Field>
                <NextBtn />
              </form>
            </div>
          )}

          {/* STEP 5 — Billing & review */}
          {step === 5 && (
            <div>
              <BackBtn onClick={() => setStep(4)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Billing &amp; Review</h2>
              <p className="text-gray-500 text-sm mb-8">Final step. We&apos;ll redirect you to Stripe to complete payment.</p>
              <form onSubmit={handleSubmit(onFinalSubmit, onInvalid)} className="space-y-5">
                <Field label="Billing name *" error={errors.billingName?.message} hint="Name on the credit/debit card.">
                  <input type="text" {...register("billingName")} className={iCls} />
                </Field>
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    Billing address <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="billingAddress" errors={errors.billingAddress} canadaOnly={false} />
                </div>

                <div className="border border-gray-200 rounded-lg bg-cream-50 p-5 mt-4">
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">Order summary</p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Change of Business Name ({JURISDICTION_LABELS[jurisdiction]})</span>
                      <span className="text-gray-900">${pricing.base.toFixed(2)}</span>
                    </div>
                    {pricing.minuteBookFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">Minute book update</span>
                        <span className="text-gray-900">${pricing.minuteBookFee.toFixed(2)}</span>
                      </div>
                    )}
                    {pricing.tax > 0 && (
                      <div className="flex justify-between text-gray-500 text-xs">
                        <span>Tax ({taxPctLabel}% — {region || "—"})</span>
                        <span>${pricing.tax.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
                      <span className="text-navy-900">Total (CAD)</span>
                      <span className="text-navy-900">${pricing.total.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      The government filing fee (ON $150 / Federal $200) and one NUANS name search are
                      included in the price above — there are no separate pass-through charges for this
                      service.
                    </p>
                  </div>
                </div>

                {submitError && (
                  <div className="border border-red-200 bg-red-50 text-red-900 text-sm rounded-md p-3">{submitError}</div>
                )}

                <NextBtn label={submitting ? "Redirecting to Stripe…" : "Continue to Payment"} disabled={submitting} />
                <p className="text-xs text-gray-500 text-center mt-2">
                  Payment is processed securely by Stripe. Card details never touch our server.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </FormProvider>
  );
}
