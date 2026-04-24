import { useEffect, useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Spotlight } from './spotlight'

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
        background: 'var(--void)',
      }}
    >
      {/* ── Gradient veil — darkens the left so copy reads, fades to reveal the map on the right ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(105deg, #07070C 0%, #07070C 25%, rgba(7,7,12,0.85) 48%, rgba(7,7,12,0.25) 70%, transparent 100%)',
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
          background: 'linear-gradient(to top, #07070C 0%, transparent 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* ── Gold spotlight — from top-left ── */}
      <Spotlight
        className="-top-40 -left-10 md:left-16 md:-top-20"
        fill="rgba(196, 165, 90, 0.4)"
      />

      {/* ── Cinematic Glasgow/Scotland map tour — full hero background ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.2, ease: 'easeOut', delay: 0.5 }}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      >
        <Suspense fallback={null}>
          {HAS_MAP_KEY
            ? <GlasgowMap3D />
            : <ScotlandLandscape3D width={heroW} height={heroH} />
          }
        </Suspense>
      </motion.div>

      {/* ── Decorative vertical gold rule ── */}
      <div
        style={{
          position: 'absolute',
          left: 'clamp(1.5rem, 5vw, 3.5rem)',
          top: '22%',
          bottom: '22%',
          width: '1px',
          background: 'linear-gradient(to bottom, transparent, var(--gold), transparent)',
          opacity: 0.35,
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />

      {/* ── Content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          maxWidth: '660px',
          padding:
            'clamp(5.5rem, 10vh, 9rem) clamp(2rem, 7vw, 6rem) clamp(3.5rem, 6vh, 5.5rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Eyebrow label */}
        <motion.div
          className="label"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            color: 'var(--gold)',
            marginBottom: '2.5rem',
          }}
        >
          EST. 2014 · GLASGOW · SCOTLAND
        </motion.div>

        {/* Animated heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
        >
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 'clamp(3.5rem, 6.5vw, 5.5rem)',
              fontWeight: 300,
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              color: 'var(--white)',
              marginBottom: 'clamp(0.75rem, 1.5vh, 1.25rem)',
            }}
          >
            <span style={{ display: 'block' }}>Your</span>

            {/* Animated adjective — gold italic */}
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
                    color: 'var(--gold)',
                    fontStyle: 'italic',
                    fontFamily: '"Playfair Display", Georgia, serif',
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

            <span style={{ display: 'block' }}>chauffeur</span>
            <span style={{ display: 'block', fontStyle: 'italic' }}>service.</span>
          </h1>
        </motion.div>

        {/* Full-width hairline divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.28 }}
          style={{
            width: '100%',
            height: '1px',
            background: 'var(--line-strong)',
            marginBottom: 'clamp(1.25rem, 2.5vh, 2rem)',
            transformOrigin: 'left',
          }}
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.35 }}
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: 1.8,
            color: 'var(--white-dim)',
            maxWidth: '44ch',
            marginBottom: '2.5rem',
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
          <Link to="/contact" className="btn-gold">
            RESERVE YOUR JOURNEY
          </Link>
          <Link to="/fleet" className="btn-ghost">
            VIEW FLEET
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          style={{
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--line)',
            display: 'flex',
            gap: 'clamp(1.5rem, 4vw, 3rem)',
            flexWrap: 'wrap',
          }}
        >
          {STATS.map((stat, i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: 'clamp(2rem, 3vw, 2.75rem)',
                  fontWeight: 500,
                  color: 'var(--gold)',
                  lineHeight: 1,
                  marginBottom: '0.35rem',
                }}
              >
                {stat.number}
              </div>
              <div
                className="label"
                style={{
                  fontSize: '0.5rem',
                  letterSpacing: '0.2em',
                  color: 'var(--white-dim)',
                }}
              >
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
