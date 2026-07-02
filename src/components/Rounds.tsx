import { ROUNDS } from '../data/tracks'
import type { Store } from '../lib/store'
import { Card, SectionTitle, Checkbox } from './ui'
import NoteField from './NoteField'

// Interview-round readiness: the actual OpenAI Residency loop, each with what it
// is and how to prep. Check one off when you feel ready for it.
export default function Rounds({ store }: { store: Store }) {
  const done = ROUNDS.filter((r) => store.isChecked(r.id)).length
  return (
    <Card className="p-5">
      <SectionTitle icon="🎤" title="Interview Rounds" right={<span className="font-mono text-[12px] text-muted">{done}/{ROUNDS.length} ready</span>} />
      <ol className="relative space-y-2 border-l border-white/10 pl-5">
        {ROUNDS.map((r) => (
          <li key={r.id} className="relative">
            <span className="absolute -left-[27px] top-1.5 grid h-4 w-4 place-items-center rounded-full border border-white/20 bg-canvas text-[9px]">
              {store.isChecked(r.id) ? '✓' : ''}
            </span>
            <div className="flex items-start gap-2.5 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5">
              <div className="pt-0.5"><Checkbox checked={store.isChecked(r.id)} onClick={() => store.toggle(r.id)} /></div>
              <div>
                <div className="text-[14px] font-bold text-ink">{r.title}</div>
                <div className="text-[12.5px] text-muted">{r.detail}</div>
                <div className="mt-1 font-mono text-[11.5px] text-accent-violet">Prep: <span className="text-subtle">{r.prep}</span></div>
                <NoteField store={store} id={r.id} />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  )
}
