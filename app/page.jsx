import HomePageClient from './home-client'
import JsonLd from '@/components/JsonLd'
import {
  buildMetadata,
  buildLocalBusinessSchema,
  buildTaxiServiceSchema,
} from '@/lib/seo'

export const metadata = buildMetadata('/')

export default function Page() {
  return (
    <>
      <JsonLd data={buildLocalBusinessSchema()} />
      <JsonLd data={buildTaxiServiceSchema()} />
      <HomePageClient />
    </>
  )
}
