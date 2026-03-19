import { Link } from 'react-router-dom'

const ServiceCard = ({ num, title, tagline, image, to }) => {
  return (
    <Link
      to={to}
      className="service-card"
      style={{
        display: 'block',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: '3 / 2',
        background: '#080604',
      }}
    >
      {/* Full-bleed image */}
      <img
        src={image}
        alt={title}
        className="service-card-img"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />

      {/* Persistent gradient overlay — deeper at bottom */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(8,6,4,0.96) 0%, rgba(8,6,4,0.45) 45%, rgba(8,6,4,0.08) 100%)',
      }} />

      {/* Number tag — top left */}
      <div style={{
        position: 'absolute',
        top: '1.5rem',
        left: '1.5rem',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '0.525rem',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'var(--copper)',
        background: 'rgba(8,6,4,0.65)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(200,115,40,0.25)',
        padding: '0.35rem 0.7rem',
      }}>
        {num}
      </div>

      {/* Text content — bottom */}
      <div
        className="service-card-content"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '2rem 1.75rem 2.25rem',
        }}
      >
        <h3 style={{
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
          fontWeight: 300,
          color: 'var(--cream)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginBottom: '0.5rem',
        }}>
          {title}
        </h3>
        <p style={{
          fontFamily: '"Syne", sans-serif',
          fontSize: '0.875rem',
          color: 'rgba(229,221,208,0.58)',
          fontStyle: 'italic',
          marginBottom: '1.375rem',
          lineHeight: 1.5,
        }}>
          {tagline}
        </p>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.625rem',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.575rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--copper)',
        }}>
          Explore
          <svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 4H16M16 4L12.5 1M16 4L12.5 7" stroke="#c87328" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </Link>
  )
}

export default ServiceCard
