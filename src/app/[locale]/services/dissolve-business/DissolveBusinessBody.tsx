"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  dissolutionSchema,
  type DissolutionSubmission,
} from "@/lib/businessUpdateSchemas";
import { BUSINESS_UPDATE_SERVICES } from "@/lib/businessUpdateServices";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, StepProgress, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";

const SERVICE = BUSINESS_UPDATE_SERVICES["dissolve-business"];
const TOTAL_STEPS = 4;

export default function DissolveBusinessPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<DissolutionSubmission>({
    resolver: zodResolver(dissolutionSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "federal", corpName: "", corpNumber: "", businessNumber: "" },
      dissolutionPath: "wound_up_with_assets",
      cessationDate: "",
      debtsStatement: "no_debts",
      assetsStatement: "no_property",
      specialResolutionPassed: false,
      specialResolutionDate: "",
      effectiveDate: "",
      finalReturnsFiled: false,
      notes: "",
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

  const { handleSubmit, trigger, watch, register, formState: { errors } } = form;
  const jurisdiction = watch("corporation.jurisdiction");
  const dissolutionPath = watch("dissolutionPath");
  const needsSpecialResolution = dissolutionPath !== "never_commenced";

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof DissolutionSubmission | string>> = {
      1: ["corporation"],
      2: [
        "dissolutionPath",
        "cessationDate",
        "debtsStatement",
        "assetsStatement",
        "specialResolutionPassed",
        "specialResolutionDate",
        "effectiveDate",
        "finalReturnsFiled",
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

  async function onFinalSubmit(data: DissolutionSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/business-update-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "dissolve-business", payload: data }),
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
          <div className="mt-4 p-3 bg-amber-50 border-l-3 border-gold-500 text-xs text-amber-900 leading-relaxed">
            <strong>Required before dissolution:</strong> file the corporation&apos;s final T2 / GST&nbsp;HST / payroll returns with the CRA, close all payroll / GST / corporate program accounts, and either pay all creditors or obtain their consent. Korporex will not submit the dissolution until you confirm this is done.
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
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Your Corporation</h2>
              <p className="text-gray-500 text-sm mb-8">Tell us which corporation you&apos;re dissolving.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <CorporationIdSection errors={errors.corporation} />
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Dissolution Details</h2>
              <p className="text-gray-500 text-sm mb-6">
                {jurisdiction === "federal"
                  ? "Federal dissolutions are filed under CBCA s.210-211 (Articles of Dissolution, Form 17 or 19)."
                  : "Ontario dissolutions are filed under OBCA s.237 (Articles of Dissolution)."}
              </p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <Field label="Dissolution pathway *" error={errors.dissolutionPath?.message} hint="Which scenario best describes the corporation.">
                  <select {...register("dissolutionPath")} className={sCls}>
                    <option value="never_commenced">Never commenced business / no shareholders (simplest)</option>
                    <option value="no_property_no_liabilities">Active corp - no property and no liabilities</option>
                    <option value="wound_up_with_assets">Active corp - wound up after distributing assets</option>
                  </select>
                </Field>

                <Field label="Cessation / final operations date *" error={errors.cessationDate?.message} hint="When the corporation last carried on business.">
                  <input type="date" {...register("cessationDate")} className={iCls} />
                </Field>

                <Field label="Debts statement *" error={errors.debtsStatement?.message}>
                  <select {...register("debtsStatement")} className={sCls}>
                    <option value="no_debts">The corporation has no outstanding debts</option>
                    <option value="all_debts_paid">All debts have been paid in full</option>
                    <option value="creditors_consent">All creditors have consented to the dissolution</option>
                  </select>
                </Field>

                <Field label="Assets statement *" error={errors.assetsStatement?.message}>
                  <select {...register("assetsStatement")} className={sCls}>
                    <option value="no_property">The corporation has no remaining property</option>
                    <option value="distributed_to_shareholders">All remaining property has been distributed to shareholders</option>
                  </select>
                </Field>

                {needsSpecialResolution && (
                  <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30 space-y-4">
                    <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">Special resolution</p>
                    <label className="flex items-start gap-3 text-sm cursor-pointer">
                      <input type="checkbox" {...register("specialResolutionPassed")} className="mt-1 accent-navy-900" />
                      <span className="text-gray-700">
                        A <strong>special shareholder resolution</strong> authorizing the dissolution has been passed (two-thirds majority).
                      </span>
                    </label>
                    {errors.specialResolutionPassed?.message && (
                      <p className="text-xs text-red-500">{errors.specialResolutionPassed.message}</p>
                    )}
                    <Field label="Resolution date *" error={errors.specialResolutionDate?.message}>
                      <input type="date" {...register("specialResolutionDate")} className={iCls} />
                    </Field>
                  </div>
                )}

                <Field label="Effective date *" error={errors.effectiveDate?.message} hint="The date you want the dissolution to take effect.">
                  <input type="date" {...register("effectiveDate")} className={iCls} />
                </Field>

                <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
                  <label className="flex items-start gap-3 text-sm cursor-pointer">
                    <input type="checkbox" {...register("finalReturnsFiled")} className="mt-1 accent-navy-900" />
                    <span className="text-gray-700">
                      I confirm the corporation&apos;s <strong>final tax / GST / payroll returns have been filed</strong> with the CRA and all related program accounts will be closed.
                    </span>
                  </label>
                  {errors.finalReturnsFiled?.message && (
                    <p className="text-xs text-red-500 mt-2">{errors.finalReturnsFiled.message}</p>
                  )}
                </div>

                <Field label="Notes" error={errors.notes?.message} hint="Anything else relevant (e.g. court-ordered timing, creditor disputes, related restructuring).">
                  <textarea {...register("notes")} rows={3} className={`${iCls} resize-none`} />
                </Field>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <BackBtn onClick={() => setStep(2)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Contact</h2>
              <p className="text-gray-500 text-sm mb-8">Who should we reach out to with questions.</p>
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
                <Field label="Your role" error={errors.contact?.contactRole?.message} hint="Optional — e.g. sole director, corporate secretary, accountant.">
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
                      Government filing fees (Corporations Canada $0 — gratis, or Ontario $25) are pass-through. Final tax / GST closure is handled by you or your accountant.
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
