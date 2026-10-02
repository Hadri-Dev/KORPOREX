"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  registeredOfficeSchema,
  type RegisteredOfficeSubmission,
} from "@/lib/businessUpdateSchemas";
import { BUSINESS_UPDATE_SERVICES, computeRegisteredOfficeSubtotal } from "@/lib/businessUpdateServices";
import { getTaxRate, REG_OFFICE_OPTIONS, type RegOfficeLocation } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";

const SERVICE = BUSINESS_UPDATE_SERVICES["registered-office"];

const STEP_LABELS = ["Office", "Corporation", "Contact", "Billing"];
const STEP_FIELDS: string[][] = [
  ["location"],
  ["corporation", "currentRegisteredOffice", "federalArticlesOntario", "notes"],
  ["contact"],
  ["billingName", "billingAddress", "acceptTerms"],
];

const emptyAddress = { street: "", city: "", region: "", postalCode: "", country: "CA" };

const LOCATIONS: RegOfficeLocation[] = ["korporex", "burlington"];

const LOCATION_COPY: Record<RegOfficeLocation, { title: string; subtitle: string }> = {
  korporex: {
    title: "Toronto",
    subtitle: "Downtown Toronto address chosen by Korporex. Mail scans emailed to you monthly.",
  },
  burlington: {
    title: "Burlington",
    subtitle: "Burlington, Ontario address chosen by Korporex. Mail scans emailed to you monthly.",
  },
};

function LocationOption({ selected, onSelect, location }: {
  selected: boolean;
  onSelect: () => void;
  location: RegOfficeLocation;
}) {
  const opt = REG_OFFICE_OPTIONS[location];
  const copy = LOCATION_COPY[location];
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left border-2 p-4 transition-colors ${
        selected ? "border-navy-900 bg-navy-50" : "border-gold-200 bg-white hover:border-navy-900"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className={`font-medium text-sm ${selected ? "text-navy-900" : "text-gray-900"}`}>{copy.title}</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{copy.subtitle}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className={`text-sm font-semibold ${selected ? "text-navy-900" : "text-gray-900"}`}>
            ${opt.annual.toFixed(2)}/yr
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5">billed annually in advance + HST</p>
        </div>
      </div>
    </button>
  );
}

