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

  const linkStyle = {
    color: 'var(--white-dim)',
    fontSize: '0.875rem',
    fontFamily: "'DM Sans', sans-serif",
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    lineHeight: 1.6,
  }

  return (
    <footer style={{ background: 'var(--deep)', borderTop: '1px solid var(--line)' }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'clamp(4rem, 8vh, 6rem) clamp(1.5rem, 5vw, 5rem) clamp(2rem, 4vh, 3.5rem)',
      }}>

        {/* Footer CTA */}
        <div style={{
          paddingBottom: 'clamp(3.5rem, 7vh, 5.5rem)',
          borderBottom: '1px solid var(--line)',
          marginBottom: 'clamp(3.5rem, 6vh, 5rem)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '2.5rem',
        }}>
          <div>
            <div className="label" style={{ marginBottom: '1.25rem' }}>
              Get a quote today
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.5rem, 5.5vw, 5rem)',
              fontWeight: 300,
              letterSpacing: '-0.03em',
              color: 'var(--white)',
              lineHeight: 1.05,
              margin: 0,
            }}>
              Ready for your<br />
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>next journey?</em>
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.125rem' }}>
            <Link to="/contact" className="btn-gold">
              Book Now
            </Link>
            <a
              href={`mailto:${EMAIL}`}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.6rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--white-dim)',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--white-dim)'}
            >
              {EMAIL}
            </a>
          </div>
        </div>

        {/* Link grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '3rem',
            paddingBottom: '3.5rem',
            borderBottom: '1px solid var(--line)',
            marginBottom: '2.5rem',
          }}
          className="max-md:!grid-cols-2 max-sm:!grid-cols-1"
        >
          {/* Brand column */}
          <div>
            <Link
              to="/"
              style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: 1, width: 'fit-content' }}
            >
              <span style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '1.75rem',
                fontWeight: 300,
                letterSpacing: '-0.01em',
                color: 'var(--gold)',
                lineHeight: 1,
              }}>
                GEC
              </span>
              <span style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.42rem',
                fontWeight: 400,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--white-dim)',
                lineHeight: 1,
                marginTop: '0.3rem',
              }}>
                Glasgow Executive Chauffeurs
              </span>
            </Link>

            <p style={{
              color: 'var(--white-dim)',
              fontSize: '0.875rem',
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.75,
              marginTop: '1.5rem',
              maxWidth: '28ch',
            }}>
              Professional chauffeur service based in Glasgow. Serving Scotland since 2014.
            </p>

            <div style={{ marginTop: '1.75rem' }}>
              <a
                href={`mailto:${EMAIL}`}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.575rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  textDecoration: 'none',
                  transition: 'opacity 0.3s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {EMAIL}
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(sections).map(([title, links]) => (
            <div key={title}>
              <div className="label" style={{ marginBottom: '1.5rem' }}>{title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      style={linkStyle}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--white-dim)'}
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
            color: 'var(--white-dim)',
            fontSize: '0.725rem',
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            &copy; {year} Glasgow Executive Chauffeurs
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {['Privacy', 'Terms', 'Cookies'].map(item => (
              <a
                key={item}
                href="#"
                style={{
                  color: 'var(--white-dim)',
                  fontSize: '0.725rem',
                  fontFamily: "'Space Mono', monospace",
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--white-dim)'}
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
