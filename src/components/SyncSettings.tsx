import { useState } from 'react'
import { getToken, setToken, verifyToken } from '../lib/github'
import type { Store } from '../lib/store'

// Optional: paste a fine-grained GitHub PAT (Contents: read/write on
// mission-frontier) to persist your manual check-offs across devices. Stored only
// in this browser. Without it, progress still works — it just lives locally.
export default function SyncSettings({ store }: { store: Store }) {
  const [open, setOpen] = useState(false)
  const [val, setVal] = useState(getToken())
  const [msg, setMsg] = useState('')

  const save = async () => {
    setMsg('Checking…')
    const res = await verifyToken(val)
    setMsg(res.message)
    if (res.ok) {
      setToken(val)
      store.syncNow()
    }
  }

  const label =
    store.syncState === 'saving' ? 'saving…' : store.syncState === 'saved' ? 'saved ✓' : store.syncState === 'error' ? 'sync error' : store.syncState === 'off' ? 'local only' : 'idle'

  return (
    <div className="text-right">
      <button onClick={() => setOpen((o) => !o)} className="font-mono text-[11.5px] text-faint hover:text-subtle">
        ⚙ sync: {label}{store.dirtyCount > 0 ? ` · ${store.dirtyCount} unsaved` : ''}
      </button>
      {open && (
        <div className="mt-2 w-[320px] rounded-xl border border-white/10 bg-card/90 p-3 text-left backdrop-blur-md">
          <p className="mb-2 text-[11.5px] leading-relaxed text-muted">
            Optional. A fine-grained PAT (Contents: read/write on <span className="text-subtle">mission-frontier</span>) saves your check-offs across devices. Stored only in this browser.
          </p>
          <input
            type="password"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="github_pat_…"
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 font-mono text-[12px] text-ink outline-none focus:border-accent-teal/60"
          />
          <div className="mt-2 flex items-center gap-2">
            <button onClick={save} className="rounded-lg border border-accent-teal/50 bg-accent-teal/15 px-3 py-1 text-[12px] font-bold text-accent-teal">Save & sync</button>
            <button onClick={() => { setToken(''); setVal(''); setMsg('cleared') }} className="rounded-lg border border-white/12 px-3 py-1 text-[12px] font-bold text-muted">Clear</button>
            {msg && <span className="font-mono text-[11px] text-faint">{msg}</span>}
          </div>
        </div>
      )}
    </div>
  )
}
