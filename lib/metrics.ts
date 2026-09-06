import fs from 'fs'
import path from 'path'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface MetricsData {
  visitantes: number
  intencion_compra: number
  ultima_actualizacion: string
}

// Archivo local para persistencia inmediata (usando /tmp en Vercel o entorno serverless)
const DATA_FILE = path.join(
  process.env.VERCEL || process.env.NODE_ENV === 'production' ? '/tmp' : process.cwd(),
  '.metrics-store.json'
)

function readLocalMetrics(): MetricsData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8')
      const parsed = JSON.parse(raw)
      return {
        visitantes: Number(parsed.visitantes) || 0,
        intencion_compra: Number(parsed.intencion_compra) || 0,
        ultima_actualizacion: parsed.ultima_actualizacion || new Date().toISOString(),
      }
    }
  } catch (err) {
    console.error('Error al leer .metrics-store.json:', err)
  }
  return {
    visitantes: 0,
    intencion_compra: 0,
    ultima_actualizacion: new Date().toISOString(),
  }
}

function writeLocalMetrics(data: MetricsData) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.warn('Advertencia al guardar .metrics-store.json:', err)
  }
}

export async function getMetrics(): Promise<MetricsData & { tasa_conversion: string }> {
  // 1. Intentar consultar desde Supabase si está disponible
  if (isSupabaseConfigured && supabase) {
    try {
      const [visitasRes, comprasRes] = await Promise.all([
        supabase.from('metricas_mvp').select('*', { count: 'exact', head: true }).eq('tipo', 'visita'),
        supabase.from('metricas_mvp').select('*', { count: 'exact', head: true }).eq('tipo', 'intencion_compra'),
      ])

      let visitantesSupabase = visitasRes.count ?? 0
      let comprasSupabase = comprasRes.count ?? 0

      // Si la tabla metricas_mvp no existe aún o no tiene compras, consultar tabla reservaciones como respaldo
      if (comprasRes.error) {
        const reservasRes = await supabase.from('reservaciones').select('*', { count: 'exact', head: true })
        if (!reservasRes.error && reservasRes.count !== null) {
          comprasSupabase = reservasRes.count
        }
      }

      // Combinar con base local si existe
      const local = readLocalMetrics()
      const visitantes = Math.max(visitantesSupabase, local.visitantes)
      const intencion_compra = Math.max(comprasSupabase, local.intencion_compra)

      const tasa = visitantes > 0 ? ((intencion_compra / visitantes) * 100).toFixed(1) + '%' : '0%'
      return {
        visitantes,
        intencion_compra,
        tasa_conversion: tasa,
        ultima_actualizacion: new Date().toISOString(),
      }
    } catch (err) {
      console.warn('Fallo al consultar Supabase, usando almacenamiento local:', err)
    }
  }

  // 2. Usar almacenamiento local persistente
  const local = readLocalMetrics()
  const tasa = local.visitantes > 0 ? ((local.intencion_compra / local.visitantes) * 100).toFixed(1) + '%' : '0%'
  return {
    ...local,
    tasa_conversion: tasa,
  }
}

export async function recordMetric(
  tipo: 'visita' | 'intencion_compra',
  metadata?: Record<string, unknown>
): Promise<MetricsData> {
  const local = readLocalMetrics()
  if (tipo === 'visita') {
    local.visitantes += 1
  } else if (tipo === 'intencion_compra') {
    local.intencion_compra += 1
  }
  local.ultima_actualizacion = new Date().toISOString()
  writeLocalMetrics(local)

  // También persistir en Supabase si está activo
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('metricas_mvp').insert([
        {
          tipo,
          metadata: metadata || null,
          created_at: new Date().toISOString(),
        },
      ])
    } catch (err) {
      console.warn('No se pudo insertar evento en Supabase metricas_mvp:', err)
    }
  }

  return local
}
