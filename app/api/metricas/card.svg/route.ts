import { getMetrics } from '@/lib/metrics'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const data = await getMetrics()
    const visitantes = Number(data.visitantes || 0).toLocaleString('es-MX')
    const intencionCompra = Number(data.intencion_compra || 0).toLocaleString('es-MX')
    const conversion = data.tasa_conversion || '0.0%'

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="100%" height="100%">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&amp;display=swap');
      .text-font { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    </style>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="125%">
      <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Fondo Principal con bordes redondeados -->
  <rect width="800" height="360" rx="28" fill="url(#bgGrad)"/>

  <!-- Encabezado Superior (Centrado) -->
  <g transform="translate(400, 32)" text-anchor="middle">
    <!-- Badge Validación -->
    <rect x="-90" y="0" width="180" height="24" rx="12" fill="#334155"/>
    <circle cx="-68" cy="12" r="4" fill="#4ade80"/>
    <text x="6" y="16" fill="#cbd5e1" font-size="11" font-weight="700" class="text-font">Validación en campo MVP</text>

    <!-- Título Centrado -->
    <text x="0" y="50" fill="#f8fafc" font-size="22" font-weight="800" class="text-font">Monitor de demanda y métricas · Raíces</text>
    
    <!-- Subtítulo Centrado -->
    <text x="0" y="70" fill="#94a3b8" font-size="12" font-weight="500" class="text-font">Seguimiento en tiempo real de visitantes e intención de compra</text>
  </g>

  <!-- Tarjeta 1: Total Visitantes (Azul Cenote) -->
  <g transform="translate(45, 120)" filter="url(#cardShadow)">
    <rect width="340" height="175" rx="20" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <path d="M 0 20 Q 0 0 20 0 L 320 0 Q 340 0 340 20 L 340 5 L 0 5 Z" fill="#0284c7"/>
    
    <!-- Textos Centrados -->
    <text x="170" y="42" fill="#94a3b8" font-size="13" font-weight="700" class="text-font" text-anchor="middle">Total de visitantes</text>
    <text x="170" y="96" fill="#38bdf8" font-size="46" font-weight="800" class="text-font" text-anchor="middle">${visitantes}</text>
    <text x="170" y="124" fill="#cbd5e1" font-size="11.5" font-weight="500" class="text-font" text-anchor="middle">Personas que abrieron el enlace (sin registro)</text>

    <!-- Badge footer Centrado -->
    <rect x="115" y="138" width="110" height="22" rx="11" fill="#0284c7" fill-opacity="0.2"/>
    <text x="170" y="153" fill="#38bdf8" font-size="11" font-weight="600" class="text-font" text-anchor="middle">Tráfico directo</text>
  </g>

  <!-- Tarjeta 2: Intención de Compra (Verde Selva) con Número y Porcentaje -->
  <g transform="translate(415, 120)" filter="url(#cardShadow)">
    <rect width="340" height="175" rx="20" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <path d="M 0 20 Q 0 0 20 0 L 320 0 Q 340 0 340 20 L 340 5 L 0 5 Z" fill="#15803d"/>

    <!-- Textos Centrados -->
    <text x="170" y="42" fill="#94a3b8" font-size="13" font-weight="700" class="text-font" text-anchor="middle">Intención de compra</text>
    
    <!-- Valor con Número y Porcentaje -->
    <text x="170" y="96" class="text-font" text-anchor="middle">
      <tspan fill="#4ade80" font-size="46" font-weight="800">${intencionCompra}</tspan>
      <tspan fill="#86efac" font-size="24" font-weight="700" dx="8">(${conversion})</tspan>
    </text>

    <text x="170" y="124" fill="#cbd5e1" font-size="11.5" font-weight="500" class="text-font" text-anchor="middle">Llegaron a la etapa de pago</text>

    <!-- Badge footer Centrado -->
    <rect x="115" y="138" width="110" height="22" rx="11" fill="#15803d" fill-opacity="0.25"/>
    <text x="170" y="153" fill="#4ade80" font-size="11" font-weight="600" class="text-font" text-anchor="middle">Demanda real</text>
  </g>

  <!-- Fuente de Datos y Sincronización en Vivo -->
  <g transform="translate(400, 324)" text-anchor="middle">
    <rect x="-185" y="-12" width="370" height="32" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <circle cx="-152" cy="4" r="3.5" fill="#4ade80"/>
    <text x="8" y="8" fill="#94a3b8" font-size="11.5" font-weight="600" class="text-font">
      Fuente: API endpoint · Sincronizado en tiempo real
    </text>
  </g>

</svg>`

    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error al generar SVG de métricas:', error)
    return new Response(
      `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100"><text x="20" y="50" fill="red">Error al cargar métricas</text></svg>`,
      {
        status: 500,
        headers: {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
}
