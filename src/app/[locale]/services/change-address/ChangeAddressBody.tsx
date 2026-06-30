"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  changeAddressSchema,
  type ChangeAddressSubmission,
} from "@/lib/amendmentSchemas";
import { AMENDMENT_SERVICES } from "@/lib/amendmentServices";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, StepProgress, iCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";

const SERVICE = AMENDMENT_SERVICES["change-address"];
const TOTAL_STEPS = 4;

const emptyAddress = { street: "", city: "", region: "", postalCode: "", country: "CA" };

export default function ChangeAddressPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ChangeAddressSubmission>({
    resolver: zodResolver(changeAddressSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "federal", corpName: "", corpNumber: "", businessNumber: "" },
      changeRegisteredOffice: true,
      changeMailingAddress: false,
      newRegisteredOffice: { ...emptyAddress },
      newMailingAddress: undefined,
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

  const { handleSubmit, trigger, watch, register, setValue, formState: { errors } } = form;
  const jurisdiction = watch("corporation.jurisdiction");
  const changeRegisteredOffice = watch("changeRegisteredOffice");
  const changeMailingAddress = watch("changeMailingAddress");

  function toggleMailing(next: boolean) {
    setValue("changeMailingAddress", next);
    setValue("newMailingAddress", next ? { ...emptyAddress } : undefined);
  }

  function toggleRegistered(next: boolean) {
    setValue("changeRegisteredOffice", next);
    setValue("newRegisteredOffice", next ? { ...emptyAddress } : undefined);
  }

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof ChangeAddressSubmission | string>> = {
      1: ["corporation"],
      2: [
        "changeRegisteredOffice",
        "changeMailingAddress",
        "newRegisteredOffice",
        "newMailingAddress",
        "effectiveDate",
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

  async function onFinalSubmit(data: ChangeAddressSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/amendment-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "change-address", payload: data }),
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
            <span className="font-semibold text-navy-900">${SERVICE.price} CAD</span> + applicable tax. Filed within 2 business days.
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
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Your Corporation</h2>
              <p className="text-gray-500 text-sm mb-8">Tell us which corporation&apos;s address is changing.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <CorporationIdSection errors={errors.corporation} />
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">New Address</h2>
              <p className="text-gray-500 text-sm mb-6">
                {jurisdiction === "federal" ? (
                  <>
                    Federal corporations file Form 3 to change the registered office address under CBCA s.19. The new
                    address must be in the same province as the one stated in the Articles. Notice is required within{" "}
                    <strong>15 days</strong>.
                  </>
                ) : (
                  <>
                    Ontario corporations file a Notice of Change under the <em>Corporations Information Act</em>. You can update
                    either the registered office, the mailing address, or both. Notice is required within <strong>15 days</strong>.
                  </>
                )}
              </p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <div className="space-y-3">
                  <label className="flex items-start gap-3 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={changeRegisteredOffice}
                      onChange={(e) => toggleRegistered(e.target.checked)}
                      className="mt-1 accent-navy-900"
                    />
                    <span className="text-gray-800"><strong>Change the registered office address.</strong></span>
                  </label>

                  {jurisdiction === "ontario" && (
                    <label className="flex items-start gap-3 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={changeMailingAddress}
                        onChange={(e) => toggleMailing(e.target.checked)}
                        className="mt-1 accent-navy-900"
                      />
                      <span className="text-gray-800">
                        <strong>Change the mailing address.</strong>{" "}
                        <span className="text-gray-500">(Ontario only — federal corporations use one address for both.)</span>
                      </span>
                    </label>
                  )}

                  {typeof errors.changeRegisteredOffice?.message === "string" && (
                    <p className="text-xs text-red-500">{errors.changeRegisteredOffice.message}</p>
                  )}
                </div>

                {changeRegisteredOffice && (
                  <div>
                    <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                      New registered office address <span className="text-red-500">*</span>
                    </p>
                    <AddressFields name="newRegisteredOffice" errors={errors.newRegisteredOffice} />
                    {jurisdiction === "federal" && (
                      <p className="text-xs text-gray-500 mt-2">
                        Must be in the same province as the one stated in your Articles. If you want to move the registered
                        office to a different province, you need Articles of Amendment instead.
                      </p>
                    )}
                  </div>
                )}

                {changeMailingAddress && jurisdiction === "ontario" && (
                  <div>
                    <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                      New mailing address <span className="text-red-500">*</span>
                    </p>
                    <AddressFields name="newMailingAddress" errors={errors.newMailingAddress} />
                  </div>
                )}

                <Field label="Effective date *" error={errors.effectiveDate?.message} hint="When the new address takes effect.">
                  <input type="date" {...register("effectiveDate")} className={iCls} />
                </Field>

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
