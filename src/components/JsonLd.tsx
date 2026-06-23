// Server component that emits a JSON-LD <script> block. Accepts one schema
// object or an array of them. Rendered inside page bodies so the structured
// data ships in the initial HTML for crawlers.
export default function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(Array.isArray(data) ? data : [data]);
  return (
    <script
      type="application/ld+json"
      // Schema is built from trusted, static server data — no user input.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
