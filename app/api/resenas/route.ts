import { NextResponse } from 'next/server'
import { getReviewsForTarget, createReview } from '@/lib/reviews'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const targetId = searchParams.get('targetId')

    if (!targetId) {
      return NextResponse.json(
        { error: 'El parámetro targetId es requerido' },
        { status: 400, headers: corsHeaders }
      )
    }

    const data = await getReviewsForTarget(targetId)

    return NextResponse.json(data, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (err: unknown) {
    console.error('Error al obtener reseñas:', err)
    return NextResponse.json(
      { error: 'Error al consultar reseñas', details: err instanceof Error ? err.message : String(err) },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { targetId, targetType, authorName, authorOrigin, rating, comment } = body || {}

    if (!targetId || !authorName || !comment || typeof rating !== 'number') {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: targetId, authorName, comment o rating' },
        { status: 400, headers: corsHeaders }
      )
    }

    const review = await createReview({
      targetId,
      targetType: targetType === 'package' ? 'package' : 'experience',
      authorName,
      authorOrigin,
      rating,
      comment,
    })

    return NextResponse.json(
      {
        success: true,
        review,
      },
      {
        status: 201,
        headers: {
          ...corsHeaders,
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (err: unknown) {
    console.error('Error al guardar reseña:', err)
    return NextResponse.json(
      { error: 'Error al registrar reseña', details: err instanceof Error ? err.message : String(err) },
      { status: 500, headers: corsHeaders }
    )
  }
}
