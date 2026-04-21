"use client";

import { useEffect, useRef, useState } from "react";

export type ParsedAddress = {
  street: string;
  city: string;
  region: string;
  regionLong: string;
  postalCode: string;
  country: string;
  countryLong: string;
};

type Props = {
  value: string;
  onChange: (street: string) => void;
  onAddressSelected?: (parsed: ParsedAddress) => void;
  countryRestrict?: string[];
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
};

const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GoogleWindow = Window & { google?: any };

let googleLoadPromise: Promise<void> | null = null;

function loadGoogle(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("ssr"));
  if (!GOOGLE_KEY) return Promise.reject(new Error("no-key"));
  const w = window as GoogleWindow;
  if (w.google?.maps?.places) return Promise.resolve();
  if (googleLoadPromise) return googleLoadPromise;
  googleLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById("google-maps-places") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("load-failed")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.id = "google-maps-places";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_KEY)}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("load-failed"));
    document.head.appendChild(script);
  });
  return googleLoadPromise;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parse(place: any): ParsedAddress {
  const comps: Array<{ long_name: string; short_name: string; types: string[] }> =
    place?.address_components ?? [];
  const get = (type: string, long = false) => {
    const c = comps.find((x) => x.types.includes(type));
    return c ? (long ? c.long_name : c.short_name) : "";
  };
  const streetNumber = get("street_number");
  const route = get("route", true);
  const street = [streetNumber, route].filter(Boolean).join(" ").trim();
  const city =
    get("locality", true) ||
    get("postal_town", true) ||
    get("sublocality", true) ||
    get("administrative_area_level_2", true);
  return {
    street,
    city,
    region: get("administrative_area_level_1"),
    regionLong: get("administrative_area_level_1", true),
    postalCode: get("postal_code"),
    country: get("country"),
    countryLong: get("country", true),
  };
}

export default function AddressAutocomplete({
  value,
  onChange,
  onAddressSelected,
  countryRestrict,
  placeholder,
  className,
  id,
  name,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const acRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!GOOGLE_KEY) {
      setFailed(true);
      return;
    }
    let cancelled = false;
    loadGoogle()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !inputRef.current) return;
    const w = window as GoogleWindow;
    const options: Record<string, unknown> = {
      types: ["address"],
      fields: ["address_components", "formatted_address"],
    };
    if (countryRestrict && countryRestrict.length > 0) {
      options.componentRestrictions = { country: countryRestrict };
    }
    const ac = new w.google.maps.places.Autocomplete(inputRef.current, options);
    acRef.current = ac;
    const listener = ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      const parsed = parse(place);
      if (parsed.street) onChange(parsed.street);
      onAddressSelected?.(parsed);
    });
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (w.google as any)?.maps?.event?.removeListener?.(listener);
      acRef.current = null;
    };
    // countryRestrict is a stable string[]; re-binding on every render would leak listeners.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <input
      ref={inputRef}
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? (failed ? "123 Main Street" : "Start typing an address…")}
      autoComplete="off"
      className={className}
    />
  );
}
