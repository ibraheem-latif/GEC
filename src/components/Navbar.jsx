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
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
      background: scrolled ? 'rgba(13, 11, 9, 0.93)' : 'transparent',
      borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
      backdropFilter: scrolled ? 'blur(14px)' : 'none',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 3rem)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontSize: 'clamp(1rem, 2vw, 1.375rem)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--cream)',
            }}>
              Glasgow <em style={{ color: 'var(--copper)', fontStyle: 'italic' }}>Executive</em> Chauffeurs
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '2rem' }}>
            {links.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                style={({ isActive }) => ({
                  fontFamily: '"Syne", sans-serif',
                  fontSize: '0.725rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--cream)' : 'var(--cream-dim)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease, border-color 0.2s ease',
                  borderBottom: isActive ? '1px solid var(--copper)' : '1px solid transparent',
                  paddingBottom: '2px',
                })}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--cream)'}
                onMouseLeave={e => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.color = 'var(--cream-dim)'
                  }
                }}
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/contact" className="btn-copper" style={{ fontSize: '0.7rem', padding: '0.625rem 1.375rem' }}>
              Book Now
            </Link>
          </div>

          {/* Mobile button */}
          <button
            className="flex flex-col md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cream)', padding: '0.5rem', gap: '5px' }}
          >
            <span style={{ height: '1px', background: 'currentColor', width: '22px', display: 'block', transition: 'transform 0.3s', transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none' }} />
            <span style={{ height: '1px', background: 'currentColor', width: '22px', display: 'block', transition: 'transform 0.3s', transform: menuOpen ? 'rotate(-45deg)' : 'none' }} />
            {!menuOpen && <span style={{ height: '1px', background: 'currentColor', width: '14px', display: 'block' }} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden" style={{
        maxHeight: menuOpen ? '400px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        background: 'var(--surface)',
        borderBottom: menuOpen ? '1px solid var(--border)' : 'none',
      }}>
        <div style={{ padding: '1.75rem 2rem 2.25rem', display: 'flex', flexDirection: 'column', gap: '1.375rem' }}>
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                fontFamily: '"Syne", sans-serif',
                fontSize: '0.8125rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: isActive ? 'var(--cream)' : 'var(--cream-dim)',
                textDecoration: 'none',
              })}
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/contact" className="btn-copper" onClick={() => setMenuOpen(false)} style={{ width: 'fit-content', marginTop: '0.5rem' }}>
            Book Now
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
