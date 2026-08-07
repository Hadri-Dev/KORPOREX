"use client";

import { useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import {
  annualResolutionOntarioSchema,
  annualResolutionFederalSchema,
  type AnnualResolutionSubmission,
} from "@/lib/complianceSchemas";
import { COMPLIANCE_SERVICES } from "@/lib/complianceServices";
import { OFFICER_POSITIONS } from "@/lib/officerPositions";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";

// Shared wizard for both Annual Resolution services. The Ontario and federal
// flows differ only in the locked jurisdiction, the schema's jurisdiction
// guard, and the statute cited in the copy — so unlike the two Annual Return
// wizards (which capture different government-form fields), this one is a
// single component rendered by both service pages.

type Jurisdiction = "ontario" | "federal";

const STEP_LABELS = ["Corporation", "Resolutions", "Contact", "Billing"];
const STEP_FIELDS: string[][] = [
  ["corporation", "financialYearEnd", "resolutionDate", "lastAnnualMeetingDate"],
  [
    "financialStatementsAvailable",
    "auditorTreatment",
    "auditorName",
    "directors",
    "officers",
    "shareholders",
    "allShareholdersWillSign",
    "additionalMatters",
  ],
  ["contact"],
  ["billingName", "billingAddress"],
];

const emptyAddress = { street: "", city: "", region: "", postalCode: "", country: "CA" };

const COPY: Record<
  Jurisdiction,
  { slug: "annual-resolution-on" | "annual-resolution-federal"; registry: string; meetingRule: string; auditRule: string }
> = {
  ontario: {
    slug: "annual-resolution-on",
    registry: "Ontario corporation",
    meetingRule:
      "OBCA s.94 requires an annual meeting of shareholders within 15 months of the last one. Written resolutions signed by all voting shareholders (OBCA s.104) satisfy the requirement without holding a meeting.",
    auditRule:
      "A non-offering Ontario corporation may dispense with the audit for the year by unanimous written consent of all shareholders, voting and non-voting (OBCA s.148).",
  },
  federal: {
    slug: "annual-resolution-federal",
    registry: "CBCA corporation",
    meetingRule:
      "CBCA s.133 requires an annual meeting of shareholders no later than 15 months after the last one and within 6 months of the financial year-end. Written resolutions signed by all voting shareholders (CBCA s.142) satisfy the requirement without holding a meeting.",
    auditRule:
      "A non-distributing CBCA corporation may dispense with the appointment of an auditor by unanimous resolution of all shareholders, voting and non-voting (CBCA s.163). The resolution is valid until the next annual meeting.",
  },
};

export default function AnnualResolutionWizard({ jurisdiction }: { jurisdiction: Jurisdiction }) {
  const copy = COPY[jurisdiction];
  const SERVICE = COMPLIANCE_SERVICES[copy.slug];

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<AnnualResolutionSubmission>({
    resolver: zodResolver(
      jurisdiction === "ontario" ? annualResolutionOntarioSchema : annualResolutionFederalSchema
    ),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction, corpName: "", corpNumber: "", businessNumber: "" },
      financialYearEnd: "",
      resolutionDate: "",
      lastAnnualMeetingDate: "",
      financialStatementsAvailable: true,
      auditorTreatment: "dispense",
      auditorName: "",
      directors: [{ firstName: "", lastName: "" }],
      officers: [{ firstName: "", lastName: "", position: "President" }],
      shareholders: [{ name: "", partyType: "individual", shareClass: "" }],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      allShareholdersWillSign: false as any,
      additionalMatters: "",
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
  const auditorTreatment = watch("auditorTreatment");

  const directors = useFieldArray({ control: form.control, name: "directors" });
  const officers = useFieldArray({ control: form.control, name: "officers" });
  const shareholders = useFieldArray({ control: form.control, name: "shareholders" });

  async function gotoStep(next: number) {
    const fields = STEP_FIELDS[step - 1];
    if (fields && step < 4) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const valid = await trigger(fields as any);
      if (!valid) return;
    }
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onFinalSubmit(data: AnnualResolutionSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/compliance-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: copy.slug, payload: data }),
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
            <span className="font-semibold text-navy-900">${SERVICE.price.toFixed(2)} CAD</span> + applicable tax.
            Drafted and emailed to you within 2 business days.
          </p>
        </div>
      </section>

      <section className="bg-white py-12 px-6">
        <div className="max-w-xl mx-auto">
          <WizardStepper steps={STEP_LABELS} current={step} onGo={setStep} />

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
              <p className="text-gray-500 text-sm mb-8">The {copy.registry} the resolutions are for.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <CorporationIdSection errors={errors.corporation} lockedJurisdiction={jurisdiction} />
                <Field
                  label="Financial year-end *"
                  error={errors.financialYearEnd?.message}
                  hint="The year-end the resolutions cover."
                >
                  <input type="date" {...register("financialYearEnd")} className={iCls} />
                </Field>
                <Field
                  label="Date of the resolutions *"
                  error={errors.resolutionDate?.message}
                  hint="The date the resolutions will be signed."
                >
                  <input type="date" {...register("resolutionDate")} className={iCls} />
                </Field>
                <Field
                  label="Last annual meeting / resolutions"
                  error={errors.lastAnnualMeetingDate?.message}
                  hint="Optional — leave blank if this is the corporation's first annual resolution."
                >
                  <input type="date" {...register("lastAnnualMeetingDate")} className={iCls} />
                </Field>
                <div className="border border-gray-200 rounded-lg p-4 bg-cream-50/40 text-xs text-gray-600 leading-relaxed">
                  {copy.meetingRule}
                </div>
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Annual Resolutions</h2>
              <p className="text-gray-500 text-sm mb-6">
                What the resolutions need to record: the financial statements, the directors elected, the
                officers appointed, and how the audit requirement is handled.
              </p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-5">
                <div className="border border-gray-200 rounded-lg p-5">
                  <label className="flex items-start gap-3 text-sm cursor-pointer">
                    <input type="checkbox" {...register("financialStatementsAvailable")} className="mt-1 accent-navy-900" />
                    <span className="text-gray-800">
                      <strong>Financial statements for the year are prepared</strong> and will be presented to the
                      shareholders for approval.{" "}
                      <span className="text-gray-500">
                        Leave unchecked if they aren&apos;t ready yet — we&apos;ll follow up before dating the resolutions.
                      </span>
                    </span>
                  </label>
                </div>

                <div className="border border-gray-200 rounded-lg p-5 space-y-4">
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">Audit</p>
                  <Field label="How is the audit requirement handled? *" error={errors.auditorTreatment?.message}>
                    <select {...register("auditorTreatment")} className={sCls}>
                      <option value="dispense">Dispense with the audit by unanimous shareholder consent</option>
                      <option value="appoint_auditor">Appoint an auditor</option>
                      <option value="appoint_accountant">Appoint an accountant (review / compilation)</option>
                    </select>
                  </Field>
                  {auditorTreatment !== "dispense" && (
                    <Field
                      label="Name of the auditor / accountant *"
                      error={errors.auditorName?.message}
                      hint="Firm or individual name, as it should appear in the resolution."
                    >
                      <input type="text" {...register("auditorName")} className={iCls} />
                    </Field>
                  )}
                  <p className="text-xs text-gray-500 leading-relaxed">{copy.auditRule}</p>
                </div>

                {/* Directors elected */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-1">Directors elected</p>
                  <p className="text-xs text-gray-500 mb-4">
                    The directors elected (or re-elected) for the coming year.
                  </p>
                  <div className="space-y-3">
                    {directors.fields.map((field, idx) => (
                      <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-start">
                        <Field label={idx === 0 ? "First name *" : ""} error={errors.directors?.[idx]?.firstName?.message}>
                          <input type="text" {...register(`directors.${idx}.firstName`)} className={iCls} />
                        </Field>
                        <Field label={idx === 0 ? "Last name *" : ""} error={errors.directors?.[idx]?.lastName?.message}>
                          <input type="text" {...register(`directors.${idx}.lastName`)} className={iCls} />
                        </Field>
                        {directors.fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => directors.remove(idx)}
                            className={`text-red-600 hover:text-red-700 p-2 ${idx === 0 ? "mt-6" : ""}`}
                            aria-label="Remove director"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {typeof errors.directors?.message === "string" && (
                    <p className="text-xs text-red-500 mt-2">{errors.directors.message}</p>
                  )}
                  {directors.fields.length < 20 && (
                    <button
                      type="button"
                      onClick={() => directors.append({ firstName: "", lastName: "" })}
                      className="mt-3 w-full border border-dashed border-gray-300 hover:border-navy-900 text-sm text-gray-700 hover:text-navy-900 py-2.5 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Plus size={14} /> Add another director
                    </button>
                  )}
                </div>

                {/* Officers appointed */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-1">Officers appointed</p>
                  <p className="text-xs text-gray-500 mb-4">
                    Appointed by the directors&apos; resolution for the coming year.
                  </p>
                  <div className="space-y-4">
                    {officers.fields.map((field, idx) => (
                      <div key={field.id} className="border border-gray-100 rounded-md p-4 bg-cream-50/30">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-semibold text-gray-600">Officer {idx + 1}</p>
                          {officers.fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => officers.remove(idx)}
                              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="First name *" error={errors.officers?.[idx]?.firstName?.message}>
                            <input type="text" {...register(`officers.${idx}.firstName`)} className={iCls} />
                          </Field>
                          <Field label="Last name *" error={errors.officers?.[idx]?.lastName?.message}>
                            <input type="text" {...register(`officers.${idx}.lastName`)} className={iCls} />
                          </Field>
                        </div>
                        <div className="mt-3">
                          <Field label="Position *" error={errors.officers?.[idx]?.position?.message}>
                            <select {...register(`officers.${idx}.position`)} className={sCls}>
                              {OFFICER_POSITIONS.map((p) => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </Field>
                        </div>
                      </div>
                    ))}
                  </div>
                  {typeof errors.officers?.message === "string" && (
                    <p className="text-xs text-red-500 mt-2">{errors.officers.message}</p>
                  )}
                  {officers.fields.length < 20 && (
                    <button
                      type="button"
                      onClick={() => officers.append({ firstName: "", lastName: "", position: "President" })}
                      className="mt-3 w-full border border-dashed border-gray-300 hover:border-navy-900 text-sm text-gray-700 hover:text-navy-900 py-2.5 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Plus size={14} /> Add another officer
                    </button>
                  )}
                </div>

                {/* Shareholders signing */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-1">Shareholders</p>
                  <p className="text-xs text-gray-500 mb-4">
                    Everyone who will sign the shareholder resolution. A shareholder may be an individual or a
                    corporation.
                  </p>
                  <div className="space-y-4">
                    {shareholders.fields.map((field, idx) => (
                      <div key={field.id} className="border border-gray-100 rounded-md p-4 bg-cream-50/30">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-semibold text-gray-600">Shareholder {idx + 1}</p>
                          {shareholders.fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => shareholders.remove(idx)}
                              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          )}
                        </div>
                        <Field label="Name *" error={errors.shareholders?.[idx]?.name?.message}>
                          <input type="text" {...register(`shareholders.${idx}.name`)} className={iCls} />
                        </Field>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <Field label="Type *" error={errors.shareholders?.[idx]?.partyType?.message}>
                            <select {...register(`shareholders.${idx}.partyType`)} className={sCls}>
                              <option value="individual">Individual</option>
                              <option value="corporation">Corporation</option>
                            </select>
                          </Field>
                          <Field
                            label="Share class"
                            error={errors.shareholders?.[idx]?.shareClass?.message}
                            hint="Optional."
                          >
                            <input type="text" {...register(`shareholders.${idx}.shareClass`)} className={iCls} placeholder="Class A Common" />
                          </Field>
                        </div>
                      </div>
                    ))}
                  </div>
                  {typeof errors.shareholders?.message === "string" && (
                    <p className="text-xs text-red-500 mt-2">{errors.shareholders.message}</p>
                  )}
                  {shareholders.fields.length < 20 && (
                    <button
                      type="button"
                      onClick={() => shareholders.append({ name: "", partyType: "individual", shareClass: "" })}
                      className="mt-3 w-full border border-dashed border-gray-300 hover:border-navy-900 text-sm text-gray-700 hover:text-navy-900 py-2.5 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Plus size={14} /> Add another shareholder
                    </button>
                  )}
                </div>

                <div className="border border-gray-200 rounded-lg p-5">
                  <label className="flex items-start gap-3 text-sm cursor-pointer">
                    <input type="checkbox" {...register("allShareholdersWillSign")} className="mt-1 accent-navy-900" />
                    <span className="text-gray-800">
                      I confirm that <strong>all shareholders entitled to vote</strong> will sign the written
                      resolutions. <span className="text-red-500">*</span>
                    </span>
                  </label>
                  {errors.allShareholdersWillSign?.message && (
                    <p className="text-xs text-red-500 mt-2">{errors.allShareholdersWillSign.message}</p>
                  )}
                </div>

                <Field
                  label="Anything else the resolutions should cover?"
                  error={errors.additionalMatters?.message}
                  hint="Optional — e.g. approving a dividend, ratifying an act of the directors, changing the year-end."
                >
                  <textarea {...register("additionalMatters")} rows={3} className={`${iCls} resize-none`} />
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
              <form onSubmit={handleSubmit(onFinalSubmit, (errs) => { const s = firstErrorStep(errs, STEP_FIELDS); if (s) setStep(s); })} className="space-y-5">
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
