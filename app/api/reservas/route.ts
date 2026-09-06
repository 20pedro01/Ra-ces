import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured, type ReservacionPayload } from '@/lib/supabase'
import { validateDates } from '@/lib/date-validation'
import { sendReservationConfirmationEmail } from '@/lib/email'

function generateReservationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let random = ''
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `CT-${random}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { state, totals, customer } = body

    if (!state || !totals) {
      return NextResponse.json(
        { error: 'Faltan datos de la reservación (state o totals)' },
        { status: 400 }
      )
    }

    if (state.startDate) {
      const dateVal = validateDates(state.startDate, state.endDate || state.startDate)
      if (!dateVal.isValid) {
        return NextResponse.json({ error: dateVal.error }, { status: 400 })
      }
    }

    const code = generateReservationCode()

    const payload: ReservacionPayload = {
      code,
      start_date: state.startDate ?? null,
      end_date: state.endDate ?? null,
      people: state.people ?? 1,
      zone: state.zone ?? null,
      lodging: state.lodging || null,
      budget: state.budget ?? null,
      transport_enabled: Boolean(state.transportEnabled),
      package_id: state.packageId ?? null,
      package_transport: Boolean(state.packageTransport),
      items: state.items || [],
      total_experiences: totals.experiences ?? 0,
      total_transport: totals.transport ?? 0,
      total_package: totals.packagePrice ?? 0,
      total: totals.total ?? 0,
      customer_name: customer?.name || null,
      customer_email: customer?.email || null,
      customer_phone: customer?.phone || null,
      status: 'confirmada',
    }

    // Si Supabase está configurado con credenciales válidas, guardamos en la base de datos
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('reservaciones')
        .insert([payload])
        .select('id, code, created_at')
        .single()

      if (error) {
        console.error('Error al insertar en Supabase:', error)
        return NextResponse.json(
          {
            error: 'No se pudo guardar la reservación en la base de datos',
            details: error.message,
          },
          { status: 500 }
        )
      }

      // Si el cliente proporcionó correo, enviamos confirmación desde el servidor
      if (customer?.email && customer.email.includes('@')) {
        await sendReservationConfirmationEmail({
          email: customer.email.trim(),
          customerName: customer.name,
          code: data.code,
          startDate: state.startDate,
          total: totals.total ?? 0,
        })
      }

      return NextResponse.json({
        success: true,
        persisted: true,
        code: data.code,
        id: data.id,
        createdAt: data.created_at,
      })
    }

    // Si el cliente proporcionó correo en modo de prueba, también procesamos la notificación
    if (customer?.email && customer.email.includes('@')) {
      await sendReservationConfirmationEmail({
        email: customer.email.trim(),
        customerName: customer.name,
        code,
        startDate: state.startDate,
        total: totals.total ?? 0,
      })
    }

    // Si aún no se configuran las variables de Supabase en .env.local, devolvemos simulación transparente
    return NextResponse.json({
      success: true,
      persisted: false,
      code,
      warning:
        'Supabase no está configurado aún en .env.local. La reservación se procesó en modo de prueba.',
    })
  } catch (err: unknown) {
    console.error('Error inesperado en /api/reservas:', err)
    return NextResponse.json(
      {
        error: 'Error interno al procesar la reservación',
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { error: 'Se requiere el parámetro ?code=...' },
        { status: 400 }
      )
    }

    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json(
        { error: 'Supabase no está configurado aún' },
        { status: 503 }
      )
    }

    const { data, error } = await supabase
      .from('reservaciones')
      .select('*')
      .eq('code', code.toUpperCase())
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Reservación no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, reservacion: data })
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: 'Error al consultar la reservación',
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}
