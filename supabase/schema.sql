-- ==============================================================================
-- Esquema de Base de Datos para Raíces (Supabase / PostgreSQL)
-- Ejecuta este script en el SQL Editor de tu proyecto en Supabase
-- ==============================================================================

-- 1. Crear tabla de reservaciones
CREATE TABLE IF NOT EXISTS public.reservaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  
  -- Fechas del viaje
  start_date DATE,
  end_date DATE,
  
  -- Huéspedes y detalles de viaje
  people INTEGER NOT NULL DEFAULT 1,
  zone TEXT,
  lodging TEXT,
  budget TEXT,
  
  -- Transporte y paquetes
  transport_enabled BOOLEAN NOT NULL DEFAULT false,
  package_id TEXT,
  package_transport BOOLEAN NOT NULL DEFAULT false,
  
  -- Lista de experiencias seleccionadas y configuración de extras (recoger/envío)
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Totales calculados en MXN
  total_experiences NUMERIC(10, 2) DEFAULT 0,
  total_transport NUMERIC(10, 2) DEFAULT 0,
  total_package NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  
  -- Datos opcionales del cliente (para confirmación y contacto)
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  
  -- Estado de la reserva
  status TEXT NOT NULL DEFAULT 'confirmada'
);

-- 2. Índices para acelerar búsquedas
CREATE INDEX IF NOT EXISTS idx_reservaciones_code ON public.reservaciones (code);
CREATE INDEX IF NOT EXISTS idx_reservaciones_created_at ON public.reservaciones (created_at DESC);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.reservaciones ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Seguridad (RLS)
-- Permitir a los visitantes (anon) crear una nueva reservación
CREATE POLICY "Permitir inserción pública de reservaciones"
  ON public.reservaciones
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Permitir consultar reservaciones públicamente por código o id
CREATE POLICY "Permitir lectura de reservaciones"
  ON public.reservaciones
  FOR SELECT
  TO anon, authenticated
  USING (true);
