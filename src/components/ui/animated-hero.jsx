import { useEffect, useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Spotlight } from './spotlight'

// Primary: actual Glasgow city map (requires VITE_MAPTILER_KEY)
// Fallback: procedural 3D landscape
const GlasgowMap3D        = lazy(() => import('./glasgow-map-3d'))
const ScotlandLandscape3D = lazy(() => import('./scotland-landscape-3d'))

const HAS_MAP_KEY = !!import.meta.env.VITE_MAPTILER_KEY

const TITLES = ['professional', 'punctual', 'discreet', 'comfortable', 'luxurious']

const STATS = [
  { number: '10+', label: 'Years Experience' },
  { number: '5K+', label: 'Trips Completed' },
  { number: '24/7', label: 'Always Available' },
  { number: '100%', label: 'Client Satisfaction' },
]

function AnimatedHero() {
  const [titleNumber, setTitleNumber] = useState(0)
  const [heroW, setHeroW] = useState(() => window.innerWidth || 1200)
  const [heroH, setHeroH] = useState(() => window.innerHeight || 800)

  useEffect(() => {
    const id = setTimeout(() => {
      setTitleNumber(prev => (prev === TITLES.length - 1 ? 0 : prev + 1))
    }, 2600)
    return () => clearTimeout(id)
  }, [titleNumber])

  useEffect(() => {
    const update = () => {
      setHeroW(window.innerWidth)
      setHeroH(window.innerHeight)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: '#080604',
      }}
    >
      {/* ── Gradient veil ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(105deg, #080604 0%, #080604 28%, rgba(8,6,4,0.82) 48%, rgba(8,6,4,0.25) 68%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Bottom vignette — grounds the section ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '220px',
          background: 'linear-gradient(to top, #080604 0%, transparent 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* ── Copper spotlight — from top-left ── */}
      <Spotlight
        className="-top-40 -left-10 md:left-16 md:-top-20"
        fill="rgba(200, 115, 40, 0.55)"
      />

      {/* ── Hero background: real Glasgow map or procedural 3D landscape ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut', delay: 0.4 }}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      >
        <Suspense fallback={null}>
          {HAS_MAP_KEY
            ? <GlasgowMap3D />
            : <ScotlandLandscape3D width={heroW} height={heroH} />
          }
        </Suspense>
      </motion.div>

      {/* ── Decorative vertical copper rule ── */}
      <div
        style={{
          position: 'absolute',
          left: 'clamp(1.5rem, 5vw, 3.5rem)',
          top: '22%',
          bottom: '22%',
          width: '1px',
          background: 'linear-gradient(to bottom, transparent, #c87328, transparent)',
          opacity: 0.45,
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />

      {/* ── Content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          maxWidth: '640px',
          padding:
            'clamp(5.5rem, 10vh, 9rem) clamp(2rem, 7vw, 6rem) clamp(3.5rem, 6vh, 5.5rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Label */}
        <motion.div
          className="label"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ marginBottom: 'clamp(1rem, 2vh, 1.5rem)' }}
        >
          Est. 2014 · Glasgow · Scotland
        </motion.div>

        {/* Animated heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
        >
          <h1
            style={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontSize: 'clamp(2rem, 4.5vw, 4rem)',
              fontWeight: 300,
              lineHeight: 1,
              letterSpacing: '-0.025em',
              color: '#e5ddd0',
              marginBottom: 'clamp(0.75rem, 1.5vh, 1.25rem)',
            }}
          >
            <span style={{ display: 'block' }}>Your</span>

            <span
              style={{
                display: 'block',
                position: 'relative',
                height: '1.05em',
                overflow: 'hidden',
              }}
            >
              {TITLES.map((title, index) => (
                <motion.span
                  key={index}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    color: '#c87328',
                    fontStyle: 'italic',
                    whiteSpace: 'nowrap',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: titleNumber === index ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                  {title}
                </motion.span>
              ))}
            </span>

            <span style={{ display: 'block' }}>
              <em>chauffeur</em>
            </span>
            <span style={{ display: 'block' }}>service.</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.35 }}
          style={{
            fontFamily: '"Syne", sans-serif',
            fontSize: 'clamp(0.9rem, 1.4vw, 1rem)',
            fontWeight: 400,
            lineHeight: 1.75,
            color: 'rgba(229,221,208,0.62)',
            maxWidth: '40ch',
            marginBottom: 'clamp(1.25rem, 2.5vh, 2rem)',
          }}
        >
          From Glasgow Airport to the Highlands — premium transport in our
          executive V-Class fleet. Fixed prices. No surprises.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
        >
          <Link to="/contact" className="btn-copper">
            Book Your Ride
          </Link>
          <Link to="/fleet" className="btn-outline">
            View Fleet
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          style={{
            marginTop: 'clamp(1.25rem, 3vh, 2.5rem)',
            paddingTop: 'clamp(0.75rem, 1.5vh, 1.25rem)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex',
            gap: 'clamp(1.5rem, 4vw, 3rem)',
            flexWrap: 'wrap',
          }}
        >
          {STATS.map((stat, i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: '"Fraunces", Georgia, serif',
                  fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                  fontWeight: 600,
                  color: '#c87328',
                  lineHeight: 1,
                  marginBottom: '0.35rem',
                }}
              >
                {stat.number}
              </div>
              <div className="label" style={{ fontSize: '0.55rem' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export { AnimatedHero }
