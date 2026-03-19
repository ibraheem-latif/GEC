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

const Marquee = () => {
  const all = [...ITEMS, ...ITEMS]

  return (
    <div style={{
      overflow: 'hidden',
      background: 'var(--copper)',
      padding: '0.8rem 0',
      borderTop: '1px solid rgba(255,255,255,0.12)',
      borderBottom: '1px solid rgba(255,255,255,0.12)',
    }}>
      <div className="marquee-track">
        {all.map((item, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.625rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#0d0b09',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              padding: '0 2.5rem',
              gap: '2.5rem',
            }}
          >
            {item}
            <span style={{
              width: '3px',
              height: '3px',
              background: 'rgba(13,11,9,0.35)',
              borderRadius: '50%',
              display: 'inline-block',
              flexShrink: 0,
            }} />
          </span>
        ))}
      </div>
    </div>
  )
}

export default Marquee
