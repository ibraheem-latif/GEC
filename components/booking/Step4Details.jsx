import { detectAirport, formatCurrency } from '@/lib/pricing'
import { buildSchedule, formatBookingDate, formatHHMM } from '@/lib/scheduling'
import { SERVICE_LABEL } from './constants'
import FieldLabel from './FieldLabel'

export default function Step4Details({ data, update, quote, route, errorMsg }) {
  const p2pAirport = data.service === 'p2p' ? (detectAirport(data.pickup) || detectAirport(data.dropoff)) : null
  const serviceLabel = p2pAirport ? 'Airport Transfer' : SERVICE_LABEL[data.service]
  const sched = buildSchedule(data, route?.durationSeconds)
  let whenSummary = ''
  if (sched?.mode === 'asap') {
    whenSummary = ` · ASAP (pickup ~${formatHHMM(sched.driverPickup)})`
  } else if (sched?.mode === 'arrive') {
    whenSummary = ` · arrive ${sched.time}${sched.driverPickup ? ` (pickup ${formatHHMM(sched.driverPickup)})` : ''}`
  } else if (sched?.mode === 'depart') {
    whenSummary = ` · ${formatBookingDate(sched.date)} ${sched.time}`
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {quote && !quote.custom && (
        <div style={{
          padding: '0.875rem 1rem',
          background: 'var(--gold-glow)',
          border: '1px solid var(--gold-border)',
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '0.875rem',
          color: 'var(--white)',
        }}>
          Estimated <strong>{formatCurrency(quote.low)}–{formatCurrency(quote.high)}</strong> · {quote.vehicle.label} · {serviceLabel}{whenSummary}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="max-sm:!grid-cols-1">
        <div>
          <FieldLabel>Full name *</FieldLabel>
          <input type="text" value={data.name} onChange={(e) => update({ name: e.target.value })} className="form-field" placeholder="John Smith" autoComplete="name" />
        </div>
        <div>
          <FieldLabel>Phone *</FieldLabel>
          <input type="tel" value={data.phone} onChange={(e) => update({ phone: e.target.value })} className="form-field" placeholder="+44 7XXX XXXXXX" autoComplete="tel" />
        </div>
      </div>
      <div>
        <FieldLabel>Email *</FieldLabel>
        <input type="email" value={data.email} onChange={(e) => update({ email: e.target.value })} className="form-field" placeholder="john@example.com" autoComplete="email" />
      </div>
      <div>
        <FieldLabel hint="Optional">Anything we should know?</FieldLabel>
        <textarea value={data.notes} onChange={(e) => update({ notes: e.target.value })} rows={3} className="form-field" style={{ resize: 'none' }} placeholder="Child seat, return trip, special requirements…" />
      </div>
      {errorMsg && (
        <div style={{
          padding: '0.875rem 1rem',
          border: '1px solid rgba(220,80,80,0.5)',
          background: 'rgba(220,80,80,0.08)',
          color: '#ec9090',
          fontSize: '0.875rem',
        }}>
          {errorMsg}
        </div>
      )}
    </div>
  )
}
