import type { CheckItem, Resource } from '../data/tracks'
import type { Store } from '../lib/store'
import { Card, SectionTitle, ProgressBar, Checkbox, Pill } from './ui'

// Generic checkbox list with optional resources footer — used by the Math and
// Production-coding tracks.
export default function Checklist({
  icon,
  title,
  items,
  store,
  resources,
  note,
  color = '#818cf8',
}: {
  icon: string
  title: string
  items: CheckItem[]
  store: Store
  resources?: Resource[]
  note?: string
  color?: string
}) {
  const done = items.filter((i) => store.isChecked(i.id)).length
  return (
    <Card className="flex h-full flex-col p-5">
      <SectionTitle icon={icon} title={title} right={<span className="font-mono text-[12px] text-muted">{done}/{items.length}</span>} />
      <div className="mb-3">
        <ProgressBar value={done} total={items.length} color={color} />
      </div>
      {note && <p className="mb-3 text-[12.5px] leading-relaxed text-muted">{note}</p>}
      <ul className="space-y-1.5">
        {items.map((i) => (
          <li key={i.id} className="flex items-start gap-2.5 rounded-lg px-1.5 py-1.5 hover:bg-white/[0.03]">
            <div className="pt-0.5">
              <Checkbox checked={store.isChecked(i.id)} onClick={() => store.toggle(i.id)} />
            </div>
            <div className="min-w-0 flex-1">
              <span className={`text-[13.5px] font-semibold ${store.isChecked(i.id) ? 'text-faint line-through' : 'text-subtle'}`}>{i.label}</span>
              {i.detail && <span className="ml-2 font-mono text-[11px] text-faint">{i.detail}</span>}
              {i.res && (
                <span className="mt-1 flex flex-wrap gap-x-2.5 gap-y-1">
                  {i.res.map((r) => (
                    <a key={r.url} href={r.url} target="_blank" rel="noreferrer" className="whitespace-nowrap font-mono text-[11px] font-bold text-accent-teal/90 hover:text-accent-teal hover:underline">
                      {r.label} ↗
                    </a>
                  ))}
                </span>
              )}
            </div>
            <span className="ml-auto flex shrink-0 items-center gap-1.5 pt-0.5">
              {i.week && <Pill color="#9B98C8">wk {i.week}</Pill>}
              {i.phase && <Pill color={color}>P{i.phase}</Pill>}
            </span>
          </li>
        ))}
      </ul>
      {resources && resources.length > 0 && (
        <div className="mt-4 border-t border-white/8 pt-3">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-wide text-faint">Resources</div>
          <div className="flex flex-wrap gap-2">
            {resources.map((r) => (
              <a key={r.url} href={r.url} target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[12px] font-semibold text-subtle transition hover:border-accent-teal/50 hover:text-accent-teal">
                {r.label} ↗
              </a>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
