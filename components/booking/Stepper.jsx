export default function Stepper({ value, onChange, min = 1, max = 12, suffix }) {
  return (
    <div className="gec-stepper">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Decrease">−</button>
      <span className="gec-stepper-value">{value}{suffix ? ` ${suffix}` : ''}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Increase">+</button>
    </div>
  )
}
