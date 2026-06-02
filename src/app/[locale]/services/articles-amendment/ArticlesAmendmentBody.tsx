"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  articlesAmendmentSchema,
  type ArticlesAmendmentSubmission,
  type AmendmentChangeType,
} from "@/lib/amendmentSchemas";
import { AMENDMENT_SERVICES } from "@/lib/amendmentServices";
import { LEGAL_ENDINGS } from "@/lib/legalEndings";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, StepProgress, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";

const SERVICE = AMENDMENT_SERVICES["articles-amendment"];
const TOTAL_STEPS = 4;

const AMENDMENT_CHOICES: Array<{ value: AmendmentChangeType; label: string; description: string }> = [
  {
    value: "corporate_name",
    label: "Corporate name",
    description: "Rename the corporation (the new name must clear a NUANS-type search if changing to a named form).",
  },
  {
    value: "share_structure",
    label: "Share structure (authorized classes)",
    description: "Add, remove, or reorganize the classes of shares the corporation is authorized to issue.",
  },
  {
    value: "share_provisions",
    label: "Rights / restrictions attached to shares",
    description: "Change voting, dividend, redemption, or other rights for one or more existing classes.",
  },
  {
    value: "number_of_directors",
    label: "Minimum / maximum number of directors",
    description: "Change the fixed number, or the min/max range, of directors set out in the Articles.",
  },
  {
    value: "business_restrictions",
    label: "Restrictions on the business",
    description: "Add or remove restrictions on the business the corporation may carry on.",
  },
  {
    value: "other_provisions",
    label: "Other provisions in the Articles",
    description: "Anything else set out in the original Articles (described in the next step).",
  },
];

