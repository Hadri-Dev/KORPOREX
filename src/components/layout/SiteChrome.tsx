"use client";

// usePathname comes from `@/i18n/navigation` so the returned path is locale-
// stripped (e.g. `/en/soon` → `/soon`). This lets us match against the
// canonical /soon prefix regardless of which language the visitor is on.
import { usePathname } from "@/i18n/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const STANDALONE_PREFIXES = ["/soon"];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandalone = STANDALONE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isStandalone) {
    return <main>{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">{children}</main>
      <Footer />
    </>
  );
}
