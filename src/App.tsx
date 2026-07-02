import CircuitBackground from './components/CircuitBackground'
import Header from './components/Header'
import StatTiles, { type Metric } from './components/StatTiles'
import WeeklyPlan from './components/WeeklyPlan'
import Today from './components/Today'
import Momentum from './components/Momentum'
import Pace from './components/Pace'
import CatchUp from './components/CatchUp'
import Checklist from './components/Checklist'
import BuildTrack from './components/BuildTrack'
import Teasers from './components/Teasers'
import TimedTests from './components/TimedTests'
import Rounds from './components/Rounds'
import { useStore } from './lib/store'
import { NEETCODE } from './data/leetcode'
import { BUILD, MATH, MATH_RESOURCES, PRODUCTION, PRODUCTION_NOTE, TESTS } from './data/tracks'

export default function App() {
  const store = useStore()

  const lcDone = NEETCODE.filter((p) => store.isSolved(p.slug)).length
  const buildSteps = BUILD.flatMap((m) => m.steps)
  const buildDone = buildSteps.filter((s) => store.isChecked(s.id)).length
  const testsDone = TESTS.filter((t) => store.isChecked(t.id)).length
  const study = [...MATH, ...PRODUCTION]
  const studyDone = study.filter((i) => store.isChecked(i.id)).length

  const metrics: Metric[] = [
    { label: 'LeetCode', value: lcDone, total: NEETCODE.length, sub: 'NeetCode 250 · auto-synced', color: '#a78bfa' },
    { label: 'Build track', value: buildDone, total: buildSteps.length, sub: 'from-scratch steps', color: '#46e0d0' },
    { label: 'Math + drills', value: studyDone, total: study.length, sub: 'math & production topics', color: '#818cf8' },
    { label: 'Timed tests', value: testsDone, total: TESTS.length, sub: 'passed in time', color: '#fbbf24' },
  ]

  return (
    <>
      <CircuitBackground />
      <Header store={store} />
      <main className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-6">
        <Pace store={store} />
        <StatTiles metrics={metrics} />
        <Momentum store={store} />
        <div id="catchup" className="scroll-mt-28">
          <CatchUp store={store} />
        </div>
        <div id="today" className="scroll-mt-28">
          <Today store={store} />
        </div>
        <div id="plan" className="scroll-mt-28">
          <WeeklyPlan store={store} />
        </div>

        <div id="study" className="grid items-start gap-5 scroll-mt-28 lg:grid-cols-2">
          <Checklist icon="📐" title="Math" items={MATH} store={store} resources={MATH_RESOURCES} color="#818cf8" />
          <Checklist icon="⌨️" title="Production Coding" items={PRODUCTION} store={store} note={PRODUCTION_NOTE} color="#46e0d0" />
        </div>

        <div id="build" className="scroll-mt-28">
          <BuildTrack store={store} />
        </div>

        <div id="prep" className="grid items-start gap-5 scroll-mt-28 lg:grid-cols-2">
          <Teasers store={store} />
          <Rounds store={store} />
        </div>

        <div id="tests" className="scroll-mt-28">
          <TimedTests store={store} />
        </div>

        <footer className="mt-4 pb-8 text-center font-mono text-[13px] text-faint">
          Mission Frontier · 3-month core plan (Jul 6 – Oct 4, 2026) · built for the OpenAI Residency
        </footer>
      </main>
    </>
  )
}
