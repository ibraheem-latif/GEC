// Operational buffer covers loading + traffic variance on top of the OSRM drive estimate.
export const PICKUP_BUFFER_MIN = 15

// "Pick up now" is a soft promise: dispatch the nearest driver and aim to arrive within this many minutes.
export const ASAP_LEAD_MIN = 65

export function computePickupTime(date, time, durationSeconds) {
  if (!date || !time || !durationSeconds) return null
  const arrival = new Date(`${date}T${time}`)
  if (Number.isNaN(arrival.getTime())) return null
  return new Date(arrival.getTime() - (durationSeconds + PICKUP_BUFFER_MIN * 60) * 1000)
}

// `timeZone` forces a specific IANA zone for ASAP times built from `new Date()` on a UTC server.
// Without it, the renderer uses the executor's local zone — fine for arrive-by where the parse and the
// format share the same naive zone, but wrong for ASAP whose Date is an absolute moment.
export function formatHHMM(date, { timeZone } = {}) {
  if (!date) return ''
  if (timeZone) {
    return date.toLocaleTimeString('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hour12: false })
  }
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

export function formatBookingDate(iso, { withYear = false } = {}) {
  if (!iso) return ''
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    ...(withYear ? { year: 'numeric' } : {}),
  })
}

export function formatDriveMinutes(seconds) {
  if (!seconds) return ''
  return `${Math.round(seconds / 60)} min`
}

export function formatLeadTime(min) {
  if (!min || min <= 0) return ''
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  if (!m) return h === 1 ? '1 hour' : `${h} hours`
  return `${h}h ${m} min`
}

// Returns null if the booking time is still valid, or a customer-facing message
// explaining why it isn't (e.g. left tab open until pickup time passed).
// ASAP always recomputes from `now` so it can't go stale.
export function checkScheduleFreshness({ pickupMode, date, time }, now = new Date()) {
  if (pickupMode === 'now') return null
  if (!date || !time) return null
  const dt = new Date(`${date}T${time}`)
  if (Number.isNaN(dt.getTime())) return null
  const leadMin = (dt.getTime() - now.getTime()) / 60000
  if (leadMin < 0) {
    return 'Your pickup time has now passed. Please pick a new time before submitting.'
  }
  if (leadMin < ASAP_LEAD_MIN) {
    return `Your pickup is now under ${formatLeadTime(ASAP_LEAD_MIN)} away. Please reschedule, or switch to "Pick up now" so we can dispatch the nearest driver.`
  }
  return null
}

// Discriminated schedule for a booking. driveSeconds is optional (route may not have resolved yet).
// `now` is injectable so server and client can each anchor to their own clock.
export function buildSchedule({ pickupMode, timeMode, date, time }, driveSeconds, now = new Date()) {
  if (pickupMode === 'now') {
    return {
      mode: 'asap',
      leadMin: ASAP_LEAD_MIN,
      driverPickup: new Date(now.getTime() + ASAP_LEAD_MIN * 60 * 1000),
    }
  }
  if (!date) return null
  if (timeMode === 'arrive') {
    return {
      mode: 'arrive',
      date,
      time,
      driveSeconds: driveSeconds || null,
      driverPickup: computePickupTime(date, time, driveSeconds),
    }
  }
  return { mode: 'depart', date, time }
}
