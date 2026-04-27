import { TOUR_PACKAGES, detectAirport, formatCurrency } from '@/lib/pricing'
import { ASAP_LEAD_MIN, buildSchedule, formatDriveMinutes, formatHHMM, formatLeadTime, PICKUP_BUFFER_MIN } from '@/lib/scheduling'
import { SERVICE_LABEL } from './constants'

export function buildSubmissionPayload(data, quote, route) {
  const pickupApt = data.service === 'p2p' ? detectAirport(data.pickup) : null
  const dropoffApt = data.service === 'p2p' ? detectAirport(data.dropoff) : null
  const detectedAirport = pickupApt || dropoffApt
  const isAirport = data.service === 'p2p' && detectedAirport
  const airportDirection = pickupApt ? 'from' : 'to'
  const otherLocation = pickupApt ? data.dropoff : data.pickup

  const serviceLabel = isAirport ? 'Airport Transfer' : SERVICE_LABEL[data.service]
  const summary = []
  summary.push(`Service: ${serviceLabel}`)
  if (data.service === 'tour') {
    const pkg = TOUR_PACKAGES.find((p) => p.id === data.tour)
    if (pkg) summary.push(`Tour: ${pkg.label} · ${pkg.duration}`)
    if (data.pickup) summary.push(`Pickup: ${data.pickup.name}`)
    if (data.tourNotes) summary.push(`Tour notes: ${data.tourNotes}`)
  }
  if (data.service === 'p2p') {
    if (data.pickup) summary.push(`Pickup: ${data.pickup.name}`)
    if (data.dropoff) summary.push(`Drop-off: ${data.dropoff.name}`)
    if (isAirport && data.flightNumber) summary.push(`Flight: ${data.flightNumber}`)
  }
  if (data.service === 'hourly') {
    summary.push(`Hours: ${data.hours}`)
    if (data.pickup) summary.push(`Pickup: ${data.pickup.name}`)
  }
  const sched = buildSchedule(data, route?.durationSeconds)
  if (sched?.mode === 'asap') {
    summary.push('When: As soon as possible')
    summary.push(`Driver pickup: ~${formatHHMM(sched.driverPickup)} (within ${formatLeadTime(ASAP_LEAD_MIN)} of dispatch)`)
  } else if (sched?.mode === 'arrive') {
    summary.push(`Arrive by: ${sched.date} ${sched.time}`)
    if (sched.driverPickup) {
      summary.push(`Driver pickup: ${formatHHMM(sched.driverPickup)} (${formatDriveMinutes(sched.driveSeconds)} drive + ${PICKUP_BUFFER_MIN} min buffer)`)
    }
  } else if (sched?.mode === 'depart') {
    summary.push(`Pickup at: ${sched.date} ${sched.time}`)
  }
  if (quote && !quote.custom) {
    summary.push(`Vehicle: ${quote.vehicle.label} (${quote.vehicle.vehicle})`)
    summary.push(`Estimate: ${formatCurrency(quote.low)}–${formatCurrency(quote.high)}`)
    for (const item of quote.breakdown || []) {
      if (item.label?.startsWith('Short notice') || item.label?.startsWith('Late-night')) {
        summary.push(`  · ${item.label}: +${formatCurrency(item.amount)}`)
      }
    }
  }
  if (data.notes) summary.push(`Notes: ${data.notes}`)

  return {
    name: data.name,
    email: data.email,
    phone: data.phone,
    service: serviceLabel,
    date: data.pickupMode === 'now' ? 'ASAP' : data.date,
    message: summary.join('\n'),
    booking: {
      service: isAirport ? 'airport' : data.service,
      airport: isAirport ? detectedAirport : null,
      airportDirection: isAirport ? airportDirection : null,
      otherLocation: isAirport ? otherLocation : null,
      flightNumber: isAirport ? (data.flightNumber || null) : null,
      tour: data.tour || null,
      tourNotes: data.tourNotes || null,
      pickup: data.pickup,
      dropoff: data.dropoff,
      hours: data.service === 'hourly' ? data.hours : null,
      vehicle: quote && !quote.custom ? { id: quote.vehicle.id, label: quote.vehicle.label, model: quote.vehicle.vehicle } : null,
      pickupMode: data.pickupMode,
      timeMode: data.timeMode,
      date: data.date,
      time: data.time,
      notes: data.notes,
      quote: quote && !quote.custom ? { low: quote.low, high: quote.high } : null,
      routeDurationSeconds: route?.durationSeconds || null,
    },
  }
}
