import { Construction } from "lucide-react";

interface Props {
  title: string;
  description: string;
  phase: string;
  scope: string[];
  storageNote?: string;
}

export default function RoadmapPlaceholder({
  title,
  description,
  phase,
  scope,
  storageNote,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-navy-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-3">
          <Construction className="h-5 w-5 shrink-0 text-amber-600" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-amber-900">
              Reserved — scheduled for {phase}
            </p>
            <p className="mt-1 text-xs text-amber-800">
              This route is a placeholder so the sidebar reflects the full SEO Dashboard
              build-out from{" "}
              <a
                href="https://github.com/Hadri-Dev/KORPOREX/blob/main/roadmap.md"
                target="_blank"
                rel="noopener"
                className="underline hover:text-amber-900"
              >
                roadmap.md
              </a>
              . No functionality yet — replace this stub when the phase ships.
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-navy-900">Planned scope</h2>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
          {scope.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-gray-400">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        {storageNote ? (
          <p className="mt-4 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-600">
            <strong className="text-gray-900">Storage:</strong> {storageNote}
          </p>
        ) : null}
      </section>
    </div>
  );
}
