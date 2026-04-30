import ContentPipelineClient from "./ContentPipelineClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ContentPipelinePage() {
  return <ContentPipelineClient />;
}
