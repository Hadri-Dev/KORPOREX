"use client";

import { useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import {
  changeDirectorSchema,
  type ChangeDirectorSubmission,
} from "@/lib/amendmentSchemas";
import { AMENDMENT_SERVICES } from "@/lib/amendmentServices";
import { getTaxRate } from "@/lib/pricing";
import { OFFICER_POSITIONS } from "@/lib/officerPositions";
import { Field, BackBtn, NextBtn, StepProgress, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";

const SERVICE = AMENDMENT_SERVICES["change-director"];
const TOTAL_STEPS = 4;

const emptyChange: ChangeDirectorSubmission["changes"][number] = {
  changeKind: "add",
  role: "director",
  firstName: "",
  lastName: "",
  email: "",
  officerPosition: undefined,
  canadianResident: false,
  address: { street: "", city: "", region: "", postalCode: "", country: "CA" },
  effectiveDate: "",
  notes: "",
};

export default function ChangeDirectorPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ChangeDirectorSubmission>({
    resolver: zodResolver(changeDirectorSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "federal", corpName: "", corpNumber: "", businessNumber: "" },
      changes: [{ ...emptyChange }],
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

  const { handleSubmit, trigger, watch, register, control, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "changes" });
  const jurisdiction = watch("corporation.jurisdiction");

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof ChangeDirectorSubmission | string>> = {
      1: ["corporation"],
      2: ["changes"],
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

  async function onFinalSubmit(data: ChangeDirectorSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/amendment-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "change-director", payload: data }),
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
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-3">Amendment</p>
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
              <p className="text-gray-500 text-sm mb-8">Tell us which corporation you&apos;re updating.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <CorporationIdSection errors={errors.corporation} />
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">The Change(s)</h2>
              <p className="text-gray-500 text-sm mb-6">
                Add one entry per person being added, removed, or updated.{" "}
                {jurisdiction === "federal" ? (
                  <>
                    Under CBCA s.113 you must notify Corporations Canada within <strong>15 days</strong> of the change.
                  </>
                ) : (
                  <>
                    Under the Ontario <em>Corporations Information Act</em>, you must notify the registry within <strong>15 days</strong> of the change.
                  </>
                )}
              </p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-6">
                {fields.map((field, idx) => {
                  const role = watch(`changes.${idx}.role`);
                  const showOfficerPosition = role === "officer" || role === "director_and_officer";
                  const isDirector = role === "director" || role === "director_and_officer";
                  const changeErrors = errors.changes?.[idx];
                  return (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">
                          Change {idx + 1}
                        </p>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(idx)}
                            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Type of change *" error={changeErrors?.changeKind?.message}>
                            <select {...register(`changes.${idx}.changeKind`)} className={sCls}>
                              <option value="add">Add (new appointment)</option>
                              <option value="remove">Remove (resignation / ceasing)</option>
                              <option value="update">Update (existing person)</option>
                            </select>
                          </Field>
                          <Field label="Role *" error={changeErrors?.role?.message}>
                            <select {...register(`changes.${idx}.role`)} className={sCls}>
                              <option value="director">Director</option>
                              <option value="officer">Officer</option>
                              <option value="director_and_officer">Director and Officer</option>
                            </select>
                          </Field>
                        </div>

                        {showOfficerPosition && (
                          <Field label="Officer position *" error={changeErrors?.officerPosition?.message}>
                            <select {...register(`changes.${idx}.officerPosition`)} className={sCls}>
                              <option value="">Select…</option>
                              {OFFICER_POSITIONS.map((p) => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </Field>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <Field label="First name *" error={changeErrors?.firstName?.message}>
                            <input type="text" {...register(`changes.${idx}.firstName`)} className={iCls} />
                          </Field>
                          <Field label="Last name *" error={changeErrors?.lastName?.message}>
                            <input type="text" {...register(`changes.${idx}.lastName`)} className={iCls} />
                          </Field>
                        </div>

                        <Field label="Email" error={changeErrors?.email?.message} hint="Optional — used by the operator if there are questions about this person.">
                          <input type="email" {...register(`changes.${idx}.email`)} className={iCls} />
                        </Field>

                        <div>
                          <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                            Residential address <span className="text-red-500">*</span>
                          </p>
                          <AddressFields name={`changes.${idx}.address`} errors={changeErrors?.address} canadaOnly={false} />
                        </div>

                        {jurisdiction === "federal" && isDirector && (
                          <label className="flex items-start gap-3 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              {...register(`changes.${idx}.canadianResident`)}
                              className="mt-1 accent-navy-900"
                            />
                            <span className="text-gray-700">
                              This person is a <strong>Canadian resident</strong> within the meaning of CBCA s.2(1).
                              {" "}
                              <span className="text-gray-500">At least 25% of a federal corporation&apos;s directors must be Canadian residents.</span>
                            </span>
                          </label>
                        )}

                        <Field label="Effective date *" error={changeErrors?.effectiveDate?.message} hint="When the appointment / resignation / change takes effect.">
                          <input type="date" {...register(`changes.${idx}.effectiveDate`)} className={iCls} />
                        </Field>

                        <Field label="Notes" error={changeErrors?.notes?.message} hint="Anything else the drafter should know about this change.">
                          <textarea {...register(`changes.${idx}.notes`)} rows={2} className={`${iCls} resize-none`} />
                        </Field>
                      </div>
                    </div>
                  );
                })}

                {fields.length < 20 && (
                  <button
                    type="button"
                    onClick={() => append({ ...emptyChange })}
                    className="w-full border border-dashed border-gray-300 hover:border-navy-900 text-sm text-gray-700 hover:text-navy-900 py-3 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus size={14} /> Add another change
                  </button>
                )}

                {typeof errors.changes?.message === "string" && (
                  <p className="text-xs text-red-500">{errors.changes.message}</p>
                )}

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
                  <input type="tel" autoComplete="tel" {...register("contact.contactPhone")} className={iCls} placeholder="+1 416 555 0100" />
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
