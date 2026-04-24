import { SITE_URL } from '@/lib/seo'

const ROUTES = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/airport-transfers', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/scotland-tours', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/corporate-chauffeurs', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/fleet', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/about', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'yearly' },
]

export default function sitemap() {
  const lastModified = new Date()
  return ROUTES.map(r => ({
    url: `${SITE_URL}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
