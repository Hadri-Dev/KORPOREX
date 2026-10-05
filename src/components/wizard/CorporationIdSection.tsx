"use client";

import { useLocale } from "next-intl";
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

type Lang = "en" | "fr" | "es";

// Display copy only. English output is unchanged.
const COPY = {
  en: {
    numberOntario: "OCN (Ontario Corporation Number) *",
    numberFederal: "Corporation number *",
    hintOntario: "9-digit number assigned by the Ontario Business Registry.",
    hintFederal: "7-digit number assigned by Corporations Canada (visible on your Certificate of Incorporation).",
    jurisdiction: "Jurisdiction *",
    jurisdictionHint: "The registry that issued your incorporation.",
    select: "Select…",
    optFederal: "Federal (CBCA, Corporations Canada)",
    optOntario: "Ontario (OBCA, Ontario Business Registry)",
    jurisdictionError: "Select your corporation's jurisdiction",
    corpName: "Corporation legal name *",
    corpNameHint: 'Exactly as it appears on the Articles of Incorporation, including the legal ending (e.g. "Acme Holdings Inc.").',
    bn: "CRA Business Number (BN)",
    phOntario: "1234567 (OCN)",
    phFederal: "1234567 (Corp #)",
    bnHint: "Optional: 9-digit BN (or 15-character BN with program account). Helps the operator match the file faster.",
  },
  fr: {
    numberOntario: "NSO (numéro de société de l'Ontario) *",
    numberFederal: "Numéro de la société *",
    hintOntario: "Numéro à 9 chiffres attribué par le Registre des entreprises de l'Ontario.",
    hintFederal: "Numéro à 7 chiffres attribué par Corporations Canada (il figure sur votre certificat de constitution).",
    jurisdiction: "Compétence *",
    jurisdictionHint: "Le registre qui a délivré votre constitution.",
    select: "Sélectionnez…",
    optFederal: "Fédérale (LCSA, Corporations Canada)",
    optOntario: "Ontario (LSAO, Registre des entreprises de l'Ontario)",
    jurisdictionError: "Sélectionnez la compétence de votre société",
    corpName: "Dénomination sociale de la société *",
    corpNameHint: "Exactement comme elle figure dans les statuts constitutifs, y compris l'élément juridique (p. ex. « Acme Holdings Inc. »).",
    bn: "Numéro d'entreprise de l'ARC (NE)",
    phOntario: "1234567 (NSO)",
    phFederal: "1234567 (no de société)",
    bnHint: "Facultatif. NE à 9 chiffres (ou NE à 15 caractères avec compte de programme). Aide notre équipe à retrouver le dossier plus rapidement.",
  },
  es: {
    numberOntario: "OCN (número de corporación de Ontario) *",
    numberFederal: "Número de corporación *",
    hintOntario: "Número de 9 dígitos asignado por el Registro de Empresas de Ontario.",
    hintFederal: "Número de 7 dígitos asignado por Corporations Canada (figura en su certificado de constitución).",
    jurisdiction: "Jurisdicción *",
    jurisdictionHint: "El registro que emitió su constitución.",
    select: "Seleccione…",
    optFederal: "Federal (CBCA, Corporations Canada)",
    optOntario: "Ontario (OBCA, Registro de Empresas de Ontario)",
    jurisdictionError: "Seleccione la jurisdicción de su corporación",
    corpName: "Nombre legal de la corporación *",
    corpNameHint: 'Exactamente como figura en los estatutos de constitución, incluida la terminación legal (p. ej., "Acme Holdings Inc.").',
    bn: "Número de empresa de la CRA (BN)",
    phOntario: "1234567 (OCN)",
    phFederal: "1234567 (n.º de corporación)",
    bnHint: "Opcional. BN de 9 dígitos (o BN de 15 caracteres con cuenta de programa). Ayuda a nuestro equipo a ubicar el expediente más rápido.",
  },
} as const;

export default function CorporationIdSection({
  errors,
  lockedJurisdiction,
}: {
  errors?: FieldErrors | CorporationFields;
  /** Hide the jurisdiction picker (the parent form has fixed it). The label
   *  still adapts the corp-number field to match. */
  lockedJurisdiction?: "federal" | "ontario";
}) {
  const { register, watch } = useFormContext();
  const locale = useLocale();
  const lang: Lang = locale === "fr" || locale === "es" ? locale : "en";
  const t = COPY[lang];
  const watchedJurisdiction = watch("corporation.jurisdiction") as "federal" | "ontario" | undefined;
  const jurisdiction = lockedJurisdiction ?? watchedJurisdiction;
  const e = (errors ?? {}) as CorporationFields;

  const numberLabel = jurisdiction === "ontario" ? t.numberOntario : t.numberFederal;
  const numberHint = jurisdiction === "ontario" ? t.hintOntario : t.hintFederal;
  const jurisdictionError =
    e.jurisdiction?.message === COPY.en.jurisdictionError ? t.jurisdictionError : e.jurisdiction?.message;

  return (
    <div className="space-y-5">
      {lockedJurisdiction ? (
        <input type="hidden" {...register("corporation.jurisdiction")} value={lockedJurisdiction} />
      ) : (
        <Field label={t.jurisdiction} error={jurisdictionError} hint={t.jurisdictionHint}>
          <select {...register("corporation.jurisdiction")} className={sCls}>
            <option value="">{t.select}</option>
            <option value="federal">{t.optFederal}</option>
            <option value="ontario">{t.optOntario}</option>
          </select>
        </Field>
      )}

      <Field label={t.corpName} error={e.corpName?.message} hint={t.corpNameHint}>
        <input type="text" {...register("corporation.corpName")} className={iCls} placeholder="Acme Holdings Inc." />
      </Field>

      <Field label={numberLabel} error={e.corpNumber?.message} hint={numberHint}>
        <input type="text" {...register("corporation.corpNumber")} className={iCls} placeholder={jurisdiction === "ontario" ? t.phOntario : t.phFederal} />
      </Field>

      <Field label={t.bn} error={e.businessNumber?.message} hint={t.bnHint}>
        <input type="text" {...register("corporation.businessNumber")} className={iCls} placeholder="123456789 RC0001" />
      </Field>
    </div>
  );
}
