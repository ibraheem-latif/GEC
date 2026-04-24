import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const Navbar = ({ scrolled }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { label: 'Airport Transfers', to: '/airport-transfers' },
    { label: 'Scotland Tours', to: '/scotland-tours' },
    { label: 'Fleet', to: '/fleet' },
    { label: 'About', to: '/about' },
  ]

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      transition: 'background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
      background: scrolled ? 'rgba(7,7,12,0.92)' : 'transparent',
      borderBottom: `1px solid ${scrolled ? 'var(--line)' : 'transparent'}`,
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 3rem)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

          {/* Wordmark */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
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
              fontSize: '0.45rem',
              fontWeight: 400,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--white-dim)',
              lineHeight: 1,
              marginTop: '0.25rem',
            }}>
              Glasgow Executive Chauffeurs
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '2.25rem' }}>
            {links.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                style={({ isActive }) => ({
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.6rem',
                  fontWeight: 400,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--white)' : 'var(--white-dim)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  borderBottom: isActive ? '1px solid var(--gold)' : '1px solid transparent',
                  paddingBottom: '3px',
                })}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                onMouseLeave={e => {
                  if (!e.currentTarget.getAttribute('aria-current')) {
                    e.currentTarget.style.color = 'var(--white-dim)'
                  } else {
                    e.currentTarget.style.color = 'var(--white)'
                  }
                }}
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              className="btn-ghost"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                padding: '0.625rem 1.375rem',
              }}
            >
              Reserve
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex flex-col md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--white)',
              padding: '0.5rem',
              gap: '5px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <span style={{
              height: '1px',
              background: 'currentColor',
              width: '22px',
              display: 'block',
              transition: 'transform 0.3s ease',
              transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
            }} />
            <span style={{
              height: '1px',
              background: 'currentColor',
              width: '22px',
              display: 'block',
              transition: 'transform 0.3s ease, opacity 0.3s ease',
              transform: menuOpen ? 'rotate(-45deg)' : 'none',
              opacity: menuOpen ? 1 : 1,
            }} />
            {!menuOpen && (
              <span style={{
                height: '1px',
                background: 'currentColor',
                width: '14px',
                display: 'block',
              }} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden"
        style={{
          maxHeight: menuOpen ? '420px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
          background: 'var(--deep)',
          borderBottom: menuOpen ? '1px solid var(--line)' : 'none',
        }}
      >
        <div style={{
          padding: '2rem clamp(1.5rem, 4vw, 3rem) 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}>
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.65rem',
                fontWeight: 400,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: isActive ? 'var(--gold)' : 'var(--white-dim)',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                borderBottom: isActive ? '1px solid var(--gold)' : '1px solid transparent',
                paddingBottom: '3px',
                width: 'fit-content',
              })}
            >
              {link.label}
            </NavLink>
          ))}
          <div style={{ width: '1px', height: '1px', background: 'var(--line)', margin: '0.25rem 0' }} />
          <Link
            to="/contact"
            className="btn-ghost"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              width: 'fit-content',
              marginTop: '0.25rem',
            }}
          >
            Reserve
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
