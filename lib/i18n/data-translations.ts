import type { Experience, TourPackage, Category, Zone, BudgetId } from '@/lib/data'
import type { Locale } from './translations'

export const CATEGORIES_EN: Record<string, { name: string; short: string; description: string }> = {
  naturaleza: {
    name: 'Nature & Wildlife',
    short: 'Nature',
    description: 'Cenotes, natural trails, melipona native stingless bees, and outdoor adventures.',
  },
  gastronomia: {
    name: 'Gastronomy & Cuisine',
    short: 'Food',
    description: 'Regional dishes, traditional smoke cooking, spice recado crafting, and culinary heritage.',
  },
  comunidad: {
    name: 'Community & Heritage',
    short: 'Community',
    description: 'Living artisan workshops: hammocks, clay pottery, leathercraft, cross-stitch embroidery, and Mayan traditions.',
  },
  nocturno: {
    name: 'Night Experiences',
    short: 'Night',
    description: 'Campfires, stargazing, ancestral legends, and cultural evening tours.',
  },
}

export const ZONES_EN: Record<Zone, { name: string; hint: string }> = {
  merida: { name: 'Mérida & Surroundings', hint: 'Downtown, North, Umán, Motul' },
  valladolid: { name: 'Valladolid & East', hint: 'Valladolid, Tizimín, Espita' },
  costa: { name: 'Gulf Coast', hint: 'Progreso, Celestún, Río Lagartos' },
  sur: { name: 'Puuc Route & South', hint: 'Ticul, Maní, Oxkutzcab' },
}

export const BUDGETS_EN: Record<BudgetId, { label: string; range: string }> = {
  bajo: { label: 'Budget-Friendly', range: 'Up to $800 MXN per person' },
  medio: { label: 'Moderate', range: '$800 – $1,800 MXN per person' },
  alto: { label: 'All-Inclusive / Flexible', range: 'Over $1,800 MXN per person' },
}

export const EXPERIENCES_EN: Record<string, Partial<Experience>> = {
  'taller-de-hamacas': {
    name: 'Traditional Hammock Weaving Workshop',
    location: 'Tixkokob',
    short: 'Learn the ancestral Maya technique of hammock weaving from Doña Martha.',
    description:
      'Immerse yourself in a home workshop in Tixkokob. Doña Martha and her family have woven traditional hammocks for three generations. Learn to handle the shuttle, choose vibrant color combinations, and weave your own sample piece to take home.',
    includes: [
      'Instruction from master artisan Doña Martha',
      'All thread, loom, and wooden shuttle supplies',
      'Woven mini-hammock sampler crafted by you',
      'Chilled regional drink and fruit snack',
    ],
    artisanName: 'Doña Martha Poot',
    artisanQuote: 'Each woven knot carries our family history and generations of Mayan patience.',
  },
  'taller-de-ceramica': {
    name: 'Red Clay Pottery Workshop',
    location: 'Ticul',
    short: 'Shape local clay into ancestral pots and Mayan whistles alongside Don Celso.',
    description:
      'Visit the historic pottery town of Ticul. In Don Celso’s family studio, work with raw red clay extracted from regional soil, learn ancestral pinching and wheel techniques, and create your own ceramic piece.',
    includes: [
      'Hands-on guidance from master potter Don Celso',
      'Natural clay, sculpting tools, and kiln preparation',
      'Your sculpted and fired ceramic piece',
      'Option for home delivery once fired and cooled',
    ],
    artisanName: 'Don Celso May',
    artisanQuote: 'Clay has its own breath; we simply teach hands how to listen to the earth.',
  },
  'taller-de-talabarteria': {
    name: 'Artisanal Leathercraft Workshop',
    location: 'Valladolid',
    short: 'Design, bevel, and stitch your own genuine leather souvenir in Valladolid.',
    description:
      'Step inside Don Fernando’s traditional leather shop. Master the ancient leatherworking craft: cutting, edging, hand-stitching, and stamping custom motifs into fine regional leather.',
    includes: [
      'Masterclass with craftsman Don Fernando',
      'Premium leather hide, beveling irons, and waxed threads',
      'Handmade leather cardholder or passport wallet made by you',
    ],
    artisanName: 'Don Fernando Canché',
    artisanQuote: 'Leather shaped by hand endures for decades, growing more beautiful with every journey.',
  },
  'abejas-meliponas': {
    name: 'Melipona Native Stingless Bee Sanctuary',
    location: 'Maní',
    short: 'Discover sacred Mayan stingless bees, ancestral wooden jobones, and medicinal honey.',
    description:
      'A gentle, family-friendly encounter in the magical town of Maní. Walk among medicinal gardens and hollowed-log hives (jobones) where sacred melipona bees produce liquid gold without stinging.',
    includes: [
      'Guided educational walk in the meliponary',
      'Tasting of pure medicinal melipona honey',
      'Jar of artisanal honey to take home',
      'Traditional tea and honey snack',
    ],
  },
  'cenote-y-comida-maya': {
    name: 'Sacred Cenote Swim & Home-Cooked Maya Feast',
    location: 'Homún',
    short: 'Swim in pristine cave waters and taste slow-cooked cochinita pibil in an authentic home.',
    description:
      'Escape mass commercial parks. Visit a community-protected cenote in Homún with clear turquoise waters, followed by an underground earth-oven (píib) feast prepared by a local Maya family.',
    includes: [
      'Access to private community cenote',
      'Life jacket and equipment',
      'Complete home-cooked traditional meal with handmade corn tortillas',
      'Fresh fruit waters and regional dessert',
    ],
  },
  'cocina-con-leña': {
    name: 'Traditional Wood-Fired Maya Cooking Masterclass',
    location: 'Yaxunah',
    short: 'Make handmade tortillas, crush achiote, and cook cochinita pibil in an earthen pit.',
    description:
      'Spend a morning in the heart of Yaxunah with a women’s culinary collective. Grind your own spices with limestone metates and prepare authentic regional stews over open wood fires.',
    includes: [
      'Cooking class guided by village cooks',
      'All farm-fresh ingredients and spices',
      'Full family feast with everything prepared during class',
      'Handwritten recipe booklet',
    ],
  },
}

