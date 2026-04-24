import Link from 'next/link'

export const metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <section style={{ background: 'var(--void)', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 5vw, 5rem)',
        textAlign: 'center',
        width: '100%',
      }}>
        <div style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 'clamp(5rem, 15vw, 12rem)',
          fontWeight: 300,
          color: 'var(--gold)',
          lineHeight: 1,
          opacity: 0.25,
          marginBottom: '2rem',
        }}>
          404
        </div>
        <div className="label" style={{ marginBottom: '1.5rem' }}>Page Not Found</div>
        <h1 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 'clamp(1.75rem, 4vw, 3rem)',
          fontWeight: 300,
          color: 'var(--white)',
          letterSpacing: '-0.02em',
          marginBottom: '1.5rem',
        }}>
          This page doesn&apos;t exist.
        </h1>
        <p style={{ color: 'var(--white-dim)', fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '0.9375rem', lineHeight: 1.75, marginBottom: '3rem' }}>
          Let us take you somewhere better.
        </p>
        <Link href="/" className="btn-gold">Back to Home</Link>
      </div>
    </section>
  )
}
