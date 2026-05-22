"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  businessNumberSchema,
  type BusinessNumberSubmission,
} from "@/lib/registrationSchemas";
import { REGISTRATION_SERVICES } from "@/lib/registrationServices";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, StepProgress, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";

const SERVICE = REGISTRATION_SERVICES["business-number"];
const TOTAL_STEPS = 3;

export default function BusinessNumberRegistrationPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<BusinessNumberSubmission>({
    resolver: zodResolver(businessNumberSchema),
    mode: "onTouched",
    defaultValues: {
      legalName: "",
      entityType: "sole_prop",
      entityAddress: { street: "", city: "", region: "", postalCode: "", country: "CA" },
      contactFirstName: "",
      contactLastName: "",
      contactEmail: "",
      contactPhone: "",
      programGst: false,
      programPayroll: false,
      programImportExport: false,
      programCorporateIncomeTax: false,
      expectedRevenue: "under_30k",
      effectiveDate: "",
      billingName: "",
      billingAddress: { street: "", city: "", region: "", postalCode: "", country: "CA" },
    },
  });

  const { handleSubmit, trigger, watch, register, formState: { errors } } = form;

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof BusinessNumberSubmission>> = {
      1: ["legalName", "entityType", "entityAddress", "effectiveDate"],
      2: [
        "expectedRevenue",
        "programGst",
        "programPayroll",
        "programImportExport",
        "programCorporateIncomeTax",
        "contactFirstName",
        "contactLastName",
        "contactEmail",
        "contactPhone",
      ],
    };
    const fields = fieldsByStep[step];
    if (fields) {
      const valid = await trigger(fields);
      if (!valid) return;
    }
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onFinalSubmit(data: BusinessNumberSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/service-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "business-number", payload: data }),
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
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-3">Registration</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-4">{SERVICE.label}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{SERVICE.description}</p>
          <p className="mt-4 text-sm text-gray-500">
            <span className="font-semibold text-navy-900">${SERVICE.price} CAD</span> + applicable tax. Filed within 1–2 business days.
          </p>
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
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Entity Details</h2>
              <p className="text-gray-500 text-sm mb-8">Who or what is being registered for the BN.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <Field label="Legal name *" error={errors.legalName?.message} hint="Individual's legal name or corporate legal name.">
                  <input type="text" {...register("legalName")} className={iCls} />
                </Field>

                <Field label="Entity type *" error={errors.entityType?.message}>
                  <select {...register("entityType")} className={sCls}>
                    <option value="individual">Individual</option>
                    <option value="sole_prop">Sole proprietorship</option>
                    <option value="partnership">Partnership</option>
                    <option value="corporation">Corporation</option>
                  </select>
                </Field>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    Entity address <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="entityAddress" errors={errors.entityAddress} />
                </div>

                <Field label="Effective date *" error={errors.effectiveDate?.message} hint="When the BN should take effect.">
                  <input type="date" {...register("effectiveDate")} className={iCls} />
                </Field>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Programs &amp; Contact</h2>
              <p className="text-gray-500 text-sm mb-8">
                Which CRA program accounts do you need, and who should we contact about this file.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <Field label="Expected gross revenue *" error={errors.expectedRevenue?.message} hint="Businesses earning over $30,000/yr must register for GST/HST.">
                  <select {...register("expectedRevenue")} className={sCls}>
                    <option value="under_30k">Under $30,000/yr</option>
                    <option value="over_30k">Over $30,000/yr</option>
                  </select>
                </Field>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-3">
                    Program accounts you need
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-md hover:border-gray-300 cursor-pointer">
                      <input type="checkbox" {...register("programGst")} className="mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-navy-900">GST/HST account</p>
                        <p className="text-xs text-gray-500">For collecting/remitting sales tax. Required over $30k/yr.</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-md hover:border-gray-300 cursor-pointer">
                      <input type="checkbox" {...register("programPayroll")} className="mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-navy-900">Payroll account</p>
                        <p className="text-xs text-gray-500">For remitting employee deductions and CPP/EI.</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-md hover:border-gray-300 cursor-pointer">
                      <input type="checkbox" {...register("programImportExport")} className="mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-navy-900">Import/Export account</p>
                        <p className="text-xs text-gray-500">For importing or exporting commercial goods across the border.</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-md hover:border-gray-300 cursor-pointer">
                      <input type="checkbox" {...register("programCorporateIncomeTax")} className="mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-navy-900">Corporate income tax account</p>
                        <p className="text-xs text-gray-500">Required for incorporated businesses to file T2 returns.</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Contact first name *" error={errors.contactFirstName?.message}>
                    <input type="text" {...register("contactFirstName")} className={iCls} />
                  </Field>
                  <Field label="Contact last name *" error={errors.contactLastName?.message}>
                    <input type="text" {...register("contactLastName")} className={iCls} />
                  </Field>
                </div>
                <Field label="Contact email *" error={errors.contactEmail?.message}>
                  <input type="email" autoComplete="email" {...register("contactEmail")} className={iCls} />
                </Field>
                <Field label="Contact phone *" error={errors.contactPhone?.message}>
                  <input type="tel" autoComplete="tel" {...register("contactPhone")} className={iCls} placeholder="+1 416 555 0100" />
                </Field>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <BackBtn onClick={() => setStep(2)} />
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
