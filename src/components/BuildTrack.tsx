import { useState } from 'react'
import { BUILD } from '../data/tracks'
import type { Store } from '../lib/store'
import { Card, SectionTitle, ProgressBar, Checkbox, Pill } from './ui'

const KIND_COLOR: Record<string, string> = { flagship: '#818cf8', reproduction: '#46e0d0', original: '#f472b6' }

// The from-scratch build track: three milestones (autograd+optimizers flagship,
// GPT reproduction, original grokking study), each with checkable steps + papers.
export default function BuildTrack({ store }: { store: Store }) {
  const [openNote, setOpenNote] = useState<Record<string, boolean>>({})
  const allSteps = BUILD.flatMap((m) => m.steps)
  const done = allSteps.filter((s) => store.isChecked(s.id)).length
  return (
    <Card className="p-5">
      <SectionTitle icon="🛠️" title="Build From Scratch" right={<span className="font-mono text-[13.5px] text-muted">{done}/{allSteps.length} steps</span>} />
      <div className="grid gap-4 lg:grid-cols-3">
        {BUILD.map((m) => {
          const c = KIND_COLOR[m.kind]
          const mDone = m.steps.filter((s) => store.isChecked(s.id)).length
          return (
            <div key={m.id} className="flex flex-col rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <div className="mb-1 flex items-center gap-2">
                <span className="font-display text-[16px] font-extrabold text-ink">{m.title}</span>
              </div>
              <div className="mb-2.5 flex items-center gap-2">
                <Pill color={c}>{m.kind}</Pill>
                <Pill color={c}>Phase {m.phase}</Pill>
                <span className="ml-auto font-mono text-[13px] text-muted">{mDone}/{m.steps.length}</span>
              </div>
              <div className="mb-3"><ProgressBar value={mDone} total={m.steps.length} color={c} /></div>
              <ul className="space-y-2">
                {m.steps.map((s) => (
                  <li key={s.id} className="flex items-start gap-2.5">
                    <div className="pt-0.5"><Checkbox checked={store.isChecked(s.id)} onClick={() => store.toggle(s.id)} /></div>
                    <div className="min-w-0">
                      <span className={`text-[14px] font-medium leading-snug ${store.isChecked(s.id) ? 'text-faint line-through' : 'text-subtle'}`}>{s.label}</span>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        {s.week && <span className="font-mono text-[12px] font-bold text-faint">wk {s.week}</span>}
                        {s.res?.map((r) => (
                          <a key={r.url} href={r.url} target="_blank" rel="noreferrer" className="font-mono text-[12.5px] font-bold text-accent-teal/90 hover:text-accent-teal hover:underline">
                            {r.label} ↗
                          </a>
                        ))}
                        <button
                          onClick={() => setOpenNote((o) => ({ ...o, [s.id]: !o[s.id] }))}
                          className="font-mono text-[12.5px] font-bold text-accent-violet hover:text-accent-teal"
                        >
                          {store.getNote(s.id) ? '✎ note•' : '✎ note'}
                        </button>
                      </div>
                      {openNote[s.id] && (
                        <textarea
                          value={store.getNote(s.id)}
                          onChange={(e) => store.setNote(s.id, e.target.value)}
                          placeholder="findings, results, gotchas…"
                          rows={2}
                          className="mt-1.5 w-full resize-y rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-[13.5px] text-ink outline-none placeholder:text-faint focus:border-accent-teal/60"
                        />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
