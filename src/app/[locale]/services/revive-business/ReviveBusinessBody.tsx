"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  revivalSchema,
  type RevivalSubmission,
  type CurrentDirector,
  type CurrentOfficer,
} from "@/lib/businessUpdateSchemas";
import { BUSINESS_UPDATE_SERVICES } from "@/lib/businessUpdateServices";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, StepProgress, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";
import { CurrentDirectorsArray, CurrentOfficersArray } from "@/components/wizard/CurrentPeopleSection";

const SERVICE = BUSINESS_UPDATE_SERVICES["revive-business"];
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
const emptyOfficer: CurrentOfficer = {
  firstName: "",
  lastName: "",
  position: "President",
  email: "",
  appointedDate: "",
  address: { ...emptyAddress },
};

export default function ReviveBusinessPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<RevivalSubmission>({
    resolver: zodResolver(revivalSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "federal", corpName: "", corpNumber: "", businessNumber: "" },
      dissolutionDate: "",
      dissolutionReason: "default_failure_to_file",
      dissolutionReasonOther: "",
      outstandingFilingsBroughtCurrent: false,
      reasonForRevival: "",
      revivedRegisteredOffice: { ...emptyAddress },
      directors: [{ ...emptyDirector }],
      officers: [{ ...emptyOfficer }],
      requestorRelationship: "former_director",
      requestorRelationshipOther: "",
      effectiveDate: "",
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
  const jurisdiction = watch("corporation.jurisdiction");
  const dissolutionReason = watch("dissolutionReason");
  const requestorRelationship = watch("requestorRelationship");
  const wasDefault = dissolutionReason === "default_failure_to_file";

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof RevivalSubmission | string>> = {
      1: ["corporation", "dissolutionDate", "dissolutionReason", "dissolutionReasonOther"],
      2: [
        "outstandingFilingsBroughtCurrent",
        "reasonForRevival",
        "requestorRelationship",
        "requestorRelationshipOther",
        "effectiveDate",
      ],
      3: ["revivedRegisteredOffice", "directors", "officers"],
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

  async function onFinalSubmit(data: RevivalSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/business-update-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "revive-business", payload: data }),
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
            <span className="font-semibold text-navy-900">${SERVICE.price} CAD</span> + applicable tax + government filing fees (pass-through). Filed within 3 business days.
          </p>
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
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Dissolved Corporation</h2>
              <p className="text-gray-500 text-sm mb-8">Tell us which corporation you&apos;re reviving and how it was dissolved.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <CorporationIdSection errors={errors.corporation} />

                <Field label="Dissolution date *" error={errors.dissolutionDate?.message} hint="Date the corporation was dissolved (per the certificate of dissolution).">
                  <input type="date" {...register("dissolutionDate")} className={iCls} />
                </Field>

                <Field label="Reason for original dissolution *" error={errors.dissolutionReason?.message}>
                  <select {...register("dissolutionReason")} className={sCls}>
                    <option value="voluntary">Voluntary (Articles of Dissolution filed)</option>
                    <option value="default_failure_to_file">Default - dissolved by the registrar for failure to file</option>
                    <option value="court_order">Court order</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
                {dissolutionReason === "other" && (
                  <Field label="Describe the reason *" error={errors.dissolutionReasonOther?.message}>
                    <input type="text" {...register("dissolutionReasonOther")} className={iCls} />
                  </Field>
                )}
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Revival Details</h2>
              <p className="text-gray-500 text-sm mb-6">
                {jurisdiction === "federal"
                  ? "Articles of Revival are filed under CBCA s.209 (Form 15)."
                  : "Articles of Revival are filed under OBCA s.241."}
              </p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                {wasDefault && (
                  <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
                    <label className="flex items-start gap-3 text-sm cursor-pointer">
                      <input type="checkbox" {...register("outstandingFilingsBroughtCurrent")} className="mt-1 accent-navy-900" />
                      <span className="text-gray-700">
                        I confirm all <strong>outstanding annual returns and required filings</strong> have been (or will be) brought current with the registry.
                      </span>
                    </label>
                    {errors.outstandingFilingsBroughtCurrent?.message && (
                      <p className="text-xs text-red-500 mt-2">{errors.outstandingFilingsBroughtCurrent.message}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Default revivals require the corporation to be brought into good standing before the registrar will accept the revival.
                    </p>
                  </div>
                )}

                <Field label="Your relationship to the dissolved corporation *" error={errors.requestorRelationship?.message} hint="Both CBCA s.209(1) and OBCA s.241 allow an interested person to request revival.">
                  <select {...register("requestorRelationship")} className={sCls}>
                    <option value="former_director">Former director</option>
                    <option value="former_shareholder">Former shareholder</option>
                    <option value="creditor">Creditor</option>
                    <option value="court_order">Authorized by court order</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
                {requestorRelationship === "other" && (
                  <Field label="Describe your relationship *" error={errors.requestorRelationshipOther?.message}>
                    <input type="text" {...register("requestorRelationshipOther")} className={iCls} />
                  </Field>
                )}

                <Field label="Reason for revival *" error={errors.reasonForRevival?.message} hint="e.g. resuming operations, settling an outstanding claim, transferring assets to a new shareholder, completing a sale.">
                  <textarea {...register("reasonForRevival")} rows={4} className={`${iCls} resize-none`} />
                </Field>

                <Field label="Effective date *" error={errors.effectiveDate?.message}>
                  <input type="date" {...register("effectiveDate")} className={iCls} />
                </Field>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <BackBtn onClick={() => setStep(2)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Post-Revival Structure</h2>
              <p className="text-gray-500 text-sm mb-6">The corporation&apos;s registered office, directors, and officers as the corporation continues after revival.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(4); }} className="space-y-6">
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    Registered office (post-revival) <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="revivedRegisteredOffice" errors={errors.revivedRegisteredOffice} />
                </div>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">Directors</p>
                  <CurrentDirectorsArray
                    name="directors"
                    showCanadianResident={jurisdiction === "federal"}
                    topError={typeof errors.directors?.message === "string" ? errors.directors.message : undefined}
                    errors={errors.directors}
                  />
                </div>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">Officers</p>
                  <CurrentOfficersArray
                    name="officers"
                    topError={typeof errors.officers?.message === "string" ? errors.officers.message : undefined}
                    errors={errors.officers}
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
              <p className="text-gray-500 text-sm mb-8">Who should we reach out to with questions.</p>
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
                <Field label="Your role" error={errors.contact?.contactRole?.message} hint="Optional — e.g. former director, accountant, legal representative.">
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
                      Government filing fees (Corporations Canada $200 / Ontario $250) and any back-filings (annual returns, returned for default) are billed separately as a pass-through.
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
