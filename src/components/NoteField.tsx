import { useState } from 'react'
import type { Store } from '../lib/store'

// A compact, toggleable note attached to any item id (persisted via the store,
// synced with your check-offs). A dot on the button shows a note already exists.
export default function NoteField({ store, id }: { store: Store; id: string }) {
  const [open, setOpen] = useState(false)
  const note = store.getNote(id)
  return (
    <div className="mt-1">
      <button onClick={() => setOpen((o) => !o)} className="font-mono text-[12.5px] font-bold text-accent-violet transition hover:text-accent-teal">
        {note ? '✎ note •' : '✎ note'}
      </button>
      {open && (
        <textarea
          value={note}
          onChange={(e) => store.setNote(id, e.target.value)}
          rows={2}
          placeholder="notes…"
          className="mt-1 w-full resize-y rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-[13.5px] text-ink outline-none placeholder:text-faint focus:border-accent-teal/60"
        />
      )}
    </div>
  )
}
