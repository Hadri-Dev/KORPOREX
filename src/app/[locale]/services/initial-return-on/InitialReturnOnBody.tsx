"use client";

import { useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import {
  initialReturnOntarioSchema,
  type InitialReturnOntarioSubmission,
  type CurrentDirector,
  type CurrentOfficer,
} from "@/lib/complianceSchemas";
import { COMPLIANCE_SERVICES } from "@/lib/complianceServices";
import { getTaxRate } from "@/lib/pricing";
import { OFFICER_POSITIONS } from "@/lib/officerPositions";
import { Field, BackBtn, NextBtn, StepProgress, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";
import NaicsCombobox from "@/components/NaicsCombobox";

const SERVICE = COMPLIANCE_SERVICES["initial-return-on"];
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

export default function InitialReturnOntarioPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<InitialReturnOntarioSubmission>({
    resolver: zodResolver(initialReturnOntarioSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "ontario", corpName: "", corpNumber: "", businessNumber: "" },
      incorporationDate: "",
      registeredOffice: { ...emptyAddress, region: "ON" },
      mailingAddressDifferent: false,
      mailingAddress: undefined,
      directors: [{ ...emptyDirector }],
      officers: [{ ...emptyOfficer }],
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

  const { handleSubmit, trigger, watch, register, control, setValue, formState: { errors } } = form;
  const directorsFA = useFieldArray({ control, name: "directors" });
  const officersFA = useFieldArray({ control, name: "officers" });
  const mailingDifferent = watch("mailingAddressDifferent");

  function toggleMailing(next: boolean) {
    setValue("mailingAddressDifferent", next);
    setValue("mailingAddress", next ? { ...emptyAddress, region: "ON" } : undefined);
  }

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof InitialReturnOntarioSubmission | string>> = {
      1: ["corporation", "incorporationDate"],
      2: ["registeredOffice", "mailingAddressDifferent", "mailingAddress"],
      3: ["directors", "officers"],
      4: ["naicsCode", "principalActivity", "contact"],
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

  async function onFinalSubmit(data: InitialReturnOntarioSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/compliance-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "initial-return-on", payload: data }),
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
          <div className="mt-4 p-3 bg-amber-50 border-l-3 border-gold-500 text-xs text-amber-900 leading-relaxed">
            <strong>Statutory deadline:</strong> the Initial Return must be filed within <strong>60 days</strong> of incorporation under the Ontario <em>Corporations Information Act</em>. Late filings risk default status with the registry.
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
              <p className="text-gray-500 text-sm mb-8">The Ontario corporation you&apos;re filing the Initial Return for.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <CorporationIdSection errors={errors.corporation} lockedJurisdiction="ontario" />
                <Field label="Incorporation date *" error={errors.incorporationDate?.message} hint="The date stamped on your Articles of Incorporation.">
                  <input type="date" {...register("incorporationDate")} className={iCls} />
                </Field>
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Registered Office</h2>
              <p className="text-gray-500 text-sm mb-8">The official address on record with the Ontario Business Registry.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    Registered office address <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="registeredOffice" errors={errors.registeredOffice} />
                  <p className="text-xs text-gray-500 mt-2">
                    Must be a physical address located in Ontario.
                  </p>
                </div>

                <label className="flex items-start gap-3 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mailingDifferent}
                    onChange={(e) => toggleMailing(e.target.checked)}
                    className="mt-1 accent-navy-900"
                  />
                  <span className="text-gray-700">My mailing address is different from the registered office.</span>
                </label>

                {mailingDifferent && (
                  <div>
                    <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                      Mailing address <span className="text-red-500">*</span>
                    </p>
                    <AddressFields name="mailingAddress" errors={errors.mailingAddress} canadaOnly={false} />
                  </div>
                )}

                <NextBtn />
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <BackBtn onClick={() => setStep(2)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Directors &amp; Officers</h2>
              <p className="text-gray-500 text-sm mb-8">The full slate of directors and officers as of today.</p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(4); }} className="space-y-8">
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">Directors</p>
                  <div className="space-y-4">
                    {directorsFA.fields.map((field, idx) => {
                      const dErrors = errors.directors?.[idx];
                      return (
                        <div key={field.id} className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">Director {idx + 1}</p>
                            {directorsFA.fields.length > 1 && (
                              <button type="button" onClick={() => directorsFA.remove(idx)} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
                                <Trash2 size={12} /> Remove
                              </button>
                            )}
                          </div>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <Field label="First name *" error={dErrors?.firstName?.message}>
                                <input type="text" {...register(`directors.${idx}.firstName`)} className={iCls} />
                              </Field>
                              <Field label="Last name *" error={dErrors?.lastName?.message}>
                                <input type="text" {...register(`directors.${idx}.lastName`)} className={iCls} />
                              </Field>
                            </div>
                            <Field label="Email" error={dErrors?.email?.message}>
                              <input type="email" {...register(`directors.${idx}.email`)} className={iCls} />
                            </Field>
                            <Field label="Elected date" error={dErrors?.electedDate?.message} hint="Optional — usually the date of incorporation for the first directors.">
                              <input type="date" {...register(`directors.${idx}.electedDate`)} className={iCls} />
                            </Field>
                            <div>
                              <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                                Residential address <span className="text-red-500">*</span>
                              </p>
                              <AddressFields name={`directors.${idx}.address`} errors={dErrors?.address} canadaOnly={false} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {directorsFA.fields.length < 20 && (
                    <button type="button" onClick={() => directorsFA.append({ ...emptyDirector })} className="mt-3 w-full border border-dashed border-gray-300 hover:border-navy-900 text-sm text-gray-700 hover:text-navy-900 py-3 flex items-center justify-center gap-2 transition-colors">
                      <Plus size={14} /> Add another director
                    </button>
                  )}
                  {typeof errors.directors?.message === "string" && (
                    <p className="text-xs text-red-500 mt-2">{errors.directors.message}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">Officers</p>
                  <div className="space-y-4">
                    {officersFA.fields.map((field, idx) => {
                      const oErrors = errors.officers?.[idx];
                      return (
                        <div key={field.id} className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">Officer {idx + 1}</p>
                            {officersFA.fields.length > 1 && (
                              <button type="button" onClick={() => officersFA.remove(idx)} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
                                <Trash2 size={12} /> Remove
                              </button>
                            )}
                          </div>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <Field label="First name *" error={oErrors?.firstName?.message}>
                                <input type="text" {...register(`officers.${idx}.firstName`)} className={iCls} />
                              </Field>
                              <Field label="Last name *" error={oErrors?.lastName?.message}>
                                <input type="text" {...register(`officers.${idx}.lastName`)} className={iCls} />
                              </Field>
                            </div>
                            <Field label="Position *" error={oErrors?.position?.message}>
                              <select {...register(`officers.${idx}.position`)} className={sCls}>
                                {OFFICER_POSITIONS.map((p) => (
                                  <option key={p} value={p}>{p}</option>
                                ))}
                              </select>
                            </Field>
                            <Field label="Email" error={oErrors?.email?.message}>
                              <input type="email" {...register(`officers.${idx}.email`)} className={iCls} />
                            </Field>
                            <Field label="Appointed date" error={oErrors?.appointedDate?.message}>
                              <input type="date" {...register(`officers.${idx}.appointedDate`)} className={iCls} />
                            </Field>
                            <div>
                              <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                                Residential address <span className="text-red-500">*</span>
                              </p>
                              <AddressFields name={`officers.${idx}.address`} errors={oErrors?.address} canadaOnly={false} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {officersFA.fields.length < 20 && (
                    <button type="button" onClick={() => officersFA.append({ ...emptyOfficer })} className="mt-3 w-full border border-dashed border-gray-300 hover:border-navy-900 text-sm text-gray-700 hover:text-navy-900 py-3 flex items-center justify-center gap-2 transition-colors">
                      <Plus size={14} /> Add another officer
                    </button>
                  )}
                  {typeof errors.officers?.message === "string" && (
                    <p className="text-xs text-red-500 mt-2">{errors.officers.message}</p>
                  )}
                </div>

                <NextBtn />
              </form>
            </div>
          )}

          {step === 4 && (
            <div>
              <BackBtn onClick={() => setStep(3)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Activity &amp; Contact</h2>
              <p className="text-gray-500 text-sm mb-8">The corporation&apos;s principal business activity, and who we can reach with questions.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(5); }} className="space-y-5">
                <Field label="Primary Activity (NAICS Code) *" error={errors.naicsCode?.message} hint="Search by code, activity, or sector.">
                  <NaicsCombobox
                    value={watch("naicsCode")}
                    onChange={(code) => form.setValue("naicsCode", code, { shouldValidate: true })}
                    error={errors.naicsCode?.message}
                  />
                </Field>
                <Field label="Principal activity description *" error={errors.principalActivity?.message} hint="A brief description of what the corporation does.">
                  <textarea {...register("principalActivity")} rows={3} className={`${iCls} resize-none`} placeholder="e.g. Consulting services for small and medium-sized businesses in the technology sector." />
                </Field>

                <div className="border-t border-gray-100 pt-5 space-y-5">
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">Contact</p>
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
                </div>

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
