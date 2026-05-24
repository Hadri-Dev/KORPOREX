"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import {
  annualReturnOntarioSchema,
  type AnnualReturnOntarioSubmission,
  type CurrentDirector,
  type CurrentOfficer,
} from "@/lib/complianceSchemas";
import { COMPLIANCE_SERVICES } from "@/lib/complianceServices";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, StepProgress, iCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";
import { CurrentDirectorsArray, CurrentOfficersArray } from "@/components/wizard/CurrentPeopleSection";
import NaicsCombobox from "@/components/NaicsCombobox";

const SERVICE = COMPLIANCE_SERVICES["annual-return-on"];
const TOTAL_STEPS = 4;

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

export default function AnnualReturnOntarioPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<AnnualReturnOntarioSubmission>({
    resolver: zodResolver(annualReturnOntarioSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "ontario", corpName: "", corpNumber: "", businessNumber: "" },
      fiscalYearEnd: "",
      anniversaryDate: "",
      informationCurrent: true,
      registeredOfficeChanged: false,
      newRegisteredOffice: undefined,
      directorsChanged: false,
      directors: undefined,
      officersChanged: false,
      officers: undefined,
      naicsCode: "",
      principalActivity: "",
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
  const informationCurrent = watch("informationCurrent");
  const registeredOfficeChanged = watch("registeredOfficeChanged");
  const directorsChanged = watch("directorsChanged");
  const officersChanged = watch("officersChanged");

  function toggleInformationCurrent(next: boolean) {
    setValue("informationCurrent", next);
    if (next) {
      setValue("registeredOfficeChanged", false);
      setValue("newRegisteredOffice", undefined);
      setValue("directorsChanged", false);
      setValue("directors", undefined);
      setValue("officersChanged", false);
      setValue("officers", undefined);
    }
  }

  function toggleRegisteredOfficeChanged(next: boolean) {
    setValue("registeredOfficeChanged", next);
    setValue("newRegisteredOffice", next ? { ...emptyAddress, region: "ON" } : undefined);
  }

  function toggleDirectorsChanged(next: boolean) {
    setValue("directorsChanged", next);
    setValue("directors", next ? [{ ...emptyDirector }] : undefined);
  }

  function toggleOfficersChanged(next: boolean) {
    setValue("officersChanged", next);
    setValue("officers", next ? [{ ...emptyOfficer }] : undefined);
  }

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof AnnualReturnOntarioSubmission | string>> = {
      1: ["corporation", "anniversaryDate", "fiscalYearEnd"],
      2: [
        "informationCurrent",
        "registeredOfficeChanged",
        "newRegisteredOffice",
        "directorsChanged",
        "directors",
        "officersChanged",
        "officers",
        "naicsCode",
        "principalActivity",
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

  async function onFinalSubmit(data: AnnualReturnOntarioSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/compliance-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "annual-return-on", payload: data }),
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
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-3">Compliance Filing</p>
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
              <p className="text-gray-500 text-sm mb-8">The Ontario corporation filing the Annual Return.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <CorporationIdSection errors={errors.corporation} lockedJurisdiction="ontario" />
                <Field label="Anniversary date *" error={errors.anniversaryDate?.message} hint="The date of incorporation; the Annual Return is due each year on or after this date.">
                  <input type="date" {...register("anniversaryDate")} className={iCls} />
                </Field>
                <Field label="Fiscal year-end *" error={errors.fiscalYearEnd?.message}>
                  <input type="date" {...register("fiscalYearEnd")} className={iCls} />
                </Field>
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Confirm Current Information</h2>
              <p className="text-gray-500 text-sm mb-6">If anything has changed since the prior return, tell us what so we can update the registry.</p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <div className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">Status</p>
                  <div className="space-y-2">
                    <label className="flex items-start gap-3 text-sm cursor-pointer">
                      <input type="radio" checked={informationCurrent} onChange={() => toggleInformationCurrent(true)} className="mt-1 accent-navy-900" />
                      <span className="text-gray-800">All information on file with the Ontario Business Registry is <strong>current</strong> — no changes since the prior filing.</span>
                    </label>
                    <label className="flex items-start gap-3 text-sm cursor-pointer">
                      <input type="radio" checked={!informationCurrent} onChange={() => toggleInformationCurrent(false)} className="mt-1 accent-navy-900" />
                      <span className="text-gray-800">Some information has <strong>changed</strong> — I&apos;ll provide the updates below.</span>
                    </label>
                  </div>
                </div>

                {!informationCurrent && (
                  <div className="space-y-5">
                    <div className="border border-gray-200 rounded-lg p-5">
                      <label className="flex items-start gap-3 text-sm cursor-pointer">
                        <input type="checkbox" checked={registeredOfficeChanged} onChange={(e) => toggleRegisteredOfficeChanged(e.target.checked)} className="mt-1 accent-navy-900" />
                        <span className="text-gray-800"><strong>Registered office address</strong> has changed.</span>
                      </label>
                      {registeredOfficeChanged && (
                        <div className="mt-4">
                          <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                            New registered office <span className="text-red-500">*</span>
                          </p>
                          <AddressFields name="newRegisteredOffice" errors={errors.newRegisteredOffice} />
                        </div>
                      )}
                    </div>

                    <div className="border border-gray-200 rounded-lg p-5">
                      <label className="flex items-start gap-3 text-sm cursor-pointer">
                        <input type="checkbox" checked={directorsChanged} onChange={(e) => toggleDirectorsChanged(e.target.checked)} className="mt-1 accent-navy-900" />
                        <span className="text-gray-800"><strong>Directors</strong> have changed — provide the current slate below.</span>
                      </label>
                      {directorsChanged && (
                        <div className="mt-4">
                          <CurrentDirectorsArray name="directors" topError={typeof errors.directors?.message === "string" ? errors.directors.message : undefined} errors={errors.directors} />
                        </div>
                      )}
                    </div>

                    <div className="border border-gray-200 rounded-lg p-5">
                      <label className="flex items-start gap-3 text-sm cursor-pointer">
                        <input type="checkbox" checked={officersChanged} onChange={(e) => toggleOfficersChanged(e.target.checked)} className="mt-1 accent-navy-900" />
                        <span className="text-gray-800"><strong>Officers</strong> have changed — provide the current slate below.</span>
                      </label>
                      {officersChanged && (
                        <div className="mt-4">
                          <CurrentOfficersArray name="officers" topError={typeof errors.officers?.message === "string" ? errors.officers.message : undefined} errors={errors.officers} />
                        </div>
                      )}
                    </div>

                    <div className="border border-gray-200 rounded-lg p-5 space-y-4">
                      <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">Activity (optional update)</p>
                      <Field label="Primary Activity (NAICS Code)" error={errors.naicsCode?.message} hint="Leave blank if unchanged.">
                        <NaicsCombobox
                          value={watch("naicsCode") ?? ""}
                          onChange={(code) => form.setValue("naicsCode", code, { shouldValidate: true })}
                          error={errors.naicsCode?.message}
                        />
                      </Field>
                      <Field label="Principal activity description" error={errors.principalActivity?.message} hint="Leave blank if unchanged.">
                        <textarea {...register("principalActivity")} rows={3} className={`${iCls} resize-none`} />
                      </Field>
                    </div>
                  </div>
                )}

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
