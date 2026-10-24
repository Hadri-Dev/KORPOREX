"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle, AlertCircle } from "lucide-react";

export type RenewalView =
  | { kind: "invalid" }
  | { kind: "expired" }
  | { kind: "paid" }
  | { kind: "movingDone"; businessName: string }
  | {
      kind: "form";
      businessName: string;
      office: string;
      termEnds: string;
      nextTermEnds: string;
      fee: string;
      defaultRegion: string;
      initialChoice: "renew" | "moving";
    };

const REGIONS = ["ON", "QC", "BC", "AB", "MB", "SK", "NS", "NB", "PE", "NL", "YT", "NT", "NU", "OUTSIDE"] as const;

export default function OfficeRenewalBody({ view, token, locale }: { view: RenewalView; token: string; locale: string }) {
  const t = useTranslations("officeRenewal");

  return (
    <main className="min-h-[70vh] bg-cream-50 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-xl">
        <div className="rounded-t-xl bg-navy-900 px-7 py-5 font-serif text-xl font-bold tracking-wide text-white">
          KORPOREX<span className="text-gold-500">.</span>
        </div>
        <div className="rounded-b-xl border border-t-0 border-gray-200 bg-white p-7 shadow-sm">
          {view.kind === "form" ? (
            <RenewalForm view={view} token={token} locale={locale} />
          ) : view.kind === "paid" ? (
            <Notice ok title={t("paidTitle")} body={t("paidBody")} />
          ) : view.kind === "movingDone" ? (
            <Notice ok title={t("movingDoneTitle")} body={t("movingDoneBody", { business: view.businessName })} />
          ) : view.kind === "expired" ? (
            <Notice title={t("expiredTitle")} body={t("expiredBody")} />
          ) : (
            <Notice title={t("invalidTitle")} body={t("invalidBody")} />
          )}
        </div>
      </div>
    </main>
  );
}

function Notice({ ok, title, body }: { ok?: boolean; title: string; body: string }) {
  const Icon = ok ? CheckCircle : AlertCircle;
  return (
    <div className="text-center">
      <Icon className={`mx-auto h-12 w-12 ${ok ? "text-navy-500" : "text-gold-600"}`} />
      <h1 className="mt-4 font-serif text-2xl font-semibold text-navy-900">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">{body}</p>
    </div>
  );
}

function RenewalForm({
  view,
  token,
  locale,
}: {
  view: Extract<RenewalView, { kind: "form" }>;
  token: string;
  locale: string;
}) {
  const t = useTranslations("officeRenewal");
  const [choice, setChoice] = useState<"renew" | "moving">(view.initialChoice);
  const [region, setRegion] = useState(view.defaultRegion);
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movingSent, setMovingSent] = useState(false);

  if (movingSent) {
    return <Notice ok title={t("movingDoneTitle")} body={t("movingDoneBody", { business: view.businessName })} />;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/office-renewal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          choice === "renew" ? { choice, token, region, locale } : { choice, token, address, note, locale },
        ),
      });
      const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (res.status === 410) throw new Error(t("errorExpired"));
      if (!res.ok) throw new Error(t("errorGeneric"));
      if (choice === "renew" && json.url) {
        window.location.href = json.url;
        return;
      }
      setMovingSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorGeneric"));
      setBusy(false);
    }
  }

  const option = (key: "renew" | "moving", title: string, desc: string, extra?: React.ReactNode) => (
    <div
      role="radio"
      aria-checked={choice === key}
      tabIndex={0}
      onClick={() => setChoice(key)}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          setChoice(key);
        }
      }}
      className={`mb-3 flex cursor-pointer gap-4 rounded-xl border-2 p-4 transition-colors ${
        choice === key ? "border-navy-900 bg-navy-50" : "border-gray-200 hover:border-navy-300"
      }`}
    >
      <span
        className={`mt-0.5 h-[18px] w-[18px] shrink-0 rounded-full border-2 ${
          choice === key ? "border-[5px] border-navy-900" : "border-gray-400"
        }`}
      />
      <div className="flex-1">
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="mt-1 text-sm text-gray-600">{desc}</p>
        {choice === key ? extra : null}
      </div>
    </div>
  );

  const input = "mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-navy-500 focus:outline-none";

  return (
    <form onSubmit={submit}>
      <h1 className="font-serif text-2xl font-semibold text-navy-900">{t("heading")}</h1>
      <p className="mt-1 text-sm text-gray-600">{t("intro")}</p>

      <dl className="my-5 grid grid-cols-[minmax(0,140px)_1fr] gap-x-3 gap-y-2 rounded-lg bg-navy-50 p-4 text-sm">
        <dt className="text-gray-500">{t("business")}</dt>
        <dd className="font-semibold text-gray-900">{view.businessName}</dd>
        <dt className="text-gray-500">{t("office")}</dt>
        <dd>{view.office}</dd>
        <dt className="text-gray-500">{t("termEnds")}</dt>
        <dd>{view.termEnds}</dd>
        <dt className="text-gray-500">{t("fee")}</dt>
        <dd>{t("feeValue", { fee: view.fee })}</dd>
      </dl>

      <div role="radiogroup">
        {option(
          "renew",
          t("renewTitle"),
          t("renewDesc", { date: view.nextTermEnds }),
          <label className="mt-3 block text-xs font-medium text-gray-600" onClick={(e) => e.stopPropagation()}>
            {t("provinceLabel")}
            <select className={input} value={region} onChange={(e) => setRegion(e.target.value)}>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {t(`provinces.${r}`)}
                </option>
              ))}
            </select>
            <span className="mt-1 block font-normal text-gray-500">{t("provinceHint")}</span>
          </label>,
        )}
        {option(
          "moving",
          t("movingTitle"),
          t("movingDesc", { date: view.termEnds }),
          <div className="mt-3 space-y-3" onClick={(e) => e.stopPropagation()}>
            <label className="block text-xs font-medium text-gray-600">
              {t("addressLabel")}
              <input required className={input} value={address} onChange={(e) => setAddress(e.target.value)} />
            </label>
            <label className="block text-xs font-medium text-gray-600">
              {t("noteLabel")}
              <textarea rows={2} className={input} value={note} onChange={(e) => setNote(e.target.value)} />
            </label>
          </div>,
        )}
      </div>

      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={busy}
        className="mt-3 w-full rounded-lg bg-gold-500 px-4 py-3.5 text-base font-bold text-white transition-colors hover:bg-gold-600 disabled:opacity-60"
      >
        {busy ? t("working") : choice === "renew" ? t("payButton") : t("sendButton")}
      </button>
      <p className="mt-4 text-center text-xs text-gray-500">{t("secureNote")}</p>
    </form>
  );
}
