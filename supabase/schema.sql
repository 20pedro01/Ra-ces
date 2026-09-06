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

-- ==============================================================================
-- 5. Tabla de Lista de Espera / Notificaciones de Disponibilidad
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.lista_espera (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  email TEXT NOT NULL,
  target_date DATE,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pendiente'
);

CREATE INDEX IF NOT EXISTS idx_lista_espera_email ON public.lista_espera (email);
CREATE INDEX IF NOT EXISTS idx_lista_espera_created_at ON public.lista_espera (created_at DESC);

ALTER TABLE public.lista_espera ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir inserción pública en lista_espera"
  ON public.lista_espera
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ==============================================================================
-- 6. Tabla de Métricas MVP (Visitantes e Intención de Compra)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.metricas_mvp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  tipo TEXT NOT NULL, -- 'visita' | 'intencion_compra'
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_metricas_tipo ON public.metricas_mvp (tipo);
CREATE INDEX IF NOT EXISTS idx_metricas_created_at ON public.metricas_mvp (created_at DESC);

ALTER TABLE public.metricas_mvp ENABLE ROW LEVEL SECURITY;

-- Permitir a los visitantes (anon) registrar eventos de métricas
CREATE POLICY "Permitir inserción pública en metricas_mvp"
  ON public.metricas_mvp
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Permitir consultar las métricas públicamente
CREATE POLICY "Permitir lectura de metricas_mvp"
  ON public.metricas_mvp
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ==============================================================================
-- 7. Tabla de Reseñas y Testimonios (Experiencias, Talleres y Paquetes)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.resenas (
  id VARCHAR(50) PRIMARY KEY,
  target_id TEXT NOT NULL,       -- id de la experiencia o paquete
  target_type TEXT NOT NULL,     -- 'experience' | 'package'
  author_name TEXT NOT NULL,
  author_origin TEXT DEFAULT 'Viajero',
  rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  verified BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_resenas_target_id ON public.resenas (target_id);
CREATE INDEX IF NOT EXISTS idx_resenas_created_at ON public.resenas (created_at DESC);

ALTER TABLE public.resenas ENABLE ROW LEVEL SECURITY;

-- Permitir a cualquier visitante publicar una reseña
CREATE POLICY "Permitir inserción pública de reseñas"
  ON public.resenas
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Permitir leer reseñas públicamente
CREATE POLICY "Permitir lectura pública de reseñas"
  ON public.resenas
  FOR SELECT
  TO anon, authenticated
  USING (true);


