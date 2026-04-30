import CompetitorDetailClient from "./CompetitorDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CompetitorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CompetitorDetailClient id={id} />;
}
