import fs from 'fs'
import path from 'path'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface MetricsData {
  visitantes: number
  intencion_compra: number
  ultima_actualizacion: string
}

// Archivo local para persistencia inmediata (resiliente si Supabase aún no está configurado)
const DATA_FILE = path.join(process.cwd(), '.metrics-store.json')

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
    console.error('Error al guardar .metrics-store.json:', err)
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

      const visitantesSupabase = visitasRes.count ?? 0
      const comprasSupabase = comprasRes.count ?? 0

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
