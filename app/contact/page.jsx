import ContactForm from '@/components/ContactForm'
import ContactInfo from '@/components/ContactInfo'
import JsonLd from '@/components/JsonLd'
import {
  buildMetadata,
  buildContactPageSchema,
  buildBreadcrumbSchema,
} from '@/lib/seo'

export const metadata = buildMetadata('/contact')

export default function ContactPage() {
  return (
    <>
      <JsonLd data={buildContactPageSchema()} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' },
      ])} />

      <section style={{ background: 'var(--void)', paddingTop: '5rem' }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 5rem)',
        }}>
          <div style={{ marginBottom: 'clamp(2rem, 4vh, 3rem)', paddingBottom: '1.25rem', borderBottom: '1px solid var(--line)' }}>
            <div className="label" style={{ marginBottom: '1rem' }}>Make a Booking</div>
            <h1 style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'var(--white)',
            }}>
              Get in touch.<br />
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>We respond within the hour.</em>
            </h1>
          </div>
          <div
            style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 'clamp(2rem, 6vw, 5rem)', alignItems: 'start' }}
            className="max-md:!grid-cols-1"
          >
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </section>
    </>
  )
}
