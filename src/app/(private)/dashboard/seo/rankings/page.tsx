import RankingsClient from "./RankingsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function RankingsPage() {
  return <RankingsClient />;
}
