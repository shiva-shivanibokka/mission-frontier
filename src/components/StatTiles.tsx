import { Card, ProgressBar } from './ui'

// Four headline progress tiles across the top of the body.
export interface Metric {
  label: string
  value: number
  total: number
  sub: string
  color: string
}

export default function StatTiles({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {metrics.map((m) => (
        <Card key={m.label} className="p-4">
          <div className="font-mono text-[13px] uppercase tracking-wide text-muted">{m.label}</div>
          <div className="mt-1.5 font-display text-[30px] font-extrabold text-ink">
            {m.value}
            {m.total > 0 && <span className="ml-1 text-[16px] font-bold text-faint">/ {m.total}</span>}
          </div>
          <div className="mb-2.5 font-mono text-[13px] text-faint">{m.sub}</div>
          {m.total > 0 && <ProgressBar value={m.value} total={m.total} color={m.color} />}
        </Card>
      ))}
    </div>
  )
}
