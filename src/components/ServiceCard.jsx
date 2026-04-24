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
        background: 'var(--void)',
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
          transition: 'transform 0.6s ease',
        }}
      />

      {/* Gradient overlay — void-toned */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(7,7,12,0.97) 0%, rgba(7,7,12,0.4) 50%, rgba(7,7,12,0.05) 100%)',
      }} />

      {/* Number tag — top left */}
      <div style={{
        position: 'absolute',
        top: '1.5rem',
        left: '1.5rem',
        fontFamily: "'Space Mono', monospace",
        fontSize: '0.55rem',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        background: 'rgba(7,7,12,0.65)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(196,165,90,0.3)',
        padding: '0.35rem 0.75rem',
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
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
          fontWeight: 300,
          color: 'var(--white)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginBottom: '0.5rem',
          margin: '0 0 0.5rem 0',
        }}>
          {title}
        </h3>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.875rem',
          color: 'var(--white-dim)',
          fontStyle: 'italic',
          marginBottom: '1.375rem',
          lineHeight: 1.55,
          margin: '0 0 1.375rem 0',
        }}>
          {tagline}
        </p>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.625rem',
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.575rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          transition: 'gap 0.3s ease',
        }}>
          Explore
          <svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
              d="M0 4H16M16 4L12.5 1M16 4L12.5 7"
              stroke="var(--gold)"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  )
}

export default ServiceCard
