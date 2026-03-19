import { EMAIL } from '../lib/seo'

const ContactInfo = () => {
  const items = [
    { label: 'Email', value: EMAIL },
    { label: 'Based In', value: 'Glasgow, Scotland' },
    { label: 'Availability', value: '24 hours · 7 days' },
  ]

  return (
    <div style={{ paddingTop: '0.25rem' }}>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem', marginBottom: '2.5rem' }}>
        <div className="label" style={{ marginBottom: '2rem' }}>Contact Details</div>
        {items.map(item => (
          <div key={item.label} style={{
            display: 'grid',
            gridTemplateColumns: '5rem 1fr',
            gap: '1rem',
            paddingBottom: '1.25rem',
            marginBottom: '1.25rem',
            borderBottom: '1px solid var(--border)',
          }}>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.575rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--cream-dim)',
              paddingTop: '0.15rem',
            }}>
              {item.label}
            </span>
            <span style={{
              fontFamily: '"Syne", sans-serif',
              fontSize: '0.9375rem',
              color: 'var(--cream)',
              fontWeight: 500,
            }}>
              {item.label === 'Email' ? (
                <a href={`mailto:${item.value}`} style={{ color: 'var(--copper)', textDecoration: 'none' }}>
                  {item.value}
                </a>
              ) : item.value}
            </span>
          </div>
        ))}
      </div>

      <div>
        <div className="label" style={{ marginBottom: '1.25rem' }}>Follow Us</div>
        <div style={{ display: 'flex', gap: '0.625rem' }}>
          {['F', 'T', 'I', 'L'].map((letter) => (
            <a
              key={letter}
              href="#"
              style={{
                width: '2.5rem',
                height: '2.5rem',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cream-dim)',
                fontFamily: '"Syne", sans-serif',
                fontWeight: 700,
                fontSize: '0.75rem',
                textDecoration: 'none',
                transition: 'border-color 0.2s ease, color 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--copper)'; e.currentTarget.style.color = 'var(--copper)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--cream-dim)' }}
            >
              {letter}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ContactInfo
