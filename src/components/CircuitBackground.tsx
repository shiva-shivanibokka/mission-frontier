import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

// Full-viewport animated circuit board behind everything: faint traces wiring
// chip nodes together, with little pulses gliding along the wires. This is the
// build-log circuit background re-skinned in the multi-colour embedding palette
// (violet / coral / teal / pink / amber) — each trace, node and pulse takes one
// of those hues. Kept faint so content stays readable. Static frame under
// prefers-reduced-motion.
type RGB = [number, number, number]
type Pt = { x: number; y: number }
type Edge = { a: Pt; b: Pt; c: RGB }
type Pulse = { e: Edge; t: number; sp: number }

const STEP = 46
const PALETTE: RGB[] = [
  [129, 140, 248], // indigo
  [255, 138, 107], // coral
  [70, 224, 208], // teal
  [244, 114, 182], // pink
  [251, 191, 36], // amber
]

export default function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0
    let nodes: { p: Pt; c: RGB }[] = []
    let edges: Edge[] = []
    let pulses: Pulse[] = []
    const pick = (): RGB => PALETTE[(Math.random() * PALETTE.length) | 0]

    const spawn = (): Pulse => {
      const e = edges.length ? edges[(Math.random() * edges.length) | 0] : { a: { x: 0, y: 0 }, b: { x: 0, y: 0 }, c: PALETTE[0] }
      return { e, t: Math.random(), sp: 0.004 + Math.random() * 0.012 }
    }

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cols = Math.ceil(w / STEP)
      const rows = Math.ceil(h / STEP)
      const set = new Set<string>()
      nodes = []
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          if (Math.random() < 0.6) {
            nodes.push({ p: { x: i * STEP, y: j * STEP }, c: pick() })
            set.add(i + '_' + j)
          }
        }
      }
      edges = []
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          if (!set.has(i + '_' + j)) continue
          const x = i * STEP
          const y = j * STEP
          if (set.has(i + 1 + '_' + j) && Math.random() < 0.55) edges.push({ a: { x, y }, b: { x: x + STEP, y }, c: pick() })
          if (set.has(i + '_' + (j + 1)) && Math.random() < 0.55) edges.push({ a: { x, y }, b: { x, y: y + STEP }, c: pick() })
        }
      }
      const count = Math.min(70, Math.max(10, Math.round(edges.length * 0.13)))
      pulses = Array.from({ length: count }, spawn)
    }

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = 1
      for (const e of edges) {
        ctx.strokeStyle = `rgba(${e.c[0]},${e.c[1]},${e.c[2]},0.13)`
        ctx.beginPath()
        ctx.moveTo(e.a.x, e.a.y)
        ctx.lineTo(e.b.x, e.b.y)
        ctx.stroke()
      }
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${n.c[0]},${n.c[1]},${n.c[2]},0.42)`
        ctx.fillRect(n.p.x - 1.4, n.p.y - 1.4, 2.8, 2.8)
      }
    }

    const loop = () => {
      drawStatic()
      for (const p of pulses) {
        p.t += p.sp
        if (p.t > 1) Object.assign(p, spawn())
        const { a, b, c } = p.e
        const x = a.x + (b.x - a.x) * p.t
        const y = a.y + (b.y - a.y) * p.t
        ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`
        ctx.shadowBlur = 12
        ctx.shadowColor = `rgb(${c[0]},${c[1]},${c[2]})`
        ctx.beginPath()
        ctx.arc(x, y, 2.4, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }
      raf = requestAnimationFrame(loop)
    }

    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        build()
        if (reduced) drawStatic()
      }, 150)
    }

    build()
    if (reduced) {
      drawStatic()
    } else {
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
    }
  }, [reduced])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-10 h-full w-full" aria-hidden />
}