export const PACKAGES_EN: Record<string, Partial<TourPackage>> = {
  'ruta-de-las-abejas-meliponas': {
    name: 'Sacred Melipona Bee & Maya Heritage Trail',
    location: 'Maní & Southern Yucatán',
    durationLabel: 'Full Day (8 hrs)',
    short: 'Connect with sacred stingless bees, historic convents, and organic artisan honey.',
    description:
      'A soul-stirring journey through the peaceful southern towns of Yucatán. Visit family-run melipona sanctuaries in Maní, taste medicinal honeys, explore 16th-century architecture, and share lunch with local beekeepers.',
    includes: [
      'Guided visit to traditional meliponary in Maní',
      'Tasting of 3 varieties of ancestral honey',
      'Traditional 3-course regional lunch',
      'Optional round-trip transportation from your hotel',
    ],
  },
  'cenotes-y-leyendas': {
    name: 'Sacred Cenotes & Ancestral Legends',
    location: 'Homún & Cuzamá',
    durationLabel: 'Full Day (7 hrs)',
    short: 'Hidden cavern cenotes, ancient folklore, and swimming in crystal turquoise waters.',
    description:
      'Immerse in the underworld of the Maya. Discover hidden cenotes guarded by local ejido communities, swim in luminous subterranean caverns, and hear oral legends passed down through generations.',
    includes: [
      'Access to 3 community-protected cenotes',
      'Life jackets and swimming gear',
      'Local Maya storyteller guide',
      'Full traditional Yucatecan meal',
      'Optional round-trip transportation',
    ],
  },
  'sabores-de-yucatan': {
    name: 'Flavors of Yucatán Culinary Expedition',
    location: 'Mérida & Yaxunah',
    durationLabel: 'Full Day (8.5 hrs)',
    short: 'Local market discovery, smoke-pit cooking, recados, and artisanal tortillas.',
    description:
      'A true gastronomic journey for food lovers. Tour traditional markets, select fresh herbs and citrus, grind achiote on a stone metate, and unearth slow-roasted cochinita pibil alongside local culinary masters.',
    includes: [
      'Guided culinary market walk',
      'Hands-on traditional cooking workshop',
      'Abundant lunch feast with your culinary creations',
      'Regional beverages and artisanal desserts',
    ],
  },
  'manos-artesanas': {
    name: 'Artisan Hands Workshop Immersion',
    location: 'Tixkokob & Ticul',
    durationLabel: 'Full Day (9 hrs)',
    short: 'Loom-woven hammocks and red clay ceramics guided by multi-generational masters.',
    description:
      'An intimate hands-on journey through two legendary craft villages. Weave with master hammock artisans in Tixkokob in the morning, and sculpt red clay pottery in Ticul in the afternoon.',
    includes: [
      'Two complete hands-on artisan workshops (hammocks & ceramics)',
      'All craft materials and tools provided',
      'Your handcrafted piece and loom sampler to take home',
      'Home-cooked lunch with artisan hosts',
      'Optional round-trip transportation',
    ],
  },
}

export function getLocalizedExperience(exp: Experience, locale: Locale): Experience {
  if (locale === 'es') return exp
  const translation = EXPERIENCES_EN[exp.id] || EXPERIENCES_EN[exp.slug]
  if (!translation) return exp
  return {
    ...exp,
    ...translation,
    name: translation.name || exp.name,
    short: translation.short || exp.short,
    description: translation.description || exp.description,
    location: translation.location || exp.location,
    includes: translation.includes || exp.includes,
    artisanName: translation.artisanName || exp.artisanName,
    artisanQuote: translation.artisanQuote || exp.artisanQuote,
  }
}

export function getLocalizedPackage(pkg: TourPackage, locale: Locale): TourPackage {
  if (locale === 'es') return pkg
  const translation = PACKAGES_EN[pkg.id] || PACKAGES_EN[pkg.slug]
  if (!translation) return pkg
  return {
    ...pkg,
    ...translation,
    name: translation.name || pkg.name,
    short: translation.short || pkg.short,
    description: translation.description || pkg.description,
    durationLabel: translation.durationLabel || pkg.durationLabel,
    location: translation.location || pkg.location,
    includes: translation.includes || pkg.includes,
  }
}

export function getLocalizedCategory(cat: Category, locale: Locale): Category {
  if (locale === 'es') return cat
  const translation = CATEGORIES_EN[cat.id]
  if (!translation) return cat
  return {
    ...cat,
    name: translation.name,
    short: translation.short,
    description: translation.description,
  }
}

export function getLocalizedZone(zone: { id: Zone; name: string; hint: string }, locale: Locale) {
  if (locale === 'es') return zone
  const translation = ZONES_EN[zone.id]
  if (!translation) return zone
  return {
    ...zone,
    name: translation.name,
    hint: translation.hint,
  }
}

export function getLocalizedBudget(budget: { id: BudgetId; label: string; range: string; max: number }, locale: Locale) {
  if (locale === 'es') return budget
  const translation = BUDGETS_EN[budget.id]
  if (!translation) return budget
  return {
    ...budget,
    label: translation.label,
    range: translation.range,
  }
}
