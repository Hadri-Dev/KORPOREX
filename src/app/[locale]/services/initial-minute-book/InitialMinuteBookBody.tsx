"use client";

import { useState } from "react";
import { useForm, FormProvider, useFieldArray, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import {
  initialMinuteBookSchema,
  type InitialMinuteBookSubmission,
} from "@/lib/businessUpdateSchemas";
import {
  BUSINESS_UPDATE_SERVICES,
  MINUTE_BOOK_PRICING,
  computeMinuteBookSubtotal,
} from "@/lib/businessUpdateServices";
import { getTaxRate } from "@/lib/pricing";
import { Field, BackBtn, NextBtn, WizardStepper, firstErrorStep, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import CorporationIdSection from "@/components/wizard/CorporationIdSection";
import { CurrentDirectorsArray, CurrentOfficersArray } from "@/components/wizard/CurrentPeopleSection";

const SERVICE = BUSINESS_UPDATE_SERVICES["initial-minute-book"];

const STEP_LABELS = ["Corporation", "Shares", "Directors", "Officers", "Contact", "Billing"];
const STEP_FIELDS: string[][] = [
  ["corporation", "incorporationDate", "registeredOffice"],
  ["shareClasses", "shareholders"],
  ["directors"],
  ["officers", "notes"],
  ["contact"],
  ["billingName", "billingAddress"],
];

const emptyAddress = { street: "", city: "", region: "", postalCode: "", country: "CA" };

// Standard class names customers can pick from. Labels mirror the incorporation
// wizard's SHARE_CLASS_OPTIONS so both flows describe the same structures; the
// Other option keeps arbitrary Articles wording possible.
const SHARE_CLASS_NAME_OPTIONS = [
  "Common Shares",
  "Class A Common Shares",
  "Class B Common Shares (non-voting)",
  "Class C Preferred Shares",
  "Class D Special Shares",
  "Class E Redeemable Preferred Shares",
];
const OTHER_CLASS = "__other__";

function ShareClassNameField({ idx, error }: { idx: number; error?: string }) {
  const { register, setValue, watch } = useFormContext<InitialMinuteBookSubmission>();
  const value = watch(`shareClasses.${idx}.className`) ?? "";
  const [custom, setCustom] = useState(
    () => value !== "" && !SHARE_CLASS_NAME_OPTIONS.includes(value)
  );
  const selectValue = custom ? OTHER_CLASS : SHARE_CLASS_NAME_OPTIONS.includes(value) ? value : "";
  return (
    <div className="space-y-4">
      <Field
        label="Class name *"
        error={custom ? undefined : error}
        hint={custom ? undefined : "Pick the class as it appears in your Articles of Incorporation."}
      >
        <select
          value={selectValue}
          onChange={(e) => {
            if (e.target.value === OTHER_CLASS) {
              setCustom(true);
              setValue(`shareClasses.${idx}.className`, "", { shouldValidate: false });
            } else {
              setCustom(false);
              setValue(`shareClasses.${idx}.className`, e.target.value, { shouldValidate: true });
            }
          }}
          className={sCls}
        >
          <option value="">Select…</option>
          {SHARE_CLASS_NAME_OPTIONS.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
          <option value={OTHER_CLASS}>Other (type the exact class name)</option>
        </select>
      </Field>
      {custom && (
        <Field
          label="Exact class name *"
          error={error}
          hint='As written in your Articles, e.g. "Class F Special Shares".'
        >
          <input
            type="text"
            {...register(`shareClasses.${idx}.className`)}
            className={iCls}
            placeholder="Class F Special Shares"
          />
        </Field>
      )}
    </div>
  );
}

const emptyShareClass: InitialMinuteBookSubmission["shareClasses"][number] = {
  className: "",
  rightsNotes: "",
};

const emptyShareholder: InitialMinuteBookSubmission["shareholders"][number] = {
  firstName: "",
  lastName: "",
  shareClass: "",
  numberOfShares: "100",
  pricePerShare: "1.00",
  issueDate: "",
  address: { ...emptyAddress },
};

export default function InitialMinuteBookPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<InitialMinuteBookSubmission>({
    resolver: zodResolver(initialMinuteBookSchema),
    mode: "onTouched",
    defaultValues: {
      corporation: { jurisdiction: "federal", corpName: "", corpNumber: "", businessNumber: "" },
      incorporationDate: "",
      registeredOffice: { ...emptyAddress },
      shareClasses: [{ ...emptyShareClass }],
      shareholders: [{ ...emptyShareholder }],
      directors: [
        { firstName: "", lastName: "", email: "", canadianResident: false, electedDate: "", address: { ...emptyAddress } },
      ],
      officers: [
        { firstName: "", lastName: "", position: "President", email: "", appointedDate: "", address: { ...emptyAddress } },
      ],
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
  const classFA = useFieldArray({ control, name: "shareClasses" });
  const holderFA = useFieldArray({ control, name: "shareholders" });
  const jurisdiction = watch("corporation.jurisdiction");

  async function gotoStep(next: number) {
    const fieldsByStep: Record<number, Array<keyof InitialMinuteBookSubmission | string>> = {
      1: ["corporation", "incorporationDate", "registeredOffice"],
      2: ["shareClasses", "shareholders"],
      3: ["directors"],
      4: ["officers", "notes"],
      5: ["contact"],
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

  async function onFinalSubmit(data: InitialMinuteBookSubmission) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/business-update-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "initial-minute-book", payload: data }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? "Submission failed.");
      window.location.href = json.url;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed.");
      setSubmitting(false);
    }
  }

  const classNames = (watch("shareClasses") ?? [])
    .map((c) => c.className.trim())
    .filter(Boolean);

  const counts = {
    shareClasses: (watch("shareClasses") ?? []).length || 1,
    shareholders: (watch("shareholders") ?? []).length || 1,
    directors: (watch("directors") ?? []).length || 1,
    officers: (watch("officers") ?? []).length || 1,
  };
  const subtotal = computeMinuteBookSubtotal(counts);
  const region = watch("billingAddress.region") || "";
  const country = watch("billingAddress.country") || "CA";
  const taxRate = getTaxRate(country, region);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const addonLine = (label: string, count: number, unit: number) => {
    const extra = Math.max(0, count - 1);
    if (extra === 0) return null;
    return (
      <div key={label} className="flex justify-between">
        <span className="text-gray-700">
          {label} × {extra}
        </span>
        <span className="text-gray-900">${(extra * unit).toFixed(2)}</span>
      </div>
    );
  };
  const addonLines = [
    addonLine("Additional share classes", counts.shareClasses, MINUTE_BOOK_PRICING.extraShareClass),
    addonLine("Additional shareholders", counts.shareholders, MINUTE_BOOK_PRICING.extraShareholder),
    addonLine("Additional directors", counts.directors, MINUTE_BOOK_PRICING.extraDirector),
    addonLine("Additional officers", counts.officers, MINUTE_BOOK_PRICING.extraOfficer),
  ].filter(Boolean);

  return (
    <FormProvider {...form}>
      <section className="bg-cream-50 py-8 px-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-4">{SERVICE.label}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{SERVICE.description}</p>
          <p className="mt-4 text-sm text-gray-500">
            <span className="font-semibold text-navy-900">${SERVICE.price} CAD</span> + applicable tax. Includes 1 class of
            shares, 1 shareholder, 1 director, and 1 officer. Delivered within 2 business days.
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Each additional class of shares ${MINUTE_BOOK_PRICING.extraShareClass}; each additional shareholder, director,
            or officer ${MINUTE_BOOK_PRICING.extraShareholder} (+ applicable tax).
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
              <p className="text-gray-500 text-sm mb-8">
                Tell us about the corporation the minute book is for. Copy the details from your Certificate and Articles
                of Incorporation.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(2); }} className="space-y-5">
                <CorporationIdSection errors={errors.corporation} />
                <Field label="Date of incorporation *" error={errors.incorporationDate?.message} hint="Shown on your Certificate of Incorporation.">
                  <input type="date" {...register("incorporationDate")} className={iCls} />
                </Field>
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    Registered office address <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name="registeredOffice" errors={errors.registeredOffice} />
                </div>
                <NextBtn />
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <BackBtn onClick={() => setStep(1)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Share Structure</h2>
              <p className="text-gray-500 text-sm mb-6">
                Enter each class of shares exactly as it appears in your Articles of Incorporation, then list who holds
                shares in each class. The first class and the first shareholder are included in the base price; each
                additional class adds ${MINUTE_BOOK_PRICING.extraShareClass} and each additional shareholder adds $
                {MINUTE_BOOK_PRICING.extraShareholder} (+ applicable tax).
              </p>

              <form onSubmit={(e) => { e.preventDefault(); gotoStep(3); }} className="space-y-6">
                <div className="space-y-4">
                  {classFA.fields.map((field, idx) => {
                    const e = errors.shareClasses?.[idx];
                    return (
                      <div key={field.id} className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">
                            Share class {idx + 1}
                          </p>
                          {classFA.fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => classFA.remove(idx)}
                              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          )}
                        </div>
                        <div className="space-y-4">
                          <ShareClassNameField idx={idx} error={e?.className?.message} />
                          <Field label="Rights and restrictions" error={e?.rightsNotes?.message} hint="Optional. Voting, dividends, redemption. We transcribe the definitive text from your Articles.">
                            <textarea {...register(`shareClasses.${idx}.rightsNotes`)} rows={2} className={`${iCls} resize-none`} />
                          </Field>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {classFA.fields.length < 10 && (
                  <button
                    type="button"
                    onClick={() => classFA.append({ ...emptyShareClass })}
                    className="w-full border border-dashed border-gray-300 hover:border-navy-900 text-sm text-gray-700 hover:text-navy-900 py-3 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus size={14} /> Add another share class (${MINUTE_BOOK_PRICING.extraShareClass} + applicable tax)
                  </button>
                )}
                {typeof errors.shareClasses?.message === "string" && (
                  <p className="text-xs text-red-500">{errors.shareClasses.message}</p>
                )}

                <div className="space-y-4">
                  {holderFA.fields.map((field, idx) => {
                    const e = errors.shareholders?.[idx];
                    return (
                      <div key={field.id} className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">
                            Shareholder {idx + 1}
                          </p>
                          {holderFA.fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => holderFA.remove(idx)}
                              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <Field label="First name *" error={e?.firstName?.message}>
                              <input type="text" {...register(`shareholders.${idx}.firstName`)} className={iCls} />
                            </Field>
                            <Field label="Last name *" error={e?.lastName?.message}>
                              <input type="text" {...register(`shareholders.${idx}.lastName`)} className={iCls} />
                            </Field>
                          </div>
                          <Field label="Share class *" error={e?.shareClass?.message} hint="Pick from the classes entered above.">
                            <select {...register(`shareholders.${idx}.shareClass`)} className={sCls}>
                              <option value="">Select…</option>
                              {classNames.map((n) => (
                                <option key={n} value={n}>{n}</option>
                              ))}
                            </select>
                          </Field>
                          <div className="grid grid-cols-2 gap-3">
                            <Field label="Number of shares *" error={e?.numberOfShares?.message}>
                              <input type="number" min={1} {...register(`shareholders.${idx}.numberOfShares`)} className={iCls} />
                            </Field>
                            <Field label="Price per share *" error={e?.pricePerShare?.message}>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">$</span>
                                <input
                                  type="number"
                                  min={0.01}
                                  step={0.01}
                                  {...register(`shareholders.${idx}.pricePerShare`)}
                                  className={`${iCls} pl-8`}
                                />
                              </div>
                            </Field>
                          </div>
                          <Field label="Issue date" error={e?.issueDate?.message} hint="Optional. When the shares were (or will be) issued. Defaults to the incorporation date.">
                            <input type="date" {...register(`shareholders.${idx}.issueDate`)} className={iCls} />
                          </Field>
                          <div>
                            <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                              Address <span className="text-red-500">*</span>
                            </p>
                            <AddressFields name={`shareholders.${idx}.address`} errors={e?.address} canadaOnly={false} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {holderFA.fields.length < 20 && (
                  <button
                    type="button"
                    onClick={() => holderFA.append({ ...emptyShareholder })}
                    className="w-full border border-dashed border-gray-300 hover:border-navy-900 text-sm text-gray-700 hover:text-navy-900 py-3 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus size={14} /> Add another shareholder (${MINUTE_BOOK_PRICING.extraShareholder} + applicable tax)
                  </button>
                )}
                {typeof errors.shareholders?.message === "string" && (
                  <p className="text-xs text-red-500">{errors.shareholders.message}</p>
                )}

                <NextBtn />
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <BackBtn onClick={() => setStep(2)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Directors</h2>
              <p className="text-gray-500 text-sm mb-6">
                The corporation&apos;s current directors, as they should appear in the register of directors. The first
                director is included in the base price; each additional director adds $
                {MINUTE_BOOK_PRICING.extraDirector} (+ applicable tax).
              </p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(4); }} className="space-y-6">
                <CurrentDirectorsArray
                  name="directors"
                  showCanadianResident={jurisdiction === "federal"}
                  topError={typeof errors.directors?.message === "string" ? errors.directors.message : undefined}
                  errors={errors.directors}
                />
                <NextBtn />
              </form>
            </div>
          )}

          {step === 4 && (
            <div>
              <BackBtn onClick={() => setStep(3)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Officers</h2>
              <p className="text-gray-500 text-sm mb-6">
                The corporation&apos;s current officers, as they should appear in the register of officers. A director can
                also be an officer; enter them in both steps. The first officer is included in the base price; each
                additional officer adds ${MINUTE_BOOK_PRICING.extraOfficer} (+ applicable tax).
              </p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(5); }} className="space-y-6">
                <CurrentOfficersArray
                  name="officers"
                  topError={typeof errors.officers?.message === "string" ? errors.officers.message : undefined}
                  errors={errors.officers}
                />
                <Field label="Notes" error={errors.notes?.message} hint="Optional. Anything else the drafter should know about the corporation.">
                  <textarea {...register("notes")} rows={3} maxLength={2000} className={`${iCls} resize-none`} />
                </Field>
                <NextBtn />
              </form>
            </div>
          )}

          {step === 5 && (
            <div>
              <BackBtn onClick={() => setStep(4)} />
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Contact</h2>
              <p className="text-gray-500 text-sm mb-8">Who should we reach out to with questions about this order.</p>
              <form onSubmit={(e) => { e.preventDefault(); gotoStep(6); }} className="space-y-5">
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
                <Field label="Your role" error={errors.contact?.contactRole?.message} hint="Optional. E.g. director, shareholder, accountant.">
                  <input type="text" {...register("contact.contactRole")} className={iCls} />
                </Field>
                <NextBtn />
              </form>
            </div>
          )}

          {step === 6 && (
            <div>
              <BackBtn onClick={() => setStep(5)} />
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
                      <span className="text-gray-700">{SERVICE.longLabel}</span>
                      <span className="text-gray-900">${SERVICE.price.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Includes 1 share class, 1 shareholder, 1 director, 1 officer
                    </p>
                    {addonLines}
                    {addonLines.length > 0 && (
                      <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between text-gray-700">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                    )}
                    {tax > 0 && (
                      <div className="flex justify-between text-gray-500 text-xs">
                        <span>Tax ({(taxRate * 100).toFixed(taxRate === 0.14975 ? 3 : 0)}%{region ? `, ${region}` : ""})</span>
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
