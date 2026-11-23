"use client";

import { useEffect } from "react";
import { captureAttributionOnLoad } from "@/lib/attribution";

// Renders nothing; just captures first-touch UTM/referrer attribution into a
// cookie on mount so order API routes can tag Stripe metadata with it.
export default function AttributionCapture() {
  useEffect(() => {
    captureAttributionOnLoad();
  }, []);
  return null;
}
