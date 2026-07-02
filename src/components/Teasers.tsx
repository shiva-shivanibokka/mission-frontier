import { useState } from 'react'
import { TEASERS } from '../data/tracks'
import type { Store } from '../lib/store'
import { Card, SectionTitle, Checkbox } from './ui'

// Brain-teaser drills for the mentor round. Check one off when you can explain it
// out loud; click "hint" to reveal the answer.
export default function Teasers({ store }: { store: Store }) {
  const [shown, setShown] = useState<Record<string, boolean>>({})
  const done = TEASERS.filter((t) => store.isChecked(t.id)).length
  return (
    <Card className="flex h-full flex-col p-5">
      <SectionTitle icon="🧩" title="Brain Teasers" right={<span className="font-mono text-[12px] text-muted">{done}/{TEASERS.length}</span>} />
      <ul className="space-y-2">
        {TEASERS.map((t) => (
          <li key={t.id} className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2">
            <div className="flex items-start gap-2.5">
              <div className="pt-0.5"><Checkbox checked={store.isChecked(t.id)} onClick={() => store.toggle(t.id)} /></div>
              <span className={`text-[13px] font-medium leading-snug ${store.isChecked(t.id) ? 'text-faint' : 'text-subtle'}`}>{t.q}</span>
              <button onClick={() => setShown((s) => ({ ...s, [t.id]: !s[t.id] }))} className="ml-auto shrink-0 font-mono text-[11px] font-bold text-accent-violet hover:text-accent-teal">
                {shown[t.id] ? 'hide' : 'hint'}
              </button>
            </div>
            {shown[t.id] && <div className="ml-8 mt-1 font-mono text-[11.5px] text-accent-teal">{t.hint}</div>}
          </li>
        ))}
      </ul>
    </Card>
  )
}
