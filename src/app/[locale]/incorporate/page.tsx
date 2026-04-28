"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "@/i18n/navigation";
import { Check, Plus, Trash2, ChevronLeft } from "lucide-react";
import NaicsCombobox from "@/components/NaicsCombobox";
import AddressAutocomplete, { type ParsedAddress } from "@/components/AddressAutocomplete";
import {
  PRICES,
  getNuansFee,
  JURISDICTION_LABELS,
  PKG_LABELS,
  REG_OFFICE_ADDON,
  regOfficeAddonAvailable,
  computePricing,
  type Jurisdiction,
  type Pkg,
  type RegOfficeAddon,
} from "@/lib/pricing";
import { LEGAL_ENDINGS, legalEndingSchema, type LegalEnding } from "@/lib/legalEndings";
import {
  OFFICER_POSITIONS,
  officerPositionSchema,
  type OfficerPosition,
} from "@/lib/officerPositions";
import { ALL_COUNTRIES } from "@/lib/countries";

// ─── Types ──────────────────────────────────────────────────────────────────

type CorpNameType = "named" | "numbered";

// CBCA s.2(1) defines a "resident Canadian" as a Canadian citizen ordinarily
// resident in Canada (with some prescribed-class exceptions) or a permanent
// resident ordinarily resident in Canada (with one-year-after-citizenship-
// eligibility caveat). We split the data into two orthogonal fields:
//  - `citizenshipStatus` — what the director IS (citizen / PR / other)
//  - `isCanadianResident` — whether the director qualifies as a CBCA
//    "resident Canadian" ("yes" / "no"). Empty string is the unset state
//    used by the federal radio group at first render so customers must
//    consciously pick. Non-federal jurisdictions seed it to "no" so the
//    existing checkbox UI behaves as before (unchecked = no).
type CitizenshipStatus = "citizen" | "permanent_resident" | "other";
type ResidentChoice = "yes" | "no";

const CITIZENSHIP_OPTIONS: ReadonlyArray<{ value: CitizenshipStatus; label: string }> = [
  { value: "citizen", label: "Canadian citizen" },
  { value: "permanent_resident", label: "Permanent resident" },
  { value: "other", label: "Other" },
];

interface Address {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

interface Director {
  firstName: string; lastName: string; email: string;
  dateOfBirth: string;
  citizenshipStatus: CitizenshipStatus;
  isCanadianResident: ResidentChoice;
  taxResidencyCountry: string;
  address: Address;
}
interface Shareholder {
  firstName: string; lastName: string;
  shareClass: string; numberOfShares: string;
  pricePerShare: string;
  address: Address;
}
interface Officer {
  firstName: string; lastName: string;
  // Surface "" at the input level (= "-- Please Select --") with a cast
  // (`"" as OfficerPosition`) on the seed value; Zod will reject empty
  // values at submit time. Same pattern used for `legalEnding` on Step 3.
  position: OfficerPosition;
  email: string;
  address: Address;
}
interface WizardData {
  jurisdiction: Jurisdiction; pkg: Pkg;
  corpNameType: CorpNameType;
  businessName: string;
  legalEnding: LegalEnding | "";
  officialEmail: string;
  naicsCode: string;
  businessActivity: string;
  fiscalYearEndMonth: string;
  fiscalYearEndDay: string;
  directors: Director[];
  shareholders: Shareholder[];
  officers: Officer[];
  regOffice: Address;
  regOfficeAddon: RegOfficeAddon;
  billingName: string;
  billingAddress: Address;
}

// ─── Constants ───────────────────────────────────────────────────────────────

// Pricing, NUANS fees, and tax rates live in `@/lib/pricing` so the API route
// can recalculate totals from the same source. PRICES and getNuansFee() are
// imported above; kept inline references below read from those.

const PKG_FEATURES: Record<Pkg, string[]> = {
  basic:    ["Articles of Incorporation", "Corporate bylaws", "Certificate of Incorporation", "Digital document delivery", "Digital document storage"],
  standard: ["Everything in Basic", "Corporate minute book", "Share certificates", "Banking resolution"],
  premium:  ["Everything in Standard", "First annual return filing", "Priority 12-hour turnaround", "Dedicated account support"],
};

const CA_PROVINCES = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "YT", name: "Yukon" },
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

// Short list of common countries; the free-text fallback keeps anywhere supported.
const COUNTRIES = [
  { code: "CA", name: "Canada" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "IN", name: "India" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IE", name: "Ireland" },
  { code: "NZ", name: "New Zealand" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "OTHER", name: "Other / not listed" },
];

const MONTHS = [
  { name: "January", days: 31 }, { name: "February", days: 28 }, { name: "March", days: 31 },
  { name: "April", days: 30 }, { name: "May", days: 31 }, { name: "June", days: 30 },
  { name: "July", days: 31 }, { name: "August", days: 31 }, { name: "September", days: 30 },
  { name: "October", days: 31 }, { name: "November", days: 30 }, { name: "December", days: 31 },
];

const SHARE_CLASSES = ["Common","Preferred","Class A","Class B"];
const STEP_LABELS = ["Jurisdiction","Package","Business Info","Directors","Shareholders","Officers","Office Address","Review & Pay"];

// Non-superiority-language jurisdiction descriptions (each is a valid choice).
const JURISDICTION_INFO = [
  {
    id: "federal" as Jurisdiction,
    label: "Federal",
    sub: "Canada Business Corporations Act",
    desc: "Country-wide name protection. You can carry on business in any province with extra-provincial registration.",
  },
  {
    id: "ontario" as Jurisdiction,
    label: "Ontario",
    sub: "Ontario Business Corporations Act",
    desc: "Provincial corporation created under Ontario law. Automatic authorization to carry on business in Ontario.",
  },
];

const PKG_INFO: { id: Pkg; label: string; desc: string }[] = [
  { id: "basic",    label: "Basic",    desc: "Essential incorporation documents. Government fees included." },
  { id: "standard", label: "Standard", desc: "Full package with minute book, share certificates, and more." },
  { id: "premium",  label: "Premium",  desc: "Complete package with first annual return filing and priority turnaround." },
];

// ─── Schemas ─────────────────────────────────────────────────────────────────

const addressSchema = z.object({
  street: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  region: z.string().min(1, "Required"),
  postalCode: z.string().min(3, "Required").max(12),
  country: z.string().min(2, "Required"),
});

const directorSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Valid email required"),
  dateOfBirth: z.string().min(1, "Required"),
  citizenshipStatus: z.enum(["citizen", "permanent_resident", "other"], {
    message: "Select citizenship status",
  }),
  isCanadianResident: z.enum(["yes", "no"], { message: "Required" }),
  taxResidencyCountry: z.string().min(2, "Select a country"),
  address: addressSchema,
});

const shareholderSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  shareClass: z.string().min(1, "Required"),
  numberOfShares: z.string().min(1, "Required").refine(
    (v) => !isNaN(Number(v)) && Number(v) > 0,
    "Must be a positive number"
  ),
  pricePerShare: z.string().min(1, "Required").refine(
    (v) => !isNaN(Number(v)) && Number(v) > 0,
    "Must be a positive amount"
  ),
  address: addressSchema,
});

const officerSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  position: officerPositionSchema,
  email: z.string().email("Valid email required"),
  address: addressSchema,
});

const s3 = z.object({
  corpNameType: z.enum(["named", "numbered"]),
  businessName: z.string().max(120),
  legalEnding: legalEndingSchema,
  officialEmail: z.string().email("Valid email required").max(320),
  naicsCode: z.string().min(4, "Please select an industry classification"),
  businessActivity: z.string().min(10, "Describe your business activity in at least a sentence"),
  fiscalYearEndMonth: z.string().min(1, "Select a month"),
  fiscalYearEndDay: z.string().min(1, "Select a day"),
}).refine(
  (v) => v.corpNameType === "numbered" || v.businessName.length >= 2,
  { message: "At least 2 characters required", path: ["businessName"] }
);

const s4 = z.object({ directors: z.array(directorSchema).min(1) });
const s5 = z.object({ shareholders: z.array(shareholderSchema).min(1) });
const s6 = z.object({ officers: z.array(officerSchema).min(1) });
const s7 = z.object({
  regOffice: addressSchema,
  regOfficeAddon: z.enum(["none", "korporex"]),
});
const s8 = z.object({
  billingName: z.string().min(1, "Required"),
  billingAddress: addressSchema,
});

// ─── Shared UI ───────────────────────────────────────────────────────────────

