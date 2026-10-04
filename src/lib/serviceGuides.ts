import {
  articles,
  isPublished,
  type Article,
  type Locale,
} from "@/app/[locale]/guides/articles";

// Guide article groups shown under each money page, most relevant first. Service
// pages are order forms with little crawlable copy, so these links are what let
// the guides pass relevance to the page that converts (and let crawlers reach
// the guides from the services). Keyed by the locale-less path. A group missing
// in a locale, or scheduled for the future, is skipped.
export const SERVICE_GUIDES: Record<string, string[]> = {
  "/incorporate": ["incorporate-business-canada", "incorporating-ontario", "cost-to-incorporate-ontario", "incorporate-canada"],
  "/nuans": ["nuans-name-search", "nuans-by-province", "read-nuans-report", "name-rejected"],
  "/services/amalgamation": ["holding-company", "minute-book", "articles-of-incorporation"],
  "/services/annual-resolution-federal": ["minute-book", "annual-returns", "salary-vs-dividends"],
  "/services/annual-resolution-on": ["minute-book", "annual-returns", "salary-vs-dividends"],
  "/services/annual-return-federal": ["annual-returns", "minute-book", "dissolve-corporation-ontario"],
  "/services/annual-return-on": ["annual-returns", "minute-book", "incorporating-ontario"],
  "/services/articles-amendment": ["articles-of-incorporation", "named-vs-numbered", "name-rejected"],
  "/services/business-name": ["register-business-ontario", "register-sole-proprietorship-ontario", "sole-prop-vs-corp"],
  "/services/business-number": ["cra-business-number", "business-vs-corporation-number", "gst-hst-ontario"],
  "/services/change-address": ["annual-returns", "minute-book", "incorporating-ontario"],
  "/services/change-director": ["minute-book", "annual-returns", "shareholder-agreements"],
  "/services/change-name": ["named-vs-numbered", "nuans-name-search", "name-rejected"],
  "/services/change-shareholder": ["shareholder-agreements", "minute-book", "holding-company"],
  "/services/continuance": ["incorporate-canada", "articles-of-incorporation", "minute-book"],
  "/services/dissolve-business": ["dissolve-corporation-ontario", "annual-returns", "minute-book"],
  "/services/extra-provincial": ["incorporate-canada", "register-business-ontario", "nuans-by-province"],
  "/services/initial-minute-book": ["minute-book", "articles-of-incorporation", "shareholder-agreements"],
  "/services/initial-return-on": ["incorporating-ontario", "annual-returns", "minute-book"],
  "/services/notice-of-change": ["annual-returns", "minute-book", "incorporate-canada"],
  "/services/registered-office": ["incorporating-ontario", "annual-returns", "incorporate-business-canada"],
  "/services/revive-business": ["dissolve-corporation-ontario", "annual-returns", "minute-book"],
  "/services/sole-proprietorship": ["register-sole-proprietorship-ontario", "sole-prop-vs-corp", "register-business-ontario"],
};

// Published guides for a service page in the visitor's locale, in map order.
export function getServiceGuides(locale: Locale, path: string): Article[] {
  const groups = SERVICE_GUIDES[path] ?? [];
  const out: Article[] = [];
  for (const group of groups) {
    const a = articles.find((x) => x.group === group && x.locale === locale);
    if (a && isPublished(a)) out.push(a);
  }
  return out;
}
