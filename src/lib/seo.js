export const SITE_NAME = 'Glasgow Executive Chauffeurs'
export const SITE_DOMAIN = 'glasgowexecutivechauffeurs.co.uk'
export const EMAIL = 'bookings@glasgowexecutivechauffeurs.co.uk'

export const SEO_CONFIG = {
  '/': {
    title: 'Glasgow Executive Chauffeurs | Premium Chauffeur Service Glasgow',
    description: 'Glasgow Executive Chauffeurs — professional airport transfers, Scotland tours, and corporate chauffeur service. Lexus ES300h fleet. Fixed prices. Available 24/7.',
    canonical: `https://glasgowexecutivechauffeurs.co.uk/`,
  },
  '/airport-transfers': {
    title: 'Airport Transfers Glasgow | Glasgow Executive Chauffeurs',
    description: 'Flight-tracked airport transfers from Glasgow, Edinburgh & Prestwick airports. Meet & greet, luggage assistance, child seats. Book online.',
    canonical: `https://glasgowexecutivechauffeurs.co.uk/airport-transfers`,
  },
  '/scotland-tours': {
    title: 'Chauffeur-Driven Scotland Tours | Glasgow Executive Chauffeurs',
    description: 'Bespoke chauffeur-driven tours of the Scottish Highlands, Loch Lomond, Edinburgh and beyond. Your route, your pace.',
    canonical: `https://glasgowexecutivechauffeurs.co.uk/scotland-tours`,
  },
  '/corporate-chauffeurs': {
    title: 'Corporate Chauffeur Service Glasgow | Glasgow Executive Chauffeurs',
    description: 'Professional corporate chauffeur service in Glasgow. Company accounts, events, roadshows and recurring bookings. Discreet and reliable.',
    canonical: `https://glasgowexecutivechauffeurs.co.uk/corporate-chauffeurs`,
  },
  '/about': {
    title: 'About Us | Glasgow Executive Chauffeurs',
    description: 'Serving Glasgow since 2014. PVL-licensed, fully insured chauffeurs with local expertise. Learn more about Glasgow Executive Chauffeurs.',
    canonical: `https://glasgowexecutivechauffeurs.co.uk/about`,
  },
  '/fleet': {
    title: 'Our Fleet | Glasgow Executive Chauffeurs',
    description: 'Travel in our premium Lexus ES 300h hybrid fleet. Comfortable, clean, and fully equipped for executive travel across Scotland.',
    canonical: `https://glasgowexecutivechauffeurs.co.uk/fleet`,
  },
  '/contact': {
    title: 'Contact Us | Glasgow Executive Chauffeurs',
    description: "Book a chauffeur in Glasgow. Send us your enquiry and we'll respond within the hour. Email bookings welcome.",
    canonical: `https://glasgowexecutivechauffeurs.co.uk/contact`,
  },
}

export function buildLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    url: `https://${SITE_DOMAIN}`,
    email: EMAIL,
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
    serviceArea: {
      '@type': 'AdministrativeArea',
      name: 'Scotland',
    },
  }
}
