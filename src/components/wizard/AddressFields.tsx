"use client";

import { useFormContext } from "react-hook-form";
import AddressAutocomplete, { type ParsedAddress } from "@/components/AddressAutocomplete";
import { Field, iCls, sCls } from "./WizardUI";

// Canadian provinces dropdown — used for both billing and business addresses
// when the country is locked to CA. For Canada we render a select instead of
// a free-text input to match registry expectations.
const CA_PROVINCES: Array<{ code: string; name: string }> = [
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

// Accept either a plain string-keyed map or the RHF nested error shape
// (`{ field: { message: string } }`). The helper inside the component
// normalizes both into a string per field.
type FieldErr = string | { message?: string } | undefined;
type Errors = Partial<Record<"street" | "city" | "region" | "postalCode" | "country", FieldErr>>;

type Props = {
  /** Form path prefix. e.g. "billingAddress" — keys then become billingAddress.street etc. */
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any;
  /** Lock country to Canada and use province dropdown for region. Default: true. */
  canadaOnly?: boolean;
};

function msg(e: FieldErr): string | undefined {
  if (!e) return undefined;
  if (typeof e === "string") return e;
  return e.message;
}

/**
 * Multi-field address subform that integrates with react-hook-form via context.
 * Auto-fills city/region/postalCode/country when the user picks a Google Places
 * suggestion in the street field.
 */
export default function AddressFields({ name, errors, canadaOnly = true }: Props) {
  const { register, setValue, watch } = useFormContext();
  const streetValue: string = watch(`${name}.street`) ?? "";
  const e: Errors = errors ?? {};

  function applyParsed(parsed: ParsedAddress) {
    setValue(`${name}.street`, parsed.street, { shouldValidate: true });
    setValue(`${name}.city`, parsed.city, { shouldValidate: true });
    setValue(`${name}.region`, parsed.region, { shouldValidate: true });
    setValue(`${name}.postalCode`, parsed.postalCode, { shouldValidate: true });
    setValue(`${name}.country`, parsed.country || (canadaOnly ? "CA" : ""), {
      shouldValidate: true,
    });
  }

  return (
    <div className="space-y-3">
      <Field label="Street address *" error={msg(e.street)}>
        <AddressAutocomplete
          value={streetValue}
          onChange={(v) => setValue(`${name}.street`, v, { shouldValidate: true })}
          onAddressSelected={applyParsed}
          countryRestrict={canadaOnly ? ["ca"] : undefined}
          placeholder="123 Main St"
          className={iCls}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="City *" error={msg(e.city)}>
          <input type="text" {...register(`${name}.city`)} className={iCls} placeholder="Toronto" />
        </Field>
        <Field label="Province *" error={msg(e.region)}>
          {canadaOnly ? (
            <select {...register(`${name}.region`)} className={sCls}>
              <option value="">Select…</option>
              {CA_PROVINCES.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              {...register(`${name}.region`)}
              className={iCls}
              placeholder="ON"
            />
          )}
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Postal code *" error={msg(e.postalCode)}>
          <input
            type="text"
            {...register(`${name}.postalCode`)}
            className={iCls}
            placeholder="M5V 3A8"
          />
        </Field>
        <Field label="Country *" error={msg(e.country)}>
          <input
            type="text"
            {...register(`${name}.country`)}
            className={iCls}
            defaultValue={canadaOnly ? "CA" : ""}
            readOnly={canadaOnly}
          />
        </Field>
      </div>
    </div>
  );
}
