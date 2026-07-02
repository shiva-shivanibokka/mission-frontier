import { lcScheduled, nonLcAssignments } from '../lib/pacing'
import { lcUrl } from '../data/leetcode'
import { todayISO } from '../data/meta'
import type { Store } from '../lib/store'
import { Card, SectionTitle, Checkbox, DiffPill } from './ui'

// Catch-up: everything scheduled BEFORE today that isn't done yet, so nothing
// silently slips. Hidden entirely when you're all caught up.
export default function CatchUp({ store }: { store: Store }) {
  const today = todayISO()
  const overdueLc = lcScheduled().filter((x) => x.date < today && !store.isSolved(x.slug!))
  const overdueOther = nonLcAssignments().filter((x) => x.date < today && !store.isChecked(x.id))
  const total = overdueLc.length + overdueOther.length

  if (total === 0) return null

  return (
    <Card className="border-accent-pink/30 p-5">
      <SectionTitle
        icon="⏳"
        title="Catch-up"
        right={<span className="rounded-full bg-accent-pink/15 px-3 py-1 font-mono text-[13.5px] font-bold text-accent-pink">{total} overdue</span>}
      />
      <p className="mb-3 font-mono text-[13.5px] text-faint">Scheduled before today and not done yet — clear these to get back on pace.</p>
      <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
        {overdueLc.map((x) => (
          <li key={x.id} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
            <span className="grid h-4 w-4 place-items-center rounded bg-white/8 text-[12px] text-faint">·</span>
            {x.difficulty && <DiffPill d={x.difficulty} />}
            <a href={lcUrl(x.slug!)} target="_blank" rel="noreferrer" className="text-[15px] font-semibold text-subtle hover:text-accent-teal hover:underline">
              {x.label}
            </a>
            <span className="ml-auto font-mono text-[12px] text-faint">{x.date.slice(5)}</span>
          </li>
        ))}
        {overdueOther.map((x) => (
          <li key={x.id} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
            <div className="pt-0.5"><Checkbox checked={false} onClick={() => store.toggle(x.id)} /></div>
            <div className="min-w-0 flex-1">
              <span className="text-[15px] font-semibold text-subtle">{x.label}</span>
              {x.res && x.res.length > 0 && (
                <span className="ml-2 inline-flex flex-wrap gap-x-2.5 gap-y-1">
                  {x.res.map((r) => (
                    <a key={r.url} href={r.url} target="_blank" rel="noreferrer" className="whitespace-nowrap font-mono text-[13px] font-bold text-accent-teal/90 hover:text-accent-teal hover:underline">
                      {r.label} ↗
                    </a>
                  ))}
                </span>
              )}
            </div>
            <span className="ml-auto shrink-0 rounded-full bg-white/6 px-2 py-0.5 font-mono text-[12px] font-bold text-faint">{x.tag}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
