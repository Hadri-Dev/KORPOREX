"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  continuanceSchema,
  type ContinuanceSubmission,
  type CurrentDirector,
} from "@/lib/businessUpdateSchemas";
import { BUSINESS_UPDATE_SERVICES } from "@/lib/businessUpdateServices";
import { LEGAL_ENDINGS } from "@/lib/legalEndings";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, StepProgress, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import { CurrentDirectorsArray } from "@/components/wizard/CurrentPeopleSection";

const SERVICE = BUSINESS_UPDATE_SERVICES["continuance"];
const TOTAL_STEPS = 5;

const emptyAddress = { street: "", city: "", region: "", postalCode: "", country: "CA" };
const emptyDirector: CurrentDirector = {
  firstName: "",
  lastName: "",
  email: "",
  canadianResident: false,
  electedDate: "",
  address: { ...emptyAddress },
};

export default function ContinuancePage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ContinuanceSubmission>({
    resolver: zodResolver(continuanceSchema),
    mode: "onTouched",
    defaultValues: {
      direction: "into",
      currentJurisdiction: "ontario",
      currentJurisdictionOther: "",
      destinationJurisdiction: "federal",
      destinationJurisdictionOther: "",
      currentCorpName: "",
      currentCorpNumber: "",
      businessNumber: "",
      nameChanging: false,
      newCorpName: "",
      newLegalEnding: undefined,
      newRegisteredOffice: { ...emptyAddress },
      reasonForContinuance: "",
      specialResolutionPassed: false,
      specialResolutionDate: "",
      effectiveDate: "",
      directors: [{ ...emptyDirector }],
      contact: {
        contactFirstName: "",
        contactLastName: "",
        contactEmail: "",
        contactPhone: "",
        contactRole: "",
      },
      billingName: "",
      billingAddress: { ...emptyAddress },
    },
  });

  const { handleSubmit, trigger, watch, register, formState: { errors } } = form;
  const currentJurisdiction = watch("currentJurisdiction");
  const destinationJurisdiction = watch("destinationJurisdiction");
  const nameChanging = watch("nameChanging");
  const direction = watch("direction");
  // Show federal Canadian-resident attestation when the destination is federal.
  const destinationIsFederal = destinationJurisdiction === "federal";

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof ContinuanceSubmission | string>> = {
      1: [
        "direction",
        "currentJurisdiction",
        "currentJurisdictionOther",
        "destinationJurisdiction",
        "destinationJurisdictionOther",
        "currentCorpName",
        "currentCorpNumber",
        "businessNumber",
      ],
      2: ["nameChanging", "newCorpName", "newLegalEnding", "newRegisteredOffice"],
      3: ["reasonForContinuance", "specialResolutionPassed", "specialResolutionDate", "effectiveDate", "directors"],
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

  async function onFinalSubmit(data: ContinuanceSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/business-update-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "continuance", payload: data }),
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
      <section className="bg-cream-50 py-8 px-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-4">{SERVICE.label}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{SERVICE.description}</p>
          <p className="mt-4 text-sm text-gray-500">
            <span className="font-semibold text-navy-900">${SERVICE.price} CAD</span> + applicable tax + government filing fees (pass-through, both jurisdictions). Filed within 5 business days.
          </p>
          <div className="mt-4 p-3 bg-amber-50 border-l-3 border-gold-500 text-xs text-amber-900 leading-relaxed">
            <strong>Two filings, one process:</strong> a continuance requires <em>authorization to depart</em> from the home jurisdiction and a parallel filing in the destination jurisdiction. Korporex coordinates both filings. The destination registry only issues the certificate of continuance after the departing registry confirms the corporation is in good standing.
          </div>
        </div>
      </section>

      <section className="bg-white py-12 px-6">
        <div className="max-w-xl mx-auto">
          <StepProgress step={step} total={TOTAL_STEPS} />

          {step === 1 && (
            <div>
              <button type="button" onClick={() => router.push("/services")} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 mb-8 transition-colors">
                ← Back to services
              </button>
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Direction &amp; Identity</h2>
              <p className="text-gray-500 text-sm mb-8">Which way the corporation is moving, and how to identify it today.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <Field label="Direction *" error={errors.direction?.message} hint="Whether the corporation is moving INTO Federal/Ontario or OUT OF Federal/Ontario.">
                  <select {...register("direction")} className={sCls}>
                    <option value="into">INTO Federal / Ontario (continuance import)</option>
                    <option value="out_of">OUT OF Federal / Ontario (continuance export)</option>
                  </select>
                </Field>

                <Field label="Current (home) jurisdiction *" error={errors.currentJurisdiction?.message}>
                  <select {...register("currentJurisdiction")} className={sCls}>
                    <option value="federal">Federal (CBCA)</option>
                    <option value="ontario">Ontario (OBCA)</option>
                    <option value="bc">British Columbia</option>
                    <option value="alberta">Alberta</option>
                    <option value="quebec">Quebec</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
                {currentJurisdiction === "other" && (
                  <Field label="Specify current jurisdiction *" error={errors.currentJurisdictionOther?.message}>
                    <input type="text" {...register("currentJurisdictionOther")} className={iCls} placeholder="e.g. Manitoba" />
                  </Field>
                )}

                <Field label="Destination jurisdiction *" error={errors.destinationJurisdiction?.message}>
                  <select {...register("destinationJurisdiction")} className={sCls}>
                    <option value="federal">Federal (CBCA)</option>
                    <option value="ontario">Ontario (OBCA)</option>
                    <option value="bc">British Columbia</option>
                    <option value="alberta">Alberta</option>
                    <option value="quebec">Quebec</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
                {destinationJurisdiction === "other" && (
                  <Field label="Specify destination jurisdiction *" error={errors.destinationJurisdictionOther?.message}>
                    <input type="text" {...register("destinationJurisdictionOther")} className={iCls} placeholder="e.g. Manitoba" />
                  </Field>
                )}

                <Field label="Current corporation legal name *" error={errors.currentCorpName?.message} hint="As it appears today in the home jurisdiction.">
                  <input type="text" {...register("currentCorpName")} className={iCls} />
                </Field>
                <Field label="Current corporation number *" error={errors.currentCorpNumber?.message}>
                  <input type="text" {...register("currentCorpNumber")} className={iCls} />
                </Field>
                <Field label="CRA Business Number (BN)" error={errors.businessNumber?.message}>
                  <input type="text" {...register("businessNumber")} className={iCls} placeholder="123456789 RC0001" />
                </Field>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Name &amp; New Registered Office</h2>
              <p className="text-gray-500 text-sm mb-6">
                {direction === "into"
                  ? "The new registered office must be in the destination jurisdiction."
                  : "The new registered office must be in the destination jurisdiction (outside Federal / Ontario)."}
              </p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <label className="flex items-start gap-3 text-sm cursor-pointer">
                  <input type="checkbox" {...register("nameChanging")} className="mt-1 accent-navy-900" />
                  <span className="text-gray-700">
                    The corporate name is <strong>changing</strong> as part of the continuance. (Some jurisdictions require it if the existing name conflicts with another in the destination registry.)
                  </span>
                </label>

                {nameChanging && (
                  <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30 space-y-4">
                    <Field label="New corporate name *" error={errors.newCorpName?.message}>
                      <input type="text" {...register("newCorpName")} className={iCls} placeholder="Acme Holdings" />
                    </Field>
                    <Field label="Legal ending *" error={errors.newLegalEnding?.message}>
                      <select {...register("newLegalEnding")} className={sCls}>
                        <option value="">Select…</option>
                        {LEGAL_ENDINGS.map((le) => (
                          <option key={le} value={le}>{le}</option>
                        ))}
                      </select>
                    </Field>
                    <p className="text-xs text-gray-500">
                      A NUANS-type name search is typically required for the destination jurisdiction; the fee is billed as a pass-through.
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    New registered office (in the destination jurisdiction) <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="newRegisteredOffice" errors={errors.newRegisteredOffice} canadaOnly={false} />
                </div>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <BackBtn onClick={() => setStep(2)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Resolution &amp; Directors</h2>
              <p className="text-gray-500 text-sm mb-6">
                {destinationIsFederal
                  ? "Continuance INTO federal: CBCA s.187. The directors of the continued corporation must include at least 25% Canadian residents per CBCA s.105(3)."
                  : currentJurisdiction === "federal"
                    ? "Continuance OUT of federal: CBCA s.188. Requires Director's authorization to depart."
                    : "Continuance under OBCA s.180 (into Ontario) or s.181 (out of Ontario)."}
              </p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(4); }} className="space-y-5">
                <Field label="Reason for continuance *" error={errors.reasonForContinuance?.message} hint="e.g. moving to align with primary operations, accessing federal name protection, tax planning, restructuring.">
                  <textarea {...register("reasonForContinuance")} rows={4} className={`${iCls} resize-none`} />
                </Field>

                <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30 space-y-3">
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">Special resolution</p>
                  <label className="flex items-start gap-3 text-sm cursor-pointer">
                    <input type="checkbox" {...register("specialResolutionPassed")} className="mt-1 accent-navy-900" />
                    <span className="text-gray-700">
                      A <strong>special shareholder resolution</strong> authorizing the continuance has been passed (two-thirds majority).
                    </span>
                  </label>
                  {errors.specialResolutionPassed?.message && (
                    <p className="text-xs text-red-500">{errors.specialResolutionPassed.message}</p>
                  )}
                  <Field label="Resolution date *" error={errors.specialResolutionDate?.message}>
                    <input type="date" {...register("specialResolutionDate")} className={iCls} />
                  </Field>
                </div>

                <Field label="Effective date *" error={errors.effectiveDate?.message} hint="When the continuance should take effect in the destination jurisdiction.">
                  <input type="date" {...register("effectiveDate")} className={iCls} />
                </Field>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">Directors of the continued corporation</p>
                  <CurrentDirectorsArray
                    name="directors"
                    showCanadianResident={destinationIsFederal}
                    topError={typeof errors.directors?.message === "string" ? errors.directors.message : undefined}
                    errors={errors.directors}
                  />
                </div>

                <NextBtn />
              </form>
            </div>
          )}

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
                <Field label="Your role" error={errors.contact?.contactRole?.message}>
                  <input type="text" {...register("contact.contactRole")} className={iCls} />
                </Field>
                <NextBtn />
              </form>
            </div>
          )}

          {step === 5 && (
            <div>
              <BackBtn onClick={() => setStep(4)} />
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
                      Government filing fees from <em>both</em> jurisdictions (typically $200-$300 each) and any NUANS report are billed separately as pass-through. Korporex coordinates both filings; the destination jurisdiction&apos;s certificate of continuance is the final step.
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