export default function RegisteredOfficeBody() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<RegisteredOfficeSubmission>({
    resolver: zodResolver(registeredOfficeSchema),
    mode: "onTouched",
    defaultValues: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      location: undefined as any,
      corporation: { jurisdiction: "ontario", corpName: "", corpNumber: "", businessNumber: "" },
      currentRegisteredOffice: { ...emptyAddress },
      federalArticlesOntario: false,
      notes: "",
      contact: {
        contactFirstName: "",
        contactLastName: "",
        contactEmail: "",
        contactPhone: "",
        contactRole: "",
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      acceptTerms: false as any,
      billingName: "",
      billingAddress: { ...emptyAddress },
    },
  });

  const { handleSubmit, trigger, watch, register, setValue, formState: { errors } } = form;
  const location = watch("location");
  const jurisdiction = watch("corporation.jurisdiction");

  async function gotoStep(next: number) {
    const fields = STEP_FIELDS[step - 1];
    if (fields) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const valid = await trigger(fields as any);
      if (!valid) return;
    }
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onFinalSubmit(data: RegisteredOfficeSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/business-update-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "registered-office", payload: data }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? "Submission failed.");
      window.location.href = json.url;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed.");
      setSubmitting(false);
    }
  }

  const opt = location ? REG_OFFICE_OPTIONS[location] : null;
  const subtotal = location ? computeRegisteredOfficeSubtotal(location) : 0;
  const region = watch("billingAddress.region") || "";
  const country = watch("billingAddress.country") || "CA";
  const taxRate = getTaxRate(country, region);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  return (
    <FormProvider {...form}>
      <section className="bg-cream-50 py-8 px-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-4">{SERVICE.label}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{SERVICE.description}</p>
          <p className="mt-4 text-sm text-gray-500">
            <span className="font-semibold text-navy-900">
              Burlington ${REG_OFFICE_OPTIONS.burlington.annual.toFixed(2)}/yr
            </span>{" "}
            or{" "}
            <span className="font-semibold text-navy-900">
              Toronto ${REG_OFFICE_OPTIONS.korporex.annual.toFixed(2)}/yr
            </span>
            , billed annually in advance + applicable tax. Filing the change of registered office is included.
          </p>
        </div>
      </section>

      <section className="bg-white py-12 px-6">
        <div className="max-w-xl mx-auto">
          <WizardStepper steps={STEP_LABELS} current={step} onGo={setStep} />

          {step === 1 && (
            <div>
              <button
                type="button"
                onClick={() => router.push("/services")}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 mb-8 transition-colors"
              >
                ← Back to services
              </button>
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Choose an Office</h2>
              <p className="text-gray-500 text-sm mb-8">
                Pick the Korporex office that will serve as your corporation&apos;s registered office address.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <div className="space-y-3">
                  {LOCATIONS.map((loc) => (
                    <LocationOption
                      key={loc}
                      location={loc}
                      selected={location === loc}
                      onSelect={() => setValue("location", loc, { shouldValidate: true })}
                    />
                  ))}
                  {errors.location?.message && <p className="text-xs text-red-500">{errors.location.message}</p>}
                </div>

                {opt && (
                  <div className="bg-navy-50 border border-navy-900 rounded-lg p-4 text-sm text-navy-900 leading-relaxed">
                    <p className="font-semibold mb-1">
                      {opt.label} - {opt.locationLabel}
                    </p>
                    <p className="text-gray-700">
                      {opt.addressAssignedAtFiling
                        ? "Korporex selects and assigns the registered office address in downtown Toronto, at our discretion, before we file the change. The street address is not disclosed in advance."
                        : `Korporex provides a registered office address in ${opt.locationLabel}, Ontario, chosen by Korporex. The specific street address is not disclosed in advance.`}
                    </p>
                    <ul className="text-xs text-gray-700 mt-3 space-y-1.5 list-disc pl-5">
                      <li>We prepare the directors&apos; resolution and file the change of registered office with the registry.</li>
                      <li>Monthly scanned copy of mail received at the address, emailed to you.</li>
                      <li>The Korporex address appears on the public corporate registry.</li>
                      <li>
                        ${opt.annual.toFixed(2)} CAD billed annually in advance, plus HST. <strong>Non-refundable</strong>,
                        including if you move your registered office elsewhere before the term ends.
                      </li>
                    </ul>
                  </div>
                )}
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Your Corporation</h2>
              <p className="text-gray-500 text-sm mb-8">
                Tell us which corporation is moving its registered office. Copy the details from your Certificate and
                Articles of Incorporation.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <CorporationIdSection errors={errors.corporation} />
                {jurisdiction === "federal" && (
                  <div className="border border-gray-200 rounded-lg p-5">
                    <label className="flex items-start gap-3 text-sm cursor-pointer">
                      <input type="checkbox" {...register("federalArticlesOntario")} className="mt-1 accent-navy-900" />
                      <span className="text-gray-800">
                        I confirm my Articles of Incorporation name <strong>Ontario</strong> as the province of the
                        registered office. <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      A federal corporation&apos;s registered office must be in the province named in its articles. If
                      your articles name another province, an Articles of Amendment filing is needed first.
                    </p>
                    {errors.federalArticlesOntario?.message && (
                      <p className="text-xs text-red-500 mt-2">{errors.federalArticlesOntario.message}</p>
                    )}
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    Current registered office address <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="currentRegisteredOffice" errors={errors.currentRegisteredOffice} />
                </div>
                <Field label="Notes" error={errors.notes?.message} hint="Optional. E.g. a preferred start date for the new address.">
                  <textarea {...register("notes")} rows={3} maxLength={2000} className={`${iCls} resize-none`} />
                </Field>
                <NextBtn />
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <BackBtn onClick={() => setStep(2)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Contact</h2>
              <p className="text-gray-500 text-sm mb-8">
                Who should we reach out to about this order. Monthly mail scans are emailed to this address.
              </p>
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
                  <input type="tel" autoComplete="tel" {...register("contact.contactPhone")} className={iCls} placeholder="+1 416 555 0100" />
                </Field>
                <Field label="Your role" error={errors.contact?.contactRole?.message} hint="Optional. E.g. director, shareholder, accountant.">
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
              <form onSubmit={handleSubmit(onFinalSubmit, (errs) => { const s = firstErrorStep(errs, STEP_FIELDS); if (s) setStep(s); })} className="space-y-5">
                <Field label="Billing name *" error={errors.billingName?.message} hint="Name on the credit/debit card.">
                  <input type="text" {...register("billingName")} className={iCls} />
                </Field>
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    Billing address <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="billingAddress" errors={errors.billingAddress} canadaOnly={false} />
                </div>

                {opt && (
                  <div className="border border-gray-200 rounded-lg bg-cream-50 p-5 mt-4">
                    <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">Order summary</p>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Registered office: {opt.locationLabel} (12 months)</span>
                        <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        12-month term, billed annually in advance. Includes filing the change of registered office.
                      </p>
                      {tax > 0 && (
                        <div className="flex justify-between text-gray-500 text-xs">
                          <span>Tax ({(taxRate * 100).toFixed(taxRate === 0.14975 ? 3 : 0)}%{region ? `, ${region}` : ""})</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
                        <span className="text-navy-900">Total (CAD)</span>
                        <span className="text-navy-900">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border border-gray-200 rounded-lg p-5">
                  <label className="flex items-start gap-3 text-sm cursor-pointer">
                    <input type="checkbox" {...register("acceptTerms")} className="mt-1 accent-navy-900" />
                    <span className="text-gray-800">
                      I understand the annual fee is billed in advance for a 12-month term and is{" "}
                      <strong>non-refundable</strong>, and I authorize Korporex to file the change of registered office.{" "}
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                  {errors.acceptTerms?.message && (
                    <p className="text-xs text-red-500 mt-2">{errors.acceptTerms.message}</p>
                  )}
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
