import SeoPageShell from "@/components/dashboard/seo/SeoPageShell";

export const dynamic = "force-static";

export default function LinkBuildingPage() {
  return (
    <SeoPageShell
      datasetKey="link-building"
      title="Link Building"
      description="Track outreach campaigns, prospects, and earned links."
      helperText="Typical columns: Target URL, Contact, Status, DR, Anchor, Earned URL, Notes."
      emptyHint="Import a CSV of your outreach pipeline (any columns). Updates persist in this browser only."
    />
  );
}
