import { TOUR_PACKAGES, detectAirport } from '@/lib/pricing'
import { ASAP_LEAD_MIN, buildSchedule, formatBookingDate, formatDriveMinutes, formatHHMM, formatLeadTime, PICKUP_BUFFER_MIN } from '@/lib/scheduling'
import { SERVICE_LABEL } from './constants'

export default function TripSummary({ data, route }) {
  const rows = []
  const p2pAirport = data.service === 'p2p' ? (detectAirport(data.pickup) || detectAirport(data.dropoff)) : null
  const serviceLabel = p2pAirport ? 'Airport Transfer' : SERVICE_LABEL[data.service]
  rows.push(['Service', serviceLabel])
  if (data.service === 'tour') {
    const pkg = TOUR_PACKAGES.find((p) => p.id === data.tour)
    if (pkg) rows.push(['Tour', `${pkg.label} · ${pkg.duration}`])
    if (data.pickup) rows.push(['Pickup', data.pickup.short])
  }
  if (data.service === 'p2p') {
    if (data.pickup) rows.push(['Pickup', data.pickup.short])
    if (data.dropoff) rows.push(['Drop-off', data.dropoff.short])
    if (p2pAirport && data.flightNumber) rows.push(['Flight', data.flightNumber])
  }
  if (data.service === 'hourly') {
    rows.push(['Style', `Hourly · ${data.hours} hrs`])
    if (data.pickup) rows.push(['Pickup', data.pickup.short])
  }

  const sched = buildSchedule(data, route?.durationSeconds)
  if (sched?.mode === 'asap') {
    rows.push(['When', 'As soon as possible'])
    rows.push(['Driver pickup', `~${formatHHMM(sched.driverPickup)} · within ${formatLeadTime(ASAP_LEAD_MIN)} of dispatch`])
  } else if (sched?.mode === 'arrive') {
    rows.push(['Arrive by', `${formatBookingDate(sched.date)} · ${sched.time} at drop-off`])
    rows.push([
      'Driver pickup',
      sched.driverPickup
        ? `${formatHHMM(sched.driverPickup)} · ${formatDriveMinutes(sched.driveSeconds)} drive + ${PICKUP_BUFFER_MIN} min buffer`
        : 'Calculating route…',
    ])
  } else if (sched?.mode === 'depart') {
    rows.push(['Pickup', `${formatBookingDate(sched.date)} · ${sched.time}`])
  }

  return (
    <div style={{ border: '1px solid var(--line)', padding: '1.25rem' }}>
      {rows.map(([k, v], i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: '5rem 1fr',
          gap: '1rem',
          padding: '0.5rem 0',
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '0.875rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '0.575rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--white-dim)',
          }}>{k}</span>
          <span style={{ color: 'var(--white)' }}>{v}</span>
        </div>
      ))}
    </div>
  )
}
