"use client";

import { useFormContext, type FieldErrors } from "react-hook-form";
import { Field, iCls, sCls } from "./WizardUI";

// Shared "What's your corporation?" sub-form used by every amendment wizard
// (change-director / change-shareholder / change-address / articles-amendment).
// Lives under `corporation` in the parent React Hook Form. Captures jurisdiction
// + legal name + corp number (Corporations Canada # for federal, OCN for
// Ontario), plus an optional CRA business number.

type CorporationFields = {
  jurisdiction?: { message?: string };
  corpName?: { message?: string };
  corpNumber?: { message?: string };
  businessNumber?: { message?: string };
};

export default function CorporationIdSection({
  errors,
}: {
  errors?: FieldErrors | CorporationFields;
}) {
  const { register, watch } = useFormContext();
  const jurisdiction = watch("corporation.jurisdiction") as "federal" | "ontario" | undefined;
  const e = (errors ?? {}) as CorporationFields;

  const numberLabel = jurisdiction === "ontario" ? "OCN (Ontario Corporation Number) *" : "Corporation number *";
  const numberHint =
    jurisdiction === "ontario"
      ? "9-digit number assigned by the Ontario Business Registry."
      : "7-digit number assigned by Corporations Canada (visible on your Certificate of Incorporation).";

  return (
    <div className="space-y-5">
      <Field label="Jurisdiction *" error={e.jurisdiction?.message} hint="The registry that issued your incorporation.">
        <select {...register("corporation.jurisdiction")} className={sCls}>
          <option value="">Select…</option>
          <option value="federal">Federal (CBCA — Corporations Canada)</option>
          <option value="ontario">Ontario (OBCA — Ontario Business Registry)</option>
        </select>
      </Field>

      <Field
        label="Corporation legal name *"
        error={e.corpName?.message}
        hint='Exactly as it appears on the Articles of Incorporation, including the legal ending (e.g. "Acme Holdings Inc.").'
      >
        <input type="text" {...register("corporation.corpName")} className={iCls} placeholder="Acme Holdings Inc." />
      </Field>

      <Field label={numberLabel} error={e.corpNumber?.message} hint={numberHint}>
        <input type="text" {...register("corporation.corpNumber")} className={iCls} placeholder={jurisdiction === "ontario" ? "1234567 (OCN)" : "1234567 (Corp #)"} />
      </Field>

      <Field
        label="CRA Business Number (BN)"
        error={e.businessNumber?.message}
        hint="Optional — 9-digit BN (or 15-character BN with program account). Helps the operator match the file faster."
      >
        <input type="text" {...register("corporation.businessNumber")} className={iCls} placeholder="123456789 RC0001" />
      </Field>
    </div>
  );
}
