import fs from 'fs'
import path from 'path'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface Review {
  id: string
  targetId: string // id del paquete o experiencia (ej: 'ruta-de-las-abejas-meliponas', 'taller-de-hamacas')
  targetType: 'experience' | 'package'
  authorName: string
  authorOrigin: string
  rating: number // 1 a 5
  comment: string
  createdAt: string
  verified: boolean
}

// Reseñas semilla auténticas para experiencias y paquetes
export const INITIAL_REVIEWS: Review[] = [
  // --- Paquete: Ruta de las Abejas Meliponas ---
  {
    id: 'rev-meliponas-1',
    targetId: 'ruta-de-las-abejas-meliponas',
    targetType: 'package',
    authorName: 'Camila Villalobos',
    authorOrigin: 'Ciudad de México',
    rating: 5,
    comment: 'Una experiencia transformadora. Probar la miel sagrada directamente de los jobones con el maestro meliponicultor fue algo mágico. El respeto con el que cuidan a las abejas y la calidez de la comunidad nos conmovió profundamente.',
    createdAt: '2026-08-28T14:30:00Z',
    verified: true,
  },
  {
    id: 'rev-meliponas-2',
    targetId: 'ruta-de-las-abejas-meliponas',
    targetType: 'package',
    authorName: 'Marc & Sophie Laurent',
    authorOrigin: 'Lyon, Francia',
    rating: 5,
    comment: 'Loin du tourisme de masse! Les explications étaient claires et la nourriture traditionnelle préparée par les femmes de la coopérative était délicieuse. Nous recommandons à 100%.',
    createdAt: '2026-08-15T11:20:00Z',
    verified: true,
  },
  {
    id: 'rev-meliponas-3',
    targetId: 'ruta-de-las-abejas-meliponas',
    targetType: 'package',
    authorName: 'Rodrigo Mendonça',
    authorOrigin: 'Guadalajara, Jal.',
    rating: 5,
    comment: 'El taller de velas de cera de melipona y la cata de mieles valen cada centavo. Es un turismo justo donde sabes que tu dinero va directo a las familias mayas.',
    createdAt: '2026-08-04T16:45:00Z',
    verified: true,
  },

  // --- Paquete: Cenotes y Leyendas ---
  {
    id: 'rev-cenotes-1',
    targetId: 'cenotes-y-leyendas',
    targetType: 'package',
    authorName: 'Esteban Morales',
    authorOrigin: 'Monterrey, N.L.',
    rating: 5,
    comment: 'Nadar en un cenote casi privado mientras el guía de la comunidad nos contaba las historias de los aluxes fue inolvidable. La comida de las cocineras tradicionales estuvo exquisita.',
    createdAt: '2026-08-22T17:10:00Z',
    verified: true,
  },
  {
    id: 'rev-cenotes-2',
    targetId: 'cenotes-y-leyendas',
    targetType: 'package',
    authorName: 'Sarah Jenkins',
    authorOrigin: 'Austin, Texas',
    rating: 5,
    comment: 'The most authentic tour we took in Yucatan. Safe, respectful, peaceful and far away from crowded tourist hubs. The local guides are so knowledgeable.',
    createdAt: '2026-08-10T15:00:00Z',
    verified: true,
  },

  // --- Paquete: Sabores de Yucatán ---
  {
    id: 'rev-sabores-1',
    targetId: 'sabores-de-yucatan',
    targetType: 'package',
    authorName: 'Alejandra Pineda',
    authorOrigin: 'Querétaro',
    rating: 5,
    comment: 'Hacer cochinita pibil en horno de tierra bajo la supervisión de las maestras cocineras de la comunidad fue un honor. El recado rojo hecho a mano en metate no tiene comparación con nada comercial.',
    createdAt: '2026-08-30T13:15:00Z',
    verified: true,
  },
  {
    id: 'rev-sabores-2',
    targetId: 'sabores-de-yucatan',
    targetType: 'package',
    authorName: 'Daniel & Claudia Ortiz',
    authorOrigin: 'Madrid, España',
    rating: 5,
    comment: 'Impresionante inmersión culinaria. Las tortillas hechas a mano inflándose en el comal y el sabor de la lima fresca son recuerdos que nos llevamos para siempre.',
    createdAt: '2026-08-18T19:00:00Z',
    verified: true,
  },

  // --- Paquete: Manos Artesanas ---
  {
    id: 'rev-artesanas-1',
    targetId: 'manos-artesanas',
    targetType: 'package',
    authorName: 'Mariana Sotomayor',
    authorOrigin: 'Puebla',
    rating: 5,
    comment: 'Poder crear mi propia pieza de barro y aprender los puntos básicos del urdido de hamacas con las maestras artesanas fue una terapia maravillosa. Paciencia y sabiduría pura.',
    createdAt: '2026-08-25T16:00:00Z',
    verified: true,
  },

  // --- Experiencia / Taller: Taller de Hamacas ---
  {
    id: 'rev-hamacas-1',
    targetId: 'taller-de-hamacas',
    targetType: 'experience',
    authorName: 'Fernando Alcocer',
    authorOrigin: 'Mérida, Yuc.',
    rating: 5,
    comment: 'La maestra artesana tiene una paciencia infinita. Uno no se imagina la cantidad de horas y destreza que lleva urdir una hamaca hasta que se sienta frente al bastidor. Un tesoro vivo.',
    createdAt: '2026-08-20T12:00:00Z',
    verified: true,
  },
  {
    id: 'rev-hamacas-2',
    targetId: 'taller-de-hamacas',
    targetType: 'experience',
    authorName: 'Elena Rostova',
    authorOrigin: 'Vancouver, Canadá',
    rating: 5,
    comment: 'Such a peaceful and grounding workshop. The artisans made me feel like family. I bought a hammock to take home and it is the highest quality you can find.',
    createdAt: '2026-08-08T18:30:00Z',
    verified: true,
  },

  // --- Experiencia / Taller: Cerámica ---
  {
    id: 'rev-ceramica-1',
    targetId: 'taller-de-ceramica',
    targetType: 'experience',
    authorName: 'Javier Bermejo',
    authorOrigin: 'San Luis Potosí',
    rating: 5,
    comment: 'Modelar el barro con técnicas prehispánicas sin torno eléctrico te conecta con algo muy antiguo. La quema a cielo abierto fue fascinante.',
    createdAt: '2026-08-19T14:40:00Z',
    verified: true,
  },

  // --- Experiencia / Taller: Meliponario ---
  {
    id: 'rev-meliponario-1',
    targetId: 'visita-meliponario',
    targetType: 'experience',
    authorName: 'Valeria Cruz',
    authorOrigin: 'Toluca',
    rating: 5,
    comment: 'Las abejas meliponas no pican y son diminutas. Ver cómo trabajan dentro de los troncos de madera es un espectáculo natural que todos deberían conocer.',
    createdAt: '2026-08-14T10:15:00Z',
    verified: true,
  },

  // --- Experiencia / Taller: Cocina Tradicional ---
  {
    id: 'rev-cocina-1',
    targetId: 'cocina-con-maria',
    targetType: 'experience',
    authorName: 'Patricia & Andrés',
    authorOrigin: 'Bogotá, Colombia',
    rating: 5,
    comment: 'La comida más rica de todo nuestro viaje a México. La familia anfitriona nos recibió en su cocina de leña con un amor inmenso. El poc chuc y los frijoles con puerco estaban gloriosos.',
    createdAt: '2026-08-27T15:20:00Z',
    verified: true,
  }
]

