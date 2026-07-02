import { useMemo, useState } from 'react'
import { NEETCODE_150, PATTERNS, lcUrl } from '../data/leetcode'
import type { Store } from '../lib/store'
import { Card, SectionTitle, DiffPill, ProgressBar, Checkbox } from './ui'

// The full LeetCode board (NeetCode 150), grouped by pattern. A problem is done
// when your LeetCode sync has seen it (auto, locked ✓) or you tick it manually.
export default function LeetBoard({ store }: { store: Store }) {
  const [open, setOpen] = useState<string | null>(PATTERNS[0])

  const byPattern = useMemo(() => {
    const m = new Map<string, typeof NEETCODE_150>()
    for (const p of NEETCODE_150) {
      if (!m.has(p.pattern)) m.set(p.pattern, [])
      m.get(p.pattern)!.push(p)
    }
    return m
  }, [])

  const totalDone = NEETCODE_150.filter((p) => store.isSolved(p.slug)).length

  return (
    <Card className="p-5">
      <SectionTitle
        icon="⚔️"
        title="LeetCode · NeetCode 150"
        right={<span className="font-mono text-[12.5px] font-bold text-accent-teal">{totalDone}/{NEETCODE_150.length} solved</span>}
      />
      <p className="mb-4 font-mono text-[11.5px] text-faint">
        Auto-checks from your LeetCode the moment you solve one · click a pattern to expand
      </p>
      <div className="space-y-2">
        {PATTERNS.map((pat) => {
          const items = byPattern.get(pat) || []
          const done = items.filter((p) => store.isSolved(p.slug)).length
          const isOpen = open === pat
          return (
            <div key={pat} className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.02]">
              <button
                onClick={() => setOpen(isOpen ? null : pat)}
                className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition hover:bg-white/[0.03]"
              >
                <span className={`font-mono text-[12px] text-faint transition ${isOpen ? 'rotate-90' : ''}`}>▶</span>
                <span className="font-display text-[14.5px] font-bold text-ink">{pat}</span>
                <span className="ml-auto font-mono text-[12px] text-muted">{done}/{items.length}</span>
                <div className="w-24">
                  <ProgressBar value={done} total={items.length} color="#a78bfa" />
                </div>
              </button>
              {isOpen && (
                <ul className="divide-y divide-white/5 border-t border-white/5">
                  {items.map((p) => {
                    const solvedLC = store.solved.has(p.slug)
                    const done2 = store.isSolved(p.slug)
                    return (
                      <li key={p.slug} className="flex items-center gap-3 px-3.5 py-2">
                        <Checkbox checked={done2} locked={solvedLC} onClick={() => !solvedLC && store.toggle(p.slug)} />
                        <DiffPill d={p.difficulty} />
                        <a href={lcUrl(p.slug)} target="_blank" rel="noreferrer" className="text-[13.5px] font-semibold text-subtle hover:text-accent-teal hover:underline">
                          {p.title}
                        </a>
                        {solvedLC && <span className="ml-auto font-mono text-[10.5px] text-accent-teal">auto ✓</span>}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
