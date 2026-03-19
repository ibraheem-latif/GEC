import SEOHead from '../components/SEOHead'
import CTABanner from '../components/CTABanner'
import { SEO_CONFIG } from '../lib/seo'
import lexusImage from '../assets/lexus es 300h black.jpg'

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

const FleetPage = () => {
  const seo = SEO_CONFIG['/fleet']
  return (
    <>
      <SEOHead title={seo.title} description={seo.description} canonical={seo.canonical} />

      <section style={{ background: 'var(--surface)', paddingTop: '7rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 5rem)' }}>
          <div className="label" style={{ marginBottom: '1.5rem' }}>Our Fleet</div>
          <h1 style={{
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            color: 'var(--cream)',
            marginBottom: '1.5rem',
          }}>
            Lexus ES 300h.<br /><em style={{ color: 'var(--copper)' }}>Pure executive comfort.</em>
          </h1>
          <p style={{ color: 'var(--cream-dim)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '52ch' }}>
            Our entire fleet runs the Lexus ES 300h hybrid — smooth, quiet, and genuinely luxurious. Not flashy. Just properly comfortable, every time.
          </p>
        </div>
      </section>

      <div style={{ height: 'clamp(200px, 30vh, 360px)', overflow: 'hidden' }}>
        <img src={lexusImage} alt="Lexus ES 300h" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
      </div>

      <section style={{ background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(1.25rem, 2.5vh, 2rem) clamp(1.5rem, 5vw, 5rem)' }}>
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
                  borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.575rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--cream-dim)',
                  }}>
                    {s.label}
                  </span>
                  <span style={{
                    fontFamily: '"Syne", sans-serif',
                    fontSize: '0.9375rem',
                    color: 'var(--cream)',
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
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.575rem',
                      letterSpacing: '0.15em',
                      color: 'var(--copper)',
                      paddingTop: '0.25rem',
                      flexShrink: 0,
                    }}>
                      {a.num}
                    </span>
                    <span style={{ color: 'var(--cream)', fontSize: '0.9375rem', lineHeight: 1.6 }}>{a.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--surface)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 5rem) clamp(1.25rem, 2.5vh, 2rem)' }}>
          <CTABanner heading="Ready to travel in style?" />
        </div>
      </section>
    </>
  )
}

export default FleetPage
