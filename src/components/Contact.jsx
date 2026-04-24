import ContactForm from './ContactForm'
import ContactInfo from './ContactInfo'

const Contact = () => {
  return (
    <section id="contact" style={{ background: 'var(--void)' }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 5vw, 5rem)',
      }}>
        <div style={{
          marginBottom: 'clamp(2.5rem, 5vh, 4rem)',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid var(--line)',
        }}>
          <div className="label" style={{ marginBottom: '1rem' }}>Make a Booking</div>
          <h2 style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'var(--white)',
          }}>
            Get in touch.<br />
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>We respond within the hour.</em>
          </h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '3fr 2fr',
            gap: 'clamp(2rem, 6vw, 5rem)',
            alignItems: 'start',
          }}
          className="max-md:!grid-cols-1"
        >
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
    </section>
  )
}

export default Contact
