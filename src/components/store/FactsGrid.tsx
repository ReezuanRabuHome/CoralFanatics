export function FactsGrid({ facts }: { facts: [string, string][] }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-pearl-300 bg-pearl-300 sm:grid-cols-3">
      {facts.map(([k, v]) => (
        <div key={k} className="bg-pearl-50 px-4 py-3">
          <dt className="text-xs text-ink-600">{k}</dt>
          <dd className="mt-0.5 text-[15px] font-semibold">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function FulfilmentSummary({ lines, livestock }: { lines: string[]; livestock: boolean }) {
  return (
    <ul className="space-y-2 rounded-xl bg-pearl-200/60 p-4 text-sm text-ink-600">
      {lines.map((l) => (
        <li key={l} className="flex gap-2"><span aria-hidden className="text-ink-900">·</span>{l}</li>
      ))}
      {livestock && (
        <li className="flex gap-2"><span aria-hidden className="text-ink-900">·</span>
          <a href="/policies/livestock" className="font-medium text-ink-900 underline underline-offset-4">Livestock policy</a>
        </li>
      )}
    </ul>
  );
}
