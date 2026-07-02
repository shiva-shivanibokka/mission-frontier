// Everything that isn't the LeetCode board: the math track, the from-scratch
// build track, production-coding drills, brain teasers, the timed-test calendar,
// the interview-round readiness checklist and the phase overview.
//
// Every checkable item carries:
//   - a stable `id` (the key in the progress store)
//   - a `week` (1..13) so it lands in the weekly quota, mirroring the daily
//     LeetCode quota — LeetCode is daily, everything else is weekly
//   - a `res` resource link you can open and study from right there

import { addDays, PLAN_START, weekOf } from './meta'

export interface Resource {
  label: string
  url: string
}
export interface CheckItem {
  id: string
  label: string
  detail?: string
  phase?: 1 | 2 | 3
  week?: number
  res?: Resource
}

// ---- Phases -----------------------------------------------------------------
export interface Phase {
  n: 1 | 2 | 3
  title: string
  range: string
  focus: string
  color: string
}
export const PHASES: Phase[] = [
  { n: 1, title: 'Foundations', range: 'Jul 6 – Aug 2 · wk 1–4', focus: 'Core LeetCode patterns · probability & linear algebra · build the autograd + optimizers flagship', color: '#818cf8' },
  { n: 2, title: 'Depth', range: 'Aug 3 – Sep 6 · wk 5–9', focus: 'Trees→Graphs→DP · matrix calculus & info theory · GPT-from-scratch + ablation · production drills', color: '#46e0d0' },
  { n: 3, title: 'Original work + full mock loop', range: 'Sep 7 – Oct 4 · wk 10–13', focus: 'Greedy/intervals/math · original project · behavioral + AI-safety · full timed mock interviews', color: '#f472b6' },
]

// ---- Math track -------------------------------------------------------------
export const MATH: CheckItem[] = [
  { id: 'math-prob-basics', label: 'Probability: sample spaces, conditional prob, Bayes’ rule', phase: 1, week: 1, res: { label: '3B1B — Bayes', url: 'https://www.youtube.com/watch?v=HZGCoVF3YvM' } },
  { id: 'math-la-vectors', label: 'Linear algebra: vectors, dot product, projections, norms', phase: 1, week: 1, res: { label: '3B1B — Vectors', url: 'https://www.3blue1brown.com/lessons/vectors' } },
  { id: 'math-expectation', label: 'Expectation, variance, linearity of expectation', phase: 1, week: 2, res: { label: 'Khan — Random variables', url: 'https://www.khanacademy.org/math/statistics-probability/random-variables-stats-library' } },
  { id: 'math-distributions', label: 'Common distributions: Bernoulli, Binomial, Gaussian, Poisson', phase: 1, week: 2, res: { label: 'Seeing Theory', url: 'https://seeing-theory.brown.edu/probability-distributions/index.html' } },
  { id: 'math-mle', label: 'Maximum likelihood estimation (MLE) & MAP', phase: 1, week: 3, res: { label: 'StatQuest — MLE', url: 'https://www.youtube.com/watch?v=XepXtl9YKwc' } },
  { id: 'math-la-matrices', label: 'Matrix multiply, rank, inverse, determinant intuition', phase: 1, week: 3, res: { label: '3B1B — Matrix mult', url: 'https://www.3blue1brown.com/lessons/matrix-multiplication' } },
  { id: 'math-eigen', label: 'Eigenvalues / eigenvectors, SVD, PCA', phase: 2, week: 5, res: { label: '3B1B — Eigen', url: 'https://www.3blue1brown.com/lessons/eigenvalues' } },
  { id: 'math-matrix-calc', label: 'Matrix calculus: gradients, Jacobians, chain rule for backprop', phase: 2, week: 6, res: { label: 'Matrix Calculus (Parr)', url: 'https://explained.ai/matrix-calculus/' } },
  { id: 'math-entropy', label: 'Information theory: entropy, cross-entropy, KL divergence', phase: 2, week: 6, res: { label: 'Géron — Entropy/KL', url: 'https://www.youtube.com/watch?v=ErfnhcEV1O8' } },
  { id: 'math-lm-loss', label: 'Language-model loss: softmax + cross-entropy, perplexity', phase: 2, week: 7, res: { label: 'CS231n — Softmax', url: 'https://cs231n.github.io/linear-classify/#softmax' } },
  { id: 'math-convex', label: 'Convexity, gradients of common losses, why SGD works', phase: 2, week: 8, res: { label: 'Boyd — Convex Opt', url: 'https://web.stanford.edu/~boyd/cvxbook/' } },
  { id: 'math-stats-tests', label: 'Estimators, bias/variance, confidence intervals, hypothesis tests', phase: 3, week: 11, res: { label: 'Seeing Theory — Inference', url: 'https://seeing-theory.brown.edu/frequentist-inference/index.html' } },
]
export const MATH_RESOURCES: Resource[] = [
  { label: '3Blue1Brown — Essence of Linear Algebra', url: 'https://www.3blue1brown.com/topics/linear-algebra' },
  { label: 'Mathematics for Machine Learning (free PDF)', url: 'https://mml-book.github.io/' },
  { label: 'Harvard Stat 110 (Blitzstein)', url: 'https://projects.iq.harvard.edu/stat110' },
]

