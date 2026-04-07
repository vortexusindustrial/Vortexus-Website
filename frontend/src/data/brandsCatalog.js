export const brandsCatalog = [
  {
    slug: 'atlas',
    name: 'Atlas',
    image: '/brands/atlas.jpeg',
    matchTerms: ['atlas'],
    galleryImages: [
      '/atlas/Hot water filters.png',
      '/atlas/Kmatic self cleaning filter .png',
      '/atlas/cold water filterrs.png',
      '/atlas/hero bag filter .png',
      '/atlas/high pressure valves .png',
      '/atlas/multistage self cleaning filters.png',
      '/atlas/rain water self cleaning filters.png',
      '/atlas/single stage self cleaning .png',
      '/atlas/special application valves.png',
      '/atlas/surface filtration filter.png',
    ],
  },
  {
    slug: 'auxin',
    name: 'Auxin',
    image: '/brands/auxin.jpeg',
    matchTerms: ['auxin', 'runxin'],
    galleryImages: [
      '/run-xin/12 Aluminum-plastic Pipe Connector.png',
      '/run-xin/F74&F80 Twin Alternating Softeners Valves.png',
      '/run-xin/F92×2 Twin Alternating Softeners Valves(two valves.png',
      '/run-xin/Plastic Electric Ball Valves.png',
      '/run-xin/Pneumatic Ball Valve.png',
      '/run-xin/Stainless electric ball valve jointed by flange.png',
    ],
  },
  {
    slug: 'certikin',
    name: 'Certikin',
    image: '/brands/certikin.jpeg',
    matchTerms: ['certikin', 'glass media'],
    galleryImages: ['/certikin/External thread vac point with lid - 50mm long.png'],
  },
  { slug: 'cnp', name: 'CNP', image: '/brands/cnp.jpeg', matchTerms: ['cnp'], galleryImages: [] },
  {
    slug: 'danfoss',
    name: 'Danfoss',
    image: '/brands/danfos.jpeg',
    matchTerms: ['danfoss', 'danfos'],
    galleryImages: [
      '/danfos/ACB cartridge pressure switches.png',
      '/danfos/KP  KPU pressure switches.png',
      '/danfos/Pressure switch, KP35.png',
      '/danfos/Pressure switch, KP352.png',
      '/danfos/Pressure switch, KP36.png',
      '/danfos/Pressure switches and thermostats for HVAC-R.png',
      '/danfos/network pressure management.png',
    ],
  },
  { slug: 'dupont', name: 'DuPont', image: '/brands/dupon.jpeg', matchTerms: ['dupont', 'dupon', 'filmtec'], galleryImages: [] },
  { slug: 'frotec', name: 'Frotec', image: '/brands/frotect.jpeg', matchTerms: ['frotec', 'frotect'], galleryImages: [] },
  {
    slug: 'genesys',
    name: 'Genesys',
    image: '/brands/genesys.jpeg',
    matchTerms: ['genesys'],
    galleryImages: ['/genesys/READY STOCK!!! CALCIUM CARBONATE_CACO3 POWDER AGRICULTURAL LIME _COSMETICS25kg.jpg'],
  },
  { slug: 'grundfos', name: 'Grundfos', image: '/brands/grandfos.jpeg', matchTerms: ['grundfos', 'grandfos'], galleryImages: [] },
  {
    slug: 'hidrotek',
    name: 'Hidrotek',
    image: '/brands/hidroteck.jpeg',
    matchTerms: ['hidrotek', 'hidroteck'],
    galleryImages: [
      '/hydroteck/Big Flow Tankless reverse osmosis commercial water purification system.png',
      '/hydroteck/Domestic RO Water Purifier with IC controller.png',
      '/hydroteck/Domestic RO Water Purifier with UV system.png',
      '/hydroteck/Domestic RO Water Purifier.png',
      '/hydroteck/Multi-stage commercialindustrial water softener with carbon and resin.png',
      '/hydroteck/UV Lamp For Sanitizing.png',
      '/hydroteck/UV Light Water Sterilizer Home.png',
      '/hydroteck/UV Light Water Sterilizer.png',
    ],
  },
  {
    slug: 'hth',
    name: 'HTH',
    image: '/brands/hth.jpeg',
    matchTerms: ['hth'],
    galleryImages: [
      '/hth/Banisol extra.png',
      '/hth/SANIPLUS.png',
      '/hth/borkler gel.png',
      '/hth/sterisol extra.png',
    ],
  },
  { slug: 'hydramem', name: 'Hydramem', image: '/brands/hydramen.jpeg', matchTerms: ['hydramem', 'hydramen'], galleryImages: [] },
  { slug: 'hydromchem', name: 'Hydrom Chem', image: '/brands/hydromchem.jpeg', matchTerms: ['hydromchem', 'hydrochem'], galleryImages: [] },
  { slug: 'improchem', name: 'ImproChem', image: '/brands/improchem.jpeg', matchTerms: ['improchem'], galleryImages: [] },
  { slug: 'jacobi', name: 'Jacobi', image: '/brands/jacobi.jpeg', matchTerms: ['jacobi'], galleryImages: [] },
  { slug: 'keensen', name: 'Keensen', image: '/brands/keesen.jpeg', matchTerms: ['keensen', 'keesen'], galleryImages: [] },
  { slug: 'leo-pump', name: 'Leo Pump', image: '/brands/leopump.jpeg', matchTerms: ['leo pump', 'leo'], galleryImages: [] },
  { slug: 'lowara', name: 'Lowara', image: '/brands/lowara.jpeg', matchTerms: ['lowara'], galleryImages: [] },
  { slug: 'pentair', name: 'Pentair', image: '/brands/pentair.jpeg', matchTerms: ['pentair'], galleryImages: [] },
  { slug: 'pedrollo', name: 'Pedrollo', image: '/brands/prdrollo.jpeg', matchTerms: ['pedrollo', 'prdrollo'], galleryImages: [] },
  { slug: 'purolite', name: 'Purolite', image: '/brands/purolite.jpeg', matchTerms: ['purolite'], galleryImages: [] },
  { slug: 'rzbc', name: 'RZBC', image: '/brands/rzbc.jpeg', matchTerms: ['rzbc'], galleryImages: [] },
  { slug: 'seko', name: 'SEKO', image: '/brands/seko.jpeg', matchTerms: ['seko'], galleryImages: [] },
  { slug: 'suez', name: 'SUEZ', image: '/brands/suez.jpeg', matchTerms: ['suez'], galleryImages: [] },
  { slug: 'vontron', name: 'Vontron', image: '/brands/vontron.jpeg', matchTerms: ['vontron'], galleryImages: [] },
  { slug: 'xylem', name: 'Xylem', image: '/brands/xylem.jpeg', matchTerms: ['xylem'], galleryImages: [] },
]

export function getBrandBySlug(slug) {
  return brandsCatalog.find((brand) => brand.slug === slug) || null
}

export function productMatchesBrand(product, brand) {
  const haystack = `${product.name} ${product.summary || ''} ${product.description || ''}`.toLowerCase()
  return brand.matchTerms.some((term) => haystack.includes(term.toLowerCase()))
}
