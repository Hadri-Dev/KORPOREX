"use client";

import { useFormContext } from "react-hook-form";
import { useLocale } from "next-intl";
import AddressAutocomplete, { type ParsedAddress } from "@/components/AddressAutocomplete";
import { isCanadaCountry } from "@/lib/pricing";
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

// Display-only translations. English output is unchanged; values sent to the
// form (province codes, country) are the same in every locale.
type Lang = "en" | "fr" | "es";

const PROVINCE_NAMES: Record<Exclude<Lang, "en">, Record<string, string>> = {
  fr: {
    BC: "Colombie-Britannique",
    NB: "Nouveau-Brunswick",
    NL: "Terre-Neuve-et-Labrador",
    NS: "Nouvelle-Écosse",
    NT: "Territoires du Nord-Ouest",
    PE: "Île-du-Prince-Édouard",
    QC: "Québec",
  },
  es: {
    BC: "Columbia Británica",
    NB: "Nuevo Brunswick",
    NL: "Terranova y Labrador",
    NS: "Nueva Escocia",
    NT: "Territorios del Noroeste",
    PE: "Isla del Príncipe Eduardo",
    QC: "Quebec",
  },
};

const COPY = {
  en: {
    street: "Street address *",
    city: "City *",
    province: "Province *",
    provinceState: "Province / State *",
    select: "Select…",
    postal: "Postal code *",
    country: "Country *",
    streetPlaceholder: undefined as string | undefined,
  },
  fr: {
    street: "Adresse municipale *",
    city: "Ville *",
    province: "Province *",
    provinceState: "Province / État *",
    select: "Sélectionner…",
    postal: "Code postal *",
    country: "Pays *",
    streetPlaceholder: "Commencez à saisir une adresse…" as string | undefined,
  },
  es: {
    street: "Dirección *",
    city: "Ciudad *",
    province: "Provincia *",
    provinceState: "Provincia / Estado *",
    select: "Seleccione…",
    postal: "Código postal *",
    country: "País *",
    streetPlaceholder: "Empiece a escribir una dirección…" as string | undefined,
  },
};

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
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];
  const provinceName = (code: string, name: string) =>
    lang === "en" ? name : (PROVINCE_NAMES[lang][code] ?? name);
  const streetValue: string = watch(`${name}.street`) ?? "";
  const countryValue: string = watch(`${name}.country`) ?? "";
  // Province dropdown whenever the address is Canadian, including in
  // international mode once the customer's country reads as Canada. Free-text
  // provinces ("Ontario") previously slipped past the tax-rate lookup.
  const canadianRegion = canadaOnly || isCanadaCountry(countryValue);
  const countryReg = register(`${name}.country`);
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
      <Field label={t.street} error={msg(e.street)}>
        <AddressAutocomplete
          placeholder={t.streetPlaceholder}
          value={streetValue}
          onChange={(v) => setValue(`${name}.street`, v, { shouldValidate: true })}
          onAddressSelected={applyParsed}
          countryRestrict={canadaOnly ? ["ca"] : undefined}
          className={iCls}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t.city} error={msg(e.city)}>
          <input type="text" {...register(`${name}.city`)} className={iCls} placeholder="Toronto" />
        </Field>
        <Field label={canadianRegion ? t.province : t.provinceState} error={msg(e.region)}>
          {canadianRegion ? (
            <select {...register(`${name}.region`)} className={sCls}>
              <option value="">{t.select}</option>
              {CA_PROVINCES.map((p) => (
                <option key={p.code} value={p.code}>
                  {provinceName(p.code, p.name)}
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
        <Field label={t.postal} error={msg(e.postalCode)}>
          <input
            type="text"
            {...register(`${name}.postalCode`)}
            className={iCls}
            placeholder="M5V 3A8"
          />
        </Field>
        <Field label={t.country} error={msg(e.country)}>
          <input
            type="text"
            {...countryReg}
            onChange={(ev) => {
              countryReg.onChange(ev);
              // Region input switches between province dropdown and free text
              // when the country's Canada-ness flips; clear the stale value so
              // the customer re-picks in the new mode.
              if (isCanadaCountry(ev.target.value) !== canadianRegion) {
                setValue(`${name}.region`, "", { shouldValidate: false });
              }
            }}
            className={iCls}
            defaultValue={canadaOnly ? "CA" : ""}
            readOnly={canadaOnly}
          />
        </Field>
      </div>
    </div>
  );
}
