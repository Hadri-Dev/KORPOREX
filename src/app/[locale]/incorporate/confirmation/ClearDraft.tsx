"use client";

import { useEffect } from "react";
import { clearDraft } from "@/lib/incorporateDraft";

// The wizard keeps an in-progress copy of the customer's answers in their
// browser so an abandoned form can be resumed. Once they land here the order
// has been submitted, so the draft is no longer wanted. Otherwise a second
// visit to /incorporate would restore a completed order.
export default function ClearDraft() {
  useEffect(() => {
    clearDraft();
  }, []);
  return null;
}
