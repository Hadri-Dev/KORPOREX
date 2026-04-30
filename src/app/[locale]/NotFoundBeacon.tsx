"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Fires once per 404 page render to /api/seo/not-found-log/capture so the
// admin dashboard can aggregate hits by path. Best-effort:
//   - useRef gate prevents double-firing under React Strict Mode.
//   - keepalive lets the beacon survive a navigation away from the page.
//   - All errors are swallowed; the visitor's 404 page is never affected.
//
// Bots/no-JS clients are missed by design. The roadmap accepts this as the
// trade-off for not having to mutate request headers via middleware.
export default function NotFoundBeacon() {
  const pathname = usePathname();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    fetch("/api/seo/not-found-log/capture", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {
      // intentional: never surface beacon failures to the visitor
    });
  }, [pathname]);

  return null;
}
