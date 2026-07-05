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

// One canonical flattening of a week's non-LeetCode items, in the order
// math → build → production → teasers → tests. Shared by the Today slice, the
// Weekly plan and the pacing/catch-up math so the three never drift apart.
export interface NonLcItem {
  id: string
  label: string
  tag: string
  res?: { label: string; url: string }[]
}

export function nonLcItemsForWeek(week: number): NonLcItem[] {
  const b = itemsForWeek(week)
  return [
    ...b.math.map((m) => ({ id: m.id, label: m.label, tag: 'Math', res: m.res })),
    ...b.build.map((s) => ({ id: s.id, label: s.label, tag: 'Build', res: s.res })),
    ...b.production.map((p) => ({ id: p.id, label: p.label, tag: 'Prod', res: p.res })),
    ...b.papers.map((p) => ({ id: p.id, label: p.label, tag: 'Paper', res: p.res })),
    ...b.opensource.map((o) => ({ id: o.id, label: o.label, tag: 'OSS', res: o.res })),
    ...b.teasers.map((t) => ({ id: t.id, label: t.q, tag: 'Teaser', res: [t.res] })),
    ...b.tests.map((t) => ({ id: t.id, label: `T${t.n} · ${t.title} (${t.minutes} min)`, tag: 'Test' })),
  ]
}

export function nonLcAssignments(): Dated[] {
  const out: Dated[] = []
  for (let w = 1; w <= PLAN_WEEKS; w++) {
    const weekDays = SCHEDULE.filter((d) => weekOf(d.date) === w)
    if (!weekDays.length) continue
    const items = nonLcItemsForWeek(w)
    const len = weekDays.length
    items.forEach((it, i) => out.push({ ...it, kind: 'other', date: weekDays[i % len].date }))
  }
  return out
}
