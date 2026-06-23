"use client";

import { useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, HelpCircle, ShieldCheck, Mail, Clock } from "lucide-react";
import {
  nuansReportRequestSchema,
  type NuansReportRequest,
  NUANS_JURISDICTIONS,
  NUANS_REPORT,
  nuansSubtotal,
} from "@/lib/nuansReport";
import { Field, iCls, sCls } from "@/components/wizard/WizardUI";
import AddressFields from "@/components/wizard/AddressFields";
import { getTaxRate } from "@/lib/pricing";

const emptyAddress = { street: "", city: "", region: "", postalCode: "", country: "CA" };

// One empty row to start with (matches the screenshot's "one row visible by
// default" behaviour). Customers can use the "Add another name" button to
// append more rows.
const initialRow = {
  proposedName: "",
  distinctiveTerm: "",
  jurisdiction: "federal" as const,
};

export default function NuansReportBody() {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<NuansReportRequest>({
    resolver: zodResolver(nuansReportRequestSchema),
    mode: "onTouched",
    defaultValues: {
      rows: [{ ...initialRow }],
      contact: {
        contactFirstName: "",
        contactLastName: "",
        contactEmail: "",
        contactPhone: "",
        contactRole: "",
      },
      billingName: "",
      billingAddress: { ...emptyAddress },
    },
  });

  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors },
  } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "rows" });

  async function onSubmit(data: NuansReportRequest) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/nuans-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? "Submission failed.");
      window.location.href = json.url;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed.");
      setSubmitting(false);
    }
  }

  const region = watch("billingAddress.region") || "";
  const country = watch("billingAddress.country") || "CA";
  const taxRate = getTaxRate(country, region);
  const rowCount = fields.length;
  const additionalCount = Math.max(0, rowCount - 1);
  const additionalTotal = NUANS_REPORT.additionalPrice * additionalCount;
  const subtotal = nuansSubtotal(rowCount);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  return (
    <FormProvider {...form}>
      {/* Hero */}
      <section className="bg-navy-900 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-3">
            Name Search
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-5">
            Order a NUANS Preliminary Name-Search Report
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
            A NUANS report cross-references your proposed Canadian corporate name against millions of registered business names, corporate names, and trademarks across the country. It is the standard pre-incorporation name check required by Corporations Canada for federal filings and by most provincial registries for named corporations.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-300">
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-gold-500" />
              Official NUANS source
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} className="text-gold-500" />
              Delivered within a few hours
            </span>
            <span className="flex items-center gap-2">
              <Mail size={16} className="text-gold-500" />
              PDF emailed to you
            </span>
          </div>
        </div>
      </section>

      {/* Guidance */}
      <section className="bg-cream-50 border-b border-gray-100 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">
            How to enter your proposed name correctly
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-6">
            Type the name you intend to register, then pick the jurisdiction where
            the corporation will be filed. Each jurisdiction has its own naming
            conventions, so follow the rules below to make sure the registry
            examiner can evaluate your name without ambiguity.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-md p-5">
              <h3 className="font-serif text-base font-bold text-navy-900 mb-2">
                Provincial filings (Ontario and others)
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                The proposed name must match the corporation name exactly as it
                will appear on the certificate of incorporation. Include a legal
                ending. Abbreviated endings such as <strong>Inc.</strong>,{" "}
                <strong>Ltd.</strong>, or <strong>Corp.</strong> must end with a period.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-md p-5">
              <h3 className="font-serif text-base font-bold text-navy-900 mb-2">
                Federal filings (CBCA)
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Do not include the legal ending in your search term. NUANS compares
                only the distinctive element of a federal name; including the suffix
                dilutes the match score and can cause valid names to be flagged.
              </p>
            </div>
          </div>
          <div className="mt-5 bg-white border border-gray-200 rounded-md p-5">
            <h3 className="font-serif text-base font-bold text-navy-900 mb-2">
              Acceptable legal endings
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Corp., Corporation, Inc., Incorporated, Incorporée, Ltd., Ltée,
              Limited, Limitée, plus their French-language equivalents where the
              jurisdiction permits French wording.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            {/* ── Names table ────────────────────────────────────────────── */}
            {/* Visually elevated card so the "proposed names" step reads as
                the headline action on the page. Cream bg + thick gold-500
                left stripe + subtle shadow + slightly larger title. */}
            <div className="relative bg-cream-50 border border-gray-200 border-l-4 border-l-gold-500 rounded-lg shadow-sm p-5 md:p-8">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy-900 mb-2">
                Your proposed names
              </h2>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Add one name per row. The first proposed name is $40 + HST. Each
                additional name in the same order is $40 + HST. Every name you
                enter is searched and the results are bundled into a single
                emailed PDF.
              </p>

              {/* Single responsive layout: stacked card on mobile, table-style
                  grid on md+. Rendered ONCE so every form path is registered
                  with react-hook-form exactly once per row. White inner bg
                  keeps the inputs legible against the cream card. */}
              <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
                {/* Column headers (md+ only) */}
                <div className="hidden md:grid grid-cols-[1.6fr_1.4fr_1.4fr_44px] gap-3 bg-navy-900 px-4 py-3 text-xs font-bold tracking-[0.08em] uppercase text-white">
                  <div>
                    Proposed Name<span className="text-red-500 ml-0.5">*</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>
                      Distinctive Term<span className="text-red-500 ml-0.5">*</span>
                    </span>
                    <span
                      title="The distinctive element is the unique part of your name (for example, in 'Maple Ridge Logistics Inc.' the distinctive element is 'Maple Ridge'). NUANS compares this against the database."
                      className="cursor-help text-gray-400"
                    >
                      <HelpCircle size={13} />
                    </span>
                  </div>
                  <div>
                    Jurisdiction<span className="text-red-500 ml-0.5">*</span>
                  </div>
                  <div className="sr-only">Remove row</div>
                </div>

                {fields.map((field, i) => {
                  const rowErr = errors.rows?.[i];
                  return (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 md:grid-cols-[1.6fr_1.4fr_1.4fr_44px] gap-x-3 gap-y-3 px-4 py-4 md:py-3 border-t border-gray-100 md:items-start first:border-t-0 md:first:border-t"
                    >
                      {/* Row label on mobile only */}
                      <div className="md:hidden flex items-center justify-between -mb-1">
                        <span className="text-xs font-bold tracking-[0.08em] uppercase text-navy-900">
                          Name #{i + 1}
                        </span>
                      </div>

                      {/* Proposed Name */}
                      <div>
                        <label className="md:hidden block text-xs font-semibold text-gray-600 mb-1">
                          Proposed name<span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <input
                          type="text"
                          {...register(`rows.${i}.proposedName`)}
                          className={iCls}
                          placeholder="e.g. Maple Ridge Logistics Inc."
                        />
                        {rowErr?.proposedName?.message && (
                          <p className="text-xs text-red-500 mt-1">
                            {rowErr.proposedName.message}
                          </p>
                        )}
                      </div>

                      {/* Distinctive Term */}
                      <div>
                        <label className="md:hidden block text-xs font-semibold text-gray-600 mb-1">
                          Distinctive term<span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <input
                          type="text"
                          {...register(`rows.${i}.distinctiveTerm`)}
                          className={iCls}
                          placeholder="e.g. Maple Ridge"
                        />
                        {rowErr?.distinctiveTerm?.message && (
                          <p className="text-xs text-red-500 mt-1">
                            {rowErr.distinctiveTerm.message}
                          </p>
                        )}
                      </div>

                      {/* Jurisdiction */}
                      <div>
                        <label className="md:hidden block text-xs font-semibold text-gray-600 mb-1">
                          Jurisdiction<span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <select
                          {...register(`rows.${i}.jurisdiction`)}
                          className={sCls}
                        >
                          {NUANS_JURISDICTIONS.map((j) => (
                            <option key={j.value} value={j.value}>
                              {j.label}
                            </option>
                          ))}
                        </select>
                        {rowErr?.jurisdiction?.message && (
                          <p className="text-xs text-red-500 mt-1">
                            {rowErr.jurisdiction.message}
                          </p>
                        )}
                      </div>

                      {/* Remove-row button */}
                      <div className="flex md:block justify-end">
                        <button
                          type="button"
                          onClick={() => remove(i)}
                          disabled={fields.length === 1}
                          aria-label={`Remove row ${i + 1}`}
                          className="md:self-center text-gray-400 hover:text-red-600 transition-colors disabled:opacity-30 disabled:hover:text-gray-400 disabled:cursor-not-allowed p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {typeof errors.rows?.message === "string" && (
                <p className="text-xs text-red-500 mt-3">{errors.rows.message}</p>
              )}

              <button
                type="button"
                onClick={() => append({ ...initialRow })}
                disabled={fields.length >= 10}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy-900 bg-white border-2 border-dashed border-navy-900/30 hover:border-gold-500 hover:text-gold-600 hover:bg-gold-500/5 transition-colors px-5 py-3 rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus size={16} /> Add another name
              </button>
              {fields.length >= 10 && (
                <p className="text-xs text-gray-500 mt-2">
                  Maximum of 10 names per order.
                </p>
              )}
            </div>

            {/* ── Contact ────────────────────────────────────────────────── */}
            <div className="border-t border-gray-100 pt-10">
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-2">
                Contact information
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                The PDF report is emailed to the address below within a few hours of payment.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="First name *" error={errors.contact?.contactFirstName?.message}>
                  <input
                    type="text"
                    {...register("contact.contactFirstName")}
                    className={iCls}
                  />
                </Field>
                <Field label="Last name *" error={errors.contact?.contactLastName?.message}>
                  <input
                    type="text"
                    {...register("contact.contactLastName")}
                    className={iCls}
                  />
                </Field>
                <Field label="Email *" error={errors.contact?.contactEmail?.message}>
                  <input
                    type="email"
                    autoComplete="email"
                    {...register("contact.contactEmail")}
                    className={iCls}
                  />
                </Field>
                <Field label="Phone *" error={errors.contact?.contactPhone?.message}>
                  <input
                    type="tel"
                    autoComplete="tel"
                    {...register("contact.contactPhone")}
                    className={iCls}
                  />
                </Field>
                <Field
                  label="Your role"
                  error={errors.contact?.contactRole?.message}
                  hint="Optional. For example: founder, lawyer, accountant."
                >
                  <input
                    type="text"
                    {...register("contact.contactRole")}
                    className={iCls}
                  />
                </Field>
              </div>
            </div>

            {/* ── Billing ────────────────────────────────────────────────── */}
            <div className="border-t border-gray-100 pt-10">
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-2">
                Billing
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Tax is calculated based on the billing province.
              </p>
              <Field
                label="Billing name *"
                error={errors.billingName?.message}
                hint="Name on the credit or debit card."
              >
                <input type="text" {...register("billingName")} className={iCls} />
              </Field>
              <div className="mt-4">
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-black mb-2">
                  Billing address <span className="text-red-500">*</span>
                </p>
                <AddressFields
                  name="billingAddress"
                  errors={errors.billingAddress}
                  canadaOnly={false}
                />
              </div>
            </div>

            {/* ── Summary + submit ───────────────────────────────────────── */}
            <div className="border-t border-gray-100 pt-10">
              <div className="border border-gray-200 rounded-lg bg-cream-50 p-5">
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-navy-900 mb-3">
                  Order summary
                </p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">
                      {NUANS_REPORT.longLabel} (first name)
                    </span>
                    <span className="text-gray-900">
                      ${NUANS_REPORT.basePrice.toFixed(2)}
                    </span>
                  </div>
                  {additionalCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">
                        Additional names ({additionalCount} ×{" "}
                        ${NUANS_REPORT.additionalPrice.toFixed(2)})
                      </span>
                      <span className="text-gray-900">
                        ${additionalTotal.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500 text-xs pt-1">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {tax > 0 && (
                    <div className="flex justify-between text-gray-500 text-xs">
                      <span>
                        Tax ({(taxRate * 100).toFixed(taxRate === 0.14975 ? 3 : 0)}% in {region || "your province"})
                      </span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
                    <span className="text-navy-900">Total (CAD)</span>
                    <span className="text-navy-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="mt-4 border border-red-200 bg-red-50 text-red-900 text-sm rounded-md p-3">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto md:px-12 mt-6 inline-flex items-center justify-center gap-2 bg-navy-900 text-white font-medium py-3.5 px-8 text-sm tracking-wide hover:bg-navy-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? "Redirecting to Stripe…" : "Continue to Payment"}
              </button>
              <p className="text-xs text-gray-500 mt-3 max-w-md">
                Payment is processed securely by Stripe. Card details never touch
                our server. After payment you&apos;ll receive a Stripe receipt and
                the PDF report by email within a few hours.
              </p>
              <p className="text-xs text-gray-500 mt-2 max-w-md">
                <strong className="text-navy-900">Not legal advice.</strong> A
                NUANS report is a database search, not an opinion on whether your
                name will be approved by a registry examiner or whether it
                infringes a trademark. Korporex is a document preparation and
                filing service, not a law firm.
              </p>
            </div>
          </form>
        </div>
      </section>
    </FormProvider>
  );
}
