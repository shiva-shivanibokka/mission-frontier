import { SCHEDULE } from '../data/schedule'
import { itemsForWeek } from '../data/tracks'
import { PLAN_WEEKS, currentWeek, weekOf, weekRange } from '../data/meta'
import type { Store } from '../lib/store'
import { Card, SectionTitle } from './ui'

// Momentum: your LeetCode streak + active days, and a 13-week progress heatmap so
// you can see at a glance which weeks you crushed and which slipped. Each cell's
// fill = that week's completion (LeetCode solved + weekly items done).
export default function Momentum({ store }: { store: Store }) {
  const now = currentWeek()

  const weeks = Array.from({ length: PLAN_WEEKS }, (_, i) => {
    const w = i + 1
    const lc = SCHEDULE.filter((d) => weekOf(d.date) === w).flatMap((d) => d.problems)
    const lcDone = lc.filter((p) => store.isSolved(p.slug)).length
    const b = itemsForWeek(w)
    const ids = [...b.math, ...b.build, ...b.production, ...b.teasers, ...b.tests].map((x) => x.id)
    const wkDone = ids.filter((id) => store.isChecked(id)).length
    const total = lc.length + ids.length
    const done = lcDone + wkDone
    return { w, ratio: total ? done / total : 0, done, total }
  })

  return (
    <Card className="p-5">
      <SectionTitle icon="🔥" title="Momentum" />
      <div className="flex flex-wrap items-center gap-6">
        <div>
          <div className="font-display text-[30px] font-extrabold leading-none text-accent-coral">{store.profile.streak}</div>
          <div className="font-mono text-[13px] text-muted">day LeetCode streak 🔥</div>
        </div>
        <div>
          <div className="font-display text-[30px] font-extrabold leading-none text-accent-teal">{store.profile.totalActiveDays}</div>
          <div className="font-mono text-[13px] text-muted">active days (past year)</div>
        </div>
        <div className="ml-auto">
          <div className="mb-1.5 font-mono text-[13px] uppercase tracking-wide text-faint">13-week progress</div>
          <div className="flex gap-1.5">
            {weeks.map((wk) => {
              const alpha = 0.12 + wk.ratio * 0.85
              return (
                <div
                  key={wk.w}
                  title={`Week ${wk.w} · ${weekRange(wk.w)} · ${wk.done}/${wk.total} (${Math.round(wk.ratio * 100)}%)`}
                  className="grid h-9 w-9 place-items-center rounded-md font-mono text-[12px] font-bold transition"
                  style={{
                    background: `rgba(70,224,208,${alpha})`,
                    color: wk.ratio > 0.4 ? '#04121a' : '#9B98C8',
                    outline: wk.w === now ? '2px solid #f472b6' : 'none',
                    outlineOffset: '1px',
                  }}
                >
                  {wk.w}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
