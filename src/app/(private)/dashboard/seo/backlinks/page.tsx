import SeoPageShell from "@/components/dashboard/seo/SeoPageShell";

export const dynamic = "force-static";

export default function BacklinksPage() {
  return (
    <SeoPageShell
      datasetKey="backlinks"
      title="Backlinks"
      description="Inbound links earned, typically imported from Ahrefs / SEMrush exports."
      helperText="Typical Ahrefs columns: Referring page URL, Domain rating, URL rating, Anchor, Target URL, First seen, Last seen."
    />
  );
}
