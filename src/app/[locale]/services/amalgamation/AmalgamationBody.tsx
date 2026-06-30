"use client";

import { useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import {
  amalgamationSchema,
  type AmalgamationSubmission,
  type CurrentDirector,
} from "@/lib/businessUpdateSchemas";
import { BUSINESS_UPDATE_SERVICES } from "@/lib/businessUpdateServices";
import { LEGAL_ENDINGS } from "@/lib/legalEndings";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, StepProgress, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import { CurrentDirectorsArray } from "@/components/wizard/CurrentPeopleSection";

const SERVICE = BUSINESS_UPDATE_SERVICES["amalgamation"];
const TOTAL_STEPS = 5;

const emptyAddress = { street: "", city: "", region: "", postalCode: "", country: "CA" };
const emptyPredecessor = { corpName: "", corpNumber: "", businessNumber: "" };
const emptyDirector: CurrentDirector = {
  firstName: "",
  lastName: "",
  email: "",
  canadianResident: false,
  electedDate: "",
  address: { ...emptyAddress },
};

export default function AmalgamationPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<AmalgamationSubmission>({
    resolver: zodResolver(amalgamationSchema),
    mode: "onTouched",
    defaultValues: {
      newJurisdiction: "federal",
      amalgamationType: "long_form",
      predecessors: [{ ...emptyPredecessor }, { ...emptyPredecessor }],
      newCorpNameType: "named",
      newCorpName: "",
      newLegalEnding: undefined,
      registeredOffice: { ...emptyAddress },
      directors: [{ ...emptyDirector }],
      agreementDate: "",
      specialResolutionsDate: "",
      effectiveDate: "",
      shareStructureNotes: "",
      notes: "",
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

  const { handleSubmit, trigger, watch, register, control, formState: { errors } } = form;
  const predecessorsFA = useFieldArray({ control, name: "predecessors" });
  const amalgamationType = watch("amalgamationType");
  const newCorpNameType = watch("newCorpNameType");
  const newJurisdiction = watch("newJurisdiction");
  const isLongForm = amalgamationType === "long_form";

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof AmalgamationSubmission | string>> = {
      1: ["newJurisdiction", "amalgamationType", "predecessors"],
      2: ["newCorpNameType", "newCorpName", "newLegalEnding", "registeredOffice"],
      3: ["directors", "shareStructureNotes", "agreementDate", "specialResolutionsDate", "effectiveDate"],
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

  async function onFinalSubmit(data: AmalgamationSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/business-update-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "amalgamation", payload: data }),
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
            <span className="font-semibold text-navy-900">${SERVICE.price} CAD</span> + applicable tax + government filing fees (pass-through). Filed within 5 business days.
          </p>
          <div className="mt-4 p-3 bg-amber-50 border-l-3 border-gold-500 text-xs text-amber-900 leading-relaxed">
            <strong>Same-jurisdiction requirement:</strong> all predecessor corporations must be in the same jurisdiction as the amalgamated corporation. Cross-jurisdiction amalgamations require one corporation to be <a className="underline" href="/services/continuance">continued</a> into the other&apos;s jurisdiction first.
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
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Amalgamation Setup</h2>
              <p className="text-gray-500 text-sm mb-8">Jurisdiction, type, and the predecessor corporations being combined.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <Field label="Jurisdiction of the amalgamated corporation *" error={errors.newJurisdiction?.message}>
                  <select {...register("newJurisdiction")} className={sCls}>
                    <option value="federal">Federal (CBCA — Corporations Canada)</option>
                    <option value="ontario">Ontario (OBCA — Ontario Business Registry)</option>
                  </select>
                </Field>

                <Field label="Amalgamation type *" error={errors.amalgamationType?.message}>
                  <select {...register("amalgamationType")} className={sCls}>
                    <option value="long_form">Long-form — separate corporations, amalgamation agreement + special resolutions</option>
                    <option value="short_form_vertical">Short-form vertical — parent + wholly-owned subsidiary</option>
                    <option value="short_form_horizontal">Short-form horizontal — wholly-owned sister corporations</option>
                  </select>
                </Field>

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-3">
                    Amalgamating (predecessor) corporations <span className="text-red-500">*</span>
                  </p>
                  <div className="space-y-4">
                    {predecessorsFA.fields.map((field, idx) => {
                      const pErrors = errors.predecessors?.[idx];
                      return (
                        <div key={field.id} className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">Predecessor {idx + 1}</p>
                            {predecessorsFA.fields.length > 2 && (
                              <button type="button" onClick={() => predecessorsFA.remove(idx)} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
                                <Trash2 size={12} /> Remove
                              </button>
                            )}
                          </div>
                          <div className="space-y-3">
                            <Field label="Corporation legal name *" error={pErrors?.corpName?.message}>
                              <input type="text" {...register(`predecessors.${idx}.corpName`)} className={iCls} />
                            </Field>
                            <Field label={newJurisdiction === "ontario" ? "OCN (Ontario Corporation Number) *" : "Corporation number *"} error={pErrors?.corpNumber?.message}>
                              <input type="text" {...register(`predecessors.${idx}.corpNumber`)} className={iCls} />
                            </Field>
                            <Field label="CRA Business Number (BN)" error={pErrors?.businessNumber?.message}>
                              <input type="text" {...register(`predecessors.${idx}.businessNumber`)} className={iCls} placeholder="123456789 RC0001" />
                            </Field>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {predecessorsFA.fields.length < 10 && (
                    <button type="button" onClick={() => predecessorsFA.append({ ...emptyPredecessor })} className="mt-3 w-full border border-dashed border-gray-300 hover:border-navy-900 text-sm text-gray-700 hover:text-navy-900 py-3 flex items-center justify-center gap-2 transition-colors">
                      <Plus size={14} /> Add another predecessor
                    </button>
                  )}
                  {typeof errors.predecessors?.message === "string" && (
                    <p className="text-xs text-red-500 mt-2">{errors.predecessors.message}</p>
                  )}
                </div>
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Name &amp; Registered Office</h2>
              <p className="text-gray-500 text-sm mb-8">The amalgamated corporation&apos;s name and registered office.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <Field label="Name choice *" error={errors.newCorpNameType?.message}>
                  <select {...register("newCorpNameType")} className={sCls}>
                    <option value="named">Named corporation</option>
                    <option value="numbered">Numbered corporation (assigned by registrar)</option>
                  </select>
                </Field>
                {newCorpNameType === "named" && (
                  <>
                    <Field label="New corporate name *" error={errors.newCorpName?.message} hint="The distinctive part, without the legal ending.">
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
                  </>
                )}

                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    Registered office of amalgamated corporation <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="registeredOffice" errors={errors.registeredOffice} />
                </div>
                <NextBtn />
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <BackBtn onClick={() => setStep(2)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Directors, Share Structure &amp; Dates</h2>
              <p className="text-gray-500 text-sm mb-6">
                {newJurisdiction === "federal"
                  ? "Federal amalgamations are filed under CBCA s.181-186 (Form 9 — Articles of Amalgamation)."
                  : "Ontario amalgamations are filed under OBCA s.174-179."}
              </p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(4); }} className="space-y-6">
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">Directors of the amalgamated corporation</p>
                  <CurrentDirectorsArray
                    name="directors"
                    showCanadianResident={newJurisdiction === "federal"}
                    topError={typeof errors.directors?.message === "string" ? errors.directors.message : undefined}
                    errors={errors.directors}
                  />
                </div>

                <Field
                  label="Share structure (plain English) *"
                  error={errors.shareStructureNotes?.message}
                  hint="Describe the classes of shares the amalgamated corporation will have, their rights, and how the predecessor shares are being converted. The drafter formalizes this into the Articles."
                >
                  <textarea {...register("shareStructureNotes")} rows={6} className={`${iCls} resize-none`} placeholder={"Example: One class of common shares (voting, dividends, participation on dissolution). Each predecessor common share converts 1-for-1 into amalgamated common shares."} />
                </Field>

                <Field label="Amalgamation agreement / directors' resolution date *" error={errors.agreementDate?.message}>
                  <input type="date" {...register("agreementDate")} className={iCls} />
                </Field>

                {isLongForm && (
                  <Field
                    label="Predecessor special resolutions date *"
                    error={errors.specialResolutionsDate?.message}
                    hint="Date the shareholders of each predecessor passed the special resolution approving the amalgamation agreement."
                  >
                    <input type="date" {...register("specialResolutionsDate")} className={iCls} />
                  </Field>
                )}

                <Field label="Effective date *" error={errors.effectiveDate?.message}>
                  <input type="date" {...register("effectiveDate")} className={iCls} />
                </Field>

                <Field label="Notes" error={errors.notes?.message} hint="Anything else relevant — related restructuring, tax considerations, cross-references.">
                  <textarea {...register("notes")} rows={3} className={`${iCls} resize-none`} />
                </Field>

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
                      Government filing fees (Corporations Canada $200 / Ontario $330) and NUANS reports (if named) are billed separately as pass-through. Complex amalgamations may require additional drafting time — we&apos;ll flag this before incurring it.
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