const iCls = "w-full border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-navy-900 transition-colors";
const sCls = "w-full border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-navy-900 bg-white transition-colors appearance-none";

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  const required = label.endsWith(" *");
  const baseLabel = required ? label.slice(0, -2) : label;
  return (
    <div>
      <label className="block text-xs font-bold tracking-[0.1em] uppercase text-black mb-1.5">
        {baseLabel}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getErr(errors: any, path: string): string | undefined {
  return path.split(".").reduce((acc, k) => acc?.[k], errors)?.message;
}

// ─── AddressFields ───────────────────────────────────────────────────────────

type AddressFieldsProps = {
  prefix: string;
  countryLock?: string;
  regionLock?: string;
  regionAllow?: string[];
  labelPrefix?: string;
};
// Renders a structured address subform bound to the surrounding react-hook-form
// context at `${prefix}.{street|city|region|postalCode|country}`. Uses
// AddressAutocomplete for the street input; falls back to a plain input if the
// Google Maps key is absent.
function AddressFields({ prefix, countryLock, regionLock, regionAllow, labelPrefix }: AddressFieldsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, watch, setValue, formState: { errors } } = useFormContext<any>();
  const country: string = countryLock ?? watch(`${prefix}.country`) ?? "CA";
  const region: string = watch(`${prefix}.region`) ?? "";
  const street: string = watch(`${prefix}.street`) ?? "";
  const L = labelPrefix ? `${labelPrefix} ` : "";

  function applyParsed(p: ParsedAddress) {
    if (p.street) setValue(`${prefix}.street`, p.street, { shouldValidate: true });
    if (p.city) setValue(`${prefix}.city`, p.city, { shouldValidate: true });
    if (p.postalCode) setValue(`${prefix}.postalCode`, p.postalCode, { shouldValidate: true });
    if (!countryLock && p.country) setValue(`${prefix}.country`, p.country, { shouldValidate: true });
    if (!regionLock && p.region) {
      const effectiveCountry = countryLock ?? p.country;
      if (effectiveCountry === "CA" && CA_PROVINCES.some((x) => x.code === p.region)) {
        setValue(`${prefix}.region`, p.region, { shouldValidate: true });
      } else if (effectiveCountry === "US" && US_STATES.includes(p.region)) {
        setValue(`${prefix}.region`, p.region, { shouldValidate: true });
      } else if (effectiveCountry !== "CA" && effectiveCountry !== "US") {
        setValue(`${prefix}.region`, p.regionLong || p.region, { shouldValidate: true });
      }
    }
  }

  const countryRestrict = countryLock === "CA" ? ["ca"] : undefined;

  let regionInput: React.ReactNode;
  if (regionLock) {
    regionInput = (
      <>
        <input type="hidden" {...register(`${prefix}.region`)} value={regionLock} />
        <input value={regionLock} disabled className={`${iCls} bg-gray-50 text-gray-500`} />
      </>
    );
  } else if (country === "CA") {
    const allowed = regionAllow
      ? CA_PROVINCES.filter((p) => regionAllow.includes(p.code))
      : CA_PROVINCES;
    regionInput = (
      <select {...register(`${prefix}.region`)} className={sCls}>
        <option value="">Select province…</option>
        {allowed.map((p) => <option key={p.code} value={p.code}>{p.code} — {p.name}</option>)}
      </select>
    );
  } else if (country === "US") {
    regionInput = (
      <select {...register(`${prefix}.region`)} className={sCls}>
        <option value="">Select state…</option>
        {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    );
  } else {
    regionInput = (
      <input
        {...register(`${prefix}.region`)}
        placeholder="State / province / region"
        className={iCls}
      />
    );
  }

  const postalPlaceholder =
    country === "CA" ? "M5V 3A8" :
    country === "US" ? "94103" :
    country === "GB" ? "SW1A 1AA" :
    "Postal / ZIP code";

  return (
    <div className="space-y-4">
      <Field label={`${L}Street Address *`} error={getErr(errors, `${prefix}.street`)}>
        <AddressAutocomplete
          value={street}
          onChange={(v) => setValue(`${prefix}.street`, v, { shouldValidate: true })}
          onAddressSelected={applyParsed}
          countryRestrict={countryRestrict}
          className={iCls}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label={`${L}City *`} error={getErr(errors, `${prefix}.city`)}>
          <input {...register(`${prefix}.city`)} className={iCls} />
        </Field>
        <Field
          label={`${L}${country === "US" ? "State" : country === "CA" ? "Province" : "Region"} *`}
          error={getErr(errors, `${prefix}.region`)}
        >
          {regionInput}
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label={`${L}Postal / ZIP *`} error={getErr(errors, `${prefix}.postalCode`)}>
          <input {...register(`${prefix}.postalCode`)} placeholder={postalPlaceholder} className={iCls} />
        </Field>
        <Field label={`${L}Country *`} error={getErr(errors, `${prefix}.country`)}>
          {countryLock ? (
            <>
              <input type="hidden" {...register(`${prefix}.country`)} value={countryLock} />
              <input
                value={COUNTRIES.find((c) => c.code === countryLock)?.name ?? countryLock}
                disabled
                className={`${iCls} bg-gray-50 text-gray-500`}
              />
            </>
          ) : (
            <select {...register(`${prefix}.country`)} className={sCls}
              onChange={(e) => {
                setValue(`${prefix}.country`, e.target.value, { shouldValidate: true });
                // Reset region when country changes so the selector matches the new list.
                if ((e.target.value !== country) && region) {
                  setValue(`${prefix}.region`, "", { shouldValidate: false });
                }
              }}
            >
              {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          )}
        </Field>
      </div>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-[72px] z-40">
      <div className="max-w-4xl mx-auto">
        <div className="flex md:hidden items-center justify-between mb-2">
          <span className="text-sm font-medium text-navy-900">Step {current} of {STEP_LABELS.length}</span>
          <span className="text-sm text-gray-500 font-medium">{STEP_LABELS[current - 1]}</span>
        </div>
        <div className="md:hidden w-full bg-gray-100 h-1.5 rounded-full">
          <div className="bg-navy-900 h-1.5 rounded-full transition-all" style={{ width: `${(current / STEP_LABELS.length) * 100}%` }} />
        </div>
        <div className="hidden md:flex items-center gap-0">
          {STEP_LABELS.map((label, idx) => {
            const num = idx + 1;
            const done = num < current;
            const active = num === current;
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
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
      <p className="text-gray-500 text-sm mb-8">
        Each of the three Canadian jurisdictions we support is a valid incorporation route. The right
        choice depends on where you plan to operate, the name-protection scope you need, and your budget.
      </p>
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
        Still weighing the options?{" "}
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

function Step3({ jurisdiction, def, onNext, onBack }: {
  jurisdiction: Jurisdiction;
  def: Partial<S3>;
  onNext: (d: S3) => void;
  onBack: () => void;
}) {
  const form = useForm<S3>({
    resolver: zodResolver(s3),
    defaultValues: {
      corpNameType: "named",
      businessName: "",
      // Cast: the wizard's WizardData allows "" for unset, but the Zod schema
      // (and therefore S3) restricts to the LegalEnding union. The UI shows
      // a "Please select…" placeholder for the empty state and validation
      // surfaces a "Select a legal ending" message before allowing submit.
      legalEnding: "" as LegalEnding,
      officialEmail: "",
      naicsCode: "",
      businessActivity: "",
      fiscalYearEndMonth: "",
      fiscalYearEndDay: "",
      ...def,
    },
  });
  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;
  const corpNameType = watch("corpNameType");
  const month = watch("fiscalYearEndMonth");
  const naicsCode = watch("naicsCode");

  const dayOptions = useMemo(() => {
    const rec = MONTHS.find((m) => m.name === month);
    if (!rec) return [] as number[];
    return Array.from({ length: rec.days }, (_, i) => i + 1);
  }, [month]);

  const nameSearchLabel =
    jurisdiction === "federal" ? "NUANS name search" : "Ontario name search";

  return (
    <FormProvider {...form}>
      <div className="max-w-xl mx-auto px-6 py-12">
        <BackBtn onClick={onBack} />
        <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Business Details</h2>
        <p className="text-gray-500 text-sm mb-8">Tell us about the business you&apos;re incorporating.</p>
        <form onSubmit={handleSubmit(onNext)} className="space-y-5">
          {/* Corporation name type */}
          <Field label="Corporation Name Type *" error={errors.corpNameType?.message}>
            <div className="grid grid-cols-2 gap-3">
              {(["named", "numbered"] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setValue("corpNameType", t, { shouldValidate: true })}
                  className={`group border px-4 py-3 text-left transition-colors hover:bg-navy-900 hover:border-navy-900 ${
                    corpNameType === t
                      ? "border-navy-900 bg-navy-50"
                      : "border-gray-200"
                  }`}
                >
                  <p className="text-sm font-semibold text-navy-900 transition-colors group-hover:text-white">
                    {t === "named" ? "Named" : "Numbered"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 transition-colors group-hover:text-gray-300">
                    {t === "named"
                      ? "Pick your own corporate name (e.g. Acme Inc.)"
                      : "Government-assigned (e.g. 1234567 Canada Inc.)"}
                  </p>
                </button>
              ))}
            </div>
            <input type="hidden" {...register("corpNameType")} />
          </Field>

          {corpNameType === "named" ? (
            <Field
              label="Proposed Corporation Name *"
              error={errors.businessName?.message}
              hint="Enter the distinctive part of the name only — the legal ending is selected separately below."
            >
              <input {...register("businessName")} placeholder='e.g. "Acme Technologies"' className={iCls} />
            </Field>
          ) : (
            <div className="bg-cream-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
              <strong className="text-gray-800">Numbered corporation:</strong> A unique number will be assigned
              by the government at incorporation and combined with your selected legal ending below
              (e.g. <em>1234567 Canada INC.</em>). No name search is required, so no NUANS fee applies. You can
              later file Articles of Amendment to adopt a name if you choose.
            </div>
          )}

          {/* Legal ending — required for both named and numbered, all jurisdictions. */}
          <Field
            label="Legal Ending *"
            error={errors.legalEnding?.message}
            hint={
              corpNameType === "named"
                ? "Appears at the end of your full corporate name (e.g. Acme Technologies INC.)."
                : "Combined with the government-assigned number to form your full corporate name."
            }
          >
            <select {...register("legalEnding")} className={sCls}>
              <option value="">-- Please Select --</option>
              {LEGAL_ENDINGS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </Field>

          {corpNameType === "named" && (
            <div className="bg-cream-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
              <strong className="text-gray-800">{nameSearchLabel} required.</strong> A ${getNuansFee(jurisdiction)} report fee
              applies and is shown separately at checkout. Choose a numbered corporation above to skip this fee.
            </div>
          )}

          {/* NAICS */}
          <Field
            label="Primary Activity (NAICS Code) *"
            error={errors.naicsCode?.message}
            hint="Search by code, activity, or sector."
          >
            <NaicsCombobox
              value={naicsCode}
              onChange={(code) => setValue("naicsCode", code, { shouldValidate: true })}
              error={errors.naicsCode?.message}
            />
          </Field>

          {/* Business activity description */}
          <Field label="Business Activity Description *" error={errors.businessActivity?.message} hint="A brief description of what your corporation will do.">
            <textarea {...register("businessActivity")} rows={3}
              placeholder="e.g. Software development and IT consulting for small businesses."
              className={`${iCls} resize-none`} />
          </Field>

          {/* Official email — corporation's primary contact email for government and Korporex correspondence. */}
          <Field
            label="Official Email Address *"
            error={errors.officialEmail?.message}
            hint="The corporation's primary contact email for government notices and correspondence."
          >
            <input
              type="email"
              autoComplete="email"
              {...register("officialEmail")}
              placeholder="e.g. contact@yourcompany.com"
              className={iCls}
            />
          </Field>

          {/* Fiscal year end: month + day */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Fiscal Year End — Month *" error={errors.fiscalYearEndMonth?.message}>
              <select {...register("fiscalYearEndMonth")} className={sCls}
                onChange={(e) => {
                  setValue("fiscalYearEndMonth", e.target.value, { shouldValidate: true });
                  // Reset day if it is now out of range for the new month.
                  const rec = MONTHS.find((m) => m.name === e.target.value);
                  const currentDay = Number(watch("fiscalYearEndDay"));
                  if (rec && currentDay > rec.days) {
                    setValue("fiscalYearEndDay", "", { shouldValidate: false });
                  }
                }}
              >
                <option value="">Month…</option>
                {MONTHS.map((m) => <option key={m.name} value={m.name}>{m.name}</option>)}
              </select>
            </Field>
            <Field label="Fiscal Year End — Day *" error={errors.fiscalYearEndDay?.message}>
              <select {...register("fiscalYearEndDay")} className={sCls} disabled={!month}>
                <option value="">{month ? "Day…" : "Select month first"}</option>
                {dayOptions.map((d) => <option key={d} value={String(d)}>{d}</option>)}
              </select>
            </Field>
          </div>

          <NextBtn />
        </form>
      </div>
    </FormProvider>
  );
}

// ─── Step 4 — Directors ───────────────────────────────────────────────────────

type S4 = z.infer<typeof s4>;
const emptyAddress: Address = { street: "", city: "", region: "", postalCode: "", country: "CA" };
const emptyDir: Director = {
  firstName: "", lastName: "", email: "",
  dateOfBirth: "",
  // Cast: empty surfaces as "no option selected" in the radio group;
  // Zod rejects it at submit time so the customer is forced to pick.
  // Same pattern used for `legalEnding` on Step 3.
  citizenshipStatus: "" as CitizenshipStatus,
  // Unset by default. For federal, customer must pick a radio option (Zod rejects "").
  // For non-federal, Step4 reseeds this to "no" so the existing checkbox UI
  // (unchecked = no) passes validation without forced interaction.
  isCanadianResident: "" as ResidentChoice,
  taxResidencyCountry: "",
  address: { ...emptyAddress },
};

function Step4({ def, jurisdiction, onNext, onBack }: { def: Partial<S4>; jurisdiction: Jurisdiction; onNext: (d: S4) => void; onBack: () => void }) {
  const isFederal = jurisdiction === "federal";
  // Federal customers must consciously pick "yes" or "no" — seed unset so the
  // radio group renders with neither option selected. Non-federal preserves
  // the legacy checkbox-as-boolean UX, so seed "no" (= unchecked).
  const seedDir: Director = isFederal ? emptyDir : { ...emptyDir, isCanadianResident: "no" };
  const form = useForm<S4>({
    resolver: zodResolver(s4),
    defaultValues: { directors: def.directors?.length ? def.directors : [seedDir] },
  });
  const { register, handleSubmit, control, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "directors" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const de = (errors.directors as any) ?? [];

  return (
    <FormProvider {...form}>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <BackBtn onClick={onBack} />
        <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Directors</h2>
        <p className="text-gray-500 text-sm mb-8">At least one director is required. Directors must be 18 or older. International directors are supported — residency requirements vary by jurisdiction.</p>
        <form onSubmit={handleSubmit(onNext)} className="space-y-6">
          {fields.map((field, i) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="font-serif font-bold text-navy-900 text-base">Director {i + 1}</p>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(i)} className="text-xs text-red-500 flex items-center gap-1 hover:text-red-600">
                    <Trash2 size={13} /> Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Field label="First Name *" error={de[i]?.firstName?.message}><input {...register(`directors.${i}.firstName`)} className={iCls} /></Field>
                <Field label="Last Name *" error={de[i]?.lastName?.message}><input {...register(`directors.${i}.lastName`)} className={iCls} /></Field>
                <Field label="Email Address *" error={de[i]?.email?.message}><input type="email" {...register(`directors.${i}.email`)} className={iCls} /></Field>
                <Field label="Date of Birth *" error={de[i]?.dateOfBirth?.message}><input type="date" {...register(`directors.${i}.dateOfBirth`)} className={iCls} /></Field>
              </div>
              <AddressFields prefix={`directors.${i}.address`} />
              {/* Tax residency — separate from the address country and from
                  the Canadian-resident checkbox below (which captures
                  residency for Canadian corporate-law purposes). */}
              <div className="mt-4">
                <Field
                  label="Country of Tax Residency *"
                  error={de[i]?.taxResidencyCountry?.message}
                >
                  <select {...register(`directors.${i}.taxResidencyCountry`)} className={sCls}>
                    <option value="">-- Select a country --</option>
                    {ALL_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </Field>
              </div>
              {/* Citizenship status — required radio group. Mutually
                  exclusive: Canadian citizen / Permanent resident / Other.
                  Native radio inputs (semantic) styled to look like the
                  other selectable cards in the wizard via the `has-[:checked]`
                  Tailwind variant. */}
              <div className="mt-4">
                <Field
                  label="Citizenship Status *"
                  error={de[i]?.citizenshipStatus?.message}
                >
                  <div className="grid grid-cols-3 gap-3">
                    {CITIZENSHIP_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-2 border border-gray-200 px-3 py-2.5 text-sm text-gray-700 cursor-pointer hover:border-navy-900 transition-colors has-[:checked]:border-navy-900 has-[:checked]:bg-navy-50 has-[:checked]:text-navy-900 has-[:checked]:font-medium"
                      >
                        <input
                          type="radio"
                          value={opt.value}
                          {...register(`directors.${i}.citizenshipStatus`)}
                          className="accent-navy-900"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </Field>
              </div>
              {isFederal ? (
                // Federal — mandatory two-radio choice. Customer must pick
                // "yes" or "no" (Zod rejects ""). Statutory text quoted from
                // CBCA s.2(1) verbatim so the customer sees the legal
                // definition they're acknowledging when they select Yes.
                <div className="mt-4">
                  <Field
                    label="Resident Canadian *"
                    error={de[i]?.isCanadianResident?.message}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 border border-gray-200 px-3 py-2.5 text-sm text-gray-700 cursor-pointer hover:border-navy-900 transition-colors has-[:checked]:border-navy-900 has-[:checked]:bg-navy-50 has-[:checked]:text-navy-900 has-[:checked]:font-medium">
                        <input type="radio" value="yes" {...register(`directors.${i}.isCanadianResident`)} className="accent-navy-900" />
                        I am a resident Canadian
                      </label>
                      <label className="flex items-center gap-2 border border-gray-200 px-3 py-2.5 text-sm text-gray-700 cursor-pointer hover:border-navy-900 transition-colors has-[:checked]:border-navy-900 has-[:checked]:bg-navy-50 has-[:checked]:text-navy-900 has-[:checked]:font-medium">
                        <input type="radio" value="no" {...register(`directors.${i}.isCanadianResident`)} className="accent-navy-900" />
                        I am not a resident Canadian
                      </label>
                    </div>
                  </Field>
                  <div className="text-xs text-gray-500 mt-2 leading-relaxed space-y-2">
                    <p>
                      Per s.&nbsp;2(1) of the Canada Business Corporations Act, resident Canadian means an individual who is
                    </p>
                    <p>(a) a Canadian citizen ordinarily resident in Canada,</p>
                    <p>(b) a Canadian citizen not ordinarily resident in Canada who is a member of a prescribed class of persons, or</p>
                    <p>(c) a permanent resident within the meaning of subsection 2(1) of the Immigration and Refugee Protection Act and ordinarily resident in Canada, except a permanent resident who has been ordinarily resident in Canada for more than one year after the time at which he or she first became eligible to apply for Canadian citizenship; (résident canadien)</p>
                  </div>
                </div>
              ) : (
                // Ontario — residency block intentionally omitted. OBCA dropped
                // the Canadian-resident director requirement (Bill 213, in
                // force 2021-07-05), so surfacing a CBCA-style residency
                // checkbox would be misleading. The underlying field defaults
                // to "no" via seedDir so the schema still validates.
                null
              )}
            </div>
          ))}
          <button type="button" onClick={() => append(seedDir)}
            className="flex items-center gap-2 text-sm text-navy-900 border border-navy-900 px-4 py-2.5 hover:bg-navy-50 transition-colors">
            <Plus size={14} /> Add Another Director
          </button>
          <NextBtn />
        </form>
      </div>
    </FormProvider>
  );
}

// ─── Step 5 — Shareholders ────────────────────────────────────────────────────

type S5 = z.infer<typeof s5>;
const emptySH: Shareholder = {
  firstName: "", lastName: "",
  shareClass: "Common", numberOfShares: "100",
  pricePerShare: "1.00",
  address: { ...emptyAddress },
};

function Step5({ def, onNext, onBack }: { def: Partial<S5>; onNext: (d: S5) => void; onBack: () => void }) {
  const form = useForm<S5>({
    resolver: zodResolver(s5),
    defaultValues: { shareholders: def.shareholders?.length ? def.shareholders : [emptySH] },
  });
  const { register, handleSubmit, control, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "shareholders" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const se = (errors.shareholders as any) ?? [];

  return (
    <FormProvider {...form}>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <BackBtn onClick={onBack} />
        <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Shareholders</h2>
        <p className="text-gray-500 text-sm mb-8">List all initial shareholders of the corporation. International shareholders are supported.</p>
        <form onSubmit={handleSubmit(onNext)} className="space-y-6">
          {fields.map((field, i) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-6">
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
                <Field label="Price per Share (CAD) *" error={se[i]?.pricePerShare?.message}>
                  {/* Currency-prefixed input. The `$` is a presentational
                      adornment; the underlying value is the numeric string
                      RHF registers — so the API still receives just the
                      number. `pl-8` leaves room for the prefix. */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">$</span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="1.00"
                      {...register(`shareholders.${i}.pricePerShare`)}
                      className={`${iCls} pl-8`}
                    />
                  </div>
                </Field>
              </div>
              {/* Informational note. Deliberately definitional / illustrative
                  — describes what the field *is*, with arithmetic example.
                  Does NOT cite typical or common practice and is NOT advice. */}
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Enter any positive dollar amount per share — the price can be{" "}
                <span className="font-medium text-gray-700">$1.00</span>. The total subscription amount equals
                price per share × number of shares (for example,{" "}
                <span className="font-medium text-gray-700">100 shares × $1.00 = $100.00 total</span>). This is a numeric
                example only. Korporex does not provide legal or tax advice on share pricing — if you&rsquo;re unsure,{" "}
                <Link href="/legal-consultation" className="text-navy-900 underline underline-offset-2">
                  speak with a corporate lawyer
                </Link>.
              </p>
              <AddressFields prefix={`shareholders.${i}.address`} />
            </div>
          ))}
          <button type="button" onClick={() => append(emptySH)}
            className="flex items-center gap-2 text-sm text-navy-900 border border-navy-900 px-4 py-2.5 hover:bg-navy-50 transition-colors">
            <Plus size={14} /> Add Another Shareholder
          </button>
          <NextBtn />
        </form>
      </div>
    </FormProvider>
  );
}

// ─── Step 6 — Officers ────────────────────────────────────────────────────────

type S6 = z.infer<typeof s6>;
const emptyOfficer: Officer = {
  firstName: "", lastName: "",
  position: "" as OfficerPosition,
  email: "",
  address: { ...emptyAddress },
};

function Step6({ def, onNext, onBack }: { def: Partial<S6>; onNext: (d: S6) => void; onBack: () => void }) {
  const form = useForm<S6>({
    resolver: zodResolver(s6),
    defaultValues: { officers: def.officers?.length ? def.officers : [emptyOfficer] },
  });
  const { register, handleSubmit, control, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "officers" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const oe = (errors.officers as any) ?? [];

  return (
    <FormProvider {...form}>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <BackBtn onClick={onBack} />
        <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Officers</h2>
        <p className="text-gray-500 text-sm mb-8">List the corporation&rsquo;s officers and their positions. At least one officer is required.</p>
        <form onSubmit={handleSubmit(onNext)} className="space-y-6">
          {fields.map((field, i) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="font-serif font-bold text-navy-900 text-base">Officer {i + 1}</p>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(i)} className="text-xs text-red-500 flex items-center gap-1 hover:text-red-600">
                    <Trash2 size={13} /> Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Field label="First Name *" error={oe[i]?.firstName?.message}><input {...register(`officers.${i}.firstName`)} className={iCls} /></Field>
                <Field label="Last Name *" error={oe[i]?.lastName?.message}><input {...register(`officers.${i}.lastName`)} className={iCls} /></Field>
                <Field label="Position *" error={oe[i]?.position?.message}>
                  <select {...register(`officers.${i}.position`)} className={sCls}>
                    <option value="">-- Please Select --</option>
                    {OFFICER_POSITIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Email Address *" error={oe[i]?.email?.message}>
                  <input type="email" {...register(`officers.${i}.email`)} className={iCls} />
                </Field>
              </div>
              <AddressFields prefix={`officers.${i}.address`} />
            </div>
          ))}
          <button type="button" onClick={() => append(emptyOfficer)}
            className="flex items-center gap-2 text-sm text-navy-900 border border-navy-900 px-4 py-2.5 hover:bg-navy-50 transition-colors">
            <Plus size={14} /> Add Another Officer
          </button>
          <NextBtn />
        </form>
      </div>
    </FormProvider>
  );
}

// ─── Step 7 — Registered Office ───────────────────────────────────────────────

type S7 = z.infer<typeof s7>;
function Step7({ jurisdiction, def, onNext, onBack }: {
  jurisdiction: Jurisdiction;
  def: Partial<S7>;
  onNext: (d: S7) => void;
  onBack: () => void;
}) {
  const regionLock = jurisdiction === "ontario" ? "ON" : undefined;
  const regionAllow = jurisdiction === "federal" ? CA_PROVINCES.map((p) => p.code) : undefined;
  const addonEligible = regOfficeAddonAvailable(jurisdiction);

  const form = useForm<S7>({
    resolver: zodResolver(s7),
    defaultValues: {
      regOfficeAddon: def.regOfficeAddon ?? "none",
      regOffice: {
        street: def.regOffice?.street ?? "",
        city: def.regOffice?.city ?? "",
        region: def.regOffice?.region || regionLock || "",
        postalCode: def.regOffice?.postalCode ?? "",
        country: "CA",
      },
    },
  });
  const { handleSubmit, watch, setValue } = form;
  const selectedAddon = watch("regOfficeAddon");

  // When the Korporex add-on is selected, mirror the sentinel address
  // (city = "Greater Toronto Area", street = "Assigned by Korporex at filing")
  // into the regOffice fields so the schema validates and the operator sees
  // a clear "to be filled in before filing" marker on the intake email. When
  // the user switches back to "none", blank the fields so they can enter
  // their own address.
  const applyAddonAddress = (addon: RegOfficeAddon) => {
    if (addon === "none") {
      setValue("regOffice.street", "");
      setValue("regOffice.city", "");
      setValue("regOffice.region", regionLock ?? "");
      setValue("regOffice.postalCode", "");
      setValue("regOffice.country", "CA");
      return;
    }
    const a = REG_OFFICE_ADDON.address;
    setValue("regOffice.street", a.street, { shouldValidate: true });
    setValue("regOffice.city", a.city, { shouldValidate: true });
    setValue("regOffice.region", a.region, { shouldValidate: true });
    setValue("regOffice.postalCode", a.postalCode, { shouldValidate: true });
    setValue("regOffice.country", a.country, { shouldValidate: true });
  };

  const jurisLabel = jurisdiction === "federal" ? "any Canadian province or territory" : "Ontario";

  return (
    <FormProvider {...form}>
      <div className="max-w-xl mx-auto px-6 py-12">
        <BackBtn onClick={onBack} />
        <h2 className="font-serif text-3xl font-bold text-navy-900 mb-1">Registered Office</h2>
        <p className="text-gray-500 text-sm mb-8">Must be a physical address in {jurisLabel} — not a P.O. Box.</p>
        <form onSubmit={handleSubmit(onNext)} className="space-y-5">
          {addonEligible && (
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-[0.1em] uppercase text-gray-500">
                How will you provide an address?
              </p>
              <AddonOption
                value="none"
                selected={selectedAddon === "none"}
                onSelect={() => { setValue("regOfficeAddon", "none"); applyAddonAddress("none"); }}
                title="I'll provide my own registered office address"
                subtitle="Enter an address you control in the fields below."
              />
              <AddonOption
                value="korporex"
                selected={selectedAddon === "korporex"}
                onSelect={() => { setValue("regOfficeAddon", "korporex"); applyAddonAddress("korporex"); }}
                title="Use a Korporex registered office address"
                subtitle="Greater Toronto Area address chosen by Korporex. Monthly mail scans emailed to you."
                price={`$${REG_OFFICE_ADDON.monthly.toFixed(2)}/mo`}
                priceSub={`billed annually in advance at $${REG_OFFICE_ADDON.annual.toFixed(2)} + HST`}
              />
            </div>
          )}

          {selectedAddon === "none" && (
            <AddressFields
              prefix="regOffice"
              countryLock="CA"
              regionLock={regionLock}
              regionAllow={regionAllow}
            />
          )}
          {selectedAddon === "korporex" && (
            <div className="bg-navy-50 border border-navy-900 rounded-lg p-4 text-sm text-navy-900 leading-relaxed">
              <p className="font-semibold mb-1">{REG_OFFICE_ADDON.label} — {REG_OFFICE_ADDON.locationLabel}</p>
              <p className="text-gray-700">
                Korporex selects and assigns the registered office address — somewhere in the Greater Toronto Area —
                at our discretion before your Articles of Incorporation are filed. The street address is not
                disclosed in advance.
              </p>
              <ul className="text-xs text-gray-700 mt-3 space-y-1.5 list-disc pl-5">
                <li>Monthly scanned copy of mail received at the address, emailed to you.</li>
                <li>The assigned address appears on your Articles of Incorporation and the public corporate registry.</li>
                <li>
                  ${REG_OFFICE_ADDON.annual.toFixed(2)} CAD billed annually in advance, plus HST. <strong>Non-refundable</strong> —
                  including if you obtain your own registered office address before the term ends.
                </li>
              </ul>
            </div>
          )}

          {addonEligible && selectedAddon === "none" && (
            <div className="bg-cream-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600 leading-relaxed">
              Don&rsquo;t have a physical address in {jurisLabel}? Use the Korporex registered office option above instead.
            </div>
          )}

          <NextBtn label="Continue to Review" />
        </form>
      </div>
    </FormProvider>
  );
}

function AddonOption({ selected, onSelect, title, subtitle, price, priceSub }: {
  value: string;
  selected: boolean;
  onSelect: () => void;
  title: string;
  subtitle: string;
  price?: string;
  priceSub?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left border p-4 transition-colors ${
        selected
          ? "border-navy-900 bg-navy-50"
          : "border-gray-200 bg-white hover:border-navy-900"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className={`font-medium text-sm ${selected ? "text-navy-900" : "text-gray-900"}`}>{title}</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{subtitle}</p>
        </div>
        {price && (
          <div className="text-right flex-shrink-0">
            <p className={`text-sm font-semibold ${selected ? "text-navy-900" : "text-gray-900"}`}>{price}</p>
            {priceSub && <p className="text-[11px] text-gray-500 mt-0.5">{priceSub}</p>}
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Step 8 — Review & Pay ────────────────────────────────────────────────────

type S8 = z.infer<typeof s8>;
function Step8({ data, onBack, onPay }: {
  data: WizardData;
  onBack: () => void;
  onPay: (billing: { billingName: string; billingAddress: Address }) => Promise<void>;
}) {
  const form = useForm<S8>({
    resolver: zodResolver(s8),
    defaultValues: {
      billingName: data.billingName || "",
      billingAddress: {
        street: data.billingAddress.street || "",
        city: data.billingAddress.city || "",
        region: data.billingAddress.region || "",
        postalCode: data.billingAddress.postalCode || "",
        country: data.billingAddress.country || "CA",
      },
    },
  });
  const { register, handleSubmit, watch, formState: { errors } } = form;
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const country = watch("billingAddress.country") || "CA";
  const region = watch("billingAddress.region") || "";

  const { price, nuansFee, regOfficeFee, subtotal, taxRate, tax, total } = computePricing({
    jurisdiction: data.jurisdiction,
    pkg: data.pkg,
    corpNameType: data.corpNameType,
    billingCountry: country,
    billingRegion: region,
    regOfficeAddon: data.regOfficeAddon,
  });
  const nameSearchApplies = nuansFee > 0;
  const addonApplies = regOfficeFee > 0 && data.regOfficeAddon === "korporex";
  const addonLabel = addonApplies
    ? `Registered office — ${REG_OFFICE_ADDON.label} (12 mo)`
    : "";

  const jurisLabel = JURISDICTION_LABELS[data.jurisdiction];
  const pkgLabel = PKG_LABELS[data.pkg];
  const endingLabel = data.legalEnding || "";
  const corpName =
    data.corpNameType === "numbered"
      ? `Numbered corporation (${jurisLabel})${endingLabel ? ` — ${endingLabel}` : ""}`
      : data.businessName
        ? `${data.businessName}${endingLabel ? ` ${endingLabel}` : ""}`
        : "—";

  const submit = handleSubmit(async (d) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      await onPay({ billingName: d.billingName, billingAddress: d.billingAddress });
    } catch (err) {
      setSubmitError(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong. Please try again or email us at contact@korporex.ca."
      );
      setSubmitting(false);
    }
  });

  return (
    <FormProvider {...form}>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <BackBtn onClick={onBack} />
        <h2 className="font-serif text-3xl font-bold text-navy-900 mb-8">Review &amp; Pay</h2>

        {/* Order Summary */}
        <div className="bg-cream-50 border border-gray-200 rounded-lg p-6 mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">Order Summary</p>
          <div className="space-y-2.5 text-sm">
            {[
              ["Jurisdiction", jurisLabel],
              ["Package", pkgLabel],
              ["Corporation", corpName],
              ["Official Email", data.officialEmail || "—"],
              ["Directors", String(data.directors.length)],
              ["Shareholders", String(data.shareholders.length)],
              ["Officers", String(data.officers.length)],
              [
                "Registered Office",
                data.regOfficeAddon === "korporex"
                  ? `${REG_OFFICE_ADDON.label} — ${REG_OFFICE_ADDON.locationLabel}`
                  : data.regOffice.city ? `${data.regOffice.city}, ${data.regOffice.region}` : "—",
              ],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-gray-500">{k}</span>
                <span className="font-medium text-gray-800 text-right">{v}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-300 mt-4 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{pkgLabel} package ({jurisLabel})</span>
              <span className="text-gray-800">${price.toFixed(2)}</span>
            </div>
            {nameSearchApplies && (
              <div className="flex justify-between">
                <span className="text-gray-600">NUANS name-search report</span>
                <span className="text-gray-800">${nuansFee.toFixed(2)}</span>
              </div>
            )}
            {addonApplies && (
              <div className="flex justify-between">
                <span className="text-gray-600">{addonLabel}</span>
                <span className="text-gray-800">${regOfficeFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600 pt-1 border-t border-dashed border-gray-200">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>
                {country === "CA"
                  ? region
                    ? `Tax (${(taxRate * 100).toFixed(taxRate === 0.14975 ? 3 : 0)}% — ${region})`
                    : "Tax (select region below)"
                  : "Tax (international — $0)"}
              </span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-gray-300">
              <span className="font-semibold text-gray-800">Total (CAD)</span>
              <span className="font-serif text-3xl font-bold text-navy-900">${total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 pt-1">
              Government filing fees are included in the package price. Taxes update live based on your
              billing address below.
            </p>
          </div>
        </div>

        {/* Billing */}
        <div className="border border-gray-200 rounded-lg p-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-5">Billing Details</p>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Billing Name *" error={errors.billingName?.message}>
              <input {...register("billingName")} placeholder="Jane Smith or Acme Ltd." className={iCls} />
            </Field>
            <AddressFields prefix="billingAddress" labelPrefix="Billing" />

            <p className="text-xs text-gray-500 bg-cream-50 border border-gray-200 rounded-md px-3 py-2.5 mt-2 leading-relaxed">
              You&apos;ll be redirected to <span className="font-semibold">Stripe</span> to complete payment securely.
              Card details are entered on stripe.com — never on Korporex.
            </p>
            {submitError && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2" role="alert">
                {submitError}
              </p>
            )}
            <button type="submit"
              disabled={submitting}
              className="w-full bg-gold-500 text-white font-medium py-4 text-sm tracking-wide hover:bg-gold-600 transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? "Redirecting to Stripe…" : `Continue to Payment — $${total.toFixed(2)}`}
            </button>
          </form>
          <p className="text-xs text-gray-400 text-center mt-4">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-2">Terms of Service</Link> and{" "}
            <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </FormProvider>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const init: WizardData = {
  jurisdiction: "ontario", pkg: "standard",
  corpNameType: "named",
  businessName: "",
  legalEnding: "",
  officialEmail: "",
  naicsCode: "",
  businessActivity: "",
  fiscalYearEndMonth: "", fiscalYearEndDay: "",
  directors: [], shareholders: [], officers: [],
  regOffice: { street: "", city: "", region: "", postalCode: "", country: "CA" },
  regOfficeAddon: "none",
  billingName: "",
  billingAddress: { street: "", city: "", region: "", postalCode: "", country: "CA" },
};

export default function IncorporatePage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(init);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [step]);

  function patch(p: Partial<WizardData>) { setData((prev) => ({ ...prev, ...p })); }

  return (
    <div className="min-h-screen bg-white">
      <ProgressBar current={step} />
      <div className="pb-20">
        {step === 1 && <Step1 value={data.jurisdiction} onChange={(jurisdiction) => patch({ jurisdiction })} onNext={() => setStep(2)} />}
        {step === 2 && <Step2 jurisdiction={data.jurisdiction} value={data.pkg} onChange={(pkg) => patch({ pkg })} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <Step3
          jurisdiction={data.jurisdiction}
          def={{
            corpNameType: data.corpNameType,
            businessName: data.businessName,
            legalEnding: data.legalEnding === "" ? undefined : data.legalEnding,
            officialEmail: data.officialEmail,
            naicsCode: data.naicsCode,
            businessActivity: data.businessActivity,
            fiscalYearEndMonth: data.fiscalYearEndMonth,
            fiscalYearEndDay: data.fiscalYearEndDay,
          }}
          onNext={(d) => {
            // Clear name for numbered corps so review screen reflects accurately.
            const next = { ...d, businessName: d.corpNameType === "numbered" ? "" : d.businessName ?? "" };
            patch(next);
            setStep(4);
          }}
          onBack={() => setStep(2)}
        />}
        {step === 4 && <Step4 jurisdiction={data.jurisdiction} def={{ directors: data.directors }} onNext={(d) => { patch(d); setStep(5); }} onBack={() => setStep(3)} />}
        {step === 5 && <Step5 def={{ shareholders: data.shareholders }} onNext={(d) => { patch(d); setStep(6); }} onBack={() => setStep(4)} />}
        {step === 6 && <Step6 def={{ officers: data.officers }} onNext={(d) => { patch(d); setStep(7); }} onBack={() => setStep(5)} />}
        {step === 7 && <Step7 jurisdiction={data.jurisdiction}
          def={{ regOffice: data.regOffice, regOfficeAddon: data.regOfficeAddon }}
          onNext={(d) => { patch(d); setStep(8); }} onBack={() => setStep(6)} />}
        {step === 8 && <Step8
          data={data}
          onBack={() => setStep(7)}
          onPay={async (billing) => {
            patch(billing);
            const payload = {
              jurisdiction: data.jurisdiction,
              pkg: data.pkg,
              corpNameType: data.corpNameType,
              businessName: data.businessName,
              legalEnding: data.legalEnding,
              officialEmail: data.officialEmail,
              naicsCode: data.naicsCode,
              businessActivity: data.businessActivity,
              fiscalYearEndMonth: data.fiscalYearEndMonth,
              fiscalYearEndDay: data.fiscalYearEndDay,
              directors: data.directors,
              shareholders: data.shareholders,
              officers: data.officers,
              regOffice: data.regOffice,
              regOfficeAddon: data.regOfficeAddon,
              billingName: billing.billingName,
              billingAddress: billing.billingAddress,
            };
            const res = await fetch("/api/incorporate", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(payload),
            });
            if (!res.ok) {
              const body = await res.json().catch(() => ({}));
              throw new Error(body?.error || "Submission failed");
            }
            const { url } = (await res.json()) as { url?: string };
            if (!url) throw new Error("Checkout session did not return a URL");
            // Full-page redirect to Stripe Checkout. After payment, Stripe
            // redirects back to /incorporate/confirmation with session_id.
            window.location.href = url;
          }}
        />}
        {/* Persistent across-step lawyer-referral link. Sits below every
            step's primary form so customers can opt out of self-serve at
            any time without losing what they've entered (the link
            navigates to /legal-consultation; closing the wizard tab
            preserves nothing — that's an existing trade-off, not a
            regression introduced here). */}
        <div className="border-t border-gray-100 mt-4">
          <div className="max-w-2xl mx-auto px-6 py-6 text-center">
            <Link
              href="/legal-consultation"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 transition-colors"
            >
              Not sure? <span className="underline underline-offset-2">Speak with a lawyer</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
