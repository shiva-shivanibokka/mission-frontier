import { TARGET_DATE, daysUntil, prettyDate } from '../data/meta'

// Sticky header: gradient wordmark, a live countdown to the interview window,
// and the last-synced line.
export default function Header({ generatedAt }: { generatedAt: string | null }) {
  const days = Math.max(0, daysUntil(TARGET_DATE))
  const synced = generatedAt
    ? new Date(generatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : 'not yet'
  return (
    <header className="sticky top-0 z-20 border-b border-white/8 bg-canvas/70 backdrop-blur-xl">
      {/* main row: wordmark + countdown */}
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-4">
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

      {/* second row: jump-to nav in oval pills, its own band */}
      <div className="border-t border-white/8 bg-white/[0.02]">
        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 py-2.5">
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
              className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-[13.5px] font-bold text-muted transition hover:border-accent-violet/40 hover:bg-accent-violet/10 hover:text-ink"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
