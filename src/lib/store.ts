import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { commitJson, hasToken, type SyncState } from './github'

// Progress model
// ---------------
// Two sources of "done":
//   1. LeetCode auto-sync — problems.json (committed by the GitHub Action) holds
//      every problem you've solved on LeetCode. Any scheduled problem whose slug
//      appears there is DONE automatically; the day's quota fills itself in.
//   2. Manual check-offs — everything else (math, build steps, production drills,
//      brain teasers, timed tests, interview rounds) is a checkbox you toggle.
//      These live in localStorage, optionally mirrored to progress.json via PAT.

const LS_KEY = 'residency-progress-v1'
const base = import.meta.env.BASE_URL

export interface Profile {
  totalSolved: number
  ranking: number | null
  streak: number
  byDifficulty: Record<'Easy' | 'Medium' | 'Hard', { solved: number; total: number }>
}
const EMPTY_PROFILE: Profile = {
  totalSolved: 0,
  ranking: null,
  streak: 0,
  byDifficulty: { Easy: { solved: 0, total: 0 }, Medium: { solved: 0, total: 0 }, Hard: { solved: 0, total: 0 } },
}

type Checks = Record<string, boolean>

function readLocal(): Checks {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}')
  } catch {
    return {}
  }
}
function writeLocal(c: Checks) {
  localStorage.setItem(LS_KEY, JSON.stringify(c))
}
function merge(baseline: Checks, local: Checks): Checks {
  return { ...baseline, ...local }
}
function clean(c: Checks): Checks {
  const out: Checks = {}
  for (const [k, v] of Object.entries(c)) if (v) out[k] = true
  return out
}

export interface Store {
  loading: boolean
  generatedAt: string | null
  profile: Profile
  solved: Set<string>
  isChecked: (id: string) => boolean
  isSolved: (slug: string) => boolean
  toggle: (id: string) => void
  dirtyCount: number
  syncState: SyncState
  syncNow: () => void
}

export function useStore(): Store {
  const [loading, setLoading] = useState(true)
  const [generatedAt, setGeneratedAt] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE)
  const [solved, setSolved] = useState<Set<string>>(new Set())
  const [baseline, setBaseline] = useState<Checks>({})
  const [local, setLocal] = useState<Checks>(() => readLocal())
  const [syncState, setSyncState] = useState<SyncState>(hasToken() ? 'idle' : 'off')
  const timer = useRef<number>()

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch(`${base}problems.json`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch(`${base}progress.json`)
        .then((r) => (r.ok ? (r.json() as Promise<Checks>) : {}))
        .catch(() => ({}) as Checks),
    ])
      .then(([pf, prog]) => {
        if (cancelled) return
        if (pf) {
          setProfile(pf.profile || EMPTY_PROFILE)
          setGeneratedAt(pf.generatedAt || null)
          setSolved(new Set((pf.problems || []).map((p: { slug: string }) => p.slug)))
        }
        setBaseline(prog || {})
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const effective = useMemo(() => merge(baseline, local), [baseline, local])
  const isChecked = useCallback((id: string) => !!effective[id], [effective])
  const isSolved = useCallback((slug: string) => solved.has(slug) || !!effective[slug], [solved, effective])

  const toggle = useCallback((id: string) => {
    setLocal((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      if (!next[id]) delete next[id]
      writeLocal(next)
      return next
    })
  }, [])

  const dirtyCount = useMemo(() => {
    let n = 0
    for (const k of Object.keys(local)) if (!!local[k] !== !!baseline[k]) n++
    return n
  }, [local, baseline])

  const syncNow = useCallback(() => {
    if (!hasToken()) return
    const payload = clean(effective)
    setSyncState('saving')
    commitJson('public/progress.json', payload, 'Update Mission Frontier progress')
      .then(() => {
        setBaseline(payload)
        setLocal({})
        writeLocal({})
        setSyncState('saved')
      })
      .catch(() => setSyncState('error'))
  }, [effective])

  useEffect(() => {
    if (loading || !hasToken() || dirtyCount === 0) return
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(syncNow, 3500)
    return () => window.clearTimeout(timer.current)
  }, [local, dirtyCount, loading, syncNow])

  return { loading, generatedAt, profile, solved, isChecked, isSolved, toggle, dirtyCount, syncState, syncNow }
}
