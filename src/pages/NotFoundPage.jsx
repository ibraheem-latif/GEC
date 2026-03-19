import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <section style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 5vw, 5rem)',
        textAlign: 'center',
        width: '100%',
      }}>
        <div style={{
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 'clamp(5rem, 15vw, 12rem)',
          fontWeight: 300,
          color: 'var(--copper)',
          lineHeight: 1,
          opacity: 0.3,
          marginBottom: '2rem',
        }}>
          404
        </div>
        <div className="label" style={{ marginBottom: '1.5rem' }}>Page Not Found</div>
        <h1 style={{
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 'clamp(1.75rem, 4vw, 3rem)',
          fontWeight: 300,
          color: 'var(--cream)',
          letterSpacing: '-0.02em',
          marginBottom: '1.5rem',
        }}>
          This page doesn't exist.
        </h1>
        <p style={{ color: 'var(--cream-dim)', fontSize: '0.9375rem', lineHeight: 1.75, marginBottom: '3rem' }}>
          Let us take you somewhere better.
        </p>
        <Link to="/" className="btn-copper">Back to Home</Link>
      </div>
    </section>
  )
}

export default NotFoundPage
