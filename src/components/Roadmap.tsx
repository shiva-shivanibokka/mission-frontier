import { PHASES } from '../data/tracks'
import { todayISO } from '../data/meta'
import { Card, SectionTitle } from './ui'

// The three-phase overview. The phase whose window contains today is highlighted.
const PHASE_RANGES: [string, string][] = [
  ['2026-07-06', '2026-08-02'],
  ['2026-08-03', '2026-09-06'],
  ['2026-09-07', '2026-10-04'],
]

export default function Roadmap() {
  const today = todayISO()
  return (
    <Card className="p-5">
      <SectionTitle icon="🗺️" title="13-Week Roadmap" />
      <div className="grid gap-4 md:grid-cols-3">
        {PHASES.map((p, i) => {
          const active = today >= PHASE_RANGES[i][0] && today <= PHASE_RANGES[i][1]
          return (
            <div
              key={p.n}
              className="rounded-xl border p-4 transition"
              style={{
                borderColor: active ? `${p.color}88` : 'rgba(255,255,255,0.08)',
                background: active ? `${p.color}12` : 'rgba(255,255,255,0.02)',
                boxShadow: active ? `0 0 24px -8px ${p.color}` : 'none',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-md font-mono text-[12px] font-black" style={{ background: `${p.color}22`, color: p.color }}>
                  {p.n}
                </span>
                <span className="font-display text-[15px] font-extrabold text-ink">{p.title}</span>
                {active && <span className="ml-auto font-mono text-[10.5px] font-bold text-accent-teal">NOW</span>}
              </div>
              <div className="mt-1 font-mono text-[11.5px] text-faint">{p.range}</div>
              <p className="mt-2 text-[13px] leading-relaxed text-subtle">{p.focus}</p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
