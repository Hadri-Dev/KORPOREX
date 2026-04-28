import { Check, X, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface EnvCheck {
  name: string;
  description: string;
  status: "ok" | "warn" | "missing";
  detail?: string;
}

function checkStripe(): { mode: "live" | "test" | null; status: "ok" | "warn" | "missing"; detail: string } {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return { mode: null, status: "missing", detail: "Not set" };
  if (key.startsWith("sk_live_")) return { mode: "live", status: "ok", detail: "Live mode" };
  if (key.startsWith("sk_test_")) return { mode: "test", status: "warn", detail: "Test mode" };
  return { mode: null, status: "warn", detail: "Unrecognized prefix" };
}

function checkEnv(name: string, required = true): "ok" | "missing" {
  const present = !!process.env[name];
  if (present) return "ok";
  return required ? "missing" : "missing";
}

export default function SettingsPage() {
  const stripe = checkStripe();

  const checks: EnvCheck[] = [
    {
      name: "ADMIN_USERNAME",
      description: "Owner login username (case-insensitive)",
      status: checkEnv("ADMIN_USERNAME"),
    },
    {
      name: "ADMIN_PASSWORD",
      description: "Owner login password",
      status: checkEnv("ADMIN_PASSWORD"),
    },
    {
      name: "ADMIN_SESSION_SECRET",
      description: "Signs the session JWT",
      status: checkEnv("ADMIN_SESSION_SECRET"),
    },
    {
      name: "STRIPE_SECRET_KEY",
      description: "Stripe Checkout + dashboard data",
      status: stripe.status,
      detail: stripe.detail,
    },
    {
      name: "STRIPE_WEBHOOK_SECRET",
      description: "Verifies /api/stripe-webhook signatures",
      status: checkEnv("STRIPE_WEBHOOK_SECRET"),
    },
    {
      name: "BREVO_API_KEY",
      description: "Transactional email for contact + order intake",
      status: checkEnv("BREVO_API_KEY"),
    },
    {
      name: "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
      description: "Address autocomplete in the wizard",
      status: checkEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", false),
    },
    {
      name: "NEXT_PUBLIC_SITE_URL",
      description: "Builds Stripe success / cancel URLs",
      status: checkEnv("NEXT_PUBLIC_SITE_URL", false),
    },
  ];

  const env = process.env.VERCEL_ENV ?? (process.env.NODE_ENV === "production" ? "production" : "development");
  const region = process.env.VERCEL_REGION ?? "local";
  const commit = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null;
  const branch = process.env.VERCEL_GIT_COMMIT_REF ?? null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-navy-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Environment health and deployment info. Read-only.
        </p>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-navy-900">Environment</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Item label="Vercel environment" value={env} />
          <Item label="Region" value={region} />
          {commit ? <Item label="Commit" value={commit} /> : null}
          {branch ? <Item label="Branch" value={branch} /> : null}
        </dl>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <header className="border-b border-gray-200 px-6 py-4">
          <h2 className="font-serif text-lg font-semibold text-navy-900">
            Environment variables
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Server-side check; values are never exposed to the client.
          </p>
        </header>
        <ul className="divide-y divide-gray-100">
          {checks.map((check) => (
            <li key={check.name} className="flex items-start justify-between gap-4 px-6 py-4">
              <div className="min-w-0">
                <p className="font-mono text-sm font-medium text-gray-900">{check.name}</p>
                <p className="mt-0.5 text-xs text-gray-500">{check.description}</p>
              </div>
              <StatusBadge status={check.status} detail={check.detail} />
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-navy-900">Sign-in</h2>
        <p className="mt-2 text-sm text-gray-600">
          To rotate the password, change <code className="rounded bg-gray-100 px-1">ADMIN_PASSWORD</code>{" "}
          on Vercel and redeploy. To force-sign-out everywhere, regenerate{" "}
          <code className="rounded bg-gray-100 px-1">ADMIN_SESSION_SECRET</code> — every existing
          session JWT becomes invalid immediately.
        </p>
      </section>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-0.5 font-mono text-sm text-gray-900">{value}</dd>
    </div>
  );
}

function StatusBadge({
  status,
  detail,
}: {
  status: "ok" | "warn" | "missing";
  detail?: string;
}) {
  if (status === "ok") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        <Check className="h-3 w-3" />
        {detail ?? "Set"}
      </span>
    );
  }
  if (status === "warn") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
        <AlertTriangle className="h-3 w-3" />
        {detail ?? "Warning"}
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
      <X className="h-3 w-3" />
      Missing
    </span>
  );
}
