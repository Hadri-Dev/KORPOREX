import SeoPageShell from "@/components/dashboard/seo/SeoPageShell";

export const dynamic = "force-static";

export default function RankingsPage() {
  return (
    <SeoPageShell
      datasetKey="rankings"
      title="Rankings"
      description="Keyword positions tracked over time."
      helperText="Typical Ahrefs Keyword Tracker columns: Keyword, Position, URL, Search volume, Keyword difficulty, Last update."
    />
  );
}
