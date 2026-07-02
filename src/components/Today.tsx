import { dayForDate, SCHEDULE } from '../data/schedule'
import { itemsForWeek } from '../data/tracks'
import { lcUrl } from '../data/leetcode'
import { todayISO, prettyDate, weekOf, DAILY_QUOTA } from '../data/meta'
import type { Store } from '../lib/store'
import { Card, SectionTitle, DiffPill, Checkbox } from './ui'

type Res = { label: string; url: string }

// Today's quota across every track. LeetCode is a true daily quota (3/day).
// Everything else is assigned weekly, so we PACE the week's items evenly across
// its study days and show just today's slice here — a realistic "do this today".
export default function Today({ store }: { store: Store }) {
  const today = todayISO()
  const day = dayForDate(today)
  const week = weekOf(day.date)

  const lcDone = day.problems.filter((p) => store.isSolved(p.slug)).length
  const lcComplete = lcDone >= Math.min(DAILY_QUOTA, day.problems.length)

  // pace this week's non-LeetCode items across the week's study days
  const weekDays = SCHEDULE.filter((d) => weekOf(d.date) === week)
  const len = weekDays.length || 1
  const pos = Math.max(0, weekDays.findIndex((d) => d.date === day.date))
  const b = itemsForWeek(week)
  const nonLC: { id: string; label: string; tag: string; res?: Res[] }[] = [
    ...b.math.map((m) => ({ id: m.id, label: m.label, tag: 'Math', res: m.res })),
    ...b.build.map((s) => ({ id: s.id, label: s.label, tag: 'Build', res: s.res })),
    ...b.production.map((p) => ({ id: p.id, label: p.label, tag: 'Prod', res: p.res })),
    ...b.teasers.map((t) => ({ id: t.id, label: t.q, tag: 'Teaser', res: [t.res] })),
    ...b.tests.map((t) => ({ id: t.id, label: `T${t.n} · ${t.title} (${t.minutes} min)`, tag: 'Test' })),
  ]
  const todayItems = nonLC.filter((_, i) => i % len === pos)
  const otherDone = todayItems.filter((x) => store.isChecked(x.id)).length
  const allDone = lcComplete && otherDone >= todayItems.length

  return (
    <Card className="p-5">
      <SectionTitle
        icon="🎯"
        title="Today’s Quota"
        right={
          <span className={`rounded-full px-3 py-1 font-mono text-[13.5px] font-bold ${allDone ? 'bg-accent-teal/20 text-accent-teal' : 'bg-white/8 text-muted'}`}>
            LC {lcDone}/{day.problems.length} · rest {otherDone}/{todayItems.length}{allDone ? ' · done 🎉' : ''}
          </span>
        }
      />
      <p className="mb-3 font-mono text-[13.5px] text-faint">
        Day {day.index} · {prettyDate(day.date)} · Week {week}
        {day.date !== today && ' · (most recent study day)'}
      </p>

      {/* daily LeetCode */}
      <div className="mb-1.5 font-mono text-[13px] font-bold uppercase tracking-wide text-accent-violet">LeetCode · 3/day</div>
      <ul className="space-y-2">
        {day.problems.map((p) => {
          const solved = store.isSolved(p.slug)
          return (
            <li key={p.slug} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition ${solved ? 'border-accent-teal/40 bg-accent-teal/10' : 'border-white/8 bg-white/[0.03]'}`}>
              <span className={`grid h-5 w-5 place-items-center rounded-md text-[13.5px] font-black ${solved ? 'bg-accent-teal/25 text-accent-teal' : 'bg-white/8 text-faint'}`}>{solved ? '✓' : '·'}</span>
              <DiffPill d={p.difficulty} />
              <a href={lcUrl(p.slug)} target="_blank" rel="noreferrer" className="text-[16px] font-bold text-ink hover:text-accent-teal hover:underline">{p.title}</a>
              {solved && <span className="ml-auto font-mono text-[13px] text-accent-teal">solved ✓</span>}
            </li>
          )
        })}
      </ul>

      {/* today's paced non-LeetCode slice */}
      <div className="mt-4 mb-1.5 font-mono text-[13px] font-bold uppercase tracking-wide text-accent-teal">Also today · math &amp; the rest (this week, paced)</div>
      {todayItems.length === 0 ? (
        <p className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5 font-mono text-[14px] text-muted">Nothing else scheduled today — get ahead on this week’s plan below.</p>
      ) : (
        <ul className="space-y-2">
          {todayItems.map((x) => {
            const done = store.isChecked(x.id)
            return (
              <li key={x.id} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                <div className="pt-0.5"><Checkbox checked={done} onClick={() => store.toggle(x.id)} /></div>
                <div className="min-w-0 flex-1">
                  <span className={`text-[15px] font-semibold ${done ? 'text-faint line-through' : 'text-subtle'}`}>{x.label}</span>
                  {x.res && x.res.length > 0 && (
                    <span className="ml-2 inline-flex flex-wrap gap-x-2.5 gap-y-1">
                      {x.res.map((r) => (
                        <a key={r.url} href={r.url} target="_blank" rel="noreferrer" className="whitespace-nowrap font-mono text-[13px] font-bold text-accent-teal/90 hover:text-accent-teal hover:underline">{r.label} ↗</a>
                      ))}
                    </span>
                  )}
                </div>
                <span className="ml-auto shrink-0 rounded-full bg-white/6 px-2 py-0.5 font-mono text-[12px] font-bold text-faint">{x.tag}</span>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
