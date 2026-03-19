import { Link } from 'react-router-dom'

const CTABanner = ({
  label = 'Ready to book?',
  heading = 'Need a chauffeur in Glasgow?',
  buttonText = 'Get a Quote',
  to = '/contact',
}) => {
  return (
    <div style={{
      marginTop: 'clamp(2.5rem, 5vh, 4rem)',
      padding: 'clamp(2.25rem, 4vw, 3.5rem)',
      background: 'var(--copper)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative large text background */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        right: '-0.05em',
        top: '-0.25em',
        fontFamily: '"Fraunces", Georgia, serif',
        fontSize: 'clamp(6rem, 15vw, 14rem)',
        fontWeight: 800,
        color: 'rgba(13,11,9,0.07)',
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
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.575rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(13,11,9,0.55)',
          marginBottom: '0.75rem',
        }}>
          {label}
        </div>
        <h3 style={{
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
          fontWeight: 300,
          color: '#0d0b09',
          letterSpacing: '-0.025em',
          lineHeight: 1.1,
        }}>
          {heading}
        </h3>
      </div>
      <Link
        to={to}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.625rem',
          padding: '0.875rem 2rem',
          background: '#0d0b09',
          color: 'var(--copper)',
          fontFamily: '"Syne", sans-serif',
          fontWeight: 700,
          fontSize: '0.8rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          transition: 'background 0.25s ease',
          flexShrink: 0,
          position: 'relative',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#1c1917'}
        onMouseLeave={e => e.currentTarget.style.background = '#0d0b09'}
      >
        {buttonText}
      </Link>
    </div>
  )
}

export default CTABanner
