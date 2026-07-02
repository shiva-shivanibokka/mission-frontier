// Build-time LeetCode sync (accumulator). Pulls, for the configured user:
//   - profile stats (ranking, solved-by-difficulty, streak)
//   - the most recent accepted problems (title, difficulty, slug)
// and merges newly-seen problems into public/problems.json, keeping everything
// already there. The tracker reads this file to auto-check any scheduled problem
// whose slug you've solved. Runs in Node (GitHub Actions or locally) — no CORS.
//   node scripts/sync-leetcode.mjs [--user <handle>]

import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const USER = argVal('--user') || process.env.LEETCODE_USERNAME || 'YqGw1R8NKB'
const LIMIT = 20
const GQL = 'https://leetcode.com/graphql'
const OUT = path.join(process.cwd(), 'public', 'problems.json')

function argVal(flag) {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : undefined
}

const headers = {
  'Content-Type': 'application/json',
  Referer: `https://leetcode.com/u/${USER}/`,
  Origin: 'https://leetcode.com',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function gql(query, variables) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(GQL, { method: 'POST', headers, body: JSON.stringify({ query, variables }) })
      if (res.status === 429) {
        await sleep(1500 * (attempt + 1))
        continue
      }
      if (!res.ok) {
        console.warn(`  ! GraphQL ${res.status}`)
        return null
      }
      const json = await res.json()
      if (json.errors) {
        console.warn(`  ! GraphQL errors: ${JSON.stringify(json.errors).slice(0, 200)}`)
        return null
      }
      return json.data
    } catch (e) {
      console.warn(`  ! network error: ${e.message}`)
      await sleep(1000)
    }
  }
  return null
}

const Q_PROFILE = `
  query userProfile($username: String!) {
    matchedUser(username: $username) {
      profile { ranking }
      submitStatsGlobal { acSubmissionNum { difficulty count } }
    }
    allQuestionsCount { difficulty count }
  }`
const Q_CALENDAR = `
  query userCalendar($username: String!) {
    matchedUser(username: $username) { userCalendar { streak totalActiveDays } }
  }`
const Q_RECENT = `
  query recentAc($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) { title titleSlug timestamp }
  }`
const Q_QUESTION = `
  query question($titleSlug: String!) {
    question(titleSlug: $titleSlug) { questionFrontendId title difficulty topicTags { name } }
  }`

function readExisting() {
  try {
    const j = JSON.parse(fs.readFileSync(OUT, 'utf8'))
    return Array.isArray(j.problems) ? j.problems : []
  } catch {
    return []
  }
}

function buildProfile(profileData, calendarData) {
  const byDifficulty = { Easy: { solved: 0, total: 0 }, Medium: { solved: 0, total: 0 }, Hard: { solved: 0, total: 0 } }
  let totalSolved = 0
  let ranking = null
  const mu = profileData?.matchedUser
  if (mu) {
    ranking = mu.profile?.ranking ?? null
    for (const row of mu.submitStatsGlobal?.acSubmissionNum || []) {
      if (row.difficulty === 'All') {
        totalSolved = row.count
        continue
      }
      if (byDifficulty[row.difficulty]) byDifficulty[row.difficulty].solved = row.count
    }
  }
  for (const row of profileData?.allQuestionsCount || []) {
    if (byDifficulty[row.difficulty]) byDifficulty[row.difficulty].total = row.count
  }
  const cal = calendarData?.matchedUser?.userCalendar
  return { ranking, totalSolved, byDifficulty, streak: cal?.streak ?? 0, totalActiveDays: cal?.totalActiveDays ?? 0 }
}

async function main() {
  console.log(`Syncing LeetCode for @${USER}`)
  const [profileData, calendarData, recentData] = await Promise.all([
    gql(Q_PROFILE, { username: USER }),
    gql(Q_CALENDAR, { username: USER }),
    gql(Q_RECENT, { username: USER, limit: LIMIT }),
  ])
  const profile = buildProfile(profileData, calendarData)
  console.log(`  profile: ${profile.totalSolved} solved · streak ${profile.streak}`)

  const bySlug = new Map()
  for (const p of readExisting()) bySlug.set(p.slug, p)

  const recent = recentData?.recentAcSubmissionList || []
  console.log(`  recent accepted returned: ${recent.length}`)

  let added = 0
  for (const sub of recent) {
    const slug = sub.titleSlug
    const solvedAt = sub.timestamp ? new Date(Number(sub.timestamp) * 1000).toISOString() : null
    const existing = bySlug.get(slug)
    if (existing) {
      if (solvedAt && (!existing.solvedAt || solvedAt < existing.solvedAt)) existing.solvedAt = solvedAt
      continue
    }
    const qd = await gql(Q_QUESTION, { titleSlug: slug })
    const q = qd?.question
    bySlug.set(slug, {
      id: q ? Number(q.questionFrontendId) : 0,
      slug,
      title: sub.title || q?.title || slug,
      difficulty: q?.difficulty || 'Medium',
      tags: (q?.topicTags || []).map((t) => t.name),
      url: `https://leetcode.com/problems/${slug}/`,
      solvedAt,
    })
    added++
    await sleep(250)
  }

  const problems = [...bySlug.values()].sort((a, b) => (b.solvedAt || '').localeCompare(a.solvedAt || ''))
  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  fs.writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), username: USER, profile, problems }, null, 2) + '\n')
  console.log(`Wrote ${problems.length} problems (+${added} new) → public/problems.json`)

  if (!profileData && !recentData && problems.length === 0) {
    console.error('LeetCode returned no data — is the username correct / profile public?')
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
