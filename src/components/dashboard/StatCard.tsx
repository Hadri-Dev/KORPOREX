import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  hint?: string;
  href?: string;
  icon: LucideIcon;
  emphasis?: "default" | "warning";
}

export default function StatCard({
  title,
  value,
  hint,
  href,
  icon: Icon,
  emphasis = "default",
}: StatCardProps) {
  const content = (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-gold-500/60">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {title}
        </h3>
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <p className="mt-3 font-serif text-3xl font-semibold text-navy-900">{value}</p>
      {hint ? (
        <p
          className={
            emphasis === "warning"
              ? "mt-1 text-xs font-medium text-amber-600"
              : "mt-1 text-xs text-gray-500"
          }
        >
          {hint}
        </p>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }
  return content;
}
