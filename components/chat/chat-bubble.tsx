import { Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export function GuideAvatar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-full bg-leaf text-leaf-foreground shadow-sm',
        className,
      )}
      aria-hidden="true"
    >
      <Leaf className="size-4" />
    </span>
  )
}

export function GuideBubble({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('chat-in flex items-end gap-2.5', className)}>
      <GuideAvatar />
      <div className="max-w-[85%] rounded-3xl rounded-bl-md bg-card px-4 py-3 text-[15px] leading-relaxed shadow-sm md:max-w-[75%]">
        {children}
      </div>
    </div>
  )
}

export function UserBubble({ children }: { children: ReactNode }) {
  return (
    <div className="chat-in flex justify-end">
      <div className="max-w-[85%] rounded-3xl rounded-br-md bg-primary px-4 py-3 text-[15px] leading-relaxed text-primary-foreground shadow-sm md:max-w-[70%]">
        {children}
      </div>
    </div>
  )
}

export function TypingBubble() {
  return (
    <div className="chat-in flex items-end gap-2.5" aria-label="El guía está escribiendo">
      <GuideAvatar />
      <div className="flex items-center gap-1 rounded-3xl rounded-bl-md bg-card px-4 py-3.5 shadow-sm">
        <span className="typing-dot size-2 rounded-full bg-muted-foreground" />
        <span className="typing-dot size-2 rounded-full bg-muted-foreground [animation-delay:0.15s]" />
        <span className="typing-dot size-2 rounded-full bg-muted-foreground [animation-delay:0.3s]" />
      </div>
    </div>
  )
}
