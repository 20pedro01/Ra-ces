import { Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function OptionButton({
  selected,
  onClick,
  icon: Icon,
  title,
  description,
  className,
}: {
  selected: boolean
  onClick: () => void
  icon?: LucideIcon
  title: string
  description?: string
  className?: string
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 bg-card px-4 py-3 text-left transition-all active:scale-[0.99]',
        selected
          ? 'border-primary bg-accent shadow-sm'
          : 'border-border hover:border-primary/40 hover:bg-muted/60',
        className,
      )}
    >
      {Icon && (
        <span
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-xl',
            selected ? 'bg-primary text-primary-foreground' : 'bg-sand text-foreground',
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
      )}
      <span className="flex flex-1 flex-col">
        <span className="font-bold leading-tight">{title}</span>
        {description && (
          <span className="text-sm leading-snug text-muted-foreground">{description}</span>
        )}
      </span>
      <span
        className={cn(
          'flex size-6 shrink-0 items-center justify-center rounded-full border-2',
          selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
        )}
        aria-hidden="true"
      >
        {selected && <Check className="size-3.5" />}
      </span>
    </button>
  )
}
