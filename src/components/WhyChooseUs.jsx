import { motion } from 'framer-motion'
import CTABanner from './CTABanner'

const benefits = [
  {
    num: '01',
    title: 'Safe & Licensed',
    desc: "All drivers are PVL-licensed, fully insured, and background checked. Vehicles are serviced to spec. Your safety isn't negotiable.",
  },
  {
    num: '02',
    title: 'Always On Time',
    desc: "We know Glasgow traffic. Buffer time is built in. Flights are tracked. You are never left waiting — that's the promise.",
  },
  {
    num: '03',
    title: 'Proper Luxury',
    desc: "Clean Lexus ES300h fleet. Air con, phone chargers, complimentary water. Not flashy — just genuinely comfortable.",
  },
  {
    num: '04',
    title: 'Available 24/7',
    desc: "Early flight? Late meeting? Weekend trip? Someone is always on call. Book any time to get sorted.",
  },
  {
    num: '05',
    title: 'Fixed Prices',
    desc: "We quote you a price before you book — that's what you pay. No surge pricing, no meter running, no nasty surprises.",
  },
  {
    num: '06',
    title: 'Local Knowledge',
    desc: "Born and based in Glasgow. We know every route, every shortcut. Most of our bookings come through word of mouth.",
  },
]

const WhyChooseUs = () => {
  return (
    <section id="why-us" style={{ background: 'var(--surface)' }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'clamp(1.25rem, 2.5vh, 2rem) clamp(1.5rem, 5vw, 5rem)',
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: '-60px' }}
          style={{
            marginBottom: 'clamp(1rem, 2vh, 1.5rem)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '2rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div>
            <div className="label" style={{ marginBottom: '1rem' }}>Why Choose Us</div>
            <h2 style={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'var(--cream)',
            }}>
              Why people<br /><em>keep coming back.</em>
            </h2>
          </div>
          <p style={{ color: 'var(--cream-dim)', maxWidth: '32ch', fontSize: '0.9375rem', lineHeight: 1.7 }}>
            We're not the cheapest and we won't pretend to be. But we show up, we're on time, and we look after you properly.
          </p>
        </motion.div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            borderTop: '1px solid var(--border)',
            borderLeft: '1px solid var(--border)',
          }}
          className="max-md:!grid-cols-2 max-sm:!grid-cols-1"
        >
          {benefits.map((b, index) => (
            <motion.div
              key={b.num}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: (index % 3) * 0.1,
              }}
              viewport={{ once: true, margin: '-30px' }}
              style={{
                padding: 'clamp(0.875rem, 1.5vw, 1.25rem)',
                borderRight: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                transition: 'background 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(200, 115, 40, 0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Large background number */}
              <div style={{
                fontFamily: '"Fraunces", Georgia, serif',
                fontSize: '4rem',
                fontWeight: 800,
                color: 'rgba(229, 221, 208, 0.04)',
                lineHeight: 1,
                marginBottom: '-0.5rem',
                letterSpacing: '-0.04em',
                userSelect: 'none',
              }}>
                {b.num}
              </div>
              {/* Copper accent line */}
              <div style={{
                width: '1.75rem',
                height: '1px',
                background: 'var(--copper)',
                marginBottom: '1rem',
                opacity: 0.7,
              }} />
              <h3 style={{
                fontFamily: '"Syne", sans-serif',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: 'var(--cream)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '0.875rem',
              }}>
                {b.title}
              </h3>
              <p style={{ color: 'var(--cream-dim)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                {b.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <CTABanner />
      </div>
    </section>
  )
}

export default WhyChooseUs
