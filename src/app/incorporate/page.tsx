"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Check, Plus, Trash2, ChevronLeft } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type Jurisdiction = "federal" | "ontario" | "bc";
type Pkg = "basic" | "standard" | "premium";

interface Director {
  firstName: string; lastName: string; email: string;
  address: string; city: string; province: string;
  postalCode: string; dateOfBirth: string; isCanadianResident: boolean;
}
interface Shareholder {
  firstName: string; lastName: string;
  address: string; city: string; province: string;
  shareClass: string; numberOfShares: string;
}
interface WizardData {
  jurisdiction: Jurisdiction; pkg: Pkg;
  businessName: string; needsNuans: boolean;
  businessActivity: string; fiscalYearEnd: string;
  directors: Director[]; shareholders: Shareholder[];
  regAddress: string; regCity: string; regProvince: string; regPostalCode: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PRICES: Record<Jurisdiction, Record<Pkg, number>> = {
  federal: { basic: 499, standard: 699, premium: 999 },
  ontario: { basic: 399, standard: 599, premium: 899 },
  bc:      { basic: 449, standard: 649, premium: 949 },
};

const PKG_FEATURES: Record<Pkg, string[]> = {
  basic:    ["Articles of Incorporation", "NUANS search (federal)", "Corporate bylaws", "Certificate of Incorporation", "Digital document delivery"],
  standard: ["Everything in Basic", "Corporate minute book", "Share certificates", "Banking resolution", "Registered office (1 month)"],
  premium:  ["Everything in Standard", "1-year registered office", "First annual return filing", "Priority 12-hour turnaround", "Dedicated account support"],
};

const PROVINCES = ["AB","BC","MB","NB","NL","NS","NT","NU","ON","PE","QC","SK","YT"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const SHARE_CLASSES = ["Common","Preferred","Class A","Class B"];
const STEP_LABELS = ["Jurisdiction","Package","Business Info","Directors","Shareholders","Office Address","Review & Pay"];

const JURISDICTION_INFO = [
  { id: "federal" as Jurisdiction, label: "Federal", sub: "Canada Business Corporations Act", desc: "Operate anywhere in Canada. National name protection. Preferred by investors and multi-province businesses." },
  { id: "ontario" as Jurisdiction, label: "Ontario", sub: "Ontario Business Corporations Act", desc: "Best for businesses based primarily in Ontario. Fast processing, straightforward filings." },
  { id: "bc" as Jurisdiction, label: "British Columbia", sub: "BC Business Corporations Act", desc: "Best for businesses based primarily in British Columbia. Modern corporate legislation." },
];

const PKG_INFO: { id: Pkg; label: string; desc: string }[] = [
  { id: "basic",    label: "Basic",    desc: "Essential incorporation documents. Government fees included." },
  { id: "standard", label: "Standard", desc: "Full package with minute book, share certificates, and more." },
  { id: "premium",  label: "Premium",  desc: "Complete package with 1-year registered office and annual return." },
];

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

const postalRx = /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/;

const directorSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Valid email required"),
  address: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  province: z.string().min(1, "Required"),
  postalCode: z.string().regex(postalRx, "Valid Canadian postal code (e.g. M5V 3A8)"),
  dateOfBirth: z.string().min(1, "Required"),
  isCanadianResident: z.boolean(),
});

const shareholderSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  address: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  province: z.string().min(1, "Required"),
  shareClass: z.string().min(1, "Required"),
  numberOfShares: z.string().min(1, "Required").refine(
    (v) => !isNaN(Number(v)) && Number(v) > 0,
    "Must be a positive number"
  ),
});

const s3 = z.object({
  businessName: z.string().min(2, "At least 2 characters required").max(120),
  needsNuans: z.boolean(),
  businessActivity: z.string().min(10, "Please describe your business activity"),
  fiscalYearEnd: z.string().min(1, "Please select a fiscal year end"),
});
const s4 = z.object({ directors: z.array(directorSchema).min(1) });
const s5 = z.object({ shareholders: z.array(shareholderSchema).min(1) });
const s6 = z.object({
  regAddress: z.string().min(1, "Required"),
  regCity: z.string().min(1, "Required"),
  regProvince: z.string().min(1, "Required"),
  regPostalCode: z.string().regex(postalRx, "Valid Canadian postal code required"),
});
const s7 = z.object({
  cardholderName: z.string().min(1, "Required"),
  cardNumber: z.string().min(13, "Valid card number required").max(19),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Format: MM/YY"),
  cvc: z.string().length(3, "Must be 3 digits"),
});

