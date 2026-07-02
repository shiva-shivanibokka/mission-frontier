import { useRef, useState } from 'react'
import { dispatchSync, hasToken, latestRun } from '../lib/github'

// One-click LeetCode sync: kicks off the deploy workflow, watches it, and
// auto-reloads the page when it finishes (~1 min) so fresh solves show up.
type State = 'idle' | 'starting' | 'running' | 'done' | 'error'

export default function SyncNow() {
  const [state, setState] = useState<State>('idle')
  const [msg, setMsg] = useState('')
  const tries = useRef(0)

  const poll = (beforeId: number | null) => {
    tries.current += 1
    latestRun().then((run) => {
      if (run && run.id !== beforeId && run.status === 'completed') {
        setState('done')
        setTimeout(() => window.location.reload(), 800)
        return
      }
      if (tries.current > 24) {
        setMsg('taking a while — refresh in a moment')
        setState('idle')
        return
      }
      window.setTimeout(() => poll(beforeId), 8000)
    })
  }

  const run = async () => {
    if (!hasToken()) {
      setState('error')
      setMsg('add a token in ⚙ check-offs first')
      return
    }
    setState('starting')
    setMsg('')
    const before = await latestRun()
    const res = await dispatchSync()
    if (!res.ok) {
      setState('error')
      setMsg(res.message)
      return
    }
    setState('running')
    tries.current = 0
    window.setTimeout(() => poll(before?.id ?? null), 6000)
  }

  const label =
    state === 'starting' ? 'Starting…' : state === 'running' ? 'Syncing… (~1 min)' : state === 'done' ? 'Done — reloading' : 'Sync LeetCode now'
  const busy = state === 'starting' || state === 'running' || state === 'done'

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={run}
        disabled={busy}
        className={`whitespace-nowrap rounded-full border px-4 py-1.5 font-mono text-[13.5px] font-bold transition ${
          busy
            ? 'border-accent-teal/40 bg-accent-teal/10 text-accent-teal/70'
            : 'border-accent-teal/50 bg-accent-teal/15 text-accent-teal hover:-translate-y-px'
        }`}
      >
        {busy && <span className="mr-1.5 inline-block animate-spin">⟳</span>}
        {label}
      </button>
      {msg && <span className="font-mono text-[13px] text-faint">{msg}</span>}
    </div>
  )
}
