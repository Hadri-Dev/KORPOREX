"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: { label: string; href: string }[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    children: [
      { label: "All orders", href: "/dashboard/orders" },
      { label: "Paid", href: "/dashboard/orders?status=paid" },
      { label: "Pending / Abandoned", href: "/dashboard/orders?status=open" },
    ],
  },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

function classNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<string[]>(["Orders"]);
  const [busy, setBusy] = useState(false);

  function toggle(label: string) {
    setOpenSections((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  }

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  }

  async function handleSignOut() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin";
  }

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="font-serif text-xl font-bold text-navy-900">K</span>
          <span className="font-serif text-base font-semibold text-navy-900">
            Korporex
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const expanded = openSections.includes(item.label) || active;

          if (item.children) {
            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => toggle(item.label)}
                  className={classNames(
                    "w-full flex items-center justify-between rounded-md px-3 py-2 text-sm",
                    active
                      ? "bg-navy-900 text-white"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  <ChevronDown
                    className={classNames(
                      "h-4 w-4 transition-transform",
                      expanded && "rotate-180",
                    )}
                  />
                </button>
                {expanded ? (
                  <div className="mt-1 space-y-0.5 pl-9">
                    {item.children.map((child) => {
                      const childPath = child.href.split("?")[0];
                      const childActive = pathname === childPath;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={classNames(
                            "block rounded-md px-3 py-1.5 text-sm",
                            childActive
                              ? "text-navy-900 font-medium"
                              : "text-gray-600 hover:text-navy-900",
                          )}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={classNames(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                active
                  ? "bg-navy-900 text-white"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-3">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={busy}
          className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" />
          {busy ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
