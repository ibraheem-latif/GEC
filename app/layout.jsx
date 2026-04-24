import { Playfair_Display, DM_Sans, Space_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import {
  SITE_NAME,
  SITE_URL,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from '@/lib/seo'

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Premium Chauffeur Service Glasgow`,
    template: '%s',
  },
  description: 'Glasgow Executive Chauffeurs — professional airport transfers, Scotland tours, and corporate chauffeur service.',
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg' },
  other: {
    'geo.region': 'GB-SCT',
    'geo.placename': 'Glasgow',
    'geo.position': '55.8642;-4.2518',
    'ICBM': '55.8642, -4.2518',
  },
}

export const viewport = {
  themeColor: '#07070C',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB" className={`${playfair.variable} ${dmSans.variable} ${spaceMono.variable}`}>
      <body>
        <JsonLd data={buildOrganizationSchema()} />
        <JsonLd data={buildWebSiteSchema()} />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
