"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  nuansReportSchema,
  type NuansReportSubmission,
} from "@/lib/nuansSchemas";
import { NUANS_SERVICES } from "@/lib/nuansServices";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, StepProgress, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";

const SERVICE = NUANS_SERVICES["nuans-report"];
const TOTAL_STEPS = 4;

const emptyAddress = { street: "", city: "", region: "", postalCode: "", country: "CA" };

export default function NuansReportPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<NuansReportSubmission>({
    resolver: zodResolver(nuansReportSchema),
    mode: "onTouched",
    defaultValues: {
      jurisdiction: "federal",
      proposedName: "",
      alternativeName1: "",
      alternativeName2: "",
      intendedUse: "new_incorporation",
      businessDescription: "",
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
  const jurisdiction = watch("jurisdiction");

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof NuansReportSubmission | string>> = {
      1: ["jurisdiction"],
      2: ["proposedName", "alternativeName1", "alternativeName2", "intendedUse", "businessDescription"],
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

  async function onFinalSubmit(data: NuansReportSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/nuans-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "nuans-report", payload: data }),
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
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-3">Name Search</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-4">{SERVICE.label}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{SERVICE.description}</p>
          <p className="mt-4 text-sm text-gray-500">
            <span className="font-semibold text-navy-900">${SERVICE.price} CAD</span> + applicable tax. Report delivered by email within 1 business day.
          </p>
          <p className="mt-3 text-xs text-gray-500 leading-relaxed">
            <strong className="text-navy-900">Not legal advice.</strong> A NUANS report is a database search, not a legal opinion on whether a name will be approved by the registry examiner or whether it infringes a trademark.
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
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Jurisdiction</h2>
              <p className="text-gray-500 text-sm mb-8">Which registry is the proposed corporation targeting? This determines which downstream filing path the name will be screened for.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <Field label="Jurisdiction *" error={errors.jurisdiction?.message}>
                  <select {...register("jurisdiction")} className={sCls}>
                    <option value="federal">Federal (Canada) — CBCA corporation</option>
                    <option value="ontario">Ontario — OBCA corporation</option>
                  </select>
                </Field>
                <div className="bg-cream-50 border border-gray-200 rounded-md p-4 text-xs text-gray-600 leading-relaxed">
                  {jurisdiction === "federal" ? (
                    <>
                      Federal corporations require a NUANS report when filing Articles of Incorporation under the <em>CBCA</em>, unless you incorporate as a numbered corporation. The same NUANS database covers all of Canada — your federal name protection is nationwide.
                    </>
                  ) : (
                    <>
                      Ontario named corporations require a NUANS report when filing Articles of Incorporation under the <em>OBCA</em> via the Ontario Business Registry, unless you incorporate as a numbered corporation. Name protection is limited to Ontario.
                    </>
                  )}
                </div>
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Proposed Name</h2>
              <p className="text-gray-500 text-sm mb-8">Enter the name you want to search. You can include up to two backup names — we&apos;ll keep them on file in case the primary is rejected by the examiner.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <Field
                  label="Primary proposed name *"
                  error={errors.proposedName?.message}
                  hint="Enter the distinctive name only — leave off the legal ending (Inc., Ltd., Corp., etc.). The NUANS search compares the distinctive element."
                >
                  <input type="text" {...register("proposedName")} className={iCls} placeholder="e.g. Maple Ridge Logistics" />
                </Field>
                <Field
                  label="Alternative name 1"
                  error={errors.alternativeName1?.message}
                  hint="Optional backup — kept on file."
                >
                  <input type="text" {...register("alternativeName1")} className={iCls} />
                </Field>
                <Field
                  label="Alternative name 2"
                  error={errors.alternativeName2?.message}
                  hint="Optional second backup — kept on file."
                >
                  <input type="text" {...register("alternativeName2")} className={iCls} />
                </Field>

                <Field
                  label="Intended use *"
                  error={errors.intendedUse?.message}
                  hint="What you plan to do with the report."
                >
                  <select {...register("intendedUse")} className={sCls}>
                    <option value="new_incorporation">Incorporating a new corporation</option>
                    <option value="name_change">Changing the name of an existing corporation</option>
                    <option value="amalgamation">Amalgamation (combining two or more corporations)</option>
                    <option value="trademark_screening">Pre-screening for a trademark application</option>
                    <option value="other">Other</option>
                  </select>
                </Field>

                <Field
                  label="Business description *"
                  error={errors.businessDescription?.message}
                  hint="A short paragraph on what the business does and any distinguishing brand elements. Helps the search operator interpret near-matches."
                >
                  <textarea
                    {...register("businessDescription")}
                    className={`${iCls} min-h-[100px] leading-relaxed`}
                    rows={4}
                    placeholder="e.g. Independent logistics broker serving the Greater Toronto Area. The name combines a geographic reference with the type of service."
                  />
                </Field>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <BackBtn onClick={() => setStep(2)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Contact</h2>
              <p className="text-gray-500 text-sm mb-8">Where should we deliver the NUANS report?</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(4); }} className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name *" error={errors.contact?.contactFirstName?.message}>
                    <input type="text" {...register("contact.contactFirstName")} className={iCls} />
                  </Field>
                  <Field label="Last name *" error={errors.contact?.contactLastName?.message}>
                    <input type="text" {...register("contact.contactLastName")} className={iCls} />
                  </Field>
                </div>
                <Field label="Email *" error={errors.contact?.contactEmail?.message} hint="The PDF report is emailed here.">
                  <input type="email" autoComplete="email" {...register("contact.contactEmail")} className={iCls} />
                </Field>
                <Field label="Phone *" error={errors.contact?.contactPhone?.message}>
                  <input type="tel" autoComplete="tel" {...register("contact.contactPhone")} className={iCls} />
                </Field>
                <Field label="Your role" error={errors.contact?.contactRole?.message} hint="Optional — e.g. founder, lawyer, accountant.">
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
