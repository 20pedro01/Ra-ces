import { CATEGORY_MAP, type Experience, type TourPackage, type Category, type CategoryId, type Zone, type BudgetId } from '@/lib/data'
import type { Locale } from './translations'

export function getLocalizedCategory(cat: Category | CategoryId, locale: Locale): Category {
  const catId = typeof cat === 'string' ? cat : cat.id
  const base = typeof cat === 'string' ? CATEGORY_MAP[cat] : cat
  if (locale === 'es') return base
  const translation = CATEGORIES_EN[catId]
  if (!translation) return base
  return {
    ...base,
    name: translation.name,
    short: translation.short,
    description: translation.description,
  }
}

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
  },
  'taller-de-ceramica': {
    name: 'Mayan Red Clay Pottery Workshop',
    location: 'Ticul',
    short: 'Shape local clay into ancestral pots and Mayan whistles alongside Don Celso.',
    description:
      'Visit the historic pottery town of Ticul — the cradle of Yucatecan ceramics. Work with raw red clay, learn ancestral hand-pinching and wheel techniques, and fire your own ceramic piece.',
    includes: [
      'Clay, tools, and kiln firing',
      'Traditional drink included',
    ],
  },
  'taller-de-talabarteria': {
    name: 'Artisanal Leathercraft Workshop',
    location: 'Mérida, Santiago District',
    short: 'Design, bevel, and stitch your own genuine leather souvenir in Mérida.',
    description:
      "Step inside Don Rafael's traditional leather shop — 40 years of craft. Master the ancient leatherworking craft: cutting, perforating, hand-stitching, and stamping your initials into fine regional leather.",
    includes: [
      'Leather hide, tools, and rivets',
      'Personalized initial stamping',
    ],
  },
  'taller-de-punto-de-cruz': {
    name: 'Traditional Cross-Stitch Embroidery Workshop',
    location: 'Maní',
    short: 'Embroider traditional floral patterns with the women of Maní and discover the meaning behind each design.',
    description:
      "In the shade of a community courtyard in Maní, a group of embroiderers teaches you to read the patterns and stitch your first floral design. While you embroider, you hear stories of the village and the huipil garment's cultural significance.",
    includes: [
      'Embroidery hoop, fabric, and threads',
      'Fresh fruit drink',
      'Access to the community courtyard',
    ],
  },
  'clase-de-antojitos': {
    name: 'Yucatecan Street Snacks Cooking Class',
    location: 'Mérida, Santa Ana District',
    short: 'Make panuchos, salbutes, and papadzules from scratch in a local Mérida family kitchen.',
    description:
      "You start at the market choosing fresh ingredients and finish at a long table eating what you cooked. You press the tortillas, you fry them, you plate the dish. Learn the difference between a panucho and a salbute, and why pickled red onion always goes with habanero.",
    includes: [
      'Market walk to select ingredients',
      'All ingredients included',
      'Full meal and handwritten recipe booklet',
    ],
  },
  'taller-de-recados': {
    name: 'Yucatecan Spice Paste (Recado) Workshop',
    location: 'Espita',
    short: 'Toast, grind, and blend the spices behind the red and black recados — the soul of Yucatecan cooking.',
    description:
      'Espita is home to the most celebrated recados in eastern Yucatán. Learn to toast achiote, chiles, and spices on a comal, grind them on a stone mill, and form your own spice paste jars to take home.',
    includes: [
      'Spices, achiote, and grinding tools',
      'Jars of your own recado to take home',
      'Cochinita pibil tasting',
    ],
  },
  'cenotes-de-homun': {
    name: 'Homún Cenote Trail by Mototaxi',
    location: 'Homún',
    short: 'Explore three distinct cenotes by mototaxi with a community guide from Homún.',
    description:
      'The cenotes of Homún are managed by local families. A community guide takes you by mototaxi to three cenotes with different characters: one open-air, one semi-open, and one cavern. You swim, rest, and eat a home-cooked meal with a local family.',
    includes: [
      'Mototaxi and community guide',
      'Access to 3 cenotes',
      'Life jacket and home-cooked meal',
    ],
  },
  'cenote-caverna-al-amanecer': {
    name: 'Cavern Cenote at Sunrise',
    location: 'Cuzamá',
    short: 'Descend into a crystal-clear cavern cenote before the crowds and experience it in complete silence.',
    description:
      'Entering the cenote at first light — when the sunbeam barely touches the water — is an entirely different experience. A local guide accompanies you to the cavern and shares what this sacred place means to their community.',
    includes: [
      'Private early-access entry',
      'Local guide',
      'Coffee and traditional sweet bread',
    ],
  },
  'ruta-abejas-meliponas': {
    name: 'Melipona Native Stingless Bee Sanctuary',
    location: 'Maní',
    short: 'Discover sacred Mayan stingless bees, ancestral wooden jobones, and medicinal honey.',
    description:
      'The Xunán Kab is a stingless bee that the Maya have tended for centuries. Visit a family meliponary in Maní, help inspect the log hives (jobones), learn how the honey is harvested, and taste it alongside artisanal products made from it.',
    includes: [
      'Guided visit to the meliponary',
      'Guided honey harvest',
      'Honey and product tasting',
    ],
  },
  'sendero-de-plantas-medicinales': {
    name: 'Medicinal Plant Trail',
    location: 'Yaxunah',
    short: 'Walk the lowland jungle with a Maya guide who shares the plants that heal and nourish.',
    description:
      'A slow walk along the trails of Yaxunah, learning to recognize plants the community uses to heal, cook, and build. Ends with a dip in the village cenote.',
    includes: [
      'Community guide',
      'Cenote swim included',
      'Herbal infusion tasting',
    ],
  },
  'flamencos-en-celestun': {
    name: 'Flamingos & Mangrove in Celestún',
    location: 'Celestún',
    short: 'Navigate the estuary with local fishermen to observe flamingos and the freshwater spring hidden in the mangrove.',
    description:
      "The boatmen of Celestún know the estuary better than anyone. With them you observe flamingos at a respectful distance, navigate the mangrove tunnel, and swim in a natural freshwater spring.",
    includes: [
      'Boat with local captain',
      'Life jackets',
      "Ceviche from the fishermen's cooperative",
    ],
  },
  'fogata-de-leyendas': {
    name: 'Bonfire of Local Legends',
    location: 'Yaxunah',
    short: 'Around the fire, community members share legends, stories, and traditions of Yucatán.',
    description:
      'When night falls, the community lights the bonfire. Hot chocolate is served and the elders share stories of the Aluxes, the Xtabay, and the Huay Chivo. No stage, no microphones — just the fire, the voices, and the sky.',
    includes: [
      'Hot chocolate and traditional bread',
      'Community storytellers',
      'English interpretation available',
    ],
  },
  'noche-de-vaqueria': {
    name: 'Vaquería Night at the Town Square',
    location: 'Motul',
    short: 'Experience a traditional vaquería with jarana dance, embroidered ternos, and a dinner of huevos motuleños.',
    description:
      'The square in Motul fills with jarana music. Learn the basic steps with a local dance group, listen to Yucatecan bombas (rhyming jokes), and enjoy the original huevos motuleños for dinner.',
    includes: [
      'Jarana dance lesson',
      'Traditional dinner',
      'Reserved seating',
    ],
  },
}

