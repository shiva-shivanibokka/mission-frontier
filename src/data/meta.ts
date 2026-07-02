// Global plan constants. The 3-month "core" block runs Mon 2026-07-06 → Sun
// 2026-10-04 (13 weeks). The countdown targets the OpenAI Residency interview
// window (~January 2027); adjust TARGET once real dates are known.

export const PLAN_START = '2026-07-06' // Monday — week boundaries are clean
export const PLAN_WEEKS = 13
export const TARGET_DATE = '2027-01-05' // interview window (approx.)
export const LEETCODE_USER = 'YqGw1R8NKB'
export const LEETCODE_GOAL = 150 // NeetCode 150 backbone; extend after the core block
export const DAILY_QUOTA = 3

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
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
