'use client'

import { useEffect, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Spotlight } from './spotlight'

const GlasgowMap3D        = dynamic(() => import('./glasgow-map-3d'), { ssr: false })
const ScotlandLandscape3D = dynamic(() => import('./scotland-landscape-3d'), { ssr: false })

const HAS_MAP_KEY = !!process.env.NEXT_PUBLIC_MAPTILER_KEY

const TITLES = ['professional', 'punctual', 'comfortable', 'luxurious']

const STATS = [
  { number: '10+', label: 'Years Experience' },
  { number: '5K+', label: 'Trips Completed' },
  { number: '24/7', label: 'Always Available' },
  { number: '100%', label: 'Client Satisfaction' },
]

function AnimatedHero() {
  const [titleNumber, setTitleNumber] = useState(0)
  const [heroW, setHeroW] = useState(1200)
  const [heroH, setHeroH] = useState(800)

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

      <Spotlight
        className="-top-40 -left-10 md:left-16 md:-top-20"
        fill="rgba(196, 165, 90, 0.4)"
      />

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

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(3.5rem, 6.5vw, 5.5rem)',
              fontWeight: 300,
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              color: 'var(--white)',
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
                    color: 'var(--gold)',
                    fontStyle: 'italic',
                    fontFamily: 'var(--font-playfair), Georgia, serif',
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

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.35 }}
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: 1.8,
            color: 'var(--white-dim)',
            maxWidth: '44ch',
            marginBottom: '2.5rem',
          }}
        >
          From Glasgow Airport to the Highlands — premium transport in our
          executive fleet. Fixed prices. No surprises.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
        >
          <Link href="/contact" className="btn-gold">
            RESERVE YOUR JOURNEY
          </Link>
          <Link href="/fleet" className="btn-ghost">
            VIEW FLEET
          </Link>
        </motion.div>

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
                  fontFamily: 'var(--font-playfair), Georgia, serif',
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
