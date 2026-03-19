import { motion } from 'framer-motion'
import { AnimatedHero } from '../components/ui/animated-hero'
import WhyChooseUs from '../components/WhyChooseUs'
import ServiceCard from '../components/ServiceCard'
import TestimonialSection from '../components/TestimonialSection'
import CTABanner from '../components/CTABanner'
import SEOHead from '../components/SEOHead'
import Marquee from '../components/ui/Marquee'
import { SEO_CONFIG, buildLocalBusinessSchema } from '../lib/seo'
import planeImage from '../assets/plane.webp'
import scotlandImage from '../assets/scotland scenery.jpg'
import lexusImage from '../assets/lexus es 300h black.jpg'

const services = [
  {
    num: '01',
    title: 'Airport Transfers',
    tagline: 'Flight-tracked, stress-free.',
    image: planeImage,
    to: '/airport-transfers',
  },
  {
    num: '02',
    title: 'Scotland Tours',
    tagline: 'Your route, your pace.',
    image: scotlandImage,
    to: '/scotland-tours',
  },
  {
    num: '03',
    title: 'Corporate Chauffeur',
    tagline: 'Discreet. Professional. Reliable.',
    image: lexusImage,
    to: '/corporate-chauffeurs',
  },
]

const HomePage = () => {
  const seo = SEO_CONFIG['/']
  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        canonical={seo.canonical}
        jsonLd={buildLocalBusinessSchema()}
      />
      <AnimatedHero />
      <Marquee />

      <section style={{ background: 'var(--bg)' }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: 'clamp(1.25rem, 2.5vh, 2rem) clamp(1.5rem, 5vw, 5rem)',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: '-60px' }}
            style={{
              marginBottom: 'clamp(1rem, 2vh, 1.5rem)',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '2rem',
            }}
          >
            <div>
              <div className="label" style={{ marginBottom: '1rem' }}>What We Do</div>
              <h2 style={{
                fontFamily: '"Fraunces", Georgia, serif',
                fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: 'var(--cream)',
              }}>
                Services across<br /><em>Glasgow & Scotland</em>
              </h2>
            </div>
            <p style={{ color: 'var(--cream-dim)', maxWidth: '30ch', fontSize: '0.9375rem', lineHeight: 1.7 }}>
              Airport runs, business travel, or a grand tour — book us for an hour or the whole day.
            </p>
          </motion.div>
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}
            className="max-md:!grid-cols-1"
          >
            {services.map((s, index) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
                viewport={{ once: true, margin: '-30px' }}
              >
                <ServiceCard {...s} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <TestimonialSection />
    </>
  )
}

export default HomePage