// ---- Build track (from scratch) --------------------------------------------
export interface BuildMilestone {
  id: string
  title: string
  phase: 1 | 2 | 3
  kind: 'flagship' | 'reproduction' | 'original'
  steps: CheckItem[]
}
export const BUILD: BuildMilestone[] = [
  {
    id: 'build-autograd',
    title: 'Autograd + Optimizers flagship',
    phase: 1,
    kind: 'flagship',
    steps: [
      { id: 'ag-value', label: 'Reverse-mode autograd: a Value/Tensor class with a backward() graph', week: 1, res: { label: 'micrograd', url: 'https://github.com/karpathy/micrograd' } },
      { id: 'ag-ops', label: 'Ops with correct local gradients: +, ×, matmul, ReLU, tanh, exp, log', week: 1, res: { label: 'CS231n — Backprop', url: 'https://cs231n.github.io/optimization-2/' } },
      { id: 'ag-mlp', label: 'Train a small MLP on a toy dataset end-to-end', week: 2, res: { label: 'Zero to Hero', url: 'https://karpathy.ai/zero-to-hero.html' } },
      { id: 'ag-optims', label: 'Optimizers from scratch: SGD, Momentum, RMSProp, Adam, AdamW', week: 2, res: { label: 'Ruder — Optimizers', url: 'https://www.ruder.io/optimizing-gradient-descent/' } },
      { id: 'ag-derive', label: 'Notebook deriving each optimizer update rule + convergence curves', week: 3, res: { label: 'Adam paper', url: 'https://arxiv.org/abs/1412.6980' } },
      { id: 'ag-merge', label: 'Fold into your Gradient-Descent-and-Optimizers repo; run optimizers on your own autograd', week: 3, res: { label: 'AdamW paper', url: 'https://arxiv.org/abs/1711.05101' } },
      { id: 'ag-writeup', label: 'README / short writeup with results', week: 4, res: { label: 'Ruder — Optimizers', url: 'https://www.ruder.io/optimizing-gradient-descent/' } },
    ],
  },
  {
    id: 'build-gpt',
    title: 'GPT-from-scratch (reproduction)',
    phase: 2,
    kind: 'reproduction',
    steps: [
      { id: 'gpt-tok', label: 'Tokenizer (char-level, then BPE) + batched data loader', week: 5, res: { label: 'minbpe', url: 'https://github.com/karpathy/minbpe' } },
      { id: 'gpt-attn', label: 'Multi-head self-attention by hand (reuse your RoPE attention)', week: 5, res: { label: 'Annotated Transformer', url: 'http://nlp.seas.harvard.edu/annotated-transformer/' } },
      { id: 'gpt-block', label: 'Transformer block: attention + MLP + residual + layernorm', week: 6, res: { label: 'nanoGPT', url: 'https://github.com/karpathy/nanoGPT' } },
      { id: 'gpt-train', label: 'Training loop with cross-entropy loss; sample generations', week: 7, res: { label: "Let's build GPT", url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY' } },
      { id: 'gpt-kv', label: 'KV cache for fast inference', week: 7, res: { label: 'Transformer Inference Arithmetic', url: 'https://kipp.ly/transformer-inference-arithmetic/' } },
      { id: 'gpt-ablation', label: 'Original ablation (e.g. RoPE vs learned pos-emb; heads vs loss/compute)', week: 8, res: { label: 'RoPE paper', url: 'https://arxiv.org/abs/2104.09864' } },
      { id: 'gpt-writeup', label: 'Writeup with the ablation plot + findings', week: 9, res: { label: 'nanoGPT', url: 'https://github.com/karpathy/nanoGPT' } },
    ],
  },
  {
    id: 'build-original',
    title: 'Grokking dynamics study (original)',
    phase: 3,
    kind: 'original',
    steps: [
      { id: 'gk-repro', label: 'Reproduce grokking on modular arithmetic with a small transformer', week: 10, res: { label: 'Grokking paper', url: 'https://arxiv.org/abs/2201.02177' } },
      { id: 'gk-hypo', label: 'Form a hypothesis (what drives when generalization kicks in?)', week: 10, res: { label: 'Progress measures', url: 'https://arxiv.org/abs/2301.05217' } },
      { id: 'gk-ablate', label: 'Original ablation: weight decay / data fraction / optimizer vs grokking speed', week: 11, res: { label: 'Progress measures', url: 'https://arxiv.org/abs/2301.05217' } },
      { id: 'gk-plot', label: 'Clean plots of train vs val accuracy over steps', week: 12, res: { label: 'Grokking paper', url: 'https://arxiv.org/abs/2201.02177' } },
      { id: 'gk-present', label: '5-min presentation + writeup (research-interview rehearsal)', week: 13, res: { label: 'Alt: DPO paper', url: 'https://arxiv.org/abs/2305.18290' } },
    ],
  },
]

// ---- Production-style coding -------------------------------------------------
export const PRODUCTION: CheckItem[] = [
  { id: 'prod-lru', label: 'LRU cache (clean, tested)', detail: 'OOP design + edge cases', phase: 1, week: 2, res: { label: 'LeetCode — LRU', url: 'https://leetcode.com/problems/lru-cache/' } },
  { id: 'prod-linreg', label: 'Linear & logistic regression from scratch (+ tests)', phase: 1, week: 3, res: { label: 'ML-From-Scratch', url: 'https://github.com/eriklindernoren/ML-From-Scratch' } },
  { id: 'prod-rate', label: 'Rate limiter (token bucket / sliding window)', phase: 1, week: 4, res: { label: 'Token bucket', url: 'https://en.wikipedia.org/wiki/Token_bucket' } },
  { id: 'prod-bpe', label: 'BPE tokenizer from scratch', phase: 2, week: 5, res: { label: 'minbpe', url: 'https://github.com/karpathy/minbpe' } },
  { id: 'prod-allreduce', label: 'All-Reduce / parallel reduction (assessment favourite)', phase: 2, week: 6, res: { label: 'Ring All-Reduce', url: 'https://andrew.gibiansky.com/blog/machine-learning/baidu-allreduce/' } },
  { id: 'prod-kmeans', label: 'K-means clustering from scratch', phase: 2, week: 7, res: { label: 'ML-From-Scratch', url: 'https://github.com/eriklindernoren/ML-From-Scratch' } },
  { id: 'prod-softmax', label: 'Softmax, cross-entropy, batchnorm, attention from scratch', phase: 2, week: 8, res: { label: 'Annotated Transformer', url: 'http://nlp.seas.harvard.edu/annotated-transformer/' } },
  { id: 'prod-vectorize', label: 'Vectorize / optimize NumPy vector ops (speed matters)', phase: 2, week: 9, res: { label: 'From Python to NumPy', url: 'https://www.labri.fr/perso/nrougier/from-python-to-numpy/' } },
  { id: 'prod-kvstore', label: 'In-memory key-value store with TTL', phase: 3, week: 10, res: { label: 'Build-your-own-X', url: 'https://github.com/codecrafters-io/build-your-own-x' } },
  { id: 'prod-retry', label: 'Retry-with-backoff wrapper + thread-safe queue', phase: 3, week: 11, res: { label: 'Backoff & jitter', url: 'https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/' } },
]
export const PRODUCTION_NOTE =
  'OpenAI’s coding rounds are production-style: write lots of clean code, handle edge cases, structure it well, and think out loud. Build each of these as a small, tested component.'

// ---- Brain teasers -----------------------------------------------------------
export interface Teaser {
  id: string
  q: string
  hint: string
  week: number
  res: Resource
}
export const TEASERS: Teaser[] = [
  { id: 'bt-25horses', week: 1, q: '25 horses, 5 tracks, no timer. Fewest races to find the top 3?', hint: '7 races.', res: { label: 'Explanation', url: 'https://www.geeksforgeeks.org/puzzle-25-horses/' } },
  { id: 'bt-ropes', week: 2, q: 'Two ropes each burn in 60 min unevenly. Measure 45 minutes.', hint: 'Burn one from both ends + one from one end.', res: { label: 'Explanation', url: 'https://www.geeksforgeeks.org/puzzle-measure-45-minutes-using-two-identical-wires/' } },
  { id: 'bt-100prisoners', week: 3, q: '100 prisoners, 100 boxes, find your number in ≤50 opens each. Strategy & odds?', hint: 'Follow the cycle / loop strategy → ~31%.', res: { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/100_prisoners_problem' } },
  { id: 'bt-12balls', week: 4, q: '12 balls, one is off-weight (unknown heavier/lighter). 3 weighings to find it.', hint: 'Split 4-4-4; track which side.', res: { label: 'Balance puzzle', url: 'https://en.wikipedia.org/wiki/Balance_puzzle' } },
  { id: 'bt-bridge', week: 5, q: 'Four people cross a bridge at night, one torch, times 1/2/5/10, two at a time. Min total?', hint: '17 minutes.', res: { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Bridge_and_torch_problem' } },
  { id: 'bt-eggdrop', week: 6, q: '2 eggs, 100 floors — find the highest safe floor with fewest worst-case drops.', hint: '14 (drop at 14, 27, 39, …).', res: { label: 'Brilliant', url: 'https://brilliant.org/wiki/egg-dropping/' } },
  { id: 'bt-montyhall', week: 7, q: 'Monty Hall: switch or stay? Why?', hint: 'Switch → 2/3.', res: { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Monty_Hall_problem' } },
  { id: 'bt-diceexp', week: 8, q: 'Expected number of dice rolls to see the first 6?', hint: 'Geometric → 6.', res: { label: 'Geometric dist.', url: 'https://en.wikipedia.org/wiki/Geometric_distribution' } },
  { id: 'bt-circle3pts', week: 9, q: 'Probability 3 random points on a circle form a triangle containing the center?', hint: '1/4.', res: { label: 'Discussion', url: 'https://math.stackexchange.com/questions/268635/three-points-on-a-circle-probability-the-triangle-contains-the-center' } },
  { id: 'bt-ants', week: 10, q: 'Three ants on a triangle, each walks to a random adjacent corner. P(no collision)?', hint: '1/4.', res: { label: 'Discussion', url: 'https://math.stackexchange.com/questions/32242/ants-on-a-triangle' } },
  { id: 'bt-coinstreak', week: 11, q: 'Expected flips of a fair coin to get two heads in a row (HH)?', hint: '6.', res: { label: 'Expected value', url: 'https://brilliant.org/wiki/expected-value/' } },
  { id: 'bt-birthday', week: 12, q: 'How many people for a >50% chance two share a birthday?', hint: '23.', res: { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Birthday_problem' } },
]

// ---- Timed tests -------------------------------------------------------------
export interface TimedTest {
  id: string
  n: number
  title: string
  detail: string
  minutes: number
  date: string
  phase: 1 | 2 | 3
}
const T = (offset: number) => addDays(PLAN_START, offset)
export const TESTS: TimedTest[] = [
  { id: 'test-1', n: 1, title: 'Math sprint', detail: '6 probability/stats problems (expectation, Bayes, KL)', minutes: 60, date: T(12), phase: 1 },
  { id: 'test-2', n: 2, title: 'LeetCode timed set', detail: '3 problems (2 medium, 1 hard) under interview time', minutes: 75, date: T(19), phase: 1 },
  { id: 'test-3', n: 3, title: 'Autograd checkpoint', detail: 'Implement backward() for a given set of ops', minutes: 60, date: T(26), phase: 1 },
  { id: 'test-4', n: 4, title: 'Mock online assessment #1', detail: '3 stats/probability + 1 coding (incl. an All-Reduce)', minutes: 100, date: T(33), phase: 2 },
  { id: 'test-5', n: 5, title: 'ML from scratch', detail: 'Implement logistic regression or k-means live', minutes: 60, date: T(40), phase: 2 },
  { id: 'test-6', n: 6, title: 'Production component', detail: 'Build a BPE tokenizer or LRU cache, clean + tested', minutes: 60, date: T(47), phase: 2 },
  { id: 'test-7', n: 7, title: 'Mock live coding #1', detail: 'Production-style problem, think out loud', minutes: 60, date: T(54), phase: 2 },
  { id: 'test-8', n: 8, title: 'Mock online assessment #2', detail: 'Full timed OA, harder set', minutes: 100, date: T(61), phase: 2 },
  { id: 'test-9', n: 9, title: 'Research interview mock #1', detail: 'Run a mini experiment + 30-min presentation', minutes: 180, date: T(68), phase: 3 },
  { id: 'test-10', n: 10, title: 'Live coding #2 + brain teasers', detail: 'Coding round then 3 teasers under pressure', minutes: 75, date: T(75), phase: 3 },
  { id: 'test-11', n: 11, title: 'Full mock loop', detail: 'OA + coding + research + behavioral back-to-back', minutes: 240, date: T(82), phase: 3 },
  { id: 'test-12', n: 12, title: 'Final full mock', detail: 'Complete loop incl. AI-safety / motivation', minutes: 240, date: T(89), phase: 3 },
]

// ---- Interview rounds --------------------------------------------------------
export interface Round {
  id: string
  title: string
  detail: string
  prep: string
}
export const ROUNDS: Round[] = [
  { id: 'round-hr', title: 'HR + Behavioral', detail: 'Motivation, background, why OpenAI', prep: 'Your story, mission fit, questions to ask them' },
  { id: 'round-oa', title: 'Online Assessment (~100 min)', detail: '3 stats/probability + 1 coding (LeetCode med–hard, e.g. All-Reduce)', prep: 'KL divergence, expected value, LM loss; timed coding' },
  { id: 'round-live', title: 'Live Coding (~1 hr)', detail: 'Production-style, not pure LeetCode', prep: 'Write lots of clean code, edge cases, narrate reasoning' },
  { id: 'round-research', title: 'Research Interview (~4 hr)', detail: '3 hr hands-on research + 30-min presentation', prep: 'Rehearse: hypothesis → experiment → present. Your projects.' },
  { id: 'round-mentor', title: 'Mentor (~40 min)', detail: 'Resume + research interests + brain teasers', prep: 'Talk fluently about your 3 projects; teaser practice' },
  { id: 'round-hm', title: 'Hiring Manager (2 × 30 min)', detail: 'AI safety / motivation + research background', prep: 'Have a genuine AI-safety point of view (DPO/grokking hook)' },
]

// ---- Weekly quota aggregation ----------------------------------------------
export interface WeekBucket {
  math: CheckItem[]
  build: (CheckItem & { milestone: string })[]
  production: CheckItem[]
  teasers: Teaser[]
  tests: TimedTest[]
}
export function itemsForWeek(week: number): WeekBucket {
  return {
    math: MATH.filter((m) => m.week === week),
    build: BUILD.flatMap((mst) => mst.steps.filter((s) => s.week === week).map((s) => ({ ...s, milestone: mst.title }))),
    production: PRODUCTION.filter((p) => p.week === week),
    teasers: TEASERS.filter((t) => t.week === week),
    tests: TESTS.filter((t) => weekOf(t.date) === week),
  }
}
