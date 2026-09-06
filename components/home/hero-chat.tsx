import Link from 'next/link'
import { Compass, Backpack, ArrowRight } from 'lucide-react'
import { GuideBubble } from '@/components/chat/chat-bubble'

export function HeroChat() {
  return (
    <div className="w-full max-w-2xl rounded-[2rem] border border-border/60 bg-background/95 p-4 shadow-2xl shadow-foreground/20 backdrop-blur md:p-6">
      <div className="flex flex-col gap-3">
        <GuideBubble>
          <p>
            ¡Hola! Soy tu guía Raíces.
            <br />
            Estoy aquí para ayudarte a descubrir experiencias auténticas de Yucatán.
          </p>
        </GuideBubble>
        <GuideBubble className="[animation-delay:0.25s]">
          <p className="font-bold">¿Qué quieres hacer?</p>
        </GuideBubble>
      </div>

      <div className="pop-in mt-5 grid gap-3 [animation-delay:0.5s] sm:grid-cols-2">
        <Link
          href="/explorar"
          className="group flex min-h-24 items-center gap-4 rounded-3xl bg-primary p-4 text-primary-foreground shadow-md transition-transform active:scale-[0.99] md:p-5"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/15">
            <Compass className="size-6" aria-hidden="true" />
          </span>
          <span className="flex flex-1 flex-col">
            <span className="text-lg font-bold leading-tight">Armar mi experiencia</span>
            <span className="text-sm text-primary-foreground/85">Te hago unas preguntas y te recomiendo</span>
          </span>
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>

        <Link
          href="/paquetes"
          className="group flex min-h-24 items-center gap-4 rounded-3xl bg-earth p-4 text-earth-foreground shadow-md transition-transform active:scale-[0.99] md:p-5"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-earth-foreground/15">
            <Backpack className="size-6" aria-hidden="true" />
          </span>
          <span className="flex flex-1 flex-col">
            <span className="text-lg font-bold leading-tight">Ver paquetes</span>
            <span className="text-sm text-earth-foreground/85">Rutas listas diseñadas con comunidades</span>
          </span>
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
