import SeoPageShell from "@/components/dashboard/seo/SeoPageShell";

export const dynamic = "force-static";

export default function CompetitorsPage() {
  return (
    <SeoPageShell
      datasetKey="competitors"
      title="Competitors"
      description="Domains you benchmark against — DR, traffic, top keywords, content gaps."
      helperText="Typical columns: Domain, DR, Monthly traffic, Referring domains, Top keywords, Notes."
    />
  );
}
