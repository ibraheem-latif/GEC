import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Margaret T.',
    location: 'Glasgow',
    text: 'Used Glasgow Executive Chauffeurs for an early morning airport run. Driver was waiting at the door before I even came downstairs. Professional from start to finish.',
    service: 'Airport Transfer',
  },
  {
    name: 'James R.',
    location: 'Edinburgh',
    text: "Booked a full-day Highland tour for my wife's birthday. The driver was knowledgeable, patient, and made the whole day feel special. Highly recommend.",
    service: 'Scotland Tour',
  },
  {
    name: 'David M.',
    location: 'Glasgow',
    text: 'We use them for all our executive travel. Always punctual, always immaculate. The company account billing makes everything seamless.',
    service: 'Corporate Chauffeur',
  },
]

const Stars = () => (
  <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1.5rem' }}>
    {[...Array(5)].map((_, i) => (
      <svg key={i} width="13" height="13" viewBox="0 0 13 13" fill="var(--gold)">
        <path d="M6.5 0.5L8.09 4.64H12.5L9.02 7.22L10.36 11.5L6.5 9.1L2.64 11.5L3.98 7.22L0.5 4.64H4.91L6.5 0.5Z" />
      </svg>
    ))}
  </div>
)

const TestimonialSection = () => {
  const [featured, ...rest] = testimonials

  return (
    <section style={{ background: 'var(--void)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative background quote mark */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-0.1em',
          right: '-0.02em',
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: 'clamp(18rem, 45vw, 55rem)',
          fontWeight: 800,
          color: 'rgba(196,165,90,0.03)',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        &ldquo;
      </div>

      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'clamp(1.25rem, 2.5vh, 2rem) clamp(1.5rem, 5vw, 5rem)',
      }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: '-60px' }}
          style={{
            marginBottom: 'clamp(1rem, 2vh, 1.5rem)',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '2rem',
          }}
        >
          <div>
            <div className="label" style={{ marginBottom: '1rem' }}>Client Testimonials</div>
            <h2 style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'var(--white)',
            }}>
              What our clients<br />
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>have to say.</em>
            </h2>
          </div>
          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            color: 'var(--white-dim)',
            maxWidth: '30ch',
            fontSize: '0.9375rem',
            lineHeight: 1.7,
          }}>
            Over a decade of getting people where they need to be — on time, in comfort.
          </p>
        </motion.div>

        {/* Featured testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: '-40px' }}
          style={{
            background: 'var(--deep)',
            borderTop: '1px solid var(--line)',
            borderBottom: '1px solid var(--line)',
            borderLeft: '2px solid var(--gold)',
            padding: 'clamp(1rem, 2.5vw, 1.75rem)',
            marginBottom: '1rem',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '2rem',
            alignItems: 'end',
          }}
          className="max-sm:!grid-cols-1"
        >
          <div>
            <Stars />
            <p style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 'clamp(1.125rem, 2.2vw, 1.625rem)',
              fontStyle: 'italic',
              fontWeight: 300,
              lineHeight: 1.65,
              color: 'var(--white)',
              maxWidth: '68ch',
            }}>
              &ldquo;{featured.text}&rdquo;
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: 'var(--white)',
              marginBottom: '0.35rem',
            }}>
              {featured.name}
            </div>
            <div className="label" style={{ fontSize: '0.5rem', color: 'var(--white-dim)' }}>
              {featured.location}
            </div>
            <div className="label" style={{ fontSize: '0.5rem', color: 'var(--gold)', marginTop: '0.35rem' }}>
              {featured.service}
            </div>
          </div>
        </motion.div>

        {/* Two smaller testimonials */}
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}
          className="max-md:!grid-cols-1"
        >
          {rest.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
              viewport={{ once: true, margin: '-40px' }}
              style={{
                border: '1px solid var(--line)',
                padding: 'clamp(1rem, 2vw, 1.5rem)',
                background: 'var(--white-faint)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <Stars />
              <p style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)',
                fontStyle: 'italic',
                fontWeight: 300,
                lineHeight: 1.75,
                color: 'var(--white)',
                flex: 1,
              }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div style={{
                borderTop: '1px solid var(--line)',
                paddingTop: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    color: 'var(--white)',
                    marginBottom: '0.25rem',
                  }}>
                    {t.name}
                  </div>
                  <div className="label" style={{ fontSize: '0.5rem', color: 'var(--white-dim)' }}>
                    {t.location}
                  </div>
                </div>
                <div className="label" style={{ fontSize: '0.5rem', color: 'var(--gold)' }}>
                  {t.service}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialSection
