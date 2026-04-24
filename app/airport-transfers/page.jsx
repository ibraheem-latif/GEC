import Image from 'next/image'
import ContactForm from '@/components/ContactForm'
import JsonLd from '@/components/JsonLd'
import {
  buildMetadata,
  buildServiceSchema,
  buildBreadcrumbSchema,
  buildFAQSchema,
} from '@/lib/seo'

export const metadata = buildMetadata('/airport-transfers')

const features = [
  { num: '01', text: 'Live flight tracking — we adjust if your flight is delayed' },
  { num: '02', text: 'Meet & greet at arrivals with name board' },
  { num: '03', text: 'Luggage assistance as standard' },
  { num: '04', text: 'Child seats and accessibility options available on request' },
  { num: '05', text: 'Fixed prices quoted upfront — no meter running' },
  { num: '06', text: 'Serving Glasgow, Edinburgh & Prestwick airports' },
]

const faqs = [
  { q: 'Do you track my flight?', a: 'Yes. We monitor your flight in real time and adjust the pickup time for delays or early arrivals at no extra charge.' },
  { q: 'Which airports do you serve?', a: 'Glasgow International, Edinburgh, and Glasgow Prestwick. We also cover smaller regional airports on request.' },
  { q: 'Are prices fixed?', a: 'Yes. We quote a fixed price up front based on the route. No meter, no surprises.' },
  { q: 'Can you provide child seats?', a: 'Yes. Please request child seats when booking and specify the age of the child.' },
]

export default function AirportTransfersPage() {
  return (
    <>
      <JsonLd data={buildServiceSchema({
        name: 'Airport Transfers Glasgow',
        description: 'Flight-tracked airport transfers from Glasgow, Edinburgh & Prestwick airports with meet & greet service.',
        slug: '/airport-transfers',
      })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Airport Transfers', path: '/airport-transfers' },
      ])} />
      <JsonLd data={buildFAQSchema(faqs)} />

      <section style={{ background: 'var(--deep)', paddingTop: '7rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 5rem)' }}>
          <div className="label" style={{ marginBottom: '1.5rem' }}>Airport Transfers</div>
          <h1 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(2.75rem, 6vw, 5.5rem)',
            fontWeight: 300,
            lineHeight: 1.02,
            letterSpacing: '-0.025em',
            color: 'var(--white)',
            marginBottom: '1.5rem',
            maxWidth: '18ch',
          }}>
            Airport Transfers{' '}
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Glasgow</em>
          </h1>
          <p style={{ fontFamily: 'var(--font-dm-sans), sans-serif', color: 'var(--white-dim)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '52ch' }}>
            From Glasgow, Edinburgh, and Prestwick airports — we track your flight and meet you at arrivals. No stress, no waiting. Just a calm, professional driver ready when you land.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--void)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 5rem)' }}>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}
            className="max-md:!grid-cols-1"
          >
            <div style={{ position: 'relative', width: '100%', height: '420px' }}>
              <Image
                src="/images/plane.webp"
                alt="Airport transfer service — aircraft at dusk"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div>
              <div className="label" style={{ marginBottom: '2rem' }}>What&apos;s Included</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {features.map(f => (
                  <div key={f.num} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <span style={{
                      fontFamily: 'var(--font-space-mono), monospace',
                      fontSize: '0.575rem',
                      letterSpacing: '0.15em',
                      color: 'var(--gold)',
                      paddingTop: '0.25rem',
                      flexShrink: 0,
                    }}>
                      {f.num}
                    </span>
                    <span style={{ fontFamily: 'var(--font-dm-sans), sans-serif', color: 'var(--white)', fontSize: '0.9375rem', lineHeight: 1.6 }}>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--deep)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 5rem)' }}>
          <div style={{ marginBottom: '2.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--line)' }}>
            <div className="label" style={{ marginBottom: '1rem' }}>Book Your Transfer</div>
            <h2 style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: 'var(--white)',
            }}>
              Ready to book?<br />
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>We respond within the hour.</em>
            </h2>
          </div>
          <div style={{ maxWidth: '720px' }}>
            <ContactForm defaultService="airport" />
          </div>
        </div>
      </section>
    </>
  )
}
