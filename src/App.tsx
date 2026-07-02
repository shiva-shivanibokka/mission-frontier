import CircuitBackground from './components/CircuitBackground'
import Header from './components/Header'
import StatTiles, { type Metric } from './components/StatTiles'
import Roadmap from './components/Roadmap'
import Today from './components/Today'
import ThisWeek from './components/ThisWeek'
import LeetBoard from './components/LeetBoard'
import Checklist from './components/Checklist'
import BuildTrack from './components/BuildTrack'
import Teasers from './components/Teasers'
import TimedTests from './components/TimedTests'
import Rounds from './components/Rounds'
import SyncSettings from './components/SyncSettings'
import { useStore } from './lib/store'
import { NEETCODE } from './data/leetcode'
import { BUILD, MATH, MATH_RESOURCES, PRODUCTION, PRODUCTION_NOTE, TESTS } from './data/tracks'
import { TARGET_DATE, daysUntil } from './data/meta'

export default function App() {
  const store = useStore()

  const lcDone = NEETCODE.filter((p) => store.isSolved(p.slug)).length
  const buildSteps = BUILD.flatMap((m) => m.steps)
  const buildDone = buildSteps.filter((s) => store.isChecked(s.id)).length
  const testsDone = TESTS.filter((t) => store.isChecked(t.id)).length
  const daysLeft = Math.max(0, daysUntil(TARGET_DATE))

  const metrics: Metric[] = [
    { label: 'LeetCode', value: lcDone, total: NEETCODE.length, sub: 'NeetCode 250 · auto-synced', color: '#a78bfa' },
    { label: 'Build track', value: buildDone, total: buildSteps.length, sub: 'from-scratch steps', color: '#46e0d0' },
    { label: 'Timed tests', value: testsDone, total: TESTS.length, sub: 'passed in time', color: '#fbbf24' },
    { label: 'Countdown', value: daysLeft, total: 0, sub: 'days to interview window', color: '#f472b6' },
  ]

  return (
    <>
      <CircuitBackground />
      <Header generatedAt={store.generatedAt} />
      <main className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-6">
        <div className="flex justify-end">
          <SyncSettings store={store} />
        </div>

        <StatTiles metrics={metrics} />
        <Roadmap />

        <Today store={store} />
        <ThisWeek store={store} />

        <LeetBoard store={store} />

        <div className="grid items-start gap-5 lg:grid-cols-2">
          <Checklist icon="📐" title="Math" items={MATH} store={store} resources={MATH_RESOURCES} color="#818cf8" />
          <Checklist icon="⌨️" title="Production Coding" items={PRODUCTION} store={store} note={PRODUCTION_NOTE} color="#46e0d0" />
        </div>

        <BuildTrack store={store} />

        <div className="grid items-start gap-5 lg:grid-cols-2">
          <Teasers store={store} />
          <Rounds store={store} />
        </div>

        <TimedTests store={store} />

        <footer className="mt-4 pb-8 text-center font-mono text-[11.5px] text-faint">
          Mission Frontier · 3-month core plan (Jul 6 – Oct 4, 2026) · built for the OpenAI Residency
        </footer>
      </main>
    </>
  )
}