export default function ArticlesAmendmentPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ArticlesAmendmentSubmission>({
    resolver: zodResolver(articlesAmendmentSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "federal", corpName: "", corpNumber: "", businessNumber: "" },
      changeTypes: [],
      newCorpName: "",
      newLegalEnding: undefined,
      minDirectors: undefined,
      maxDirectors: undefined,
      fixedDirectors: undefined,
      amendmentDescription: "",
      effectiveDate: "",
      specialResolutionPassed: false,
      specialResolutionDate: "",
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
  const changeTypes = watch("changeTypes") ?? [];

  function toggleChangeType(value: AmendmentChangeType, checked: boolean) {
    const next = checked
      ? Array.from(new Set([...changeTypes, value]))
      : changeTypes.filter((v) => v !== value);
    setValue("changeTypes", next, { shouldValidate: true });
  }

  const includesName = changeTypes.includes("corporate_name");
  const includesDirectors = changeTypes.includes("number_of_directors");

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof ArticlesAmendmentSubmission | string>> = {
      1: ["corporation"],
      2: [
        "changeTypes",
        "newCorpName",
        "newLegalEnding",
        "minDirectors",
        "maxDirectors",
        "fixedDirectors",
        "amendmentDescription",
        "effectiveDate",
        "specialResolutionPassed",
        "specialResolutionDate",
      ],
      3: ["contact"],
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

  async function onFinalSubmit(data: ArticlesAmendmentSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/amendment-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "articles-amendment", payload: data }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? "Submission failed.");
      window.location.href = json.url;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed.");
      setSubmitting(false);
    }
  }

  const region = watch("billingAddress.region") || "";
  const country = watch("billingAddress.country") || "CA";
  const taxRate = getTaxRate(country, region);
  const tax = Math.round(SERVICE.price * taxRate * 100) / 100;
  const total = Math.round((SERVICE.price + tax) * 100) / 100;

  return (
    <FormProvider {...form}>
      <section className="bg-cream-50 py-12 px-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-3">Amendment</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-4">{SERVICE.label}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{SERVICE.description}</p>
          <p className="mt-4 text-sm text-gray-500">
            <span className="font-semibold text-navy-900">${SERVICE.price} CAD</span> + applicable tax + government filing fees (pass-through). Filed within 3 business days.
          </p>
          <div className="mt-4 p-3 bg-amber-50 border-l-3 border-gold-500 text-xs text-amber-900 leading-relaxed">
            <strong>Required by statute:</strong> Articles of Amendment must be authorized by a <strong>special resolution</strong> (two-thirds of the votes cast by shareholders entitled to vote). Korporex prepares and files the form; the resolution itself must be passed before filing.
          </div>
        </div>
      </section>

      <section className="bg-white py-12 px-6">
        <div className="max-w-xl mx-auto">
          <StepProgress step={step} total={TOTAL_STEPS} />

          {step === 1 && (
            <div>
              <button
                type="button"
                onClick={() => router.push("/services")}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 mb-8 transition-colors"
              >
                ← Back to services
              </button>
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Your Corporation</h2>
              <p className="text-gray-500 text-sm mb-8">Tell us which corporation&apos;s Articles you&apos;re amending.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <CorporationIdSection errors={errors.corporation} />
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">The Amendment</h2>
              <p className="text-gray-500 text-sm mb-6">
                {jurisdiction === "federal" ? (
                  <>Filed as <strong>Form 4 – Articles of Amendment</strong> under CBCA s.173.</>
                ) : (
                  <>Filed as <strong>Articles of Amendment</strong> under OBCA s.168.</>
                )}
              </p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-3">
                    What&apos;s being amended? <span className="text-red-500">*</span>
                  </p>
                  <div className="space-y-2">
                    {AMENDMENT_CHOICES.map((c) => {
                      const checked = changeTypes.includes(c.value);
                      return (
                        <label
                          key={c.value}
                          className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                            checked ? "border-navy-900 bg-cream-50" : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => toggleChangeType(c.value, e.target.checked)}
                            className="mt-1 accent-navy-900"
                          />
                          <span>
                            <span className="text-sm font-medium text-gray-900 block">{c.label}</span>
                            <span className="text-xs text-gray-500">{c.description}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {typeof errors.changeTypes?.message === "string" && (
                    <p className="text-xs text-red-500 mt-2">{errors.changeTypes.message}</p>
                  )}
                </div>

                {includesName && (
                  <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30 space-y-4">
                    <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">Corporate name change</p>
                    <Field label="New corporate name *" error={errors.newCorpName?.message} hint="The distinctive part of the name, without the legal ending.">
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
                    <p className="text-xs text-gray-500">
                      For named-to-named changes, a NUANS search may be required. For changes to a numbered corporation, the registry will assign the number — leave the name blank and select <em>(numbered)</em> in the description.
                    </p>
                  </div>
                )}

                {includesDirectors && (
                  <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30 space-y-4">
                    <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">Number of directors</p>
                    <p className="text-xs text-gray-500">
                      Provide either a fixed number, or a minimum and maximum range. {jurisdiction === "federal" ? <>CBCA s.102: 1+ for non-distributing corps, 3+ if shares are publicly traded.</> : <>OBCA s.115: 1+ for non-offering corps, 3+ for offering corps.</>}
                    </p>
                    <Field label="Fixed number of directors" error={errors.fixedDirectors?.message} hint="Use this if the Articles will set a single fixed number.">
                      <input
                        type="number"
                        min={1}
                        max={50}
                        {...register("fixedDirectors", { setValueAs: (v) => (v === "" || v == null ? undefined : Number(v)) })}
                        className={iCls}
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Minimum" error={errors.minDirectors?.message}>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          {...register("minDirectors", { setValueAs: (v) => (v === "" || v == null ? undefined : Number(v)) })}
                          className={iCls}
                        />
                      </Field>
                      <Field label="Maximum" error={errors.maxDirectors?.message}>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          {...register("maxDirectors", { setValueAs: (v) => (v === "" || v == null ? undefined : Number(v)) })}
                          className={iCls}
                        />
                      </Field>
                    </div>
                  </div>
                )}

                <Field
                  label="Amendment description *"
                  error={errors.amendmentDescription?.message}
                  hint="Describe the amendment(s) in plain English. The drafter will turn this into the formal amendment language for the form."
                >
                  <textarea
                    {...register("amendmentDescription")}
                    rows={6}
                    className={`${iCls} resize-none`}
                    placeholder={
                      "Example: Add a new Class D Special share class with the following rights:\n  - Non-voting\n  - Discretionary dividends\n  - Return of paid-up capital only on dissolution\n  - Redeemable at the option of the corporation"
                    }
                  />
                </Field>

                <Field label="Effective date *" error={errors.effectiveDate?.message} hint="When the amendment should take effect (must be on or after the filing date).">
                  <input type="date" {...register("effectiveDate")} className={iCls} />
                </Field>

                <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30 space-y-4">
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">Special resolution</p>
                  <label className="flex items-start gap-3 text-sm cursor-pointer">
                    <input type="checkbox" {...register("specialResolutionPassed")} className="mt-1 accent-navy-900" />
                    <span className="text-gray-700">
                      I confirm a <strong>special resolution</strong> authorizing this amendment has been passed by the shareholders entitled to vote (two-thirds majority).
                    </span>
                  </label>
                  {errors.specialResolutionPassed?.message && (
                    <p className="text-xs text-red-500">{errors.specialResolutionPassed.message}</p>
                  )}
                  <Field label="Resolution date *" error={errors.specialResolutionDate?.message} hint="Date the special resolution was signed / passed at the meeting.">
                    <input type="date" {...register("specialResolutionDate")} className={iCls} />
                  </Field>
                </div>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <BackBtn onClick={() => setStep(2)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Contact</h2>
              <p className="text-gray-500 text-sm mb-8">Who should we reach out to with questions about this filing.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(4); }} className="space-y-5">
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

          {step === 4 && (
            <div>
              <BackBtn onClick={() => setStep(3)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Billing &amp; Review</h2>
              <p className="text-gray-500 text-sm mb-8">Final step. We&apos;ll redirect you to Stripe to complete payment.</p>
              <form onSubmit={handleSubmit(onFinalSubmit)} className="space-y-5">
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
                      <span className="text-gray-700">{SERVICE.label}</span>
                      <span className="text-gray-900">${SERVICE.price.toFixed(2)}</span>
                    </div>
                    {tax > 0 && (
                      <div className="flex justify-between text-gray-500 text-xs">
                        <span>Tax ({(taxRate * 100).toFixed(0)}% — {region || "—"})</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
                      <span className="text-navy-900">Total (CAD)</span>
                      <span className="text-navy-900">${total.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      Government filing fees (Corporations Canada $200 / Ontario $150) are billed separately as a pass-through after submission. NUANS reports (if required for a name change) are also billed as a pass-through.
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
