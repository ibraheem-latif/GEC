import SEOHead from '../components/SEOHead'
import ContactForm from '../components/ContactForm'
import { SEO_CONFIG } from '../lib/seo'
import planeImage from '../assets/plane.webp'

const features = [
  { num: '01', text: 'Live flight tracking — we adjust if your flight is delayed' },
  { num: '02', text: 'Meet & greet at arrivals with name board' },
  { num: '03', text: 'Luggage assistance as standard' },
  { num: '04', text: 'Child seats and accessibility options available on request' },
  { num: '05', text: 'Fixed prices quoted upfront — no meter running' },
  { num: '06', text: 'Serving Glasgow, Edinburgh & Prestwick airports' },
]

const AirportTransfersPage = () => {
  const seo = SEO_CONFIG['/airport-transfers']
  return (
    <>
      <SEOHead title={seo.title} description={seo.description} canonical={seo.canonical} />

      <section style={{ background: 'var(--surface)', paddingTop: '7rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 5rem)' }}>
          <div className="label" style={{ marginBottom: '1.5rem' }}>Airport Transfers</div>
          <h1 style={{
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            color: 'var(--cream)',
            marginBottom: '1.5rem',
            maxWidth: '18ch',
          }}>
            Airport Transfers <em style={{ color: 'var(--copper)' }}>Glasgow</em>
          </h1>
          <p style={{ color: 'var(--cream-dim)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '52ch' }}>
            From Glasgow, Edinburgh, and Prestwick airports — we track your flight and meet you at arrivals. No stress, no waiting. Just a calm, professional driver ready when you land.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 5rem)' }}>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}
            className="max-md:!grid-cols-1"
          >
            <div>
              <img
                src={planeImage}
                alt="Airport transfer service"
                style={{ width: '100%', height: '360px', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div className="label" style={{ marginBottom: '2rem' }}>What's Included</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {features.map(f => (
                  <div key={f.num} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <span style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.575rem',
                      letterSpacing: '0.15em',
                      color: 'var(--copper)',
                      paddingTop: '0.25rem',
                      flexShrink: 0,
                    }}>
                      {f.num}
                    </span>
                    <span style={{ color: 'var(--cream)', fontSize: '0.9375rem', lineHeight: 1.6 }}>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--surface)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(1.25rem, 2.5vh, 2rem) clamp(1.5rem, 5vw, 5rem)' }}>
          <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
            <div className="label" style={{ marginBottom: '1rem' }}>Book Your Transfer</div>
            <h2 style={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: 'var(--cream)',
            }}>
              Ready to book?<br /><em>We respond within the hour.</em>
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

export default AirportTransfersPage
