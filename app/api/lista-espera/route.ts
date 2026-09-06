import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, targetDate, experienceOrPackage, notes } = body

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Correo electrónico inválido' },
        { status: 400 }
      )
    }

    // Si Supabase está disponible, intentamos guardar en la tabla lista_espera
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('lista_espera').insert([
        {
          email: email.trim().toLowerCase(),
          target_date: targetDate || null,
          notes: experienceOrPackage
            ? `Interés en: ${experienceOrPackage}${notes ? ` - ${notes}` : ''}`
            : notes || null,
          status: 'pendiente',
        },
      ])

      if (error) {
        console.warn(
          'Aviso: no se pudo insertar en la tabla lista_espera (puede requerir ejecutar el schema actualizado en Supabase):',
          error.message
        )
      } else {
        return NextResponse.json({ success: true, persisted: true })
      }
    }

    return NextResponse.json({
      success: true,
      persisted: false,
      message: 'Solicitud recibida correctamente.',
    })
  } catch (err: unknown) {
    console.error('Error en /api/lista-espera:', err)
    return NextResponse.json(
      { error: 'Error interno al registrar solicitud' },
      { status: 500 }
    )
  }
}
