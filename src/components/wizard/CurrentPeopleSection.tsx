"use client";

import { useFieldArray, useFormContext, type FieldErrors } from "react-hook-form";
import { useLocale } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import { Field, iCls, sCls } from "./WizardUI";
import AddressFields from "./AddressFields";
import { OFFICER_POSITIONS, type OfficerPosition } from "@/lib/officerPositions";
import type { CurrentDirector, CurrentOfficer } from "@/lib/complianceSchemas";

// Reusable "current directors" and "current officers" field arrays used by
// the Initial Return + both Annual Return wizards. Kind switches the schema
// shape (officer adds `position`, federal director adds `canadianResident`).

type Lang = "en" | "fr" | "es";

// Display copy only. English output is unchanged; option values and payload
// stay English (registry position names).
const COPY = {
  en: {
    director: "Director",
    officer: "Officer",
    remove: "Remove",
    first: "First name *",
    last: "Last name *",
    email: "Email",
    electedDate: "Elected date",
    electedHint: "Optional: the date this person became a director.",
    residential: "Residential address",
    residentPre: "This director is a ",
    residentStrong: "Canadian resident",
    residentPost: " within the meaning of CBCA s.2(1).",
    residentNote: "At least 25% of a federal corporation's directors must be Canadian residents.",
    addDirector: "Add another director",
    addOfficer: "Add another officer",
    position: "Position *",
    appointedDate: "Appointed date",
    errPosition: "Select a position",
  },
  fr: {
    director: "Administrateur",
    officer: "Dirigeant",
    remove: "Retirer",
    first: "Prénom *",
    last: "Nom de famille *",
    email: "Courriel",
    electedDate: "Date d'élection",
    electedHint: "Facultatif. La date à laquelle cette personne est devenue administrateur.",
    residential: "Adresse résidentielle",
    residentPre: "Cet administrateur est un ",
    residentStrong: "résident canadien",
    residentPost: " au sens du paragraphe 2(1) de la LCSA.",
    residentNote: "Au moins 25 % des administrateurs d'une société fédérale doivent être des résidents canadiens.",
    addDirector: "Ajouter un autre administrateur",
    addOfficer: "Ajouter un autre dirigeant",
    position: "Poste *",
    appointedDate: "Date de nomination",
    errPosition: "Sélectionnez un poste",
  },
  es: {
    director: "Director",
    officer: "Funcionario",
    remove: "Eliminar",
    first: "Nombre *",
    last: "Apellido *",
    email: "Correo electrónico",
    electedDate: "Fecha de elección",
    electedHint: "Opcional. La fecha en que esta persona pasó a ser director.",
    residential: "Dirección residencial",
    residentPre: "Este director es ",
    residentStrong: "residente canadiense",
    residentPost: " en el sentido del art. 2(1) de la CBCA.",
    residentNote: "Al menos el 25 % de los directores de una corporación federal deben ser residentes canadienses.",
    addDirector: "Agregar otro director",
    addOfficer: "Agregar otro funcionario",
    position: "Cargo *",
    appointedDate: "Fecha de nombramiento",
    errPosition: "Seleccione un cargo",
  },
} as const;

// Display labels for the registry officer positions. The option value stays
// the English registry name.
export const POSITION_LABELS: Record<Exclude<Lang, "en">, Record<OfficerPosition, string>> = {
  fr: {
    "Assistant Secretary": "Secrétaire adjoint",
    "Authorized Signing Officer": "Signataire autorisé",
    "Assistant Treasurer": "Trésorier adjoint",
    "Chief Administrative Officer": "Chef de l'administration",
    "Chief Executive Officer": "Chef de la direction",
    "Chief Financial Officer": "Chef des finances",
    Chair: "Président(e) du conseil",
    Chairman: "Président du conseil",
    "Chair Person": "Personne à la présidence du conseil",
    Chairwoman: "Présidente du conseil",
    "Chief Information Officer": "Chef de l'information",
    "Chief Manager": "Directeur en chef",
    Comptroller: "Contrôleur",
    "Chief Operating Officer": "Chef de l'exploitation",
    "Executive Director": "Directeur exécutif",
    "General Manager": "Directeur général",
    "Managing Director": "Administrateur délégué",
    President: "Président",
    Secretary: "Secrétaire",
    Treasurer: "Trésorier",
    "Vice-Chair": "Vice-président du conseil",
    "Vice-President": "Vice-président",
  },
  es: {
    "Assistant Secretary": "Secretario adjunto",
    "Authorized Signing Officer": "Funcionario autorizado para firmar",
    "Assistant Treasurer": "Tesorero adjunto",
    "Chief Administrative Officer": "Director de administración",
    "Chief Executive Officer": "Director ejecutivo principal",
    "Chief Financial Officer": "Director financiero",
    Chair: "Presidente del consejo",
    Chairman: "Presidente del consejo",
    "Chair Person": "Persona que preside el consejo",
    Chairwoman: "Presidenta del consejo",
    "Chief Information Officer": "Director de informática",
    "Chief Manager": "Gerente en jefe",
    Comptroller: "Contralor",
    "Chief Operating Officer": "Director de operaciones",
    "Executive Director": "Director ejecutivo",
    "General Manager": "Gerente general",
    "Managing Director": "Director gerente",
    President: "Presidente",
    Secretary: "Secretario",
    Treasurer: "Tesorero",
    "Vice-Chair": "Vicepresidente del consejo",
    "Vice-President": "Vicepresidente",
  },
};

