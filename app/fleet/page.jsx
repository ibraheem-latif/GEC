import Image from 'next/image'
import CTABanner from '@/components/CTABanner'
import JsonLd from '@/components/JsonLd'
import {
  buildMetadata,
  buildVehicleSchema,
  buildBreadcrumbSchema,
} from '@/lib/seo'

export const metadata = buildMetadata('/fleet')

const specs = [
  { label: 'Model', value: 'Lexus ES 300h' },
  { label: 'Drivetrain', value: 'Hybrid (2.5L + Electric)' },
  { label: 'Seats', value: '4 passengers' },
  { label: 'Luggage', value: 'Up to 3 large cases' },
  { label: 'Colour', value: 'Graphite Black' },
]

const amenities = [
  { num: '01', text: 'Complimentary still and sparkling water' },
  { num: '02', text: 'USB and wireless phone charging' },
  { num: '03', text: 'Climate control throughout' },
  { num: '04', text: 'Tinted privacy glass' },
  { num: '05', text: 'Child seats available on request' },
  { num: '06', text: 'Professional dress code for all drivers' },
]

export default function FleetPage() {
  return (
    <>
      <JsonLd data={buildVehicleSchema()} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Fleet', path: '/fleet' },
      ])} />

      <section style={{ background: 'var(--deep)', paddingTop: '7rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 5rem)' }}>
          <div className="label" style={{ marginBottom: '1.5rem' }}>Our Fleet</div>
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
            Lexus ES 300h.<br />
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Pure executive comfort.</em>
          </h1>
          <p style={{ fontFamily: 'var(--font-dm-sans), sans-serif', color: 'var(--white-dim)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '52ch' }}>
            Our entire fleet runs the Lexus ES 300h hybrid — smooth, quiet, and genuinely luxurious. Not flashy. Just properly comfortable, every time.
          </p>
        </div>
      </section>

      <div style={{ position: 'relative', height: 'clamp(200px, 30vh, 360px)', overflow: 'hidden' }}>
        <Image
          src="/images/lexus-es-300h-black.jpg"
          alt="Lexus ES 300h executive sedan"
          fill
          sizes="100vw"
          priority
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>

      <section style={{ background: 'var(--void)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 5rem)' }}>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}
            className="max-md:!grid-cols-1"
          >
            <div>
              <div className="label" style={{ marginBottom: '2rem' }}>Vehicle Specifications</div>
              {specs.map(s => (
                <div key={s.label} style={{
                  display: 'grid',
                  gridTemplateColumns: '7rem 1fr',
                  gap: '1rem',
                  paddingBottom: '1.25rem',
                  marginBottom: '1.25rem',
                  borderBottom: '1px solid var(--line)',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-space-mono), monospace',
                    fontSize: '0.575rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--white-dim)',
                  }}>
                    {s.label}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: '0.9375rem',
                    color: 'var(--white)',
                    fontWeight: 500,
                  }}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>

            <div>
              <div className="label" style={{ marginBottom: '2rem' }}>Passenger Amenities</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {amenities.map(a => (
                  <div key={a.num} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <span style={{
                      fontFamily: 'var(--font-space-mono), monospace',
                      fontSize: '0.575rem',
                      letterSpacing: '0.15em',
                      color: 'var(--gold)',
                      paddingTop: '0.25rem',
                      flexShrink: 0,
                    }}>
                      {a.num}
                    </span>
                    <span style={{ fontFamily: 'var(--font-dm-sans), sans-serif', color: 'var(--white)', fontSize: '0.9375rem', lineHeight: 1.6 }}>{a.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--deep)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 5rem) clamp(3rem, 6vh, 5rem)' }}>
          <CTABanner heading="Ready to travel in style?" />
        </div>
      </section>
    </>
  )
}
