"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import { soleProprietorshipSchema, type SoleProprietorshipSubmission } from "@/lib/registrationSchemas";
import { REGISTRATION_SERVICES } from "@/lib/registrationServices";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, StepProgress, iCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import NaicsCombobox from "@/components/NaicsCombobox";

const SERVICE = REGISTRATION_SERVICES["sole-prop-on"];
const TOTAL_STEPS = 3;

export default function SolePropPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<SoleProprietorshipSubmission>({
    resolver: zodResolver(soleProprietorshipSchema),
    mode: "onTouched",
    defaultValues: {
      businessName: "",
      businessActivity: "",
      naicsCode: "",
      businessAddress: { street: "", city: "", region: "", postalCode: "", country: "CA" },
      ownerFirstName: "",
      ownerLastName: "",
      ownerEmail: "",
      ownerPhone: "",
      ownerDob: "",
      ownerAddress: { street: "", city: "", region: "", postalCode: "", country: "CA" },
      effectiveDate: "",
      billingName: "",
      billingAddress: { street: "", city: "", region: "", postalCode: "", country: "CA" },
    },
  });

  const { handleSubmit, trigger, watch, register, formState: { errors } } = form;

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof SoleProprietorshipSubmission>> = {
      1: ["businessName", "businessActivity", "naicsCode", "businessAddress", "effectiveDate"],
      2: ["ownerFirstName", "ownerLastName", "ownerEmail", "ownerPhone", "ownerDob", "ownerAddress"],
    };
    const fields = fieldsByStep[step];
    if (fields) {
      const valid = await trigger(fields);
      if (!valid) return;
    }
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onFinalSubmit(data: SoleProprietorshipSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/service-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "sole-prop-on", payload: data }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        throw new Error(json.error ?? "Submission failed.");
      }
      window.location.href = json.url;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed.");
      setSubmitting(false);
    }
  }

  // Pricing preview (server still recomputes from constants)
  const region = watch("billingAddress.region") || "";
  const country = watch("billingAddress.country") || "CA";
  const taxRate = getTaxRate(country, region);
  const tax = Math.round(SERVICE.price * taxRate * 100) / 100;
  const total = Math.round((SERVICE.price + tax) * 100) / 100;

  return (
    <FormProvider {...form}>
      <section className="bg-cream-50 py-12 px-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-3">
            Registration
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-4">
            {SERVICE.label}
          </h1>
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
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Business Details</h2>
              <p className="text-gray-500 text-sm mb-8">
                The business you&apos;re registering as a sole proprietorship.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  gotoStep(2);
                }}
                className="space-y-5"
              >
                <Field label="Business name *" error={errors.businessName?.message} hint='e.g. "Maple Ridge Consulting"'>
                  <input type="text" {...register("businessName")} className={iCls} />
                </Field>

                <Field label="Primary Activity (NAICS Code) *" error={errors.naicsCode?.message} hint="Search by code, activity, or sector.">
                  <NaicsCombobox
                    value={watch("naicsCode")}
                    onChange={(code) => form.setValue("naicsCode", code, { shouldValidate: true })}
                    error={errors.naicsCode?.message}
                  />
                </Field>

                <Field label="Business activity description *" error={errors.businessActivity?.message} hint="A brief description of what the business will do.">
                  <textarea
                    {...register("businessActivity")}
                    rows={3}
                    placeholder="e.g. Freelance graphic design and brand consulting for small businesses."
                    className={`${iCls} resize-none`}
                  />
                </Field>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    Business address <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="businessAddress" errors={errors.businessAddress} />
                </div>

                <Field label="Effective date *" error={errors.effectiveDate?.message} hint="When the business will start operating (or today if already active).">
                  <input type="date" {...register("effectiveDate")} className={iCls} />
                </Field>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Owner Details</h2>
              <p className="text-gray-500 text-sm mb-8">
                Personal information for the sole proprietor.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  gotoStep(3);
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name *" error={errors.ownerFirstName?.message}>
                    <input type="text" {...register("ownerFirstName")} className={iCls} />
                  </Field>
                  <Field label="Last name *" error={errors.ownerLastName?.message}>
                    <input type="text" {...register("ownerLastName")} className={iCls} />
                  </Field>
                </div>

                <Field label="Email *" error={errors.ownerEmail?.message}>
                  <input type="email" autoComplete="email" {...register("ownerEmail")} className={iCls} />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Phone *" error={errors.ownerPhone?.message}>
                    <input type="tel" autoComplete="tel" {...register("ownerPhone")} className={iCls} placeholder="+1 416 555 0100" />
                  </Field>
                  <Field label="Date of birth *" error={errors.ownerDob?.message}>
                    <input type="date" {...register("ownerDob")} className={iCls} />
                  </Field>
                </div>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    Home address <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="ownerAddress" errors={errors.ownerAddress} />
                </div>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <BackBtn onClick={() => setStep(2)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Billing &amp; Review</h2>
              <p className="text-gray-500 text-sm mb-8">
                Final step. We&apos;ll redirect you to Stripe to complete payment.
              </p>
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
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">
                    Order summary
                  </p>
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
                  <div className="border border-red-200 bg-red-50 text-red-900 text-sm rounded-md p-3">
                    {submitError}
                  </div>
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
