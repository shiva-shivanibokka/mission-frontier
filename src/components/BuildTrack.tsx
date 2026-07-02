import { BUILD } from '../data/tracks'
import type { Store } from '../lib/store'
import { Card, SectionTitle, ProgressBar, Checkbox, Pill } from './ui'

const KIND_COLOR: Record<string, string> = { flagship: '#818cf8', reproduction: '#46e0d0', original: '#f472b6' }

// The from-scratch build track: three milestones (autograd+optimizers flagship,
// GPT reproduction, original grokking study), each with checkable steps + papers.
export default function BuildTrack({ store }: { store: Store }) {
  const allSteps = BUILD.flatMap((m) => m.steps)
  const done = allSteps.filter((s) => store.isChecked(s.id)).length
  return (
    <Card className="p-5">
      <SectionTitle icon="🛠️" title="Build From Scratch" right={<span className="font-mono text-[12px] text-muted">{done}/{allSteps.length} steps</span>} />
      <div className="grid gap-4 lg:grid-cols-3">
        {BUILD.map((m) => {
          const c = KIND_COLOR[m.kind]
          const mDone = m.steps.filter((s) => store.isChecked(s.id)).length
          return (
            <div key={m.id} className="flex flex-col rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <div className="mb-1 flex items-center gap-2">
                <span className="font-display text-[15px] font-extrabold text-ink">{m.title}</span>
              </div>
              <div className="mb-2.5 flex items-center gap-2">
                <Pill color={c}>{m.kind}</Pill>
                <Pill color={c}>Phase {m.phase}</Pill>
                <span className="ml-auto font-mono text-[11.5px] text-muted">{mDone}/{m.steps.length}</span>
              </div>
              <div className="mb-3"><ProgressBar value={mDone} total={m.steps.length} color={c} /></div>
              <ul className="space-y-1.5">
                {m.steps.map((s) => (
                  <li key={s.id} className="flex items-start gap-2.5">
                    <div className="pt-0.5"><Checkbox checked={store.isChecked(s.id)} onClick={() => store.toggle(s.id)} /></div>
                    <span className={`text-[12.5px] font-medium leading-snug ${store.isChecked(s.id) ? 'text-faint line-through' : 'text-subtle'}`}>{s.label}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-1.5 border-t border-white/8 pt-3">
                {m.resources.map((r) => (
                  <a key={r.url} href={r.url} target="_blank" rel="noreferrer" className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] font-semibold text-subtle transition hover:border-accent-teal/50 hover:text-accent-teal">
                    {r.label} ↗
                  </a>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
