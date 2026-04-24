'use client'

import Link from 'next/link'

export default function CTABanner({
  label = 'Ready to book?',
  heading = 'Need a chauffeur in Glasgow?',
  buttonText = 'Get a Quote',
  to = '/contact',
}) {
  return (
    <div style={{
      marginTop: 'clamp(2.5rem, 5vh, 4rem)',
      padding: 'clamp(2.5rem, 5vw, 4rem) clamp(2rem, 5vw, 4rem)',
      background: 'var(--gold)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '2.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div aria-hidden="true" style={{
        position: 'absolute',
        right: '-0.05em',
        top: '-0.2em',
        fontFamily: 'var(--font-playfair), Georgia, serif',
        fontSize: 'clamp(7rem, 16vw, 15rem)',
        fontWeight: 300,
        color: 'rgba(7,7,12,0.07)',
        lineHeight: 1,
        pointerEvents: 'none',
        userSelect: 'none',
        letterSpacing: '-0.04em',
        whiteSpace: 'nowrap',
      }}>
        GEC
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{
          fontFamily: 'var(--font-space-mono), monospace',
          fontSize: '0.575rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(7,7,12,0.5)',
          marginBottom: '0.875rem',
        }}>
          {label}
        </div>
        <h3 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 'clamp(1.625rem, 3.5vw, 2.75rem)',
          fontWeight: 300,
          color: 'var(--void)',
          letterSpacing: '-0.025em',
          lineHeight: 1.1,
          margin: 0,
        }}>
          {heading}
        </h3>
      </div>

      <Link
        href={to}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.9rem 2.25rem',
          background: 'var(--void)',
          color: 'var(--gold)',
          fontFamily: 'var(--font-space-mono), monospace',
          fontWeight: 400,
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          transition: 'background 0.3s ease',
          flexShrink: 0,
          position: 'relative',
          borderRadius: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--deep)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--void)'}
      >
        {buttonText}
      </Link>
    </div>
  )
}
