// Optional auto-sync: commit the tracker's manual check-offs (progress.json)
// straight to the repo using a user-provided fine-grained PAT, stored ONLY in
// this browser's localStorage — never in the repo. Lets your progress persist
// across devices. Token needs Contents: read & write on the mission-frontier repo.
// Everything works fully without a token (progress just lives in this browser).

const OWNER = 'shiva-shivanibokka'
const REPO = 'mission-frontier'
const TOKEN_KEY = 'mission-frontier-gh-token'
const API = 'https://api.github.com'

export const getToken = (): string => {
  try {
    return localStorage.getItem(TOKEN_KEY) || ''
  } catch {
    return ''
  }
}
export const setToken = (t: string) => {
  if (t) localStorage.setItem(TOKEN_KEY, t)
  else localStorage.removeItem(TOKEN_KEY)
}
export const hasToken = (): boolean => !!getToken()

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

function toBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
}

export async function verifyToken(token: string): Promise<{ ok: boolean; message: string }> {
  try {
    const r = await fetch(`${API}/repos/${OWNER}/${REPO}`, { headers: authHeaders(token) })
    if (r.ok) return { ok: true, message: 'Connected' }
    if (r.status === 401) return { ok: false, message: 'Invalid token' }
    if (r.status === 404) return { ok: false, message: 'Token can’t see the mission-frontier repo' }
    return { ok: false, message: `GitHub error ${r.status}` }
  } catch (e) {
    return { ok: false, message: `Network error: ${(e as Error).message}` }
  }
}

async function currentSha(path: string, token: string): Promise<string | undefined> {
  const r = await fetch(`${API}/repos/${OWNER}/${REPO}/contents/${path}?ref=main`, { headers: authHeaders(token) })
  if (r.status === 404) return undefined
  if (!r.ok) throw new Error(`read ${r.status}`)
  const j = await r.json()
  return j.sha as string
}

export async function commitJson(path: string, data: unknown, message: string): Promise<void> {
  const token = getToken()
  if (!token) throw new Error('No GitHub token set')
  const content = toBase64(JSON.stringify(data, null, 2) + '\n')

  let sha = await currentSha(path, token)
  const put = () =>
    fetch(`${API}/repos/${OWNER}/${REPO}/contents/${path}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ message, content, sha, branch: 'main' }),
    })

  let res = await put()
  if (res.status === 409) {
    sha = await currentSha(path, token)
    res = await put()
  }
  if (!res.ok) throw new Error(`commit ${res.status}`)
}

export type SyncState = 'idle' | 'saving' | 'saved' | 'error' | 'off'

// --- On-demand LeetCode sync -------------------------------------------------
// Kick off the deploy workflow (which runs the LeetCode sync + rebuild) straight
// from the page. Needs the token to also have Actions: Read and write.
export async function dispatchSync(): Promise<{ ok: boolean; message: string }> {
  const token = getToken()
  if (!token) return { ok: false, message: 'Add a token first (⚙ check-offs)' }
  const r = await fetch(`${API}/repos/${OWNER}/${REPO}/actions/workflows/deploy.yml/dispatches`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ ref: 'main' }),
  })
  if (r.status === 204) return { ok: true, message: 'Sync started' }
  if (r.status === 403) return { ok: false, message: 'Token needs Actions: read & write' }
  if (r.status === 401) return { ok: false, message: 'Invalid token' }
  if (r.status === 404) return { ok: false, message: 'No access to the workflow' }
  return { ok: false, message: `GitHub error ${r.status}` }
}

// Latest workflow run (id + status) so the UI can poll for completion.
export async function latestRun(): Promise<{ id: number; status: string; conclusion: string | null } | null> {
  const token = getToken()
  if (!token) return null
  const r = await fetch(`${API}/repos/${OWNER}/${REPO}/actions/runs?per_page=1`, { headers: authHeaders(token) })
  if (!r.ok) return null
  const j = await r.json()
  const run = j.workflow_runs?.[0]
  return run ? { id: run.id, status: run.status, conclusion: run.conclusion } : null
}
