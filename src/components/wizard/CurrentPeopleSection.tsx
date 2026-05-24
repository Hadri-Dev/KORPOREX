"use client";

import { useFieldArray, useFormContext, type FieldErrors } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Field, iCls, sCls } from "./WizardUI";
import AddressFields from "./AddressFields";
import { OFFICER_POSITIONS } from "@/lib/officerPositions";
import type { CurrentDirector, CurrentOfficer } from "@/lib/complianceSchemas";

// Reusable "current directors" and "current officers" field arrays used by
// the Initial Return + both Annual Return wizards. Kind switches the schema
// shape (officer adds `position`, federal director adds `canadianResident`).

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

type DirectorsProps = {
  /** Form field-array path. */
  name: string;
  /** Show the CBCA Canadian-resident checkbox (federal directors only). */
  showCanadianResident?: boolean;
  /** Top error message (e.g. min-array length). */
  topError?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: FieldErrors<CurrentDirector>[] | any;
};

export function CurrentDirectorsArray({
  name,
  showCanadianResident = false,
  topError,
  errors,
}: DirectorsProps) {
  const { control, register } = useFormContext();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fields, append, remove } = useFieldArray({ control, name: name as any });
  return (
    <div>
      <div className="space-y-4">
        {fields.map((field, idx) => {
          const e = errors?.[idx];
          return (
            <div key={field.id} className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">Director {idx + 1}</p>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(idx)} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
                    <Trash2 size={12} /> Remove
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name *" error={e?.firstName?.message}>
                    <input type="text" {...register(`${name}.${idx}.firstName`)} className={iCls} />
                  </Field>
                  <Field label="Last name *" error={e?.lastName?.message}>
                    <input type="text" {...register(`${name}.${idx}.lastName`)} className={iCls} />
                  </Field>
                </div>
                <Field label="Email" error={e?.email?.message}>
                  <input type="email" {...register(`${name}.${idx}.email`)} className={iCls} />
                </Field>
                <Field label="Elected date" error={e?.electedDate?.message} hint="Optional — the date this person became a director.">
                  <input type="date" {...register(`${name}.${idx}.electedDate`)} className={iCls} />
                </Field>
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    Residential address <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name={`${name}.${idx}.address`} errors={e?.address} canadaOnly={false} />
                </div>
                {showCanadianResident && (
                  <label className="flex items-start gap-3 text-sm cursor-pointer">
                    <input type="checkbox" {...register(`${name}.${idx}.canadianResident`)} className="mt-1 accent-navy-900" />
                    <span className="text-gray-700">
                      This director is a <strong>Canadian resident</strong> within the meaning of CBCA s.2(1).{" "}
                      <span className="text-gray-500">At least 25% of a federal corporation&apos;s directors must be Canadian residents.</span>
                    </span>
                  </label>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {fields.length < 20 && (
        <button type="button" onClick={() => append({ ...emptyDirector })} className="mt-3 w-full border border-dashed border-gray-300 hover:border-navy-900 text-sm text-gray-700 hover:text-navy-900 py-3 flex items-center justify-center gap-2 transition-colors">
          <Plus size={14} /> Add another director
        </button>
      )}
      {topError && <p className="text-xs text-red-500 mt-2">{topError}</p>}
    </div>
  );
}

type OfficersProps = {
  name: string;
  topError?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: FieldErrors<CurrentOfficer>[] | any;
};

export function CurrentOfficersArray({ name, topError, errors }: OfficersProps) {
  const { control, register } = useFormContext();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fields, append, remove } = useFieldArray({ control, name: name as any });
  return (
    <div>
      <div className="space-y-4">
        {fields.map((field, idx) => {
          const e = errors?.[idx];
          return (
            <div key={field.id} className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">Officer {idx + 1}</p>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(idx)} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
                    <Trash2 size={12} /> Remove
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name *" error={e?.firstName?.message}>
                    <input type="text" {...register(`${name}.${idx}.firstName`)} className={iCls} />
                  </Field>
                  <Field label="Last name *" error={e?.lastName?.message}>
                    <input type="text" {...register(`${name}.${idx}.lastName`)} className={iCls} />
                  </Field>
                </div>
                <Field label="Position *" error={e?.position?.message}>
                  <select {...register(`${name}.${idx}.position`)} className={sCls}>
                    {OFFICER_POSITIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Email" error={e?.email?.message}>
                  <input type="email" {...register(`${name}.${idx}.email`)} className={iCls} />
                </Field>
                <Field label="Appointed date" error={e?.appointedDate?.message}>
                  <input type="date" {...register(`${name}.${idx}.appointedDate`)} className={iCls} />
                </Field>
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    Residential address <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name={`${name}.${idx}.address`} errors={e?.address} canadaOnly={false} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {fields.length < 20 && (
        <button type="button" onClick={() => append({ ...emptyOfficer })} className="mt-3 w-full border border-dashed border-gray-300 hover:border-navy-900 text-sm text-gray-700 hover:text-navy-900 py-3 flex items-center justify-center gap-2 transition-colors">
          <Plus size={14} /> Add another officer
        </button>
      )}
      {topError && <p className="text-xs text-red-500 mt-2">{topError}</p>}
    </div>
  );
}
