'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { label: 'Airport Transfers', to: '/airport-transfers' },
  { label: 'Scotland Tours', to: '/scotland-tours' },
  { label: 'Fleet', to: '/fleet' },
  { label: 'About', to: '/about' },
]

const LINK_STYLE = {
  fontFamily: "var(--font-space-mono), monospace",
  fontWeight: 400,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  textDecoration: 'none',
  transition: 'color 0.3s ease',
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [menuOpen])

  const isActive = (to) => pathname === to

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      transition: 'background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
      background: scrolled || menuOpen ? 'rgba(7,7,12,0.92)' : 'transparent',
      borderBottom: `1px solid ${scrolled || menuOpen ? 'var(--line)' : 'transparent'}`,
      backdropFilter: scrolled || menuOpen ? 'blur(16px)' : 'none',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 3rem)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

          <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: '1.75rem',
              fontWeight: 300,
              letterSpacing: '-0.01em',
              color: 'var(--gold)',
              lineHeight: 1,
            }}>
              GEC
            </span>
            <span style={{
              fontFamily: "var(--font-space-mono), monospace",
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

          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '2.25rem' }}>
            {LINKS.map((link) => {
              const active = isActive(link.to)
              return (
                <Link
                  key={link.to}
                  href={link.to}
                  style={{
                    ...LINK_STYLE,
                    fontSize: '0.6rem',
                    color: active ? 'var(--white)' : 'var(--white-dim)',
                    borderBottom: active ? '1px solid var(--gold)' : '1px solid transparent',
                    paddingBottom: '3px',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)' }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = active ? 'var(--white)' : 'var(--white-dim)'
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href="/contact"
              className="btn-ghost"
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                padding: '0.625rem 1.375rem',
              }}
            >
              Reserve
            </Link>
          </div>

          <button
            className="gec-hamburger md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span style={{
              height: '1px',
              background: 'currentColor',
              width: '22px',
              transition: 'transform 0.3s ease',
              transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
            }} />
            <span style={{
              height: '1px',
              background: 'currentColor',
              width: menuOpen ? '22px' : '14px',
              transition: 'transform 0.3s ease, width 0.3s ease, opacity 0.2s ease',
              transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              height: '1px',
              background: 'currentColor',
              width: menuOpen ? '22px' : '18px',
              transition: 'transform 0.3s ease, width 0.3s ease',
              transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
            }} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            borderTop: '1px solid var(--line)',
            background: 'rgba(7,7,12,0.98)',
            backdropFilter: 'blur(20px)',
            animation: 'gecMenuDrop 0.28s ease',
          }}
        >
          <div style={{
            padding: '2rem clamp(1.5rem, 4vw, 3rem) 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}>
            {LINKS.map((link) => {
              const active = isActive(link.to)
              return (
                <Link
                  key={link.to}
                  href={link.to}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    ...LINK_STYLE,
                    fontSize: '0.75rem',
                    color: active ? 'var(--gold)' : 'var(--white)',
                    paddingBottom: '3px',
                    width: 'fit-content',
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href="/contact"
              className="btn-gold"
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                width: 'fit-content',
                marginTop: '0.5rem',
              }}
            >
              Reserve
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
