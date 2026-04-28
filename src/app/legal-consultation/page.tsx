"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarClock, ScaleIcon, ShieldAlert, FileText, ArrowRight, CheckCircle, Upload, X } from "lucide-react";
import {
  legalConsultSchema,
  LEGAL_CONSULT_TOPICS,
  LEGAL_CONSULT_INCORP_STATUS,
  LEGAL_CONSULT_MAX_FILES,
  LEGAL_CONSULT_MAX_FILE_BYTES,
  LEGAL_CONSULT_ACCEPTED_MIMES,
  CALENDLY_LAWYER_URL,
} from "@/lib/legalConsult";
import { getLegalConsultPricing } from "@/lib/pricing";

// Drop the calendly slot fields from the client form schema — those are
// captured separately when the Calendly embed fires `event_scheduled` and
// merged into the API payload at submit time.
const formSchema = legalConsultSchema.omit({
  calendlyEventUri: true,
  calendlyInviteeUri: true,
  calendlyStartTime: true,
});
type FormValues = z.infer<typeof formSchema>;

type CalendlySlot = {
  eventUri: string;
  inviteeUri: string;
  startTime: string;
};

const iCls =
  "w-full border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-navy-900 transition-colors";
const sCls =
  "w-full border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-navy-900 bg-white transition-colors appearance-none";

