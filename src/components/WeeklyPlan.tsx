import { useState } from 'react'
import { itemsForWeek, PHASES } from '../data/tracks'
import { SCHEDULE } from '../data/schedule'
import { PLAN_WEEKS, currentWeek, weekOf, weekRange } from '../data/meta'
import { lcUrl } from '../data/leetcode'
import type { Store } from '../lib/store'
import { nonLcItemsForWeek } from '../lib/pacing'
import { Card, SectionTitle, Checkbox, ProgressBar, DiffPill } from './ui'

// Interactive 14-week planner (replaces the old static phase box). Click any week
// to see exactly what's assigned that week — its LeetCode target plus the weekly
// math / build / production / teaser / test items, each with a resource link.
const phaseOf = (w: number): 1 | 2 | 3 => (w <= 4 ? 1 : w <= 9 ? 2 : 3)

export default function WeeklyPlan({ store }: { store: Store }) {
  const now = currentWeek()
  const [sel, setSel] = useState(now)

  const weekStats = (w: number) => {
    const lc = SCHEDULE.filter((d) => weekOf(d.date) === w).flatMap((d) => d.problems)
    const lcDone = lc.filter((p) => store.isSolved(p.slug)).length
    const b = itemsForWeek(w)
    const ids = [...b.math, ...b.build, ...b.production, ...b.teasers, ...b.tests].map((x) => x.id)
    const wkDone = ids.filter((id) => store.isChecked(id)).length
    const total = lc.length + ids.length
    return { lc, lcDone, ratio: total ? (lcDone + wkDone) / total : 0 }
  }

  const selPhase = PHASES[phaseOf(sel) - 1]
  const { lc, lcDone } = weekStats(sel)

  const rows = nonLcItemsForWeek(sel).map((it) => ({
    ...it,
    checked: store.isChecked(it.id),
    toggle: () => store.toggle(it.id),
  }))

  return (
    <Card className="p-5">
      <SectionTitle icon="🗺️" title="Plan by Week" right={<span className="font-mono text-[13.5px] text-muted">{PLAN_WEEKS} weeks · click a week</span>} />

      {/* phase legend */}
      <div className="mb-3 flex flex-wrap gap-2">
        {PHASES.map((p) => (
          <span key={p.n} className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[13px] font-bold" style={{ color: p.color, borderColor: `${p.color}55`, background: `${p.color}12` }}>
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            P{p.n} {p.title} · {p.range.split(' · ')[0]}
          </span>
        ))}
      </div>

      {/* week selector */}
      <div className="mb-4 grid grid-cols-7 gap-1.5 sm:grid-cols-14">
        {Array.from({ length: PLAN_WEEKS }, (_, i) => i + 1).map((w) => {
          const c = PHASES[phaseOf(w) - 1].color
          const { ratio } = weekStats(w)
          const active = w === sel
          return (
            <button
              key={w}
              onClick={() => setSel(w)}
              title={`Week ${w} · ${weekRange(w)}`}
              className="relative rounded-lg border px-0 py-2 font-mono text-[13.5px] font-bold transition"
              style={{
                borderColor: active ? c : `${c}44`,
                background: active ? `${c}28` : `${c}0d`,
                color: active ? '#fff' : c,
                outline: w === now ? '2px solid #f472b6' : 'none',
                outlineOffset: '1px',
              }}
            >
              {w}
              <span className="absolute inset-x-1 bottom-1 h-[3px] overflow-hidden rounded-full bg-white/10">
                <span className="block h-full rounded-full" style={{ width: `${ratio * 100}%`, background: c }} />
              </span>
            </button>
          )
        })}
      </div>

      {/* selected-week detail */}
      <div className="rounded-xl border p-4" style={{ borderColor: `${selPhase.color}44`, background: `${selPhase.color}0a` }}>
        <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-display text-[16px] font-extrabold text-ink">Week {sel} {sel === now && <span className="ml-1 font-mono text-[13px] text-accent-pink">· now</span>}</span>
          <span className="font-mono text-[13.5px] text-muted">{weekRange(sel)} · Phase {selPhase.n} · {selPhase.title}</span>
        </div>
        <p className="mb-3 text-[14px] leading-relaxed text-subtle">{selPhase.focus}</p>

        {/* LeetCode target */}
        <div className="mb-3 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[13.5px] font-bold text-accent-violet">LeetCode this week (3/day)</span>
            <span className="font-mono text-[13.5px] text-muted">{lcDone}/{lc.length} solved</span>
          </div>
          <div className="mt-2"><ProgressBar value={lcDone} total={lc.length} color="#a78bfa" /></div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {lc.map((p) => (
              <a key={p.slug} href={lcUrl(p.slug)} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1 text-[13.5px] ${store.isSolved(p.slug) ? 'text-faint line-through' : 'text-subtle hover:text-accent-teal hover:underline'}`}>
                <DiffPill d={p.difficulty} /> {p.title}
              </a>
            ))}
          </div>
        </div>

        {/* weekly items */}
        {rows.length === 0 ? (
          <p className="py-2 text-center font-mono text-[14px] text-muted">No weekly items — focus on LeetCode + review.</p>
        ) : (
          <ul className="space-y-1">
            {rows.map((r) => (
              <li key={r.id} className="flex items-start gap-2.5 rounded-lg px-1.5 py-1.5 hover:bg-white/[0.03]">
                <div className="pt-0.5"><Checkbox checked={r.checked} onClick={r.toggle} /></div>
                <div className="min-w-0 flex-1">
                  <span className={`text-[14.5px] font-semibold ${r.checked ? 'text-faint line-through' : 'text-subtle'}`}>{r.label}</span>
                  {r.res && r.res.length > 0 && (
                    <span className="ml-2 inline-flex flex-wrap gap-x-2.5 gap-y-1">
                      {r.res.map((x) => (
                        <a key={x.url} href={x.url} target="_blank" rel="noreferrer" className="whitespace-nowrap font-mono text-[13px] font-bold text-accent-teal/90 hover:text-accent-teal hover:underline">
                          {x.label} ↗
                        </a>
                      ))}
                    </span>
                  )}
                </div>
                <span className="ml-auto shrink-0 rounded-full bg-white/6 px-2 py-0.5 font-mono text-[12px] font-bold text-faint">{r.tag}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}
