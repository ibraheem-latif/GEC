import Image from 'next/image'
import BookingWizard from '@/components/BookingWizard'
import JsonLd from '@/components/JsonLd'
import {
  buildMetadata,
  buildServiceSchema,
  buildBreadcrumbSchema,
  buildFAQSchema,
} from '@/lib/seo'

export const metadata = buildMetadata('/corporate-chauffeurs')

const benefits = [
  { num: '01', title: 'Company Accounts', desc: 'Set up a company account for streamlined billing. Ideal for teams with regular travel requirements.' },
  { num: '02', title: 'Events & Roadshows', desc: 'Conference transfers, venue shuttles, executive meet-and-greet. We handle the logistics.' },
  { num: '03', title: 'Recurring Bookings', desc: 'Regular routes managed on your schedule. Standing bookings taken by email — no need to call each time.' },
  { num: '04', title: 'Confidential Service', desc: 'Discreet, professional. Your driver does not discuss other clients or journeys.' },
]

const faqs = [
  { q: 'Can we open a company account?', a: 'Yes. Email us to set up a corporate account with monthly invoicing, multiple travelers, and cost centers.' },
  { q: 'Do you cover conferences and events?', a: 'Yes. We handle multi-vehicle event logistics, venue shuttles, and executive meet-and-greet at any venue in Scotland.' },
  { q: 'Is the service confidential?', a: 'Yes. Our drivers are trained in discretion — they do not discuss other clients or routes.' },
]

export default function CorporateChauffeursPage() {
  return (
    <>
      <JsonLd data={buildServiceSchema({
        name: 'Corporate Chauffeur Service Glasgow',
        description: 'Professional corporate chauffeur service in Glasgow. Company accounts, events, roadshows and recurring bookings.',
        slug: '/corporate-chauffeurs',
      })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Corporate Chauffeurs', path: '/corporate-chauffeurs' },
      ])} />
      <JsonLd data={buildFAQSchema(faqs)} />

      <section style={{ background: 'var(--deep)', paddingTop: '7rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 5rem)' }}>
          <div className="label" style={{ marginBottom: '1.5rem' }}>Corporate</div>
          <h1 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(2.75rem, 6vw, 5.5rem)',
            fontWeight: 300,
            lineHeight: 1.02,
            letterSpacing: '-0.025em',
            color: 'var(--white)',
            marginBottom: '1.5rem',
            maxWidth: '18ch',
          }}>
            Corporate Chauffeur{' '}
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Service Glasgow</em>
          </h1>
          <p style={{ fontFamily: 'var(--font-dm-sans), sans-serif', color: 'var(--white-dim)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '52ch' }}>
            Business travel that works. One-off trips or regular bookings — pick-up from your office, door-to-door service to any meeting, event, or airport. Company accounts welcome.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--void)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 5rem)' }}>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}
            className="max-md:!grid-cols-1"
          >
            <div style={{ position: 'relative', width: '100%', height: '400px' }}>
              <Image
                src="/images/lexus-es-300h-black.jpg"
                alt="Corporate chauffeur Lexus ES 300h"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div>
              <div className="label" style={{ marginBottom: '2rem' }}>What We Offer</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {benefits.map(b => (
                  <div key={b.num} style={{ borderBottom: '1px solid var(--line)', paddingBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                      <span style={{
                        fontFamily: 'var(--font-space-mono), monospace',
                        fontSize: '0.575rem',
                        letterSpacing: '0.15em',
                        color: 'var(--gold)',
                        paddingTop: '0.25rem',
                        flexShrink: 0,
                      }}>
                        {b.num}
                      </span>
                      <div>
                        <h3 style={{
                          fontFamily: 'var(--font-dm-sans), sans-serif',
                          fontSize: '0.9375rem',
                          fontWeight: 700,
                          color: 'var(--white)',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          marginBottom: '0.5rem',
                        }}>
                          {b.title}
                        </h3>
                        <p style={{ fontFamily: 'var(--font-dm-sans), sans-serif', color: 'var(--white-dim)', fontSize: '0.9rem', lineHeight: 1.75 }}>{b.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--deep)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 5rem)' }}>
          <div style={{ marginBottom: '2.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--line)' }}>
            <div className="label" style={{ marginBottom: '1rem' }}>Enquire Now</div>
            <h2 style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: 'var(--white)',
            }}>
              Set up a corporate account.{' '}
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>We handle the rest.</em>
            </h2>
          </div>
          <div style={{ maxWidth: '720px' }}>
            <BookingWizard defaultService="p2p" />
          </div>
        </div>
      </section>
    </>
  )
}
