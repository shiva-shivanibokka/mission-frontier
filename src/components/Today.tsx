import { dayForDate } from '../data/schedule'
import { lcUrl } from '../data/leetcode'
import { todayISO, prettyDate, DAILY_QUOTA } from '../data/meta'
import type { Store } from '../lib/store'
import { Card, SectionTitle, DiffPill } from './ui'

// Today's quota: the DAILY_QUOTA scheduled problems for the current date. Each
// auto-checks when the LeetCode sync sees you solved it; the quota badge fills
// itself in. There's nothing to click — solving on LeetCode is the action.
export default function Today({ store }: { store: Store }) {
  const today = todayISO()
  const day = dayForDate(today)
  const done = day.problems.filter((p) => store.isSolved(p.slug)).length
  const complete = done >= Math.min(DAILY_QUOTA, day.problems.length)

  return (
    <Card className="p-5">
      <SectionTitle
        icon="🎯"
        title="Today’s Quota"
        right={
          <span
            className={`rounded-full px-3 py-1 font-mono text-[12px] font-bold ${
              complete ? 'bg-accent-teal/20 text-accent-teal' : 'bg-white/8 text-muted'
            }`}
          >
            {done}/{day.problems.length} {complete ? '· done 🎉' : 'solved'}
          </span>
        }
      />
      <p className="mb-3 font-mono text-[12px] text-faint">
        Day {day.index} · {prettyDate(day.date)} · pattern: {day.problems[0]?.pattern}
        {day.date !== today && ' · (most recent study day)'}
      </p>
      <ul className="space-y-2">
        {day.problems.map((p) => {
          const solved = store.isSolved(p.slug)
          return (
            <li
              key={p.slug}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                solved ? 'border-accent-teal/40 bg-accent-teal/10' : 'border-white/8 bg-white/[0.03]'
              }`}
            >
              <span className={`grid h-5 w-5 place-items-center rounded-md text-[12px] font-black ${solved ? 'bg-accent-teal/25 text-accent-teal' : 'bg-white/8 text-faint'}`}>
                {solved ? '✓' : '·'}
              </span>
              <DiffPill d={p.difficulty} />
              <a href={lcUrl(p.slug)} target="_blank" rel="noreferrer" className="text-[14.5px] font-bold text-ink hover:text-accent-teal hover:underline">
                {p.title}
              </a>
              {solved && <span className="ml-auto font-mono text-[11px] text-accent-teal">solved ✓</span>}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
