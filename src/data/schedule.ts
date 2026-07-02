import { NEETCODE_150, type LCProblem } from './leetcode'
import { PLAN_START, DAILY_QUOTA, addDays } from './meta'

// Turn the ordered NeetCode 150 into a dated daily schedule: DAILY_QUOTA problems
// per study day, six study days a week (Sunday is a rest / catch-up day). The
// dates are derived from PLAN_START so nothing has to be hand-entered.

export interface PlanDay {
  index: number // 1-based study-day number
  date: string // YYYY-MM-DD
  week: number // 1-based
  problems: LCProblem[]
}

function isSunday(iso: string): boolean {
  return new Date(iso + 'T00:00:00').getDay() === 0
}

export function buildSchedule(): PlanDay[] {
  const days: PlanDay[] = []
  let cursor = PLAN_START
  let studyDay = 0
  for (let i = 0; i < NEETCODE_150.length; i += DAILY_QUOTA) {
    // advance to the next non-Sunday date
    while (isSunday(cursor)) cursor = addDays(cursor, 1)
    studyDay++
    days.push({
      index: studyDay,
      date: cursor,
      week: Math.ceil(studyDay / 6),
      problems: NEETCODE_150.slice(i, i + DAILY_QUOTA),
    })
    cursor = addDays(cursor, 1)
  }
  return days
}

export const SCHEDULE = buildSchedule()

// The plan day whose date is today, or the last past day if today is a rest day
// / before the plan starts we return the first day.
export function dayForDate(iso: string): PlanDay {
  let chosen = SCHEDULE[0]
  for (const d of SCHEDULE) {
    if (d.date <= iso) chosen = d
    else break
  }
  return chosen
}

export function scheduleBounds() {
  return { first: SCHEDULE[0]?.date, last: SCHEDULE[SCHEDULE.length - 1]?.date, count: SCHEDULE.length }
}
