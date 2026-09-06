export type CategoryId = 'naturaleza' | 'gastronomia' | 'comunidad' | 'nocturno'

export interface Category {
  id: CategoryId
  name: string
  short: string
  description: string
}

export const CATEGORIES: Category[] = [
  {
    id: 'naturaleza',
    name: 'Naturaleza',
    short: 'Naturaleza',
    description:
      'Cenotes, recorridos naturales, abejas meliponas y actividades al aire libre.',
  },
  {
    id: 'gastronomia',
    name: 'Gastronomía',
    short: 'Gastronomía',
    description:
      'Antojitos regionales, cocina tradicional, elaboración de recados y experiencias gastronómicas.',
  },
  {
    id: 'comunidad',
    name: 'Comunidad y cultura',
    short: 'Comunidad',
    description:
      'Artesanía, talleres con artesanos, hamacas, cerámica, talabartería, punto de cruz y tradiciones locales.',
  },
  {
    id: 'nocturno',
    name: 'Experiencias nocturnas',
    short: 'Nocturnas',
    description:
      'Fogatas, leyendas, historias y actividades culturales nocturnas.',
  },
]

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>

export type Zone = 'merida' | 'valladolid' | 'costa' | 'sur'

export const ZONES: { id: Zone; name: string; hint: string }[] = [
  { id: 'merida', name: 'Mérida y alrededores', hint: 'Centro, norte, Umán, Motul' },
  { id: 'valladolid', name: 'Valladolid y oriente', hint: 'Valladolid, Tizimín, Espita' },
  { id: 'costa', name: 'Costa', hint: 'Progreso, Celestún, Río Lagartos' },
  { id: 'sur', name: 'Ruta Puuc y sur', hint: 'Ticul, Maní, Oxkutzcab' },
]

export type BudgetId = 'bajo' | 'medio' | 'alto'

export const BUDGETS: { id: BudgetId; label: string; range: string; max: number }[] = [
  { id: 'bajo', label: 'Económico', range: 'Hasta $800 MXN por persona', max: 800 },
  { id: 'medio', label: 'Intermedio', range: '$800 – $1,800 MXN por persona', max: 1800 },
  { id: 'alto', label: 'Sin límite', range: 'Más de $1,800 MXN por persona', max: Infinity },
]

export interface Experience {
  id: string
  slug: string
  name: string
  category: CategoryId
  location: string
  zone: Zone
  durationHours: number
  price: number
  image: string
  short: string
  description: string
  includes: string[]
  isWorkshop?: boolean
  isNight?: boolean
  provider: string
}

