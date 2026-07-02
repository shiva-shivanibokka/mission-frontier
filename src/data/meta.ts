// Global plan constants. The 3-month "core" block opens Sun 2026-07-05 and runs
// 14 weeks to Sat 2026-10-10. Sunday is a rest/catch-up day, so the first study
// day lands on Mon 2026-07-06 (see schedule.ts). The countdown targets the
// OpenAI Residency interview window (~January 2027); adjust TARGET once real
// dates are known.

export const PLAN_START = '2026-07-05' // Sunday — plan opens here; study starts Mon Jul 6
export const PLAN_WEEKS = 14
export const TARGET_DATE = '2027-01-05' // interview window (approx.)
export const DAILY_QUOTA = 3

export function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Whole days from today until an ISO date (negative if past).
export function daysUntil(iso: string): number {
  const now = new Date(todayISO() + 'T00:00:00')
  const then = new Date(iso + 'T00:00:00')
  return Math.round((then.getTime() - now.getTime()) / 86_400_000)
}

export function addDays(iso: string, n: number): string {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export function prettyDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Which plan week (1..PLAN_WEEKS) an ISO date falls in, clamped to the plan.
export function weekOf(iso: string): number {
  const days = Math.floor((new Date(iso + 'T00:00:00').getTime() - new Date(PLAN_START + 'T00:00:00').getTime()) / 86_400_000)
  return Math.min(PLAN_WEEKS, Math.max(1, Math.floor(days / 7) + 1))
}

export function currentWeek(): number {
  return weekOf(todayISO())
}

// The Sun–Sat date range string for a plan week (PLAN_START is a Sunday).
export function weekRange(week: number): string {
  const start = addDays(PLAN_START, (week - 1) * 7)
  return `${prettyDate(start)} – ${prettyDate(addDays(start, 6))}`
}