export default function LegalConsultationPage() {
  const [stage, setStage] = useState<"form" | "calendly" | "ready" | "submitting" | "error">("form");
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [calendlySlot, setCalendlySlot] = useState<CalendlySlot | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const calendlyContainerRef = useRef<HTMLDivElement | null>(null);
  const pricing = getLegalConsultPricing();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      incorpStatus: "Planning to incorporate",
      existingCorpName: "",
      existingJurisdiction: "",
      incorpThroughKorporex: false,
      topics: [],
      description: "",
      isUrgent: false,
      willShareDocuments: false,
      additionalNotes: "",
    },
  });

  const incorpStatus = watch("incorpStatus");
  const willShareDocuments = watch("willShareDocuments");

  // Listen for Calendly's `event_scheduled` postMessage when the embed is
  // mounted. Calendly emits `event.data.event === "calendly.event_scheduled"`
  // with `{ event, invitee }` URIs we can store and forward to the API.
  useEffect(() => {
    if (stage !== "calendly") return;
    function handleMessage(e: MessageEvent) {
      // Calendly only posts from `https://calendly.com`.
      if (typeof e.data !== "object" || !e.data?.event) return;
      if (e.data.event !== "calendly.event_scheduled") return;
      const payload = e.data.payload as
        | { event?: { uri?: string }; invitee?: { uri?: string } }
        | undefined;
      const eventUri = payload?.event?.uri ?? "";
      const inviteeUri = payload?.invitee?.uri ?? "";
      // Calendly's postMessage doesn't include the start time directly.
      // We mark the slot reserved here; Calendly will email the customer
      // (and us, via Calendly's notifications) with the full slot details.
      // The API stores `calendlyStartTime` as the human-readable label the
      // customer sees in the embed — we capture it from a polling read
      // below if the data carries it; otherwise fall back to "(see Calendly)".
      const startTime =
        (payload as { event?: { start_time?: string } } | undefined)?.event?.start_time ?? "(see Calendly notification)";
      setCalendlySlot({ eventUri, inviteeUri, startTime });
      setStage("ready");
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [stage]);

  // Initialize the Calendly inline widget when the script + container are
  // both ready. Calendly.js exposes `Calendly.initInlineWidget`.
  useEffect(() => {
    if (stage !== "calendly") return;
    const init = () => {
      const w = window as unknown as {
        Calendly?: { initInlineWidget: (opts: { url: string; parentElement: HTMLElement; prefill?: Record<string, string> }) => void };
      };
      if (!w.Calendly || !calendlyContainerRef.current || !formData) return;
      // Empty the container in case React re-mounts it during HMR.
      calendlyContainerRef.current.innerHTML = "";
      // Append Calendly's white-label flags so the host's avatar / firm name
      // / GDPR banner are hidden — customers should experience the booking
      // as a Korporex flow rather than a Hadri Law one. The event title
      // (`Consultation - KORPOREX`) stays visible.
      const url = new URL(CALENDLY_LAWYER_URL);
      url.searchParams.set("hide_landing_page_details", "1");
      url.searchParams.set("hide_gdpr_banner", "1");
      w.Calendly.initInlineWidget({
        url: url.toString(),
        parentElement: calendlyContainerRef.current,
        prefill: {
          name: formData.fullName,
          email: formData.email,
        },
      });
    };
    // The widget script may load after this effect runs the first time.
    // Re-try on a short timer until Calendly.initInlineWidget is available.
    const id = window.setInterval(() => {
      if ((window as unknown as { Calendly?: unknown }).Calendly) {
        window.clearInterval(id);
        init();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [stage, formData]);

  function onFilesPicked(picked: FileList | null) {
    if (!picked) return;
    const next = [...files];
    let total = files.reduce((sum, f) => sum + f.size, 0);
    for (let i = 0; i < picked.length; i++) {
      const f = picked[i];
      if (next.length >= LEGAL_CONSULT_MAX_FILES) break;
      if (!(LEGAL_CONSULT_ACCEPTED_MIMES as readonly string[]).includes(f.type)) {
        setSubmitError(`${f.name}: only PDF, JPG, PNG accepted.`);
        continue;
      }
      if (total + f.size > LEGAL_CONSULT_MAX_FILE_BYTES) {
        setSubmitError(`Total upload over ${LEGAL_CONSULT_MAX_FILE_BYTES / 1024 / 1024} MB.`);
        break;
      }
      next.push(f);
      total += f.size;
    }
    setFiles(next);
  }

  function removeFile(idx: number) {
    setFiles(files.filter((_, i) => i !== idx));
  }

  const onValid = (d: FormValues) => {
    setSubmitError(null);
    setFormData(d);
    setStage("calendly");
  };

  async function submitToApi() {
    if (!formData || !calendlySlot) return;
    setSubmitError(null);
    setStage("submitting");
    try {
      const fd = new FormData();
      fd.set("fullName", formData.fullName);
      fd.set("email", formData.email);
      fd.set("phone", formData.phone);
      fd.set("incorpStatus", formData.incorpStatus);
      fd.set("existingCorpName", formData.existingCorpName ?? "");
      fd.set("existingJurisdiction", formData.existingJurisdiction ?? "");
      fd.set("incorpThroughKorporex", String(formData.incorpThroughKorporex));
      for (const t of formData.topics) fd.append("topics", t);
      fd.set("description", formData.description);
      fd.set("isUrgent", String(formData.isUrgent));
      fd.set("willShareDocuments", String(formData.willShareDocuments));
      fd.set("additionalNotes", formData.additionalNotes ?? "");
      fd.set("calendlyEventUri", calendlySlot.eventUri);
      fd.set("calendlyInviteeUri", calendlySlot.inviteeUri);
      fd.set("calendlyStartTime", calendlySlot.startTime);
      for (const f of files) fd.append("documents", f);

      const res = await fetch("/api/legal-consult", { method: "POST", body: fd });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Submission failed");
      }
      const { url } = (await res.json()) as { url?: string };
      if (!url) throw new Error("Checkout session did not return a URL");
      window.location.href = url;
    } catch (err) {
      setSubmitError(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong. Please try again or email contact@korporex.ca."
      );
      setStage("error");
    }
  }

  return (
    <>
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" />

      {/* Hero */}
      <section className="bg-cream-50 py-16 px-6 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
            Talk to a Trusted Corporate Lawyer
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-5">
            Need legal advice for your corporation?
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6 max-w-2xl">
            Book a 30-minute consultation with an independent licensed lawyer from our trusted referral network.
            Get personalized answers about incorporation strategy, shareholder agreements, compliance, restructuring, and more.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <CalendarClock size={16} className="text-navy-900" />
              30-minute consultation
            </div>
            <div className="flex items-center gap-2">
              <ScaleIcon size={16} className="text-navy-900" />
              Independent corporate lawyer
            </div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-navy-900 text-base">${pricing.fee.toFixed(2)}</span>
              <span>+ HST · ${pricing.total.toFixed(2)} CAD total</span>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-white border-b border-gray-100 px-6 py-6">
        <div className="max-w-3xl mx-auto flex items-start gap-3">
          <ShieldAlert size={18} className="text-gold-500 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong className="text-navy-900">Korporex is not a law firm and does not provide legal advice.</strong>{" "}
            The consultation is provided by an independent licensed lawyer from our trusted referral network. Korporex&rsquo;s role is
            limited to facilitating the introduction. No solicitor-client relationship is created with Korporex.
            The lawyer&rsquo;s services are subject to their own engagement terms; the $150 fee covers the 30-minute consultation only.
          </p>
        </div>
      </section>

      {/* Body — staged content. Width varies by stage: the questionnaire
          and confirmation panels sit in a 2xl column for readability, while
          the Calendly embed widens to a 4xl column so the calendar grid
          and time-slot list aren't cramped. */}
      <section className="bg-white py-12 px-6 min-h-[60vh]">
        <div className={stage === "calendly" ? "max-w-4xl mx-auto" : "max-w-2xl mx-auto"}>
          {stage === "form" && (
            <form onSubmit={handleSubmit(onValid)} className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-1">Tell us about your situation</h2>
              <p className="text-gray-500 text-sm mb-2">
                The lawyer reviews this before your call so they can come prepared.
              </p>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full Name *" error={errors.fullName?.message}>
                  <input {...register("fullName")} className={iCls} />
                </Field>
                <Field label="Phone *" error={errors.phone?.message}>
                  <input type="tel" autoComplete="tel" {...register("phone")} className={iCls} />
                </Field>
              </div>
              <Field label="Email Address *" error={errors.email?.message}>
                <input type="email" autoComplete="email" {...register("email")} className={iCls} />
              </Field>

              {/* Incorp status */}
              <Field label="Incorporation status *" error={errors.incorpStatus?.message}>
                <select {...register("incorpStatus")} className={sCls}>
                  {LEGAL_CONSULT_INCORP_STATUS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>

              {incorpStatus === "Already incorporated" && (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Existing Corporation Name" error={errors.existingCorpName?.message}>
                    <input {...register("existingCorpName")} placeholder='e.g. "Acme Technologies Inc."' className={iCls} />
                  </Field>
                  <Field
                    label="Jurisdiction"
                    error={errors.existingJurisdiction?.message}
                    hint="Federal, Ontario, or other province"
                  >
                    <input {...register("existingJurisdiction")} placeholder="e.g. Ontario" className={iCls} />
                  </Field>
                </div>
              )}

              <label htmlFor="korporex-client" className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
                <input id="korporex-client" type="checkbox" className="shrink-0 accent-navy-900" {...register("incorpThroughKorporex")} />
                I incorporated through Korporex.
              </label>

              {/* Topics */}
              <Field
                label="What topics would you like to discuss? *"
                error={errors.topics?.message as string | undefined}
                hint="Pick all that apply."
              >
                <div className="grid sm:grid-cols-2 gap-2 mt-1">
                  {LEGAL_CONSULT_TOPICS.map((t) => (
                    <label
                      key={t}
                      className="flex items-start gap-2 border border-gray-200 px-3 py-2.5 text-sm text-gray-700 cursor-pointer hover:border-navy-900 transition-colors"
                    >
                      <input
                        type="checkbox"
                        value={t}
                        {...register("topics")}
                        className="mt-0.5 accent-navy-900"
                      />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </Field>

              {/* Description */}
              <Field
                label="Briefly describe your situation *"
                error={errors.description?.message}
                hint="A sentence or two is fine. The lawyer will go deeper on the call."
              >
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="e.g. We're three co-founders looking at a federal incorporation with a vesting schedule and want to understand share-class options."
                  className={`${iCls} resize-none`}
                />
              </Field>

              {/* Urgency */}
              <label htmlFor="is-urgent" className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
                <input id="is-urgent" type="checkbox" className="shrink-0 accent-navy-900" {...register("isUrgent")} />
                This matter is urgent.
              </label>

              {/* Documents */}
              <label htmlFor="will-share-docs" className="flex items-center gap-3 cursor-pointer text-sm text-gray-700">
                <input id="will-share-docs" type="checkbox" className="shrink-0 accent-navy-900" {...register("willShareDocuments")} />
                I have documents I&rsquo;d like the lawyer to review.
              </label>

              {willShareDocuments && (
                <div className="border border-dashed border-gray-300 p-4 bg-cream-50">
                  <p className="text-xs font-semibold tracking-[0.1em] uppercase text-gray-500 mb-3">
                    Upload Documents (optional)
                  </p>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                    PDF, JPG, or PNG. Up to {LEGAL_CONSULT_MAX_FILES} files,{" "}
                    {LEGAL_CONSULT_MAX_FILE_BYTES / 1024 / 1024} MB total. Files are emailed directly to the lawyer with your questionnaire.
                  </p>
                  <label className="inline-flex items-center gap-2 border border-navy-900 px-4 py-2.5 text-sm text-navy-900 cursor-pointer hover:bg-navy-50 transition-colors">
                    <Upload size={14} /> Choose Files
                    <input
                      type="file"
                      multiple
                      accept={LEGAL_CONSULT_ACCEPTED_MIMES.join(",")}
                      onChange={(e) => onFilesPicked(e.target.files)}
                      className="hidden"
                    />
                  </label>
                  {files.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {files.map((f, i) => (
                        <li
                          key={`${f.name}-${i}`}
                          className="flex items-center justify-between text-sm bg-white border border-gray-200 px-3 py-2"
                        >
                          <span className="flex items-center gap-2 text-gray-700">
                            <FileText size={14} className="text-navy-900" />
                            {f.name}
                            <span className="text-xs text-gray-500">
                              · {(f.size / 1024).toFixed(0)} KB
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="text-gray-400 hover:text-red-500"
                            aria-label={`Remove ${f.name}`}
                          >
                            <X size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Notes */}
              <Field label="Anything else the lawyer should know? (optional)" error={errors.additionalNotes?.message}>
                <textarea {...register("additionalNotes")} rows={3} className={`${iCls} resize-none`} />
              </Field>

              {submitError && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2" role="alert">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-navy-900 text-white font-medium py-4 text-sm tracking-wide hover:bg-navy-800 transition-colors mt-2 inline-flex items-center justify-center gap-2"
              >
                Continue to Booking <ArrowRight size={14} />
              </button>
            </form>
          )}

          {stage === "calendly" && (
            <>
              <button
                type="button"
                onClick={() => setStage("form")}
                className="text-sm text-gray-500 hover:text-navy-900 mb-6"
              >
                ← Back to questionnaire
              </button>
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-1">Pick a time</h2>
              <p className="text-gray-500 text-sm mb-6">
                Choose any 30-minute slot that works for you. After selecting, you&rsquo;ll be redirected to checkout.
              </p>
              {/*
                Calendly's inline widget renders an iframe at 100% of this
                container. A fixed h-[1100px] gives the calendar grid + slot
                picker enough room without internal scrollbars. The previous
                `min-h-[700px]` was too short and made Calendly scroll
                internally with arrow controls — which looked broken.
              */}
              <div ref={calendlyContainerRef} className="h-[1100px] border border-gray-100" />
            </>
          )}

          {stage === "ready" && calendlySlot && (
            <div className="text-center py-12">
              <CheckCircle size={32} className="text-gold-500 mx-auto mb-4" />
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-2">Slot reserved</h2>
              <p className="text-gray-600 mb-2">
                Booking time:{" "}
                <span className="font-semibold text-navy-900">
                  {formatSlotTime(calendlySlot.startTime)}
                </span>
              </p>
              <p className="text-gray-500 text-sm mb-8">
                Continue to secure payment to confirm your consultation.
              </p>
              <button
                type="button"
                onClick={submitToApi}
                className="inline-flex items-center gap-2 bg-gold-500 text-white font-medium px-8 py-4 text-sm tracking-wide hover:bg-gold-600 transition-colors"
              >
                Continue to Payment — ${pricing.total.toFixed(2)} CAD <ArrowRight size={14} />
              </button>
              <p className="text-xs text-gray-500 mt-4">
                You&rsquo;ll be redirected to <span className="font-semibold">Stripe</span> to complete payment securely.
              </p>
              {submitError && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 mt-4" role="alert">
                  {submitError}
                </p>
              )}
            </div>
          )}

          {stage === "submitting" && (
            <div className="text-center py-12">
              <p className="text-gray-600">Redirecting to Stripe…</p>
            </div>
          )}

          {stage === "error" && (
            <div className="text-center py-12">
              <p className="text-red-700 bg-red-50 border border-red-200 px-3 py-3 mb-4" role="alert">
                {submitError ?? "Something went wrong."}
              </p>
              <button
                type="button"
                onClick={submitToApi}
                className="inline-flex items-center gap-2 bg-gold-500 text-white font-medium px-6 py-3 text-sm tracking-wide hover:bg-gold-600 transition-colors"
              >
                Try Again <ArrowRight size={14} />
              </button>
              <p className="text-xs text-gray-500 mt-4">
                Or email{" "}
                <a className="underline" href="mailto:contact@korporex.ca">
                  contact@korporex.ca
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer fine print */}
      <section className="bg-cream-50 py-12 px-6 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center text-xs text-gray-500 leading-relaxed">
          <p className="mb-2">
            <strong className="text-navy-900">Need general help that isn&rsquo;t legal advice?</strong>{" "}
            Email <a className="underline" href="mailto:contact@korporex.ca">contact@korporex.ca</a> or check our{" "}
            <Link className="underline" href="/faq">FAQ</Link>.
          </p>
          <p>
            Korporex is not a law firm. Lawyers in our referral network are independent professionals; their fees beyond the consultation are between them and you.
          </p>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  const required = label.endsWith(" *");
  const baseLabel = required ? label.slice(0, -2) : label;
  return (
    <div>
      <label className="block text-xs font-semibold tracking-[0.1em] uppercase text-gray-500 mb-1.5">
        {baseLabel}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// Calendly's `event_scheduled` payload may include an ISO `start_time` or
// the `(see Calendly notification)` fallback. Format whichever we got into
// a friendly local string.
function formatSlotTime(s: string) {
  if (!s || s === "(see Calendly notification)") return s;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
