// Everything that isn't the LeetCode board: the math track, the from-scratch
// build track, production-coding drills, brain teasers, the timed-test calendar,
// the interview-round readiness checklist and the phase overview.
//
// Every checkable item carries:
//   - a stable `id` (the key in the progress store)
//   - a `week` (1..14) so it lands in the weekly quota, mirroring the daily
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
  // Several study resources per item, so if one doesn't click for you there are
  // alternatives — no time wasted hunting for a good one.
  res?: Resource[]
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
  { n: 1, title: 'Foundations', range: 'Jul 23 – Aug 19 · wk 1–4', focus: 'Core LeetCode patterns · probability & linear algebra · build the autograd + optimizers flagship', color: '#818cf8' },
  { n: 2, title: 'Depth', range: 'Aug 20 – Sep 23 · wk 5–9', focus: 'Trees→Graphs→DP · matrix calculus & info theory · GPT-from-scratch + ablation · production drills', color: '#46e0d0' },
  { n: 3, title: 'Original work + full mock loop', range: 'Sep 24 – Oct 28 · wk 10–14', focus: 'Greedy/intervals/math · original project · behavioral + AI-safety · full timed mock interviews', color: '#f472b6' },
]

// ---- Math track -------------------------------------------------------------
export const MATH: CheckItem[] = [
  { id: 'math-prob-basics', label: 'Probability: sample spaces, conditional prob, Bayes’ rule', phase: 1, week: 1, res: [
    { label: '3B1B — Bayes', url: 'https://www.youtube.com/watch?v=HZGCoVF3YvM' },
    { label: 'Seeing Theory', url: 'https://seeing-theory.brown.edu/compound-probability/index.html' },
    { label: 'Khan — Conditional', url: 'https://www.khanacademy.org/math/statistics-probability/probability-library' },
  ] },
  { id: 'math-la-vectors', label: 'Linear algebra: vectors, dot product, projections, norms', phase: 1, week: 1, res: [
    { label: '3B1B — Vectors', url: 'https://www.3blue1brown.com/lessons/vectors' },
    { label: 'Khan — Vectors', url: 'https://www.khanacademy.org/math/linear-algebra/vectors-and-spaces' },
    { label: 'MML book ch.2', url: 'https://mml-book.github.io/' },
  ] },
  { id: 'math-expectation', label: 'Expectation, variance, linearity of expectation', phase: 1, week: 2, res: [
    { label: 'Khan — Random vars', url: 'https://www.khanacademy.org/math/statistics-probability/random-variables-stats-library' },
    { label: 'StatQuest — Expectation', url: 'https://www.youtube.com/watch?v=KLs_7b7SKi4' },
    { label: 'Stat 110 (videos)', url: 'https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo' },
  ] },
  { id: 'math-distributions', label: 'Common distributions: Bernoulli, Binomial, Gaussian, Poisson', phase: 1, week: 2, res: [
    { label: 'Seeing Theory', url: 'https://seeing-theory.brown.edu/probability-distributions/index.html' },
    { label: 'StatQuest playlist', url: 'https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9' },
    { label: 'Distribution zoo', url: 'https://ben18785.shinyapps.io/distribution-zoo/' },
  ] },
  { id: 'math-mle', label: 'Maximum likelihood estimation (MLE) & MAP', phase: 1, week: 3, res: [
    { label: 'StatQuest — MLE', url: 'https://www.youtube.com/watch?v=XepXtl9YKwc' },
    { label: 'MML book ch.8', url: 'https://mml-book.github.io/' },
    { label: 'CS229 notes', url: 'https://cs229.stanford.edu/main_notes.pdf' },
  ] },
  { id: 'math-la-matrices', label: 'Matrix multiply, rank, inverse, determinant intuition', phase: 1, week: 3, res: [
    { label: '3B1B — Matrix mult', url: 'https://www.3blue1brown.com/lessons/matrix-multiplication' },
    { label: '3B1B — Determinant', url: 'https://www.3blue1brown.com/lessons/determinant' },
    { label: 'MIT 18.06 (Strang)', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/' },
  ] },
  { id: 'math-eigen', label: 'Eigenvalues / eigenvectors, SVD, PCA', phase: 2, week: 5, res: [
    { label: '3B1B — Eigen', url: 'https://www.3blue1brown.com/lessons/eigenvalues' },
    { label: 'StatQuest — PCA', url: 'https://www.youtube.com/watch?v=FgakZw6K1QQ' },
    { label: 'Gregory Gundersen — SVD', url: 'https://gregorygundersen.com/blog/2018/12/10/svd/' },
  ] },
  { id: 'math-matrix-calc', label: 'Matrix calculus: gradients, Jacobians, chain rule for backprop', phase: 2, week: 6, res: [
    { label: 'Matrix Calculus (Parr)', url: 'https://explained.ai/matrix-calculus/' },
    { label: 'CS231n — Backprop', url: 'https://cs231n.github.io/optimization-2/' },
    { label: 'Matrix Cookbook', url: 'https://www.math.uwaterloo.ca/~hwolkowi/matrixcookbook.pdf' },
  ] },
  { id: 'math-entropy', label: 'Information theory: entropy, cross-entropy, KL divergence', phase: 2, week: 6, res: [
    { label: 'Géron — Entropy/KL', url: 'https://www.youtube.com/watch?v=ErfnhcEV1O8' },
    { label: 'C. Olah — Visual Info', url: 'https://colah.github.io/posts/2015-09-Visual-Information/' },
    { label: 'StatQuest — Entropy', url: 'https://www.youtube.com/watch?v=YtebGVx-Fxw' },
  ] },
  { id: 'math-lm-loss', label: 'Language-model loss: softmax + cross-entropy, perplexity', phase: 2, week: 7, res: [
    { label: 'CS231n — Softmax', url: 'https://cs231n.github.io/linear-classify/#softmax' },
    { label: 'Perplexity (HF)', url: 'https://huggingface.co/docs/transformers/perplexity' },
    { label: 'Lil’Log — cross-entropy', url: 'https://lilianweng.github.io/posts/2018-06-24-attention/' },
  ] },
  { id: 'math-convex', label: 'Convexity, gradients of common losses, why SGD works', phase: 2, week: 8, res: [
    { label: 'Boyd — Convex Opt', url: 'https://web.stanford.edu/~boyd/cvxbook/' },
    { label: 'Ruder — SGD variants', url: 'https://www.ruder.io/optimizing-gradient-descent/' },
    { label: 'distill.pub — Momentum', url: 'https://distill.pub/2017/momentum/' },
  ] },
  { id: 'math-stats-tests', label: 'Estimators, bias/variance, confidence intervals, hypothesis tests', phase: 3, week: 11, res: [
    { label: 'Seeing Theory', url: 'https://seeing-theory.brown.edu/frequentist-inference/index.html' },
    { label: 'StatQuest — p-values', url: 'https://www.youtube.com/watch?v=vemZtEM63GY' },
    { label: 'Stat 110 (videos)', url: 'https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo' },
  ] },
]
export const MATH_RESOURCES: Resource[] = [
  { label: '3Blue1Brown — Essence of Linear Algebra', url: 'https://www.3blue1brown.com/topics/linear-algebra' },
  { label: 'Mathematics for Machine Learning (free PDF)', url: 'https://mml-book.github.io/' },
  { label: 'Harvard Stat 110 (videos)', url: 'https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo' },
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
      { id: 'ag-value', label: 'Reverse-mode autograd: a Value/Tensor class with a backward() graph', week: 1, res: [{ label: 'micrograd', url: 'https://github.com/karpathy/micrograd' }, { label: 'micrograd video', url: 'https://www.youtube.com/watch?v=VMj-3S1tku0' }] },
      { id: 'ag-ops', label: 'Ops with correct local gradients: +, ×, matmul, ReLU, tanh, exp, log', week: 1, res: [{ label: 'CS231n — Backprop', url: 'https://cs231n.github.io/optimization-2/' }, { label: 'Olah — Backprop', url: 'https://colah.github.io/posts/2015-08-Backprop/' }] },
      { id: 'ag-mlp', label: 'Train a small MLP on a toy dataset end-to-end', week: 2, res: [{ label: 'Zero to Hero', url: 'https://karpathy.ai/zero-to-hero.html' }, { label: 'PyTorch basics', url: 'https://pytorch.org/tutorials/beginner/basics/intro.html' }] },
      { id: 'ag-optims', label: 'Optimizers from scratch: SGD, Momentum, RMSProp, Adam, AdamW', week: 2, res: [{ label: 'Ruder — Optimizers', url: 'https://www.ruder.io/optimizing-gradient-descent/' }, { label: 'distill — Momentum', url: 'https://distill.pub/2017/momentum/' }] },
      { id: 'ag-derive', label: 'Notebook deriving each optimizer update rule + convergence curves', week: 3, res: [{ label: 'Adam paper', url: 'https://arxiv.org/abs/1412.6980' }, { label: 'Ruder — Optimizers', url: 'https://www.ruder.io/optimizing-gradient-descent/' }] },
      { id: 'ag-merge', label: 'Fold into your Gradient-Descent-and-Optimizers repo; run optimizers on your own autograd', week: 3, res: [{ label: 'AdamW paper', url: 'https://arxiv.org/abs/1711.05101' }, { label: 'Lion paper', url: 'https://arxiv.org/abs/2302.06675' }] },
      { id: 'ag-writeup', label: 'README / short writeup with results', week: 4, res: [{ label: 'readme-writer guide', url: 'https://www.makeareadme.com/' }, { label: 'Ruder — Optimizers', url: 'https://www.ruder.io/optimizing-gradient-descent/' }] },
    ],
  },
  {
    id: 'build-gpt',
    title: 'GPT-from-scratch (reproduction)',
    phase: 2,
    kind: 'reproduction',
    steps: [
      { id: 'gpt-tok', label: 'Tokenizer (char-level, then BPE) + batched data loader', week: 5, res: [{ label: 'minbpe', url: 'https://github.com/karpathy/minbpe' }, { label: 'minbpe video', url: 'https://www.youtube.com/watch?v=zduSFxRajkE' }] },
      { id: 'gpt-attn', label: 'Multi-head self-attention by hand (reuse your RoPE attention)', week: 5, res: [{ label: 'Annotated Transformer', url: 'http://nlp.seas.harvard.edu/annotated-transformer/' }, { label: 'Illustrated Transformer', url: 'https://jalammar.github.io/illustrated-transformer/' }] },
      { id: 'gpt-block', label: 'Transformer block: attention + MLP + residual + layernorm', week: 6, res: [{ label: 'nanoGPT', url: 'https://github.com/karpathy/nanoGPT' }, { label: 'LayerNorm paper', url: 'https://arxiv.org/abs/1607.06450' }] },
      { id: 'gpt-train', label: 'Training loop with cross-entropy loss; sample generations', week: 7, res: [{ label: "Let's build GPT", url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY' }, { label: 'nanoGPT', url: 'https://github.com/karpathy/nanoGPT' }] },
      { id: 'gpt-kv', label: 'KV cache for fast inference', week: 7, res: [{ label: 'Transformer Inference Arithmetic', url: 'https://kipp.ly/transformer-inference-arithmetic/' }, { label: 'Lil’Log — inference', url: 'https://lilianweng.github.io/posts/2023-01-10-inference-optimization/' }] },
      { id: 'gpt-ablation', label: 'Original ablation (e.g. RoPE vs learned pos-emb; heads vs loss/compute)', week: 8, res: [{ label: 'RoPE paper', url: 'https://arxiv.org/abs/2104.09864' }, { label: 'RoPE explained', url: 'https://blog.eleuther.ai/rotary-embeddings/' }] },
      { id: 'gpt-writeup', label: 'Writeup with the ablation plot + findings', week: 9, res: [{ label: 'nanoGPT', url: 'https://github.com/karpathy/nanoGPT' }, { label: 'How to write a paper', url: 'https://cs.stanford.edu/people/widom/paper-writing.html' }] },
    ],
  },
  {
    id: 'build-original',
    title: 'Grokking dynamics study (original)',
    phase: 3,
    kind: 'original',
    steps: [
      { id: 'gk-repro', label: 'Reproduce grokking on modular arithmetic with a small transformer', week: 10, res: [{ label: 'Grokking paper', url: 'https://arxiv.org/abs/2201.02177' }, { label: 'Nanda — grokking', url: 'https://www.neelnanda.io/grokking' }] },
      { id: 'gk-hypo', label: 'Form a hypothesis (what drives when generalization kicks in?)', week: 10, res: [{ label: 'Progress measures', url: 'https://arxiv.org/abs/2301.05217' }, { label: 'Grokking paper', url: 'https://arxiv.org/abs/2201.02177' }] },
      { id: 'gk-ablate', label: 'Original ablation: weight decay / data fraction / optimizer vs grokking speed', week: 11, res: [{ label: 'Progress measures', url: 'https://arxiv.org/abs/2301.05217' }, { label: 'Omnigrok', url: 'https://arxiv.org/abs/2210.01117' }] },
      { id: 'gk-plot', label: 'Clean plots of train vs val accuracy over steps', week: 12, res: [{ label: 'Matplotlib guide', url: 'https://matplotlib.org/stable/tutorials/index.html' }, { label: 'Grokking paper', url: 'https://arxiv.org/abs/2201.02177' }] },
      { id: 'gk-present', label: '5-min presentation + writeup (research-interview rehearsal)', week: 14, res: [{ label: 'Alt: DPO paper', url: 'https://arxiv.org/abs/2305.18290' }, { label: 'How to give a talk', url: 'https://www.youtube.com/watch?v=sT_-owjKIbA' }] },
    ],
  },
]

// ---- Production-style coding -------------------------------------------------
export const PRODUCTION: CheckItem[] = [
  { id: 'prod-lru', label: 'LRU cache (clean, tested)', detail: 'OOP design + edge cases', phase: 1, week: 2, res: [
    { label: 'LeetCode — LRU', url: 'https://leetcode.com/problems/lru-cache/' },
    { label: 'NeetCode video', url: 'https://www.youtube.com/watch?v=7ABFKPK2hD4' },
    { label: 'OrderedDict', url: 'https://docs.python.org/3/library/collections.html#collections.OrderedDict' },
  ] },
  { id: 'prod-linreg', label: 'Linear & logistic regression from scratch (+ tests)', phase: 1, week: 3, res: [
    { label: 'ML-From-Scratch', url: 'https://github.com/eriklindernoren/ML-From-Scratch' },
    { label: 'CS229 notes', url: 'https://cs229.stanford.edu/main_notes.pdf' },
    { label: 'StatQuest — LogReg', url: 'https://www.youtube.com/watch?v=yIYKR4sgzI8' },
  ] },
  { id: 'prod-rate', label: 'Rate limiter (token bucket / sliding window)', phase: 1, week: 4, res: [
    { label: 'Token bucket', url: 'https://en.wikipedia.org/wiki/Token_bucket' },
    { label: 'ByteByteGo', url: 'https://bytebytego.com/courses/system-design-interview/design-a-rate-limiter' },
    { label: 'Cloudflare blog', url: 'https://blog.cloudflare.com/counting-things-a-lot-of-different-things/' },
  ] },
  { id: 'prod-bpe', label: 'BPE tokenizer from scratch', phase: 2, week: 5, res: [
    { label: 'minbpe', url: 'https://github.com/karpathy/minbpe' },
    { label: 'minbpe video', url: 'https://www.youtube.com/watch?v=zduSFxRajkE' },
    { label: 'HF tokenizers', url: 'https://huggingface.co/learn/nlp-course/chapter6/5' },
  ] },
  { id: 'prod-allreduce', label: 'All-Reduce / parallel reduction (assessment favourite)', phase: 2, week: 6, res: [
    { label: 'Ring All-Reduce', url: 'https://andrew.gibiansky.com/blog/machine-learning/baidu-allreduce/' },
    { label: 'NCCL docs', url: 'https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/usage/collectives.html' },
    { label: 'Collective ops', url: 'https://en.wikipedia.org/wiki/Collective_operation' },
  ] },
  { id: 'prod-kmeans', label: 'K-means clustering from scratch', phase: 2, week: 7, res: [
    { label: 'ML-From-Scratch', url: 'https://github.com/eriklindernoren/ML-From-Scratch' },
    { label: 'StatQuest — K-means', url: 'https://www.youtube.com/watch?v=4b5d3muPQmA' },
    { label: 'sklearn — K-means', url: 'https://scikit-learn.org/stable/modules/clustering.html#k-means' },
  ] },
  { id: 'prod-softmax', label: 'Softmax, cross-entropy, batchnorm, attention from scratch', phase: 2, week: 8, res: [
    { label: 'Annotated Transformer', url: 'http://nlp.seas.harvard.edu/annotated-transformer/' },
    { label: 'CS231n — Neural nets', url: 'https://cs231n.github.io/neural-networks-2/' },
    { label: 'BatchNorm paper', url: 'https://arxiv.org/abs/1502.03167' },
  ] },
  { id: 'prod-vectorize', label: 'Vectorize / optimize NumPy vector ops (speed matters)', phase: 2, week: 9, res: [
    { label: 'From Python to NumPy', url: 'https://www.labri.fr/perso/nrougier/from-python-to-numpy/' },
    { label: 'NumPy — broadcasting', url: 'https://numpy.org/doc/stable/user/basics.broadcasting.html' },
    { label: '100 NumPy exercises', url: 'https://github.com/rougier/numpy-100' },
  ] },
  { id: 'prod-kvstore', label: 'In-memory key-value store with TTL', phase: 3, week: 10, res: [
    { label: 'Build-your-own-X', url: 'https://github.com/codecrafters-io/build-your-own-x' },
    { label: 'Build your own Redis', url: 'https://build-your-own.org/redis/' },
    { label: 'Redis expiry', url: 'https://redis.io/docs/latest/commands/expire/' },
  ] },
  { id: 'prod-retry', label: 'Retry-with-backoff wrapper + thread-safe queue', phase: 3, week: 11, res: [
    { label: 'Google SRE — overload', url: 'https://sre.google/sre-book/handling-overload/' },
    { label: 'Exponential backoff', url: 'https://en.wikipedia.org/wiki/Exponential_backoff' },
    { label: 'Python queue', url: 'https://docs.python.org/3/library/queue.html' },
  ] },
]
export const PRODUCTION_NOTE =
  'OpenAI’s coding rounds are production-style: write lots of clean code, handle edge cases, structure it well, and think out loud. Build each of these as a small, tested component.'

// ---- Frontier research papers -----------------------------------------------
// The canon a residency candidate is expected to speak to fluently, phased so
// each paper lands the week its ideas show up elsewhere in the plan (e.g. RoPe
// during the GPT build; RLHF/DPO during the alignment weeks). Each has the
// arXiv link plus a strong explainer so you can pick whichever clicks.
export const PAPERS: CheckItem[] = [
  { id: 'paper-transformer', label: 'Attention Is All You Need — the Transformer', detail: '2017', phase: 1, week: 1, res: [
    { label: 'arXiv 1706.03762', url: 'https://arxiv.org/abs/1706.03762' },
    { label: 'Illustrated Transformer', url: 'https://jalammar.github.io/illustrated-transformer/' },
  ] },
  { id: 'paper-gpt3', label: 'GPT-3: Language Models are Few-Shot Learners', detail: 'the scale bet', phase: 1, week: 2, res: [
    { label: 'arXiv 2005.14165', url: 'https://arxiv.org/abs/2005.14165' },
    { label: 'Illustrated GPT-2', url: 'https://jalammar.github.io/illustrated-gpt2/' },
  ] },
  { id: 'paper-scaling', label: 'Scaling Laws for Neural Language Models (Kaplan)', phase: 1, week: 3, res: [
    { label: 'arXiv 2001.08361', url: 'https://arxiv.org/abs/2001.08361' },
    { label: 'Papers with Code', url: 'https://paperswithcode.com/paper/scaling-laws-for-neural-language-models' },
  ] },
  { id: 'paper-chinchilla', label: 'Training Compute-Optimal LLMs — Chinchilla', detail: 'tokens > params', phase: 1, week: 4, res: [
    { label: 'arXiv 2203.15556', url: 'https://arxiv.org/abs/2203.15556' },
    { label: "Chinchilla's implications", url: 'https://www.lesswrong.com/posts/6Fpvch8RR29qLEWNH/chinchilla-s-wild-implications' },
  ] },
  { id: 'paper-rope', label: 'RoFormer — Rotary Position Embeddings (RoPE)', phase: 2, week: 5, res: [
    { label: 'arXiv 2104.09864', url: 'https://arxiv.org/abs/2104.09864' },
    { label: 'EleutherAI blog', url: 'https://blog.eleuther.ai/rotary-embeddings/' },
  ] },
  { id: 'paper-flash', label: 'FlashAttention — IO-aware exact attention', phase: 2, week: 6, res: [
    { label: 'arXiv 2205.14135', url: 'https://arxiv.org/abs/2205.14135' },
    { label: 'flash-attention repo', url: 'https://github.com/Dao-AILab/flash-attention' },
  ] },
  { id: 'paper-lora', label: 'LoRA — Low-Rank Adaptation of LLMs', phase: 2, week: 6, res: [
    { label: 'arXiv 2106.09685', url: 'https://arxiv.org/abs/2106.09685' },
    { label: 'PEFT — LoRA guide', url: 'https://huggingface.co/docs/peft/conceptual_guides/lora' },
  ] },
  { id: 'paper-moe', label: 'Switch Transformers — Mixture of Experts', phase: 2, week: 7, res: [
    { label: 'arXiv 2101.03961', url: 'https://arxiv.org/abs/2101.03961' },
    { label: 'HF — MoE explained', url: 'https://huggingface.co/blog/moe' },
  ] },
  { id: 'paper-cot', label: 'Chain-of-Thought Prompting', phase: 2, week: 8, res: [
    { label: 'arXiv 2201.11903', url: 'https://arxiv.org/abs/2201.11903' },
    { label: 'Prompting Guide — CoT', url: 'https://www.promptingguide.ai/techniques/cot' },
  ] },
  { id: 'paper-emergent', label: 'Emergent Abilities of Large Language Models', phase: 2, week: 9, res: [
    { label: 'arXiv 2206.07682', url: 'https://arxiv.org/abs/2206.07682' },
    { label: 'Jason Wei — emergence', url: 'https://www.jasonwei.net/blog/emergence' },
  ] },
  { id: 'paper-instructgpt', label: 'InstructGPT — training LMs to follow instructions (RLHF)', detail: 'the alignment paper', phase: 3, week: 10, res: [
    { label: 'arXiv 2203.02155', url: 'https://arxiv.org/abs/2203.02155' },
    { label: 'HF — Illustrated RLHF', url: 'https://huggingface.co/blog/rlhf' },
  ] },
  { id: 'paper-prefs', label: 'Deep RL from Human Preferences', phase: 3, week: 10, res: [
    { label: 'arXiv 1706.03741', url: 'https://arxiv.org/abs/1706.03741' },
    { label: 'OpenAI blog', url: 'https://openai.com/index/learning-from-human-preferences/' },
  ] },
  { id: 'paper-dpo', label: 'DPO — Direct Preference Optimization', detail: 'RLHF without RL', phase: 3, week: 11, res: [
    { label: 'arXiv 2305.18290', url: 'https://arxiv.org/abs/2305.18290' },
    { label: 'TRL — DPO trainer', url: 'https://huggingface.co/docs/trl/dpo_trainer' },
  ] },
  { id: 'paper-cai', label: 'Constitutional AI — harmlessness from AI feedback', phase: 3, week: 12, res: [
    { label: 'arXiv 2212.08073', url: 'https://arxiv.org/abs/2212.08073' },
    { label: 'Anthropic research', url: 'https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback' },
  ] },
  { id: 'paper-clip', label: 'CLIP — learning transferable visual models from text', detail: 'multimodal', phase: 3, week: 13, res: [
    { label: 'arXiv 2103.00020', url: 'https://arxiv.org/abs/2103.00020' },
    { label: 'OpenAI blog', url: 'https://openai.com/index/clip/' },
  ] },
  { id: 'paper-ddpm', label: 'DDPM — Denoising Diffusion Probabilistic Models', detail: 'generative', phase: 3, week: 14, res: [
    { label: 'arXiv 2006.11239', url: 'https://arxiv.org/abs/2006.11239' },
    { label: 'Lil’Log — diffusion', url: 'https://lilianweng.github.io/posts/2021-07-11-diffusion-models/' },
  ] },
]
export const PAPERS_NOTE =
  'Read for fluency, not memorization: for each, be able to say what problem it solved, the key idea, and why it mattered. In the research/mentor rounds you’ll be expected to place these on the map and connect them to your own projects.'
export const PAPERS_RESOURCES: Resource[] = [
  { label: 'Papers with Code', url: 'https://paperswithcode.com/' },
  { label: 'Hugging Face — Daily Papers (AK)', url: 'https://huggingface.co/papers' },
  { label: 'Sebastian Raschka — Ahead of AI', url: 'https://magazine.sebastianraschka.com/' },
  { label: 'Lil’Log', url: 'https://lilianweng.github.io/' },
  { label: 'The Annotated Transformer', url: 'http://nlp.seas.harvard.edu/annotated-transformer/' },
]

// ---- Open-source contributions ----------------------------------------------
// A ladder from "read the CONTRIBUTING.md" to "land a substantive merged PR" —
// the last rung is the actual interview talking point. The concrete repos to
// pick from live in OPENSOURCE_TARGETS below (rendered as the section footer),
// each pointing straight at its beginner-friendly issue queue.
export const OPENSOURCE: CheckItem[] = [
  { id: 'os-pick', label: 'Pick 2 target repos; star + watch them and read their CONTRIBUTING.md', detail: 'from the list below', phase: 1, week: 4, res: [
    { label: 'first-contributions', url: 'https://github.com/firstcontributions/first-contributions' },
    { label: 'How to contribute (GitHub)', url: 'https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project' },
  ] },
  { id: 'os-build', label: 'Fork one target, build it from source & get its test suite green locally', phase: 2, week: 6, res: [
    { label: 'Transformers — contributing', url: 'https://huggingface.co/docs/transformers/contributing' },
    { label: 'vLLM — contributing', url: 'https://docs.vllm.ai/en/latest/contributing/index.html' },
  ] },
  { id: 'os-claim', label: 'Claim a “good first issue” — reproduce it and comment your plan of attack', phase: 2, week: 8, res: [
    { label: 'Transformers — good first issues', url: 'https://github.com/huggingface/transformers/contribute' },
    { label: 'vLLM — good first issues', url: 'https://github.com/vllm-project/vllm/labels/good%20first%20issue' },
  ] },
  { id: 'os-docs', label: 'Land a first small PR (docs / typo / test) to learn the review flow', detail: 'get the process reps in', phase: 2, week: 9, res: [
    { label: 'Making a PR (GitHub)', url: 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request' },
  ] },
  { id: 'os-bugfix', label: 'Bug-fix PR with a regression test that a maintainer reviews & merges', phase: 3, week: 11 },
  { id: 'os-feature', label: 'Substantive PR: a new eval task, a kernel, or a real feature', detail: 'the one you’ll talk about', phase: 3, week: 12, res: [
    { label: 'lm-eval — add a task', url: 'https://github.com/EleutherAI/lm-evaluation-harness/blob/main/docs/new_task_guide.md' },
  ] },
  { id: 'os-merged', label: 'Get a substantive PR merged; write it up as an interview story', phase: 3, week: 14 },
]
export const OPENSOURCE_NOTE =
  'A merged PR to a repo the interviewers respect is one of the strongest signals you can bring: it proves you can read a large unfamiliar codebase, work to their standards, and ship. Aim the whole ladder at ONE substantive merge — quality over count.'
// The concrete places to contribute, best interview signal first. Each link goes
// straight to that repo’s beginner-friendly issue queue / contribution entry.
export const OPENSOURCE_TARGETS: Resource[] = [
  { label: 'vLLM — LLM inference engine', url: 'https://github.com/vllm-project/vllm/labels/good%20first%20issue' },
  { label: 'HF Transformers — the models', url: 'https://github.com/huggingface/transformers/contribute' },
  { label: 'HF TRL — RLHF / DPO / GRPO', url: 'https://github.com/huggingface/trl/labels/good%20first%20issue' },
  { label: 'HF PEFT — LoRA / QLoRA', url: 'https://github.com/huggingface/peft/labels/Good%20First%20Issue' },
  { label: 'lm-evaluation-harness — evals', url: 'https://github.com/EleutherAI/lm-evaluation-harness/labels/good%20first%20issue' },
  { label: 'Triton — GPU kernels (born at OpenAI)', url: 'https://github.com/triton-lang/triton/labels/good%20first%20issue' },
  { label: 'HF Accelerate — distributed training', url: 'https://github.com/huggingface/accelerate/labels/Good%20First%20Issue' },
  { label: 'HF Datasets — data tooling', url: 'https://github.com/huggingface/datasets/labels/good%20first%20issue' },
  { label: 'karpathy/llm.c — GPT in raw C/CUDA', url: 'https://github.com/karpathy/llm.c/issues' },
  { label: 'karpathy/nanochat — full-stack ChatGPT', url: 'https://github.com/karpathy/nanochat/issues' },
]

// ---- Brain teasers -----------------------------------------------------------
export interface Teaser {
  id: string
  q: string
  hint: string
  week: number
  res: Resource
}
export const TEASERS: Teaser[] = [
  { id: 'bt-25horses', week: 1, q: '25 horses, 5 tracks, no timer. Fewest races to find the top 3?', hint: '7 races.', res: { label: 'Explanation', url: 'https://puzzling.stackexchange.com/questions/2517/how-do-i-find-the-3-fastest-horses' } },
  { id: 'bt-ropes', week: 2, q: 'Two ropes each burn in 60 min unevenly. Measure 45 minutes.', hint: 'Burn one from both ends + one from one end.', res: { label: 'Explanation', url: 'https://puzzling.stackexchange.com/questions/9138/two-ropes-that-each-take-an-hour-to-burn-measure-45-minutes' } },
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
  papers: CheckItem[]
  opensource: CheckItem[]
  teasers: Teaser[]
  tests: TimedTest[]
}
export function itemsForWeek(week: number): WeekBucket {
  return {
    math: MATH.filter((m) => m.week === week),
    build: BUILD.flatMap((mst) => mst.steps.filter((s) => s.week === week).map((s) => ({ ...s, milestone: mst.title }))),
    production: PRODUCTION.filter((p) => p.week === week),
    papers: PAPERS.filter((p) => p.week === week),
    opensource: OPENSOURCE.filter((o) => o.week === week),
    teasers: TEASERS.filter((t) => t.week === week),
    tests: TESTS.filter((t) => weekOf(t.date) === week),
  }
}
