import { lcScheduled, nonLcAssignments } from '../lib/pacing'
import { todayISO } from '../data/meta'
import type { Store } from '../lib/store'

// "On track?" — compares what should already be done (items dated before today)
// against what you've actually completed. Positive delta = ahead, negative = behind.
export default function Pace({ store }: { store: Store }) {
  const today = todayISO()
  const lc = lcScheduled()
  const other = nonLcAssignments()

  const shouldHave = lc.filter((x) => x.date < today).length + other.filter((x) => x.date < today).length
  const haveDone = lc.filter((x) => store.isSolved(x.slug!)).length + other.filter((x) => store.isChecked(x.id)).length
  const behind = lc.filter((x) => x.date < today && !store.isSolved(x.slug!)).length + other.filter((x) => x.date < today && !store.isChecked(x.id)).length
  const delta = haveDone - shouldHave

  const notStarted = shouldHave === 0
  const ahead = delta > 0
  const onTrack = behind === 0

  const color = notStarted ? '#818cf8' : onTrack ? '#34d399' : '#fb7185'
  const headline = notStarted
    ? 'Plan hasn’t started yet — anything you do now is a head start 🚀'
    : onTrack
      ? ahead
        ? `You’re ${delta} ahead of schedule 🚀`
        : 'Right on track ✅'
      : `You’re behind by ${behind} — time to catch up`

  return (
    <div
      className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border px-5 py-3.5 backdrop-blur-md"
      style={{ borderColor: `${color}55`, background: `${color}12` }}
    >
      <span className="font-display text-[17px] font-extrabold" style={{ color }}>
        {headline}
      </span>
      <span className="ml-auto font-mono text-[13.5px] text-muted">
        done <span className="font-bold text-ink">{haveDone}</span> · due by now <span className="font-bold text-ink">{shouldHave}</span>
        {behind > 0 && <> · <span className="font-bold text-accent-pink">{behind}</span> overdue</>}
      </span>
    </div>
  )
}
