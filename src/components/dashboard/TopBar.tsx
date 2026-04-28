"use client";

import { useState } from "react";
import { LogOut, Menu } from "lucide-react";

export default function TopBar() {
  const [busy, setBusy] = useState(false);

  async function handleSignOut() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin";
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
      <div className="lg:hidden flex items-center gap-2">
        <Menu className="h-5 w-5 text-gray-500" />
        <span className="font-serif text-base font-semibold text-navy-900">Korporex</span>
      </div>
      <div className="hidden lg:block text-sm text-gray-500">Admin dashboard</div>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={busy}
        className="lg:hidden flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
      >
        <LogOut className="h-4 w-4" />
        {busy ? "…" : "Sign out"}
      </button>
    </header>
  );
}
