import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware drop-in replacements for next/link, next/navigation. Use
// these everywhere the app links between pages — they automatically prefix
// the current locale (or a passed-in locale, for the language switcher).
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
