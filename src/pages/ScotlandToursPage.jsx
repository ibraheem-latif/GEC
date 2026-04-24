import SEOHead from '../components/SEOHead'
import ContactForm from '../components/ContactForm'
import { SEO_CONFIG } from '../lib/seo'
import scotlandImage from '../assets/scotland scenery.jpg'

const destinations = [
  { name: 'Scottish Highlands', duration: 'Full day', desc: 'Glencoe, Ben Nevis, Fort William — the classic Highland route.' },
  { name: 'Loch Lomond & Trossachs', duration: 'Half or full day', desc: 'A short drive from Glasgow into stunning lochside scenery.' },
  { name: 'St Andrews & Fife', duration: 'Full day', desc: 'Historic golf town and charming coastal fishing villages.' },
  { name: 'Whisky Distillery Trail', duration: 'Full day', desc: 'Speyside or Islay — we drive, you sample.' },
  { name: 'Edinburgh Day Trip', duration: 'Full day', desc: 'The Royal Mile, the Castle, Holyrood — and back in comfort.' },
  { name: 'Custom Itinerary', duration: 'Flexible', desc: 'Your list, your pace. Tell us where you want to go.' },
]

const ScotlandToursPage = () => {
  const seo = SEO_CONFIG['/scotland-tours']
  return (
    <>
      <SEOHead title={seo.title} description={seo.description} canonical={seo.canonical} />

      {/* Hero */}
      <section style={{ background: 'var(--deep)', paddingTop: '7rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 5rem)' }}>
          <div className="label" style={{ marginBottom: '1.5rem' }}>Scotland Tours</div>
          <h1 style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(2.75rem, 6vw, 5.5rem)',
            fontWeight: 300,
            lineHeight: 1.02,
            letterSpacing: '-0.025em',
            color: 'var(--white)',
            marginBottom: '1.5rem',
            maxWidth: '18ch',
          }}>
            Chauffeur-Driven{' '}
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Scotland Tours</em>
          </h1>
          <p style={{ fontFamily: '"DM Sans", sans-serif', color: 'var(--white-dim)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '52ch' }}>
            The Highlands. Loch Lomond. Edinburgh. Whisky country. We'll plan your route and get you there in comfort — no driving, no worrying, just Scotland.
          </p>
        </div>
      </section>

      {/* Full-width image */}
      <div style={{ height: 'clamp(280px, 40vh, 480px)', overflow: 'hidden' }}>
        <img
          src={scotlandImage}
          alt="Scottish scenery"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>

      {/* Destinations grid */}
      <section style={{ background: 'var(--void)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 5rem)' }}>
          <div style={{ marginBottom: '2.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--line)' }}>
            <div className="label" style={{ marginBottom: '1rem' }}>Popular Routes</div>
            <h2 style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: 'var(--white)',
            }}>
              Where would you{' '}
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>like to go?</em>
            </h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              borderTop: '1px solid var(--line)',
              borderLeft: '1px solid var(--line)',
            }}
            className="max-md:!grid-cols-2 max-sm:!grid-cols-1"
          >
            {destinations.map((d) => (
              <div
                key={d.name}
                style={{
                  padding: 'clamp(1.75rem, 3vw, 2.5rem)',
                  borderRight: '1px solid var(--line)',
                  borderBottom: '1px solid var(--line)',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,165,90,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div className="label" style={{ marginBottom: '0.75rem' }}>{d.duration}</div>
                <h3 style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: '1.375rem',
                  fontWeight: 300,
                  color: 'var(--white)',
                  letterSpacing: '-0.015em',
                  marginBottom: '0.75rem',
                }}>
                  {d.name}
                </h3>
                <p style={{ fontFamily: '"DM Sans", sans-serif', color: 'var(--white-dim)', fontSize: '0.9rem', lineHeight: 1.7 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section style={{ background: 'var(--deep)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 5rem)' }}>
          <div style={{ marginBottom: '2.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--line)' }}>
            <div className="label" style={{ marginBottom: '1rem' }}>Plan Your Tour</div>
            <h2 style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: 'var(--white)',
            }}>
              Tell us your plans.{' '}
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>We'll take care of the driving.</em>
            </h2>
          </div>
          <div style={{ maxWidth: '720px' }}>
            <ContactForm defaultService="tour" />
          </div>
        </div>
      </section>
    </>
  )
}

export default ScotlandToursPage
