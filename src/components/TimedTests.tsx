import { TESTS } from '../data/tracks'
import { todayISO, prettyDate } from '../data/meta'
import type { Store } from '../lib/store'
import { Card, SectionTitle, Checkbox, Pill } from './ui'

// The 12 timed tests. Each has a target date and a time limit so you rehearse
// working under the real interview clock. Check one off once you've passed it in
// time. Overdue-but-unpassed tests are flagged.
export default function TimedTests({ store }: { store: Store }) {
  const today = todayISO()
  const done = TESTS.filter((t) => store.isChecked(t.id)).length
  return (
    <Card className="p-5">
      <SectionTitle icon="⏱️" title="Timed Tests" right={<span className="font-mono text-[13.5px] text-muted">{done}/{TESTS.length} passed</span>} />
      <p className="mb-3 text-[14px] text-muted">Rehearse under the real clock — check one off only when you finish inside the limit.</p>
      <div className="grid gap-2 md:grid-cols-2">
        {TESTS.map((t) => {
          const passed = store.isChecked(t.id)
          const overdue = !passed && t.date < today
          return (
            <div key={t.id} className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 ${passed ? 'border-accent-teal/40 bg-accent-teal/10' : overdue ? 'border-accent-coral/40 bg-accent-coral/10' : 'border-white/8 bg-white/[0.02]'}`}>
              <div className="pt-0.5"><Checkbox checked={passed} onClick={() => store.toggle(t.id)} /></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[13px] font-bold text-faint">T{t.n}</span>
                  <span className={`text-[15px] font-bold ${passed ? 'text-faint line-through' : 'text-ink'}`}>{t.title}</span>
                </div>
                <div className="mt-0.5 text-[13.5px] leading-snug text-muted">{t.detail}</div>
                <div className="mt-1.5 flex items-center gap-2">
                  <Pill color="#fbbf24">{t.minutes} min</Pill>
                  <span className={`font-mono text-[13px] ${overdue ? 'text-accent-coral' : 'text-faint'}`}>{prettyDate(t.date)}{overdue ? ' · overdue' : ''}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
