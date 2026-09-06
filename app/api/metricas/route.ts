import { NextResponse } from 'next/server'
import { getMetrics, recordMetric } from '@/lib/metrics'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export async function GET() {
  try {
    const data = await getMetrics()
    return NextResponse.json(data, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (err: unknown) {
    console.error('Error al obtener métricas:', err)
    return NextResponse.json(
      { error: 'Error al consultar métricas', details: err instanceof Error ? err.message : String(err) },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const tipo = body?.evento || body?.tipo

    if (tipo !== 'visita' && tipo !== 'intencion_compra') {
      return NextResponse.json(
        { error: "Tipo de evento inválido. Debe ser 'visita' o 'intencion_compra'." },
        { status: 400, headers: corsHeaders }
      )
    }

    const updated = await recordMetric(tipo, body?.metadata)
    return NextResponse.json(
      {
        success: true,
        evento: tipo,
        metricas: updated,
      },
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (err: unknown) {
    console.error('Error al registrar métrica:', err)
    return NextResponse.json(
      { error: 'Error al procesar evento de métricas', details: err instanceof Error ? err.message : String(err) },
      { status: 500, headers: corsHeaders }
    )
  }
}