// ─── Reusable UI ──────────────────────────────────────────────────────────────

const iCls = "w-full border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-navy-900 transition-colors";
const sCls = "w-full border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-navy-900 bg-white transition-colors appearance-none";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-[0.1em] uppercase text-gray-500 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 mb-8 transition-colors">
      <ChevronLeft size={16} /> Back
    </button>
  );
}

function NextBtn({ label = "Continue", disabled = false }: { label?: string; disabled?: boolean }) {
  return (
    <button type="submit" disabled={disabled}
      className="w-full bg-navy-900 text-white font-medium py-3.5 text-sm tracking-wide hover:bg-navy-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-6">
      {label}
    </button>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-[72px] z-40">
      <div className="max-w-4xl mx-auto">
        {/* Mobile */}
        <div className="flex md:hidden items-center justify-between mb-2">
          <span className="text-sm font-medium text-navy-900">Step {current} of {STEP_LABELS.length}</span>
          <span className="text-sm text-gray-500 font-medium">{STEP_LABELS[current - 1]}</span>
        </div>
        <div className="md:hidden w-full bg-gray-100 h-1.5 rounded-full">
          <div className="bg-navy-900 h-1.5 rounded-full transition-all" style={{ width: `${(current / STEP_LABELS.length) * 100}%` }} />
        </div>
        {/* Desktop */}
        <div className="hidden md:flex items-center gap-0">
          {STEP_LABELS.map((label, idx) => {
            const num = idx + 1;
            const done = num < current;
            const active = num === current;
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-8 h-8 flex items-center justify-center text-xs font-bold transition-colors
                    ${done ? "bg-navy-900 text-white" : active ? "border-2 border-navy-900 text-navy-900" : "border border-gray-300 text-gray-400"}`}>
                    {done ? <Check size={14} /> : num}
                  </div>
                  <span className={`text-[10px] mt-1 whitespace-nowrap font-medium
                    ${active ? "text-navy-900" : done ? "text-gray-600" : "text-gray-400"}`}>
                    {label}
                  </span>
                </div>
                {idx < STEP_LABELS.length - 1 && (
                  <div className={`flex-1 h-px mx-1 mb-4 transition-colors ${done ? "bg-navy-900" : "bg-gray-200"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Step 1 — Jurisdiction ────────────────────────────────────────────────────

function Step1({ value, onChange, onNext }: { value: Jurisdiction; onChange: (v: Jurisdiction) => void; onNext: () => void }) {
  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Choose Your Jurisdiction</h2>
      <p className="text-gray-500 text-sm mb-8">Where will your business primarily operate?</p>
      <div className="space-y-3 mb-6">
        {JURISDICTION_INFO.map(({ id, label, sub, desc }) => (
          <button key={id} onClick={() => onChange(id)}
            className={`w-full text-left border px-5 py-4 transition-colors ${value === id ? "border-navy-900 bg-navy-50" : "border-gray-200 hover:border-gray-300"}`}>
            <div className="flex items-start gap-3">
              <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${value === id ? "border-navy-900" : "border-gray-300"}`}>
                {value === id && <div className="w-2 h-2 rounded-full bg-navy-900" />}
              </div>
              <div>
                <p className="font-semibold text-navy-900 text-sm">{label}</p>
                <p className="text-xs text-gray-500 mb-0.5">{sub}</p>
                <p className="text-xs text-gray-600">{desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mb-5">
        Not sure which to choose?{" "}
        <Link href="/faq" className="underline underline-offset-2 text-navy-900" target="_blank">Read our FAQ</Link>
      </p>
      <button onClick={onNext}
        className="w-full bg-navy-900 text-white font-medium py-3.5 text-sm tracking-wide hover:bg-navy-800 transition-colors">
        Continue
      </button>
    </div>
  );
}

// ─── Step 2 — Package ─────────────────────────────────────────────────────────

function Step2({ jurisdiction, value, onChange, onNext, onBack }: {
  jurisdiction: Jurisdiction; value: Pkg;
  onChange: (v: Pkg) => void; onNext: () => void; onBack: () => void;
}) {
  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <BackBtn onClick={onBack} />
      <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Choose Your Package</h2>
      <p className="text-gray-500 text-sm mb-8">All prices include government filing fees. Prices in CAD.</p>
      <div className="space-y-3 mb-6">
        {PKG_INFO.map(({ id, label, desc }) => {
          const price = PRICES[jurisdiction][id];
          return (
            <button key={id} onClick={() => onChange(id)}
              className={`w-full text-left border px-5 py-5 transition-colors ${value === id ? "border-navy-900 bg-navy-50" : "border-gray-200 hover:border-gray-300"}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${value === id ? "border-navy-900" : "border-gray-300"}`}>
                    {value === id && <div className="w-2 h-2 rounded-full bg-navy-900" />}
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900 text-sm">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </div>
                <span className="font-serif text-2xl font-bold text-navy-900 shrink-0">${price}</span>
              </div>
              <ul className="ml-7 space-y-1">
                {PKG_FEATURES[id].map((f) => (
                  <li key={f} className="text-xs text-gray-600 flex items-center gap-1.5">
                    <Check size={10} className="text-navy-700 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
      <button onClick={onNext}
        className="w-full bg-navy-900 text-white font-medium py-3.5 text-sm tracking-wide hover:bg-navy-800 transition-colors">
        Continue
      </button>
    </div>
  );
}

// ─── Step 3 — Business Info ───────────────────────────────────────────────────

type S3 = z.infer<typeof s3>;
function Step3({ jurisdiction, def, onNext, onBack }: { jurisdiction: Jurisdiction; def: Partial<S3>; onNext: (d: S3) => void; onBack: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<S3>({
    resolver: zodResolver(s3),
    defaultValues: { needsNuans: jurisdiction === "federal", ...def },
  });
  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <BackBtn onClick={onBack} />
      <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Business Details</h2>
      <p className="text-gray-500 text-sm mb-8">Tell us about the business you&apos;re incorporating.</p>
      <form onSubmit={handleSubmit(onNext)} className="space-y-5">
        <Field label="Proposed Corporation Name *" error={errors.businessName?.message}>
          <input {...register("businessName")} placeholder='e.g. "Acme Technologies Inc."' className={iCls} />
          <p className="text-xs text-gray-500 mt-1">Must include a legal ending: Inc., Ltd., Corp., or Limited.</p>
        </Field>
        {jurisdiction === "federal" && (
          <div className="flex items-start gap-3 bg-cream-50 border border-gray-200 p-4">
            <input type="checkbox" id="nuans" {...register("needsNuans")} className="mt-0.5 shrink-0 accent-navy-900" />
            <label htmlFor="nuans" className="text-sm text-gray-700 cursor-pointer leading-snug">
              <span className="font-medium">Include NUANS name search</span> — Required for federal incorporations.
              Confirms your proposed name is available. <span className="text-navy-900 font-medium">(Included in your package)</span>
            </label>
          </div>
        )}
        <Field label="Business Activity Description *" error={errors.businessActivity?.message}>
          <textarea {...register("businessActivity")} rows={3} placeholder="e.g. Software development and IT consulting services for small businesses." className={`${iCls} resize-none`} />
          <p className="text-xs text-gray-500 mt-1">A brief description of what your corporation will do.</p>
        </Field>
        <Field label="Fiscal Year End (Month) *" error={errors.fiscalYearEnd?.message}>
          <select {...register("fiscalYearEnd")} className={sCls}>
            <option value="">Select month...</option>
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <p className="text-xs text-gray-500 mt-1">Most businesses choose December.</p>
        </Field>
        <NextBtn />
      </form>
    </div>
  );
}

// ─── Step 4 — Directors ───────────────────────────────────────────────────────

type S4 = z.infer<typeof s4>;
const emptyDir: Director = { firstName:"", lastName:"", email:"", address:"", city:"", province:"", postalCode:"", dateOfBirth:"", isCanadianResident: true };

function Step4({ def, onNext, onBack }: { def: Partial<S4>; onNext: (d: S4) => void; onBack: () => void }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<S4>({
    resolver: zodResolver(s4),
    defaultValues: { directors: def.directors?.length ? def.directors : [emptyDir] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "directors" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const de = (errors.directors as any) ?? [];

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <BackBtn onClick={onBack} />
      <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Directors</h2>
      <p className="text-gray-500 text-sm mb-8">At least one director is required. Directors must be 18 or older.</p>
      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        {fields.map((field, i) => (
          <div key={field.id} className="border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="font-serif font-bold text-navy-900 text-base">Director {i + 1}</p>
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(i)} className="text-xs text-red-500 flex items-center gap-1 hover:text-red-600">
                  <Trash2 size={13} /> Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name *" error={de[i]?.firstName?.message}><input {...register(`directors.${i}.firstName`)} className={iCls} /></Field>
              <Field label="Last Name *" error={de[i]?.lastName?.message}><input {...register(`directors.${i}.lastName`)} className={iCls} /></Field>
              <Field label="Email Address *" error={de[i]?.email?.message}><input type="email" {...register(`directors.${i}.email`)} className={iCls} /></Field>
              <Field label="Date of Birth *" error={de[i]?.dateOfBirth?.message}><input type="date" {...register(`directors.${i}.dateOfBirth`)} className={iCls} /></Field>
            </div>
            <div className="mt-4 space-y-4">
              <Field label="Street Address *" error={de[i]?.address?.message}><input {...register(`directors.${i}.address`)} placeholder="123 Main Street" className={iCls} /></Field>
              <div className="grid grid-cols-3 gap-4">
                <Field label="City *" error={de[i]?.city?.message}><input {...register(`directors.${i}.city`)} className={iCls} /></Field>
                <Field label="Province *" error={de[i]?.province?.message}>
                  <select {...register(`directors.${i}.province`)} className={sCls}>
                    <option value="">Select...</option>
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Postal Code *" error={de[i]?.postalCode?.message}><input {...register(`directors.${i}.postalCode`)} placeholder="M5V 3A8" className={iCls} /></Field>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id={`resident-${i}`} {...register(`directors.${i}.isCanadianResident`)} className="shrink-0 accent-navy-900" />
                <label htmlFor={`resident-${i}`} className="text-sm text-gray-700 cursor-pointer">Canadian resident</label>
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => append(emptyDir)}
          className="flex items-center gap-2 text-sm text-navy-900 border border-navy-900 px-4 py-2.5 hover:bg-navy-50 transition-colors">
          <Plus size={14} /> Add Another Director
        </button>
        <NextBtn />
      </form>
    </div>
  );
}

// ─── Step 5 — Shareholders ────────────────────────────────────────────────────

type S5 = z.infer<typeof s5>;
const emptySH: Shareholder = { firstName:"", lastName:"", address:"", city:"", province:"", shareClass:"Common", numberOfShares:"100" };

function Step5({ def, onNext, onBack }: { def: Partial<S5>; onNext: (d: S5) => void; onBack: () => void }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<S5>({
    resolver: zodResolver(s5),
    defaultValues: { shareholders: def.shareholders?.length ? def.shareholders : [emptySH] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "shareholders" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const se = (errors.shareholders as any) ?? [];

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <BackBtn onClick={onBack} />
      <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Shareholders</h2>
      <p className="text-gray-500 text-sm mb-8">List all initial shareholders of the corporation.</p>
      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        {fields.map((field, i) => (
          <div key={field.id} className="border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="font-serif font-bold text-navy-900 text-base">Shareholder {i + 1}</p>
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(i)} className="text-xs text-red-500 flex items-center gap-1 hover:text-red-600">
                  <Trash2 size={13} /> Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="First Name *" error={se[i]?.firstName?.message}><input {...register(`shareholders.${i}.firstName`)} className={iCls} /></Field>
              <Field label="Last Name *" error={se[i]?.lastName?.message}><input {...register(`shareholders.${i}.lastName`)} className={iCls} /></Field>
              <Field label="Share Class *" error={se[i]?.shareClass?.message}>
                <select {...register(`shareholders.${i}.shareClass`)} className={sCls}>
                  {SHARE_CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Number of Shares *" error={se[i]?.numberOfShares?.message}>
                <input type="number" min="1" {...register(`shareholders.${i}.numberOfShares`)} className={iCls} />
              </Field>
            </div>
            <Field label="Street Address *" error={se[i]?.address?.message}><input {...register(`shareholders.${i}.address`)} placeholder="123 Main Street" className={iCls} /></Field>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <Field label="City *" error={se[i]?.city?.message}><input {...register(`shareholders.${i}.city`)} className={iCls} /></Field>
              <Field label="Province *" error={se[i]?.province?.message}>
                <select {...register(`shareholders.${i}.province`)} className={sCls}>
                  <option value="">Select...</option>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
              <div />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => append(emptySH)}
          className="flex items-center gap-2 text-sm text-navy-900 border border-navy-900 px-4 py-2.5 hover:bg-navy-50 transition-colors">
          <Plus size={14} /> Add Another Shareholder
        </button>
        <NextBtn />
      </form>
    </div>
  );
}

// ─── Step 6 — Registered Office ───────────────────────────────────────────────

type S6 = z.infer<typeof s6>;
function Step6({ jurisdiction, def, onNext, onBack }: { jurisdiction: Jurisdiction; def: Partial<S6>; onNext: (d: S6) => void; onBack: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<S6>({ resolver: zodResolver(s6), defaultValues: def });
  const jurisLabel = jurisdiction === "federal" ? "any Canadian province" : jurisdiction === "ontario" ? "Ontario" : "British Columbia";
  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <BackBtn onClick={onBack} />
      <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Registered Office</h2>
      <p className="text-gray-500 text-sm mb-8">Must be a physical address in {jurisLabel} — not a P.O. Box.</p>
      <form onSubmit={handleSubmit(onNext)} className="space-y-5">
        <Field label="Street Address *" error={errors.regAddress?.message}>
          <input {...register("regAddress")} placeholder="123 Business Street" className={iCls} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="City *" error={errors.regCity?.message}><input {...register("regCity")} className={iCls} /></Field>
          <Field label="Province *" error={errors.regProvince?.message}>
            <select {...register("regProvince")} className={sCls}>
              <option value="">Select...</option>
              {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Postal Code *" error={errors.regPostalCode?.message}>
          <input {...register("regPostalCode")} placeholder="M5V 3A8" className={`${iCls} max-w-[200px]`} />
        </Field>
        <div className="bg-cream-50 border border-gray-200 p-4 text-sm text-gray-600 leading-relaxed">
          <strong className="text-gray-800">Standard &amp; Premium packages</strong> include a registered office address,
          so you can use our address if you don&apos;t have a physical office location in the jurisdiction.
        </div>
        <NextBtn label="Continue to Review" />
      </form>
    </div>
  );
}

// ─── Step 7 — Review & Pay ────────────────────────────────────────────────────

type S7 = z.infer<typeof s7>;
function Step7({ data, onBack, onPay }: { data: WizardData; onBack: () => void; onPay: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<S7>({ resolver: zodResolver(s7) });
  const price = PRICES[data.jurisdiction][data.pkg];
  const jurisLabel = { federal: "Federal (Canada)", ontario: "Ontario", bc: "British Columbia" }[data.jurisdiction];
  const pkgLabel = { basic: "Basic", standard: "Standard", premium: "Premium" }[data.pkg];

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <BackBtn onClick={onBack} />
      <h2 className="font-serif text-3xl font-bold text-navy-900 mb-8">Review &amp; Pay</h2>

      {/* Order Summary */}
      <div className="bg-cream-50 border border-gray-200 p-6 mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">Order Summary</p>
        <div className="space-y-2.5 text-sm">
          {[
            ["Jurisdiction", jurisLabel],
            ["Package", pkgLabel],
            ["Corporation Name", data.businessName || "—"],
            ["Directors", String(data.directors.length)],
            ["Shareholders", String(data.shareholders.length)],
            ["Registered Office", data.regCity ? `${data.regCity}, ${data.regProvince}` : "—"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-gray-500">{k}</span>
              <span className="font-medium text-gray-800 text-right">{v}</span>
            </div>
          ))}
          <div className="border-t border-gray-300 pt-3 mt-1 flex justify-between items-baseline">
            <span className="font-semibold text-gray-800">Total (excl. tax)</span>
            <span className="font-serif text-3xl font-bold text-navy-900">${price}</span>
          </div>
          <p className="text-xs text-gray-500">All government filing fees included. No hidden charges.</p>
        </div>
      </div>

      {/* Payment (stub) */}
      <div className="border border-gray-200 p-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-5">Payment Details</p>
        <form onSubmit={handleSubmit(onPay)} className="space-y-4">
          <Field label="Cardholder Name *" error={errors.cardholderName?.message}>
            <input {...register("cardholderName")} placeholder="Jane Smith" className={iCls} />
          </Field>
          <Field label="Card Number *" error={errors.cardNumber?.message}>
            <input {...register("cardNumber")} placeholder="1234 5678 9012 3456" maxLength={19} className={iCls} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Expiry (MM/YY) *" error={errors.expiry?.message}>
              <input {...register("expiry")} placeholder="09/27" maxLength={5} className={iCls} />
            </Field>
            <Field label="CVC *" error={errors.cvc?.message}>
              <input {...register("cvc")} placeholder="123" maxLength={3} className={iCls} />
            </Field>
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
            🔒 Encrypted &amp; secure. Card details are never stored by Korporex.
          </p>
          <button type="submit"
            className="w-full bg-gold-500 text-white font-medium py-4 text-sm tracking-wide hover:bg-gold-600 transition-colors mt-2">
            Pay ${price} — Submit Incorporation
          </button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-4">
          By submitting you agree to our{" "}
          <Link href="#" className="underline underline-offset-2">Terms of Service</Link> and{" "}
          <Link href="#" className="underline underline-offset-2">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const init: WizardData = {
  jurisdiction: "ontario", pkg: "standard",
  businessName: "", needsNuans: false, businessActivity: "", fiscalYearEnd: "",
  directors: [], shareholders: [],
  regAddress: "", regCity: "", regProvince: "", regPostalCode: "",
};

export default function IncorporatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(init);

  function patch(p: Partial<WizardData>) { setData((prev) => ({ ...prev, ...p })); }

  return (
    <div className="min-h-screen bg-white">
      <ProgressBar current={step} />
      <div className="pb-20">
        {step === 1 && <Step1 value={data.jurisdiction} onChange={(jurisdiction) => patch({ jurisdiction })} onNext={() => setStep(2)} />}
        {step === 2 && <Step2 jurisdiction={data.jurisdiction} value={data.pkg} onChange={(pkg) => patch({ pkg })} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <Step3 jurisdiction={data.jurisdiction}
          def={{ businessName: data.businessName, needsNuans: data.needsNuans, businessActivity: data.businessActivity, fiscalYearEnd: data.fiscalYearEnd }}
          onNext={(d) => { patch(d); setStep(4); }} onBack={() => setStep(2)} />}
        {step === 4 && <Step4 def={{ directors: data.directors }} onNext={(d) => { patch(d); setStep(5); }} onBack={() => setStep(3)} />}
        {step === 5 && <Step5 def={{ shareholders: data.shareholders }} onNext={(d) => { patch(d); setStep(6); }} onBack={() => setStep(4)} />}
        {step === 6 && <Step6 jurisdiction={data.jurisdiction}
          def={{ regAddress: data.regAddress, regCity: data.regCity, regProvince: data.regProvince, regPostalCode: data.regPostalCode }}
          onNext={(d) => { patch(d); setStep(7); }} onBack={() => setStep(5)} />}
        {step === 7 && <Step7 data={data} onBack={() => setStep(6)} onPay={() => router.push("/incorporate/confirmation")} />}
      </div>
    </div>
  );
}
