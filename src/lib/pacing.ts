import { SCHEDULE } from '../data/schedule'
import { itemsForWeek } from '../data/tracks'
import { PLAN_WEEKS, weekOf } from '../data/meta'
import type { Diff } from '../data/leetcode'

// Shared scheduling math for the pace indicator and the catch-up panel.
// LeetCode items are dated by their study day. Non-LeetCode (weekly) items are
// paced evenly across each week's study days so every item gets a concrete date.

export interface Dated {
  id: string
  label: string
  tag: string
  kind: 'lc' | 'other'
  date: string
  slug?: string
  difficulty?: Diff
  res?: { label: string; url: string }[]
}

export function lcScheduled(): Dated[] {
  return SCHEDULE.flatMap((d) =>
    d.problems.map((p) => ({ id: p.slug, slug: p.slug, label: p.title, difficulty: p.difficulty, tag: 'LeetCode', kind: 'lc' as const, date: d.date })),
  )
}

export function nonLcAssignments(): Dated[] {
  const out: Dated[] = []
  for (let w = 1; w <= PLAN_WEEKS; w++) {
    const weekDays = SCHEDULE.filter((d) => weekOf(d.date) === w)
    if (!weekDays.length) continue
    const b = itemsForWeek(w)
    const items: { id: string; label: string; tag: string; res?: { label: string; url: string }[] }[] = [
      ...b.math.map((m) => ({ id: m.id, label: m.label, tag: 'Math', res: m.res })),
      ...b.build.map((s) => ({ id: s.id, label: s.label, tag: 'Build', res: s.res })),
      ...b.production.map((p) => ({ id: p.id, label: p.label, tag: 'Prod', res: p.res })),
      ...b.teasers.map((t) => ({ id: t.id, label: t.q, tag: 'Teaser', res: [t.res] })),
      ...b.tests.map((t) => ({ id: t.id, label: `T${t.n} · ${t.title}`, tag: 'Test' })),
    ]
    const len = weekDays.length
    items.forEach((it, i) => out.push({ ...it, kind: 'other', date: weekDays[i % len].date }))
  }
  return out
}
