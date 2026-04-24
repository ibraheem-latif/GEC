const ITEMS = [
  'Flight Tracking',
  'Fixed Pricing',
  'PVL Licensed',
  '24 / 7 Available',
  'Est. 2014',
  'Glasgow & Scotland',
  'Meet & Greet',
  'Executive Fleet',
  'Child Seats',
  'Hybrid Fleet',
]

export default function Marquee() {
  const all = [...ITEMS, ...ITEMS]

  return (
    <div style={{
      overflow: 'hidden',
      background: 'var(--deep)',
      padding: '1rem 0',
      borderTop: '1px solid var(--line)',
      borderBottom: '1px solid var(--line)',
    }}>
      <div className="marquee-track">
        {all.map((item, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--white-dim)',
              fontWeight: 400,
              whiteSpace: 'nowrap',
              padding: '0 2.5rem',
              gap: '2.5rem',
            }}
          >
            {item}
            <span style={{
              color: 'var(--gold)',
              display: 'inline-block',
              flexShrink: 0,
              marginLeft: '2.5rem',
            }}>
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
