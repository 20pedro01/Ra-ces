import { createClient } from '@supabase/supabase-js'

const DEFAULT_SUPABASE_URL = 'https://dgzlrdxxeofyfaradrat.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_tR4GngidXPXNU2ShlKhvSA_N5tL55H3'

const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim()
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY).trim()

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://tu-proyecto.supabase.co'
)

// Cliente para uso en el navegador o en el servidor con clave anónima
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface ReservacionPayload {
  code: string
  start_date: string | null
  end_date: string | null
  people: number
  zone: string | null
  lodging: string | null
  budget: string | null
  transport_enabled: boolean
  package_id: string | null
  package_transport: boolean
  items: Array<{
    experienceId: string
    day: number
    startHour: number
    pickup?: 'recoger' | 'envio'
  }>
  total_experiences: number
  total_transport: number
  total_package: number
  total: number
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  status?: string
}
