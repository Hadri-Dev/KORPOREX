import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

// Server-side loader: for each incoming request, decide which locale's
// messages to send to the React tree. The locale comes from the URL via the
// next-intl middleware; we validate it against `routing.locales` and fall
// back to the default if a non-supported value sneaks in (e.g. a typo'd URL).
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
