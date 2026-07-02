import { itemsForWeek } from '../data/tracks'
import { SCHEDULE } from '../data/schedule'
import { currentWeek, weekRange, weekOf, PLAN_WEEKS } from '../data/meta'
import type { Store } from '../lib/store'
import { Card, SectionTitle, Checkbox, ProgressBar } from './ui'

// The weekly quota — the counterpart to the daily LeetCode quota. Everything that
// isn't LeetCode is distributed across the 13 weeks; this panel shows exactly
// what's due THIS week across every track, each with a resource link to study
// from, plus this week's LeetCode target.
type Res = { label: string; url: string }
function Row({
  label,
  tag,
  res,
  checked,
  onToggle,
}: {
  label: string
  tag: string
  res?: Res[]
  checked: boolean
  onToggle: () => void
}) {
  return (
    <li className="flex items-start gap-2.5 rounded-lg px-1.5 py-1.5 hover:bg-white/[0.03]">
      <div className="pt-0.5"><Checkbox checked={checked} onClick={onToggle} /></div>
      <div className="min-w-0 flex-1">
        <span className={`text-[13px] font-semibold ${checked ? 'text-faint line-through' : 'text-subtle'}`}>{label}</span>
        {res && res.length > 0 && (
          <span className="ml-2 inline-flex flex-wrap gap-x-2.5 gap-y-1">
            {res.map((r) => (
              <a key={r.url} href={r.url} target="_blank" rel="noreferrer" className="whitespace-nowrap font-mono text-[11px] font-bold text-accent-teal/90 hover:text-accent-teal hover:underline">
                {r.label} ↗
              </a>
            ))}
          </span>
        )}
      </div>
      <span className="ml-auto shrink-0 rounded-full bg-white/6 px-2 py-0.5 font-mono text-[10px] font-bold text-faint">{tag}</span>
    </li>
  )
}

export default function ThisWeek({ store }: { store: Store }) {
  const week = currentWeek()
  const b = itemsForWeek(week)

  // this week's LeetCode target = scheduled problems whose day falls in this week
  const lcThisWeek = SCHEDULE.filter((d) => weekOf(d.date) === week).flatMap((d) => d.problems)
  const lcDone = lcThisWeek.filter((p) => store.isSolved(p.slug)).length

  const rows: { id: string; label: string; tag: string; res?: Res[]; checked: boolean; toggle: () => void }[] = [
    ...b.math.map((m) => ({ id: m.id, label: m.label, tag: 'Math', res: m.res, checked: store.isChecked(m.id), toggle: () => store.toggle(m.id) })),
    ...b.build.map((s) => ({ id: s.id, label: `${s.label}`, tag: 'Build', res: s.res, checked: store.isChecked(s.id), toggle: () => store.toggle(s.id) })),
    ...b.production.map((p) => ({ id: p.id, label: p.label, tag: 'Prod', res: p.res, checked: store.isChecked(p.id), toggle: () => store.toggle(p.id) })),
    ...b.teasers.map((t) => ({ id: t.id, label: t.q, tag: 'Teaser', res: [t.res], checked: store.isChecked(t.id), toggle: () => store.toggle(t.id) })),
    ...b.tests.map((t) => ({ id: t.id, label: `T${t.n} · ${t.title} (${t.minutes} min)`, tag: 'Test', res: undefined, checked: store.isChecked(t.id), toggle: () => store.toggle(t.id) })),
  ]
  const done = rows.filter((r) => r.checked).length

  return (
    <Card className="p-5">
      <SectionTitle
        icon="🗓️"
        title="This Week’s Quota"
        right={
          <span className="font-mono text-[12px] font-bold text-muted">
            Week {week}/{PLAN_WEEKS} · {weekRange(week)}
          </span>
        }
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[12px] font-bold text-accent-violet">LeetCode (daily · 3/day)</span>
            <span className="font-mono text-[12px] text-muted">{lcDone}/{lcThisWeek.length}</span>
          </div>
          <div className="mt-2"><ProgressBar value={lcDone} total={lcThisWeek.length} color="#a78bfa" /></div>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[12px] font-bold text-accent-teal">Everything else (weekly)</span>
            <span className="font-mono text-[12px] text-muted">{done}/{rows.length}</span>
          </div>
          <div className="mt-2"><ProgressBar value={done} total={rows.length} color="#46e0d0" /></div>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="py-3 text-center font-mono text-[13px] text-muted">No weekly items scheduled — focus on LeetCode + review.</p>
      ) : (
        <ul className="space-y-1">
          {rows.map((r) => (
            <Row key={r.id} label={r.label} tag={r.tag} res={r.res} checked={r.checked} onToggle={r.toggle} />
          ))}
        </ul>
      )}
    </Card>
  )
}
