import type { Locale } from "@/i18n/routing";

// Server-rendered copy shown under a service's order form. The forms are client
// wizards with almost no crawlable text, so this block carries the page's
// service intent and its FAQ (also emitted as FAQPage structured data).
export type ServiceInline = string | { text: string; href: string };

export type ServiceBlock =
  | { type: "h3"; text: string }
  | { type: "p"; parts: ServiceInline[] }
  | { type: "list"; items: string[] };

export type ServiceContent = {
  title: string;
  blocks: ServiceBlock[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  disclaimer: string;
};

export type ServiceContentByLocale = Record<Locale, ServiceContent>;
