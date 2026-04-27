export default function FieldLabel({ children, hint }) {
  return (
    <div style={{ marginBottom: '0.625rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem 0.75rem', flexWrap: 'wrap' }}>
      <label style={{
        display: 'block',
        fontFamily: 'var(--font-space-mono), monospace',
        fontSize: '0.575rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
      }}>{children}</label>
      {hint && <span style={{ fontSize: '0.7rem', color: 'var(--white-dim)' }}>{hint}</span>}
    </div>
  )
}