function useLang(): Lang {
  const locale = useLocale();
  return locale === "fr" || locale === "es" ? locale : "en";
}

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
  const lang = useLang();
  const t = COPY[lang];
  return (
    <div>
      <div className="space-y-4">
        {fields.map((field, idx) => {
          const e = errors?.[idx];
          return (
            <div key={field.id} className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">{t.director} {idx + 1}</p>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(idx)} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
                    <Trash2 size={12} /> {t.remove}
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t.first} error={e?.firstName?.message}>
                    <input type="text" {...register(`${name}.${idx}.firstName`)} className={iCls} />
                  </Field>
                  <Field label={t.last} error={e?.lastName?.message}>
                    <input type="text" {...register(`${name}.${idx}.lastName`)} className={iCls} />
                  </Field>
                </div>
                <Field label={t.email} error={e?.email?.message}>
                  <input type="email" {...register(`${name}.${idx}.email`)} className={iCls} />
                </Field>
                <Field label={t.electedDate} error={e?.electedDate?.message} hint={t.electedHint}>
                  <input type="date" {...register(`${name}.${idx}.electedDate`)} className={iCls} />
                </Field>
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    {t.residential} <span className="text-red-500">*</span>
                  </p>
                  <AddressFields name={`${name}.${idx}.address`} errors={e?.address} canadaOnly={false} />
                </div>
                {showCanadianResident && (
                  <label className="flex items-start gap-3 text-sm cursor-pointer">
                    <input type="checkbox" {...register(`${name}.${idx}.canadianResident`)} className="mt-1 accent-navy-900" />
                    <span className="text-gray-700">
                      {t.residentPre}<strong>{t.residentStrong}</strong>{t.residentPost}{" "}
                      <span className="text-gray-500">{t.residentNote}</span>
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
          <Plus size={14} /> {t.addDirector}
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
  const lang = useLang();
  const t = COPY[lang];
  return (
    <div>
      <div className="space-y-4">
        {fields.map((field, idx) => {
          const e = errors?.[idx];
          return (
            <div key={field.id} className="border border-gray-200 rounded-lg p-5 bg-cream-50/30">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900">{t.officer} {idx + 1}</p>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(idx)} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
                    <Trash2 size={12} /> {t.remove}
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t.first} error={e?.firstName?.message}>
                    <input type="text" {...register(`${name}.${idx}.firstName`)} className={iCls} />
                  </Field>
                  <Field label={t.last} error={e?.lastName?.message}>
                    <input type="text" {...register(`${name}.${idx}.lastName`)} className={iCls} />
                  </Field>
                </div>
                <Field label={t.position} error={e?.position?.message === COPY.en.errPosition ? t.errPosition : e?.position?.message}>
                  <select {...register(`${name}.${idx}.position`)} className={sCls}>
                    {OFFICER_POSITIONS.map((p) => (
                      <option key={p} value={p}>{lang === "en" ? p : POSITION_LABELS[lang][p]}</option>
                    ))}
                  </select>
                </Field>
                <Field label={t.email} error={e?.email?.message}>
                  <input type="email" {...register(`${name}.${idx}.email`)} className={iCls} />
                </Field>
                <Field label={t.appointedDate} error={e?.appointedDate?.message}>
                  <input type="date" {...register(`${name}.${idx}.appointedDate`)} className={iCls} />
                </Field>
                <div>
                  <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                    {t.residential} <span className="text-red-500">*</span>
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
          <Plus size={14} /> {t.addOfficer}
        </button>
      )}
      {topError && <p className="text-xs text-red-500 mt-2">{topError}</p>}
    </div>
  );
}
