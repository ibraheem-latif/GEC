import { Link } from 'react-router-dom'
import { EMAIL } from '../lib/seo'

const Footer = () => {
  const year = new Date().getFullYear()

  const sections = {
    Services: [
      { label: 'Airport Transfers', to: '/airport-transfers' },
      { label: 'Scotland Tours', to: '/scotland-tours' },
      { label: 'Corporate Chauffeur', to: '/corporate-chauffeurs' },
    ],
    Company: [
      { label: 'About Us', to: '/about' },
      { label: 'Our Fleet', to: '/fleet' },
      { label: 'Contact', to: '/contact' },
    ],
    Support: [
      { label: 'Contact', to: '/contact' },
      { label: 'Privacy Policy', to: '#' },
      { label: 'Terms of Service', to: '#' },
    ],
  }

  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'clamp(3.5rem, 7vh, 5.5rem) clamp(1.5rem, 5vw, 5rem) clamp(2rem, 4vh, 3.5rem)',
      }}>

        {/* Footer CTA — above the link grid */}
        <div style={{
          paddingBottom: 'clamp(3rem, 6vh, 5rem)',
          borderBottom: '1px solid var(--border)',
          marginBottom: 'clamp(3rem, 5vh, 4.5rem)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '2rem',
        }}>
          <div>
            <div className="label" style={{ marginBottom: '1rem' }}>Get a quote today</div>
            <h2 style={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
              fontWeight: 300,
              letterSpacing: '-0.03em',
              color: 'var(--cream)',
              lineHeight: 1,
            }}>
              Ready for your<br /><em style={{ color: 'var(--copper)', fontStyle: 'italic' }}>next journey?</em>
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
            <Link to="/contact" className="btn-copper">Book Now</Link>
            <a
              href={`mailto:${EMAIL}`}
              style={{
                color: 'var(--cream-dim)',
                fontSize: '0.8125rem',
                fontFamily: '"Syne", sans-serif',
                textDecoration: 'none',
                letterSpacing: '0.02em',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--copper)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--cream-dim)'}
            >
              {EMAIL}
            </a>
          </div>
        </div>

        {/* Top section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '3rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid var(--border)',
            marginBottom: '2.5rem',
          }}
          className="max-md:!grid-cols-2 max-sm:!grid-cols-1"
        >

          {/* Brand */}
          <div>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <span style={{
                fontFamily: '"Fraunces", Georgia, serif',
                fontSize: '1.75rem',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                color: 'var(--cream)',
              }}>
                Glasgow <em style={{ color: 'var(--copper)', fontStyle: 'italic' }}>Executive</em> Chauffeurs
              </span>
            </Link>
            <p style={{
              color: 'var(--cream-dim)',
              fontSize: '0.875rem',
              lineHeight: 1.7,
              marginTop: '1rem',
              maxWidth: '28ch',
            }}>
              Professional chauffeur service based in Glasgow. Serving Scotland since 2014.
            </p>
            <div style={{ marginTop: '1.5rem' }}>
              <a
                href={`mailto:${EMAIL}`}
                className="label"
                style={{ color: 'var(--copper)', textDecoration: 'none' }}
              >
                {EMAIL}
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(sections).map(([title, links]) => (
            <div key={title}>
              <div className="label" style={{ marginBottom: '1.25rem' }}>{title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      style={{
                        color: 'var(--cream-dim)',
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        fontFamily: '"Syne", sans-serif',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--cream)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--cream-dim)'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{
            color: 'var(--cream-dim)',
            fontSize: '0.8rem',
            fontFamily: '"Syne", sans-serif',
          }}>
            © {year} Glasgow Executive Chauffeurs
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {['Privacy', 'Terms', 'Cookies'].map(item => (
              <a
                key={item}
                href="#"
                style={{
                  color: 'var(--cream-dim)',
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  fontFamily: '"Syne", sans-serif',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--copper)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--cream-dim)'}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