export const EXPERIENCES: Experience[] = [
  {
    id: 'hamacas',
    slug: 'taller-de-hamacas',
    name: 'Taller de elaboración de hamacas',
    category: 'comunidad',
    location: 'Tixkokob',
    zone: 'merida',
    durationHours: 2.5,
    price: 650,
    image: '/images/hamaca.png',
    short:
      'Aprende con artesanas locales las técnicas tradicionales para tejer una hamaca en bastidor.',
    description:
      'En el patio de una casa comunitaria de Tixkokob, maestras artesanas locales te enseñan a montar el hilo en el bastidor y a tejer los primeros tramos de tu propia hamaca. Tú tejes, ellas guían. Te llevas una pieza pequeña y una historia que contar.',
    includes: ['Materiales para tu pieza', 'Agua de chaya y galletas', 'Guía local en español e inglés'],
    isWorkshop: true,
    provider: 'Cooperativa de Artesanas · Tixkokob',
  },
  {
    id: 'ceramica',
    slug: 'taller-de-ceramica',
    name: 'Taller de cerámica maya',
    category: 'comunidad',
    location: 'Ticul',
    zone: 'sur',
    durationHours: 3,
    price: 780,
    image: '/images/ceramica.png',
    short:
      'Moldea tu propia pieza de barro con un maestro ceramista de Ticul, cuna de la alfarería yucateca.',
    description:
      'Ticul huele a barro y a leña. En este taller trabajarás con tus manos una pieza de cerámica desde el amasado hasta el decorado, de la mano de maestros alfareros de la comunidad. Tu pieza se hornea después y puedes recogerla o pedir envío.',
    includes: ['Barro y herramientas', 'Horneado de la pieza', 'Bebida tradicional'],
    isWorkshop: true,
    provider: 'Taller Alfarero Comunitario · Ticul',
  },
  {
    id: 'talabarteria',
    slug: 'taller-de-talabarteria',
    name: 'Taller de talabartería',
    category: 'comunidad',
    location: 'Mérida, Barrio de Santiago',
    zone: 'merida',
    durationHours: 2,
    price: 590,
    image: '/images/talabarteria.png',
    short:
      'Corta, cose y graba en piel una cartera o llavero junto a un talabartero de oficio.',
    description:
      'En un taller de tradición con más de 40 años de oficio en los barrios de Mérida, aprenderás a cortar, perforar y coser a mano una pieza pequeña que te llevas puesta. Una mirada honesta a un oficio que sigue vivo en los barrios de Mérida.',
    includes: ['Piel y herrajes', 'Herramientas', 'Grabado con tus iniciales'],
    isWorkshop: true,
    provider: 'Taller Tradicional de Piel · Mérida',
  },
  {
    id: 'punto-cruz',
    slug: 'taller-de-punto-de-cruz',
    name: 'Bordado en punto de cruz',
    category: 'comunidad',
    location: 'Maní',
    zone: 'sur',
    durationHours: 2,
    price: 480,
    image: '/images/punto-cruz.png',
    short:
      'Borda flores tradicionales con las mujeres de Maní y conoce el significado detrás de cada diseño.',
    description:
      'Bajo la sombra de un patio en Maní, un grupo de bordadoras te enseña a leer los patrones y bordar tu primer diseño floral. Mientras bordas, escuchas historias del pueblo y del huipil.',
    includes: ['Tela, hilos y bastidor', 'Refresco de frutas', 'Acceso al patio comunitario'],
    isWorkshop: true,
    provider: 'Colectivo Lool Beh · Maní',
  },
  {
    id: 'antojitos',
    slug: 'clase-de-antojitos',
    name: 'Clase de antojitos regionales',
    category: 'gastronomia',
    location: 'Mérida, Barrio de Santa Ana',
    zone: 'merida',
    durationHours: 3,
    price: 890,
    image: '/images/antojitos.png',
    short:
      'Prepara panuchos, salbutes y papadzules desde cero en la cocina de una familia meridana.',
    description:
      'Empiezas en el mercado eligiendo ingredientes y terminas en una mesa larga comiendo lo que preparaste. Tú tortillas, tú fríes, tú sirves. Aprendes las diferencias entre panucho y salbute y por qué la cebolla morada va con habanero.',
    includes: ['Visita al mercado', 'Todos los ingredientes', 'Comida completa y recetario'],
    provider: 'Cocina Tradicional Yucateca · Mérida',
  },
  {
    id: 'recados',
    slug: 'taller-de-recados',
    name: 'Elaboración de recados y condimentos',
    category: 'gastronomia',
    location: 'Espita',
    zone: 'valladolid',
    durationHours: 2.5,
    price: 720,
    image: '/images/recados.png',
    short:
      'Tuesta, muele y mezcla las especias del recado rojo y negro, base de la cocina yucateca.',
    description:
      'En Espita se muelen los recados más famosos del oriente. Aprenderás a tostar achiote, chiles y especias en comal, molerlos y formar tus propias pastas. Te llevas frascos de recado hechos por ti.',
    includes: ['Especias y achiote', 'Frascos para llevar', 'Degustación de cochinita'],
    provider: 'Molino Tradicional de Especias · Espita',
  },
  {
    id: 'cenote-abierto',
    slug: 'cenotes-de-homun',
    name: 'Ruta de cenotes en Homún',
    category: 'naturaleza',
    location: 'Homún',
    zone: 'merida',
    durationHours: 5,
    price: 950,
    image: '/images/hero-cenote.png',
    short:
      'Recorre en mototaxi tres cenotes distintos con un guía de la comunidad de Homún.',
    description:
      'Los cenotes de Homún son administrados por familias locales. Un guía de la comunidad te lleva en mototaxi por tres cenotes con caracteres distintos: uno abierto, uno semiabierto y una caverna. Se nada, se descansa y se come en casa de una familia.',
    includes: ['Mototaxi y guía comunitario', 'Acceso a 3 cenotes', 'Chaleco y comida casera'],
    provider: 'Cooperativa Cenotes de Homún',
  },
  {
    id: 'cenote-caverna',
    slug: 'cenote-caverna-al-amanecer',
    name: 'Cenote de caverna al amanecer',
    category: 'naturaleza',
    location: 'Cuzamá',
    zone: 'merida',
    durationHours: 3,
    price: 620,
    image: '/images/cenote-cavern.png',
    short:
      'Baja a una caverna de aguas cristalinas antes de que llegue la gente y vívela en silencio.',
    description:
      'Entrar al cenote a primera hora, cuando el rayo de luz apenas toca el agua, es otra experiencia. Un guía local te acompaña a la caverna y te cuenta lo que este lugar significa para su pueblo.',
    includes: ['Acceso privado temprano', 'Guía local', 'Café y pan dulce'],
    provider: 'Guías Comunitarios de Cuzamá',
  },
  {
    id: 'meliponas',
    slug: 'ruta-abejas-meliponas',
    name: 'Ruta de las abejas meliponas',
    category: 'naturaleza',
    location: 'Maní',
    zone: 'sur',
    durationHours: 4,
    price: 850,
    image: '/images/meliponas.png',
    short:
      'Conoce el meliponario de una familia maya, aprende del cuidado de la Xunán Kab y prueba su miel.',
    description:
      'La Xunán Kab es una abeja sin aguijón que los mayas cuidan desde hace siglos. Visitas el meliponario de una familia en Maní, ayudas a revisar los jobones, aprendes cómo se cosecha la miel y la pruebas junto con productos hechos con ella.',
    includes: ['Visita al meliponario', 'Cosecha guiada', 'Degustación de miel y productos'],
    provider: 'Meliponario U Najil Kab · Maní',
  },
  {
    id: 'senderismo',
    slug: 'sendero-de-plantas-medicinales',
    name: 'Sendero de plantas medicinales',
    category: 'naturaleza',
    location: 'Yaxunah',
    zone: 'valladolid',
    durationHours: 2.5,
    price: 450,
    image: '/images/senderismo.png',
    short:
      'Camina la selva baja con un guía maya que te enseña las plantas que curan y alimentan.',
    description:
      'Un recorrido lento por los caminos de Yaxunah, aprendiendo a reconocer plantas que la comunidad usa para curar, cocinar y construir. Termina en el cenote del pueblo.',
    includes: ['Guía comunitario', 'Baño en cenote', 'Infusión de hierbas'],
    provider: 'Centro Cultural Yaxunah',
  },
  {
    id: 'flamencos',
    slug: 'flamencos-en-celestun',
    name: 'Flamencos y manglar en Celestún',
    category: 'naturaleza',
    location: 'Celestún',
    zone: 'costa',
    durationHours: 4,
    price: 1100,
    image: '/images/flamencos.png',
    short:
      'Navega la ría con pescadores locales para observar flamencos y el ojo de agua del manglar.',
    description:
      'Los lancheros de Celestún conocen la ría mejor que nadie. Con ellos observas flamencos a distancia respetuosa, recorres el túnel de manglar y te bañas en un ojo de agua dulce.',
    includes: ['Lancha con capitán local', 'Chalecos', 'Ceviche de la cooperativa'],
    provider: 'Cooperativa de Lancheros de Celestún',
  },
  {
    id: 'fogata',
    slug: 'fogata-de-leyendas',
    name: 'Fogata de leyendas locales',
    category: 'nocturno',
    location: 'Yaxunah',
    zone: 'valladolid',
    durationHours: 2,
    price: 380,
    image: '/images/fogata.png',
    short:
      'Alrededor del fuego, habitantes de la comunidad comparten leyendas, historias y tradiciones de Yucatán.',
    description:
      'Cuando cae la noche, la comunidad enciende la fogata. Se sirve chocolate caliente y los mayores cuentan sobre los aluxes, la Xtabay y el Huay Chivo. Sin escenario ni micrófonos: solo el fuego, las voces y el cielo.',
    includes: ['Chocolate caliente y pan', 'Narradores de la comunidad', 'Traducción al inglés'],
    isNight: true,
    provider: 'Comunidad de Yaxunah',
  },
  {
    id: 'vaqueria',
    slug: 'noche-de-vaqueria',
    name: 'Noche de vaquería en la plaza',
    category: 'nocturno',
    location: 'Motul',
    zone: 'merida',
    durationHours: 2.5,
    price: 320,
    image: '/images/noche-vaqueria.png',
    short:
      'Vive una vaquería tradicional con jarana, ternos bordados y una cena de huevos motuleños.',
    description:
      'La plaza de Motul se llena de música de jarana. Aprendes los pasos básicos con un grupo local, escuchas bombas yucatecas y cenas los huevos motuleños originales.',
    includes: ['Clase de jarana', 'Cena tradicional', 'Lugar reservado'],
    isNight: true,
    provider: 'Grupo Jaranero de Motul',
  },
]

