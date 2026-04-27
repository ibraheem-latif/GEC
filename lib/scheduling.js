// Pickup-time calculation for "arrive by" bookings.
// Driver pickup = arrival - drive duration - operational buffer (loading + traffic variance).

export const PICKUP_BUFFER_MIN = 15

export function computePickupTime(date, time, durationSeconds) {
  if (!date || !time || !durationSeconds) return null
  const arrival = new Date(`${date}T${time}`)
  if (Number.isNaN(arrival.getTime())) return null
  return new Date(arrival.getTime() - (durationSeconds + PICKUP_BUFFER_MIN * 60) * 1000)
}

export function formatHHMM(date) {
  if (!date) return ''
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
