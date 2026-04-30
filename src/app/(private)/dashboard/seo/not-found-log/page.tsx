import { isSupabaseConfigured } from "@/lib/supabase";
import RoadmapPlaceholder from "@/components/dashboard/seo/RoadmapPlaceholder";
import NotFoundLogClient from "./NotFoundLogClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function NotFoundLogPage() {
  if (!isSupabaseConfigured()) {
    return (
      <RoadmapPlaceholder
        title="404 Log"
        description="Auto-tracked log of 404 hits from real visitors. Currently unconfigured — set the Supabase env vars in Vercel to enable."
        phase="Phase 2 (storage unconfigured)"
        scope={[
          "Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY in Vercel for Production + Preview + Development.",
          "Apply supabase/migrations/0001_not_found_log.sql in the Supabase SQL Editor.",
          "Redeploy. The beacon in /[locale]/not-found.tsx will then start capturing 404s.",
        ]}
        storageNote="The capture path, schema, and admin UI are all built — only the env vars + SQL apply are missing."
      />
    );
  }
  return <NotFoundLogClient />;
}
