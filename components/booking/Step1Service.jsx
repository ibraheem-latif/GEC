import { SERVICE_CARDS } from './constants'

export default function Step1Service({ data, update, onPick }) {
  const handle = (id) => {
    update({ service: id })
    setTimeout(onPick, 200)
  }
  return (
    <div>
      <h3 style={{
        fontFamily: 'var(--font-playfair), Georgia, serif',
        fontSize: '1.5rem',
        fontWeight: 300,
        color: 'var(--white)',
        margin: '0 0 1.5rem',
      }}>
        What can we help with?
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '0.75rem',
      }}>
        {SERVICE_CARDS.map((s) => (
          <button
            key={s.id}
            type="button"
            className="gec-card"
            aria-pressed={data.service === s.id}
            onClick={() => handle(s.id)}
          >
            <div style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: '1.25rem',
              fontWeight: 400,
              color: data.service === s.id ? 'var(--gold)' : 'var(--white)',
            }}>
              {s.title}
            </div>
            <div style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '0.875rem',
              color: 'var(--white-dim)',
              lineHeight: 1.5,
            }}>
              {s.subtitle}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
