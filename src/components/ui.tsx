import type { ReactNode } from 'react'

// Small shared building blocks used across the tracker sections.

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-2xl border border-white/10 bg-card/60 shadow-card backdrop-blur-md ${className}`}
    >
      {children}
    </section>
  )
}

export function SectionTitle({ icon, title, right }: { icon: string; title: string; right?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2.5 font-display text-[21px] font-extrabold uppercase tracking-wide text-ink">
        <span className="text-[22px]">{icon}</span>
        {title}
      </h2>
      {right}
    </div>
  )
}

export function ProgressBar({ value, total, color = '#818cf8' }: { value: number; total: number; color?: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/8">
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, #46e0d0)` }}
      />
    </div>
  )
}

export function Checkbox({ checked, onClick, locked }: { checked: boolean; onClick: () => void; locked?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={checked}
      title={locked ? 'Auto-checked from your LeetCode' : checked ? 'Done' : 'Mark done'}
      className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border text-[13.5px] font-black transition ${
        checked
          ? 'border-accent-teal/70 bg-accent-teal/20 text-accent-teal'
          : 'border-white/20 bg-white/[0.03] text-transparent hover:border-white/40'
      }`}
    >
      ✓
    </button>
  )
}

export function DiffPill({ d }: { d: 'Easy' | 'Medium' | 'Hard' }) {
  const c = d === 'Easy' ? '#34d399' : d === 'Medium' ? '#fbbf24' : '#fb7185'
  return (
    <span
      className="rounded-md border px-1.5 py-0.5 font-mono text-[12.5px] font-extrabold uppercase"
      style={{ color: c, borderColor: `${c}66`, background: `${c}1f` }}
    >
      {d[0]}
    </span>
  )
}

export function Pill({ children, color = '#818cf8' }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="rounded-full border px-2.5 py-1 font-mono text-[13px] font-bold"
      style={{ color, borderColor: `${color}55`, background: `${color}14` }}
    >
      {children}
    </span>
  )
}