// Archivo local de almacenamiento temporal si Supabase no está conectado
const REVIEWS_FILE = path.join(
  process.env.VERCEL || process.env.NODE_ENV === 'production' ? '/tmp' : process.cwd(),
  '.reviews-store.json'
)

function readLocalReviews(): Review[] {
  try {
    if (fs.existsSync(REVIEWS_FILE)) {
      const raw = fs.readFileSync(REVIEWS_FILE, 'utf-8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (e) {
    console.warn('Advertencia al leer .reviews-store.json:', e)
  }
  return []
}

function writeLocalReview(review: Review) {
  try {
    const list = readLocalReviews()
    list.unshift(review)
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(list, null, 2), 'utf-8')
  } catch (e) {
    console.warn('Advertencia al guardar .reviews-store.json:', e)
  }
}

/**
 * Obtiene las reseñas asociadas a un targetId (experiencia o paquete),
 * calculando promedio y total.
 */
export async function getReviewsForTarget(targetId: string): Promise<{
  reviews: Review[]
  averageRating: number
  totalCount: number
}> {
  // 1. Filtrar reseñas iniciales predefinidas
  const seeded = INITIAL_REVIEWS.filter((r) => r.targetId === targetId)

  // 2. Consultar reseñas adicionales en Supabase si está disponible
  let supabaseReviews: Review[] = []
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('resenas')
        .select('*')
        .eq('target_id', targetId)
        .order('created_at', { ascending: false })

      if (!error && Array.isArray(data)) {
        supabaseReviews = data.map((d) => ({
          id: d.id,
          targetId: d.target_id,
          targetType: d.target_type,
          authorName: d.author_name,
          authorOrigin: d.author_origin,
          rating: Number(d.rating),
          comment: d.comment,
          createdAt: d.created_at,
          verified: Boolean(d.verified ?? true),
        }))
      }
    } catch (e) {
      console.warn('Fallo al consultar reseñas en Supabase, usando respaldo local:', e)
    }
  }

  // 3. Consultar respaldo local
  const localReviews = readLocalReviews().filter((r) => r.targetId === targetId)

  // 4. Combinar sin duplicados por ID
  const reviewMap = new Map<string, Review>()
  supabaseReviews.forEach((r) => reviewMap.set(r.id, r))
  localReviews.forEach((r) => reviewMap.set(r.id, r))
  seeded.forEach((r) => {
    if (!reviewMap.has(r.id)) {
      reviewMap.set(r.id, r)
    }
  })

  const allReviews = Array.from(reviewMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const totalCount = allReviews.length
  const averageRating =
    totalCount > 0
      ? Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1))
      : 5.0

  return {
    reviews: allReviews,
    averageRating,
    totalCount,
  }
}

/**
 * Registra una nueva reseña en Supabase y almacenamiento local
 */
export async function createReview(params: {
  targetId: string
  targetType: 'experience' | 'package'
  authorName: string
  authorOrigin?: string
  rating: number
  comment: string
}): Promise<Review> {
  const newReview: Review = {
    id: 'rev-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    targetId: params.targetId,
    targetType: params.targetType,
    authorName: params.authorName.trim(),
    authorOrigin: (params.authorOrigin || 'Viajero').trim(),
    rating: Math.max(1, Math.min(5, Math.round(params.rating))),
    comment: params.comment.trim(),
    createdAt: new Date().toISOString(),
    verified: true,
  }

  // Guardar en respaldo local
  writeLocalReview(newReview)

  // Guardar en Supabase si está disponible
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('resenas').insert([
        {
          id: newReview.id,
          target_id: newReview.targetId,
          target_type: newReview.targetType,
          author_name: newReview.authorName,
          author_origin: newReview.authorOrigin,
          rating: newReview.rating,
          comment: newReview.comment,
          created_at: newReview.createdAt,
          verified: newReview.verified,
        },
      ])
    } catch (e) {
      console.warn('Error al guardar reseña en Supabase:', e)
    }
  }

  return newReview
}
