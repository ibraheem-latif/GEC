import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import WhyChooseUs from '../components/WhyChooseUs'
import { SEO_CONFIG } from '../lib/seo'
import scotlandImage from '../assets/scotland scenery.jpg'

const features = [
  { code: '01', text: 'Premium Lexus ES300h fleet, serviced to manufacturer spec' },
  { code: '02', text: 'PVL-licensed, fully insured, locally-experienced drivers' },
  { code: '03', text: 'Fixed quotes upfront — no meters, no surprises' },
  { code: '04', text: 'Child seats and accessibility options available on request' },
]

const AboutPage = () => {
  const seo = SEO_CONFIG['/about']
  return (
    <>
      <SEOHead title={seo.title} description={seo.description} canonical={seo.canonical} />

      <section style={{ background: 'var(--surface)', position: 'relative', overflow: 'hidden', paddingTop: '5rem' }}>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '90vh' }}
          className="max-md:!grid-cols-1"
        >
          <div style={{
            padding: 'clamp(4rem, 8vw, 8rem) clamp(2rem, 6vw, 6rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRight: '1px solid var(--border)',
          }}>
            <div className="label" style={{ marginBottom: '2.5rem' }}>About Us</div>
            <h1 style={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)',
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: '-0.022em',
              color: 'var(--cream)',
              marginBottom: '1.75rem',
            }}>
              Glasgow's chauffeur<br />
              <em style={{ fontStyle: 'italic', color: 'var(--copper)' }}>since 2014.</em>
            </h1>
            <p style={{ color: 'var(--cream-dim)', lineHeight: 1.8, fontSize: '0.9875rem', marginBottom: '1rem', maxWidth: '44ch' }}>
              We've been getting people where they need to be for over a decade. Started right here in Glasgow,
              we know these roads like the back of our hand — from the M8 to Edinburgh,
              Glasgow Airport to the city centre.
            </p>
            <p style={{ color: 'var(--cream-dim)', lineHeight: 1.8, fontSize: '0.9875rem', marginBottom: '3rem', maxWidth: '44ch' }}>
              Our drivers aren't just professional — they're local. They know the shortcuts, the
              traffic patterns, and exactly when to leave to get you there bang on time.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
              {features.map((f) => (
                <div key={f.code} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.625rem',
                    letterSpacing: '0.15em',
                    color: 'var(--copper)',
                    paddingTop: '0.25rem',
                    flexShrink: 0,
                  }}>
                    {f.code}
                  </span>
                  <span style={{ color: 'var(--cream)', fontSize: '0.9375rem', lineHeight: 1.5 }}>{f.text}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn-copper">Get a Quote</Link>
              <Link to="/fleet" className="btn-outline">View Our Fleet</Link>
            </div>
          </div>

          <div style={{ position: 'relative', minHeight: '480px' }}>
            <img
              src={scotlandImage}
              alt="Scotland scenery"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(120deg, var(--surface) 0%, rgba(19,17,16,0.3) 45%, transparent 100%)',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '2.5rem',
              right: '2rem',
              background: 'rgba(13, 11, 9, 0.88)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--border-strong)',
              padding: '1.5rem 2rem',
            }}>
              <div style={{
                fontFamily: '"Fraunces", Georgia, serif',
                fontSize: '3rem',
                fontWeight: 700,
                color: 'var(--copper)',
                lineHeight: 1,
                marginBottom: '0.375rem',
              }}>
                10+
              </div>
              <div className="label">Years in Glasgow</div>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUs />
    </>
  )
}

export default AboutPage