export const EXPERIENCE_MAP = Object.fromEntries(
  EXPERIENCES.map((e) => [e.id, e]),
) as Record<string, Experience>

export function getExperienceBySlug(slug: string) {
  return EXPERIENCES.find((e) => e.slug === slug)
}

export interface TourPackage {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  image: string
  durationLabel: string
  location: string
  price: number
  activities: string[]
  includes: string[]
  bring: string[]
  transportPrice: number
  featured?: boolean
  experienceIds: string[]
}

export const PACKAGES: TourPackage[] = [
  {
    id: 'meliponas',
    slug: 'ruta-de-las-abejas-meliponas',
    name: 'Ruta de las Abejas Meliponas',
    tagline: 'Un día con las guardianas de la miel maya',
    description:
      'Visita una comunidad del sur de Yucatán y pasa el día con una familia que cuida abejas meliponas desde hace generaciones. Conoces la Xunán Kab, aprendes cómo se cuida y cómo se produce su miel, participas en una cosecha y terminas con una degustación de productos hechos en casa.',
    image: '/images/meliponas.png',
    durationLabel: '1 día · 7 horas',
    location: 'Maní, sur de Yucatán',
    price: 1450,
    activities: [
      'Bienvenida en la comunidad de Maní',
      'Visita al meliponario familiar y presentación de la Xunán Kab',
      'Explicación del cuidado y ciclo de las abejas meliponas',
      'Cosecha guiada de miel en jobones tradicionales',
      'Taller con productores: elaboración de bálsamo de miel',
      'Degustación de miel, pox y productos de la comunidad',
    ],
    includes: [
      'Guía comunitario bilingüe',
      'Comida tradicional en casa de familia',
      'Frasco de miel melipona y bálsamo',
      'Aportación directa a la cooperativa',
    ],
    bring: ['Ropa cómoda y clara', 'Sombrero y bloqueador', 'Botella reutilizable', 'Repelente natural'],
    transportPrice: 350,
    featured: true,
    experienceIds: ['meliponas', 'punto-cruz'],
  },
  {
    id: 'cenotes-fogata',
    slug: 'cenotes-y-leyendas',
    name: 'Cenotes y leyendas de Yaxunah',
    tagline: 'Del agua cristalina al fuego de la noche',
    description:
      'Un día completo en la comunidad de Yaxunah: caminas la selva baja con un guía maya, nadas en el cenote del pueblo y cierras la jornada alrededor de una fogata escuchando leyendas contadas por sus habitantes.',
    image: '/images/fogata.png',
    durationLabel: '1 día · tarde y noche',
    location: 'Yaxunah, oriente de Yucatán',
    price: 1150,
    activities: [
      'Sendero de plantas medicinales con guía comunitario',
      'Baño en el cenote Lol-Ha',
      'Cena en casa de familia',
      'Fogata de leyendas locales',
    ],
    includes: ['Guía comunitario', 'Cena tradicional', 'Chocolate caliente y pan', 'Traducción al inglés'],
    bring: ['Traje de baño y toalla', 'Ropa de manga larga para la noche', 'Lámpara pequeña'],
    transportPrice: 420,
    experienceIds: ['senderismo', 'fogata'],
  },
  {
    id: 'sabores',
    slug: 'sabores-de-yucatan',
    name: 'Sabores de Yucatán',
    tagline: 'Del mercado a la mesa, con tus manos',
    description:
      'Una jornada gastronómica en la que participas en todo: eliges ingredientes en el mercado, mueles tu propio recado y preparas antojitos regionales con una familia meridana.',
    image: '/images/antojitos.png',
    durationLabel: '1 día · 6 horas',
    location: 'Mérida',
    price: 1350,
    activities: [
      'Recorrido por el mercado de Santa Ana',
      'Elaboración de recado rojo',
      'Clase de panuchos, salbutes y papadzules',
      'Comida compartida y recetario',
    ],
    includes: ['Todos los ingredientes', 'Comida completa', 'Frasco de recado', 'Recetario impreso'],
    bring: ['Apetito', 'Ropa que pueda mancharse', 'Cuaderno si te gusta anotar'],
    transportPrice: 250,
    experienceIds: ['antojitos', 'recados'],
  },
  {
    id: 'manos',
    slug: 'manos-artesanas',
    name: 'Manos artesanas',
    tagline: 'Dos talleres, dos oficios vivos',
    description:
      'Pasa el día entre artesanos: teje los primeros tramos de una hamaca en Tixkokob por la mañana y trabaja la piel con un talabartero de Mérida por la tarde.',
    image: '/images/hamaca.png',
    durationLabel: '1 día · 6 horas',
    location: 'Tixkokob y Mérida',
    price: 1290,
    activities: [
      'Taller de hamacas con la familia Canul',
      'Comida en Tixkokob',
      'Taller de talabartería en Santiago',
    ],
    includes: ['Materiales de ambos talleres', 'Comida regional', 'Pieza de piel personalizada'],
    bring: ['Ropa cómoda', 'Paciencia y ganas de aprender'],
    transportPrice: 300,
    experienceIds: ['hamacas', 'talabarteria'],
  },
]

export function getPackageBySlug(slug: string) {
  return PACKAGES.find((p) => p.slug === slug)
}

export const TRANSPORT_PRICE_PER_PERSON = 250
