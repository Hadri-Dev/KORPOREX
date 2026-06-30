"use client";

import { useState } from "react";
import { useForm, FormProvider, useFormContext, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  changeShareholderSchema,
  type ChangeShareholderSubmission,
} from "@/lib/amendmentSchemas";
import { AMENDMENT_SERVICES } from "@/lib/amendmentServices";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, StepProgress, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";

const SERVICE = AMENDMENT_SERVICES["change-shareholder"];
const TOTAL_STEPS = 4;

const emptyParty: NonNullable<ChangeShareholderSubmission["fromParty"]> = {
  partyType: "individual",
  firstName: "",
  lastName: "",
  corpName: "",
  corpNumber: "",
  email: "",
  address: { street: "", city: "", region: "", postalCode: "", country: "CA" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PartySubForm({ name, errors }: { name: "fromParty" | "toParty"; errors?: any }) {
  const { register, watch } = useFormContext<ChangeShareholderSubmission>();
  const partyType = watch(`${name}.partyType`);
  const e = (errors ?? {}) as FieldErrors<NonNullable<ChangeShareholderSubmission["fromParty"]>>;
  return (
    <div className="space-y-4 border border-gray-200 rounded-lg p-5 bg-cream-50/30">
      <Field label="Party type *" error={e.partyType?.message}>
        <select {...register(`${name}.partyType`)} className={sCls}>
          <option value="individual">Individual</option>
          <option value="corporation">Corporation</option>
        </select>
      </Field>

      {partyType === "individual" ? (
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name *" error={e.firstName?.message}>
            <input type="text" {...register(`${name}.firstName`)} className={iCls} />
          </Field>
          <Field label="Last name *" error={e.lastName?.message}>
            <input type="text" {...register(`${name}.lastName`)} className={iCls} />
          </Field>
        </div>
      ) : (
        <div className="space-y-3">
          <Field label="Corporation legal name *" error={e.corpName?.message}>
            <input type="text" {...register(`${name}.corpName`)} className={iCls} placeholder="Holdco Inc." />
          </Field>
          <Field label="Corporation number" error={e.corpNumber?.message} hint="Optional but recommended for the share certificate.">
            <input type="text" {...register(`${name}.corpNumber`)} className={iCls} />
          </Field>
        </div>
      )}

      <Field label="Email" error={e.email?.message} hint="Optional — used to send the share certificate.">
        <input type="email" {...register(`${name}.email`)} className={iCls} />
      </Field>

      <div>
        <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
          Address <span className="text-red-500">*</span>
        </p>
        <AddressFields name={`${name}.address`} errors={e.address} canadaOnly={false} />
      </div>
    </div>
  );
}

export default function ChangeShareholderPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ChangeShareholderSubmission>({
    resolver: zodResolver(changeShareholderSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "federal", corpName: "", corpNumber: "", businessNumber: "" },
      changeType: "issuance",
      shareClass: "Class A Common",
      numberOfShares: 0,
      consideration: "",
      effectiveDate: "",
      fromParty: undefined,
      toParty: { ...emptyParty },
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

  const { handleSubmit, trigger, watch, register, setValue, formState: { errors } } = form;
  const changeType = watch("changeType");
  const needsFrom = changeType === "transfer" || changeType === "redemption" || changeType === "cancellation";
  const needsTo = changeType === "issuance" || changeType === "transfer";

  function syncPartyVisibility(next: ChangeShareholderSubmission["changeType"]) {
    const wantsFrom = next === "transfer" || next === "redemption" || next === "cancellation";
    const wantsTo = next === "issuance" || next === "transfer";
    setValue("fromParty", wantsFrom ? { ...emptyParty } : undefined);
    setValue("toParty", wantsTo ? { ...emptyParty } : undefined);
  }

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof ChangeShareholderSubmission | string>> = {
      1: ["corporation"],
      2: ["changeType", "shareClass", "numberOfShares", "effectiveDate", "fromParty", "toParty"],
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

  async function onFinalSubmit(data: ChangeShareholderSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/amendment-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "change-shareholder", payload: data }),
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
            <span className="font-semibold text-navy-900">${SERVICE.price} CAD</span> + applicable tax. Updated within 2 business days.
          </p>
          <div className="mt-4 p-3 bg-amber-50 border-l-3 border-gold-500 text-xs text-amber-900 leading-relaxed">
            <strong>Note:</strong> Shareholder changes are <em>not</em> filed with the government. Korporex updates your corporation&apos;s internal records (register of shareholders + share certificates). For complex transactions, restrictions, or unanimous shareholder agreements, speak with a lawyer.
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
              <p className="text-gray-500 text-sm mb-8">Tell us which corporation&apos;s shareholder register is being updated.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <CorporationIdSection errors={errors.corporation} />
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">The Share Change</h2>
              <p className="text-gray-500 text-sm mb-8">What&apos;s changing in the share register.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <Field label="Type of change *" error={errors.changeType?.message}>
                  <select
                    {...register("changeType", {
                      onChange: (e) => syncPartyVisibility(e.target.value as ChangeShareholderSubmission["changeType"]),
                    })}
                    className={sCls}
                  >
                    <option value="issuance">New issuance (corporation issues new shares)</option>
                    <option value="transfer">Transfer (one shareholder to another)</option>
                    <option value="redemption">Redemption (corporation buys back shares)</option>
                    <option value="cancellation">Cancellation</option>
                  </select>
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Share class *" error={errors.shareClass?.message} hint="As named in the Articles.">
                    <input type="text" {...register("shareClass")} className={iCls} placeholder="Class A Common" />
                  </Field>
                  <Field label="Number of shares *" error={errors.numberOfShares?.message}>
                    <input type="number" min={1} {...register("numberOfShares", { valueAsNumber: true })} className={iCls} />
                  </Field>
                </div>

                <Field label="Consideration / price" error={errors.consideration?.message} hint="Optional — e.g. '$1.00/share', 'nil', 'gift'. Recorded in the minute book.">
                  <input type="text" {...register("consideration")} className={iCls} placeholder="$1.00 per share" />
                </Field>

                <Field label="Effective date *" error={errors.effectiveDate?.message}>
                  <input type="date" {...register("effectiveDate")} className={iCls} />
                </Field>

                {needsFrom && (
                  <div>
                    <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-2">
                      {changeType === "transfer" ? "From (transferor)" : "Shareholder being redeemed / cancelled"}
                    </p>
                    <PartySubForm name="fromParty" errors={errors.fromParty} />
                  </div>
                )}

                {needsTo && (
                  <div>
                    <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-2">
                      {changeType === "transfer" ? "To (transferee)" : "New shareholder"}
                    </p>
                    <PartySubForm name="toParty" errors={errors.toParty} />
                  </div>
                )}

                <Field label="Notes" error={errors.notes?.message} hint="Anything else relevant to this transaction.">
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