export const PACKAGES_EN: Record<string, Partial<TourPackage>> = {
  'ruta-de-las-abejas-meliponas': {
    name: 'Sacred Melipona Bee & Maya Heritage Trail',
    location: 'Maní & Southern Yucatán',
    durationLabel: 'Full Day (8 hrs)',
    tagline: 'A day with the guardians of Mayan honey',
    short: 'Connect with sacred stingless bees, historic convents, and organic artisan honey.',
    description:
      'A soul-stirring journey through the peaceful southern towns of Yucatán. Visit family-run melipona sanctuaries in Maní, taste medicinal honeys, explore 16th-century architecture, and share lunch with local beekeepers.',
    activities: [
      'Welcome in the community of Maní',
      'Visit to the family meliponary and introduction to the Xunán Kab bee',
      'Explanation of melipona bee care and life cycle',
      'Guided honey harvest from traditional log hives (jobones)',
      'Workshop with producers: making honey balm',
      'Tasting of honey, pox, and artisanal community products',
    ],
    includes: [
      'Bilingual community guide',
      'Traditional home-cooked family lunch',
      'Jar of melipona honey and balm',
      'Direct contribution to the cooperative',
    ],
    bring: ['Comfortable, light-colored clothing', 'Hat and sunscreen', 'Reusable water bottle', 'Natural insect repellent'],
  },
  'cenotes-y-leyendas': {
    name: 'Cenotes & Legends of Yaxunah',
    location: 'Yaxunah, Eastern Yucatán',
    durationLabel: 'Full Day (afternoon & night)',
    tagline: 'From crystal waters to the fire of night',
    short: 'Medicinal plant trail, hidden cenote swim, and a bonfire of ancestral legends.',
    description:
      'A full day in the community of Yaxunah: walk the lowland jungle with a Maya guide, swim in the village cenote, and close the day around a bonfire listening to legends told by community members.',
    activities: [
      'Medicinal plant trail with community guide',
      'Swim in Lol-Ha cenote',
      'Dinner at a local family home',
      'Bonfire of local legends',
    ],
    includes: [
      'Community guide',
      'Traditional dinner',
      'Hot chocolate and bread',
      'English interpretation available',
    ],
    bring: ['Swimsuit and towel', 'Long-sleeved shirt for the evening', 'Small flashlight'],
  },
  'sabores-de-yucatan': {
    name: 'Flavors of Yucatán Culinary Expedition',
    location: 'Mérida',
    durationLabel: 'Full Day (6 hrs)',
    tagline: 'From market to table, with your own hands',
    short: 'Local market discovery, spice grinding, and authentic Yucatecan cooking.',
    description:
      'A gastronomic journey where you participate in everything: choose ingredients at the market, grind your own recado spice paste, and prepare regional snacks with a Mérida family.',
    activities: [
      'Tour of the Santa Ana Market',
      'Making red recado spice paste',
      'Cooking class: panuchos, salbutes, and papadzules',
      'Shared meal and recipe booklet',
    ],
    includes: ['All ingredients', 'Full meal', 'Jar of homemade recado', 'Printed recipe booklet'],
    bring: ["Good appetite", "Clothes you don't mind getting dirty", 'Notebook if you like to take notes'],
  },
  'manos-artesanas': {
    name: 'Artisan Hands Workshop Immersion',
    location: 'Tixkokob & Mérida',
    durationLabel: 'Full Day (6 hrs)',
    tagline: 'Two workshops, two living crafts',
    short: 'Loom-woven hammocks in the morning and leathercraft in the afternoon.',
    description:
      'Spend the day among artisans: weave the first stretches of a hammock in Tixkokob in the morning, then work leather with a craftsman from Mérida in the afternoon.',
    activities: [
      'Hammock workshop with the Canul family',
      'Lunch in Tixkokob',
      'Leathercraft workshop in Santiago District',
    ],
    includes: ['Materials for both workshops', 'Regional lunch', 'Personalized leather piece'],
    bring: ['Comfortable clothing', 'Patience and eagerness to learn'],
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
    tagline: translation.tagline || pkg.tagline,
    short: translation.short || pkg.short,
    description: translation.description || pkg.description,
    durationLabel: translation.durationLabel || pkg.durationLabel,
    location: translation.location || pkg.location,
    includes: translation.includes || pkg.includes,
    activities: translation.activities || pkg.activities,
    bring: translation.bring || pkg.bring,
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
