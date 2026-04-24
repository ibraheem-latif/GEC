export const SITE_NAME = 'Glasgow Executive Chauffeurs'
export const SITE_DOMAIN = 'gec.limo'
export const SITE_URL = `https://${SITE_DOMAIN}`
export const EMAIL = 'bookings@gec.limo'
export const PHONE = '+44 7973 502224'
export const PHONE_TEL = PHONE.replace(/\s/g, '')

const canonical = (path) => `${SITE_URL}${path}`

export const SEO_CONFIG = {
  '/': {
    title: 'Glasgow Executive Chauffeurs | Premium Chauffeur Service Glasgow',
    description: 'Glasgow Executive Chauffeurs — professional airport transfers, Scotland tours, and corporate chauffeur service. Lexus ES 300h fleet. Fixed prices. Available 24/7.',
    canonical: canonical('/'),
    keywords: ['glasgow chauffeur', 'chauffeur service glasgow', 'airport transfers glasgow', 'executive travel glasgow', 'luxury car hire glasgow'],
  },
  '/airport-transfers': {
    title: 'Airport Transfers Glasgow | Flight-Tracked Chauffeur Service',
    description: 'Flight-tracked airport transfers from Glasgow, Edinburgh & Prestwick airports. Meet & greet, luggage assistance, child seats. Fixed prices. Book online.',
    canonical: canonical('/airport-transfers'),
    keywords: ['airport transfers glasgow', 'glasgow airport chauffeur', 'edinburgh airport transfer', 'prestwick airport taxi'],
  },
  '/scotland-tours': {
    title: 'Chauffeur-Driven Scotland Tours | Glasgow Executive Chauffeurs',
    description: 'Bespoke chauffeur-driven tours of the Scottish Highlands, Loch Lomond, Edinburgh and beyond. Your route, your pace. Luxury Lexus ES 300h.',
    canonical: canonical('/scotland-tours'),
    keywords: ['scotland tours', 'highlands tour glasgow', 'loch lomond chauffeur', 'scottish private tour'],
  },
  '/corporate-chauffeurs': {
    title: 'Corporate Chauffeur Service Glasgow | Executive Business Travel',
    description: 'Professional corporate chauffeur service in Glasgow. Company accounts, events, roadshows and recurring bookings. Discreet, reliable, punctual.',
    canonical: canonical('/corporate-chauffeurs'),
    keywords: ['corporate chauffeur glasgow', 'executive travel scotland', 'business chauffeur glasgow'],
  },
  '/about': {
    title: 'About Us | Glasgow Executive Chauffeurs Since 2014',
    description: 'Serving Glasgow since 2014. PVL-licensed, fully insured chauffeurs with local expertise. Learn more about Glasgow Executive Chauffeurs.',
    canonical: canonical('/about'),
    keywords: ['about glasgow executive chauffeurs', 'pvl licensed chauffeur glasgow'],
  },
  '/fleet': {
    title: 'Our Fleet | Lexus ES 300h Hybrid | Glasgow Executive Chauffeurs',
    description: 'Travel in our premium Lexus ES 300h hybrid fleet. Comfortable, clean, and fully equipped for executive travel across Scotland.',
    canonical: canonical('/fleet'),
    keywords: ['lexus chauffeur glasgow', 'hybrid chauffeur fleet', 'executive car glasgow'],
  },
  '/contact': {
    title: 'Contact Us | Book a Glasgow Chauffeur',
    description: "Book a chauffeur in Glasgow. Send us your enquiry and we'll respond within the hour. Email bookings welcome.",
    canonical: canonical('/contact'),
    keywords: ['book glasgow chauffeur', 'chauffeur booking glasgow'],
  },
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    email: EMAIL,
    telephone: PHONE,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Glasgow',
      addressRegion: 'Scotland',
      addressCountry: 'GB',
    },
    sameAs: [],
  }
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'en-GB',
  }
}

export function buildLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    url: SITE_URL,
    email: EMAIL,
    telephone: PHONE,
    image: `${SITE_URL}/images/lexus-es-300h-black.jpg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Glasgow',
      addressRegion: 'Scotland',
      addressCountry: 'GB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 55.8642,
      longitude: -4.2518,
    },
    priceRange: '££',
    openingHours: 'Mo-Su 00:00-24:00',
    serviceArea: { '@type': 'AdministrativeArea', name: 'Scotland' },
  }
}

const PROVIDER = { '@type': 'LocalBusiness', name: SITE_NAME, url: SITE_URL }
const AREA_SERVED = { '@type': 'AdministrativeArea', name: 'Scotland' }

export function buildTaxiServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    name: SITE_NAME,
    url: SITE_URL,
    provider: PROVIDER,
    areaServed: AREA_SERVED,
  }
}

export function buildServiceSchema({ name, description, slug }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: canonical(slug),
    provider: PROVIDER,
    areaServed: AREA_SERVED,
  }
}

export function buildBreadcrumbSchema(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

export function buildFAQSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

export function buildVehicleSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: 'Lexus ES 300h',
    manufacturer: 'Lexus',
    model: 'ES 300h',
    bodyType: 'Sedan',
    fuelType: 'Hybrid',
    numberOfDoors: 4,
    vehicleSeatingCapacity: 4,
    image: `${SITE_URL}/images/lexus-es-300h-black.jpg`,
  }
}

export function buildContactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: canonical('/contact'),
    mainEntity: {
      '@type': 'LocalBusiness',
      name: SITE_NAME,
      email: EMAIL,
      telephone: PHONE,
      url: SITE_URL,
    },
  }
}

export function buildMetadata(route) {
  const cfg = SEO_CONFIG[route]
  if (!cfg) return {}
  return {
    title: cfg.title,
    description: cfg.description,
    keywords: cfg.keywords,
    alternates: { canonical: cfg.canonical },
    openGraph: {
      title: cfg.title,
      description: cfg.description,
      url: cfg.canonical,
      siteName: SITE_NAME,
      locale: 'en_GB',
      type: 'website',
      images: [{ url: `${SITE_URL}/images/lexus-es-300h-black.jpg`, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: cfg.title,
      description: cfg.description,
      images: [`${SITE_URL}/images/lexus-es-300h-black.jpg`],
    },
  }
}

