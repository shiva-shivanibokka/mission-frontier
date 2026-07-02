import { TARGET_DATE, daysUntil, prettyDate } from '../data/meta'
import type { Store } from '../lib/store'
import SyncNow from './SyncNow'
import SyncSettings from './SyncSettings'

// Sticky header: gradient wordmark, a live countdown to the interview window,
// the last-synced line, and the row of jump-nav pills + sync/settings actions.
export default function Header({ store }: { store: Store }) {
  const generatedAt = store.generatedAt
  const days = Math.max(0, daysUntil(TARGET_DATE))
  const synced = generatedAt
    ? new Date(generatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : 'not yet'
  return (
    <header className="sticky top-0 z-20">
      {/* One panel that fades from opaque at the wordmark to near-transparent
          under the pills, so the animated circuit shows through the nav strip.
          No hard divider — the header dissolves into the moving background. */}
      <div className="bg-gradient-to-b from-canvas/95 via-canvas/80 to-canvas/25 backdrop-blur-md">
        {/* main row: wordmark + countdown */}
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 pt-4 pb-3">
          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-accent-violet/30 bg-accent-violet/10 text-[32px] shadow-glow">
            🔭
          </div>
          <div className="min-w-0">
            <h1 className="bg-gradient-to-r from-accent-violet via-accent-coral to-accent-teal bg-clip-text font-display text-[32px] font-extrabold leading-none text-transparent sm:text-[38px]">
              MISSION FRONTIER
            </h1>
            <p className="mt-1 font-mono text-[14px] text-muted">
              OpenAI Residency prep · LeetCode synced {synced}
            </p>
          </div>
          <div className="ml-auto hidden text-right sm:block">
            <div className="font-display text-[30px] font-extrabold leading-none text-ink">{days}</div>
            <div className="font-mono text-[13px] text-muted">days to interview window</div>
            <div className="font-mono text-[12px] text-faint">~{prettyDate(TARGET_DATE)} 2027 · tentative</div>
          </div>
        </div>

        {/* second row: jump-to nav pills (left) + sync/settings actions (right).
            Pills scroll horizontally on narrow screens inside their own <nav>;
            the actions sit outside that scroll box so the Settings dropdown
            isn't clipped. */}
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 pb-3.5">
          <nav className="flex gap-2 overflow-x-auto">
            {[
              ['today', 'Today'],
              ['plan', 'Plan'],
              ['catchup', 'Catch-up'],
              ['study', 'Math + Drills'],
              ['build', 'Build'],
              ['prep', 'Interview Prep'],
              ['tests', 'Timed Tests'],
            ].map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="whitespace-nowrap rounded-full border border-white/10 bg-canvas/50 px-4 py-1.5 font-mono text-[13.5px] font-bold text-muted backdrop-blur-sm transition hover:border-accent-violet/40 hover:bg-accent-violet/20 hover:text-ink"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <SyncNow />
            <SyncSettings store={store} />
          </div>
        </div>
      </div>
      {/* soft glow seam instead of a line: a thin gradient that melts away */}
      <div className="h-6 bg-gradient-to-b from-canvas/25 to-transparent" />
    </header>
  )
}
