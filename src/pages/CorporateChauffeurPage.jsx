import SEOHead from '../components/SEOHead'
import ContactForm from '../components/ContactForm'
import { SEO_CONFIG } from '../lib/seo'
import lexusImage from '../assets/lexus es 300h black.jpg'

const benefits = [
  { num: '01', title: 'Company Accounts', desc: 'Set up a company account for streamlined billing. Ideal for teams with regular travel requirements.' },
  { num: '02', title: 'Events & Roadshows', desc: 'Conference transfers, venue shuttles, executive meet-and-greet. We handle the logistics.' },
  { num: '03', title: 'Recurring Bookings', desc: 'Regular routes managed on your schedule. Standing bookings taken by email — no need to call each time.' },
  { num: '04', title: 'Confidential Service', desc: 'Discreet, professional. Your driver does not discuss other clients or journeys.' },
]

const CorporateChauffeurPage = () => {
  const seo = SEO_CONFIG['/corporate-chauffeurs']
  return (
    <>
      <SEOHead title={seo.title} description={seo.description} canonical={seo.canonical} />

      <section style={{ background: 'var(--surface)', paddingTop: '7rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 5rem)' }}>
          <div className="label" style={{ marginBottom: '1.5rem' }}>Corporate</div>
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
            Corporate Chauffeur <em style={{ color: 'var(--copper)' }}>Service Glasgow</em>
          </h1>
          <p style={{ color: 'var(--cream-dim)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '52ch' }}>
            Business travel that works. One-off trips or regular bookings — pick-up from your office, door-to-door service to any meeting, event, or airport. Company accounts welcome.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 5rem)' }}>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}
            className="max-md:!grid-cols-1"
          >
            <div>
              <img
                src={lexusImage}
                alt="Corporate chauffeur Lexus"
                style={{ width: '100%', height: '400px', objectFit: 'cover', marginBottom: '2rem' }}
              />
            </div>
            <div>
              <div className="label" style={{ marginBottom: '2rem' }}>What We Offer</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {benefits.map(b => (
                  <div key={b.num} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                      <span style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '0.575rem',
                        letterSpacing: '0.15em',
                        color: 'var(--copper)',
                        paddingTop: '0.25rem',
                        flexShrink: 0,
                      }}>
                        {b.num}
                      </span>
                      <div>
                        <h3 style={{
                          fontFamily: '"Syne", sans-serif',
                          fontSize: '0.9375rem',
                          fontWeight: 700,
                          color: 'var(--cream)',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          marginBottom: '0.5rem',
                        }}>
                          {b.title}
                        </h3>
                        <p style={{ color: 'var(--cream-dim)', fontSize: '0.9rem', lineHeight: 1.75 }}>{b.desc}</p>
                      </div>
                    </div>
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
            <div className="label" style={{ marginBottom: '1rem' }}>Enquire Now</div>
            <h2 style={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: 'var(--cream)',
            }}>
              Set up a corporate account.<br /><em>We handle the rest.</em>
            </h2>
          </div>
          <div style={{ maxWidth: '720px' }}>
            <ContactForm defaultService="executive" />
          </div>
        </div>
      </section>
    </>
  )
}

export default CorporateChauffeurPage
