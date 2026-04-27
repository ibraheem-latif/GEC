const FROM_ADDRESS = 'Glasgow Executive Chauffeurs <bookings@gec.limo>'
const DEFAULT_TO = 'bookings@gec.limo'

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function row(label, value) {
  if (value == null || value === '') return ''
  return `<tr><td style="padding:6px 12px 6px 0;color:#888;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td><td style="padding:6px 0;color:#111;font-size:14px;">${escapeHtml(value)}</td></tr>`
}

function navRow(label, place) {
  if (!place?.coords) return ''
  const [lng, lat] = place.coords
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  const display = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  return `<tr><td style="padding:6px 12px 6px 0;color:#888;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td><td style="padding:6px 0;font-size:13px;"><a href="${url}" style="color:#1a73e8;text-decoration:none;">Open in Google Maps</a> <span style="color:#888;">· ${display}</span></td></tr>`
}

const SERVICE_LABEL = {
  airport: 'Airport Transfer',
  p2p: 'Point-to-Point',
  hourly: 'By the Hour',
  tour: 'Scotland Tour',
}

const AIRPORT_LABEL = {
  GLA: 'Glasgow Airport (GLA)',
  EDI: 'Edinburgh Airport (EDI)',
  PIK: 'Prestwick Airport (PIK)',
}

const TOUR_LABEL = {
  lochlomond: 'Loch Lomond & The Trossachs',
  highlands: 'Highlands & Glencoe',
  edinburgh: 'Edinburgh Day Tour',
  standrews: 'St Andrews & East Neuk',
  stirling: 'Stirling & Loch Katrine',
  whisky: 'Whisky Trail · Speyside',
  custom: 'Custom itinerary',
}

const PICKUP_BUFFER_MIN = 15

function formatHHMM(date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function computePickupTime(date, time, durationSeconds) {
  if (!date || !time || !durationSeconds) return null
  const arrival = new Date(`${date}T${time}`)
  if (Number.isNaN(arrival.getTime())) return null
  return new Date(arrival.getTime() - (durationSeconds + PICKUP_BUFFER_MIN * 60) * 1000)
}

function formatWhenDate(b) {
  const d = new Date(b.date + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function buildScheduleRows(b) {
  if (b.pickupMode === 'now') return [row('When', 'ASAP — dispatch nearest driver')]
  if (!b.date) return []
  const dateStr = formatWhenDate(b)
  if (b.timeMode !== 'arrive') {
    return [row('Pickup at', `${dateStr} · ${b.time || ''}`)]
  }
  const rows = [row('Arrive by', `${dateStr} · ${b.time || ''} at drop-off`)]
  const pickup = computePickupTime(b.date, b.time, b.routeDurationSeconds)
  if (pickup) {
    const drive = Math.round(b.routeDurationSeconds / 60)
    rows.push(row('Driver pickup', `${formatHHMM(pickup)} · ${drive} min drive + ${PICKUP_BUFFER_MIN} min buffer`))
  }
  return rows
}

function buildBookingTable(b) {
  if (!b) return ''
  const rows = []

  if (b.vehicle) rows.push(row('Vehicle', `${b.vehicle.label} · ${b.vehicle.model}`))
  rows.push(row('Service', SERVICE_LABEL[b.service] || b.service))

  if (b.service === 'airport') {
    const airport = AIRPORT_LABEL[b.airport] || b.airport
    const other = b.otherLocation?.name || ''
    const otherDetails = b.otherLocation?.details || ''
    if (b.airportDirection === 'from') {
      rows.push(row('Pickup', airport))
      if (other) rows.push(row('Drop-off', other))
      if (otherDetails) rows.push(row('Drop-off details', otherDetails))
      rows.push(navRow('Drop-off nav', b.otherLocation))
    } else {
      if (other) rows.push(row('Pickup', other))
      if (otherDetails) rows.push(row('Pickup details', otherDetails))
      rows.push(navRow('Pickup nav', b.otherLocation))
      rows.push(row('Drop-off', airport))
    }
    if (b.flightNumber) rows.push(row('Flight', b.flightNumber))
  } else if (b.service === 'tour') {
    rows.push(row('Tour', TOUR_LABEL[b.tour] || b.tour))
    if (b.pickup?.name) rows.push(row('Pickup', b.pickup.name))
    if (b.pickup?.details) rows.push(row('Pickup details', b.pickup.details))
    rows.push(navRow('Pickup nav', b.pickup))
    if (b.tourNotes) rows.push(row('Itinerary', b.tourNotes))
  } else if (b.service === 'p2p') {
    if (b.pickup?.name) rows.push(row('Pickup', b.pickup.name))
    if (b.pickup?.details) rows.push(row('Pickup details', b.pickup.details))
    rows.push(navRow('Pickup nav', b.pickup))
    if (b.dropoff?.name) rows.push(row('Drop-off', b.dropoff.name))
    if (b.dropoff?.details) rows.push(row('Drop-off details', b.dropoff.details))
    rows.push(navRow('Drop-off nav', b.dropoff))
  } else if (b.service === 'hourly') {
    rows.push(row('Duration', `${b.hours} hrs`))
    if (b.pickup?.name) rows.push(row('Pickup', b.pickup.name))
    if (b.pickup?.details) rows.push(row('Pickup details', b.pickup.details))
    rows.push(navRow('Pickup nav', b.pickup))
  }

  rows.push(...buildScheduleRows(b))

  if (b.quote) rows.push(row('Estimate', `£${b.quote.low}–£${b.quote.high}`))
  if (b.notes) rows.push(row('Customer notes', b.notes))

  return `<table style="border-collapse:collapse;margin:16px 0;">${rows.join('')}</table>`
}

function buildSubject(name, booking) {
  if (!booking) return `New Booking Request from ${name}`
  const veh = booking.vehicle?.label || ''
  let route = ''
  if (booking.service === 'airport') {
    const apt = booking.airport || ''
    const other = booking.otherLocation?.short || 'address'
    route = booking.airportDirection === 'from' ? `${apt} → ${other}` : `${other} → ${apt}`
  } else if (booking.service === 'p2p') {
    route = `${booking.pickup?.short || ''} → ${booking.dropoff?.short || ''}`
  } else if (booking.service === 'tour') {
    route = TOUR_LABEL[booking.tour] || 'Tour'
  } else if (booking.service === 'hourly') {
    route = `${booking.hours}hr · ${booking.pickup?.short || ''}`
  }
  const price = booking.quote ? ` · £${booking.quote.low}–£${booking.quote.high}` : ''
  return `Booking · ${name}${veh ? ` · ${veh}` : ''}${route ? ` · ${route}` : ''}${price}`
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, phone, service, date, message, booking } = body

    if (!name || !email || !phone || !service || !date || !message) {
      return Response.json({ error: 'Please fill in all required fields' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const TO_EMAIL = process.env.TO_EMAIL || DEFAULT_TO

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return Response.json({ error: 'Email service is not configured' }, { status: 500 })
    }

    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>')
    const bookingTable = buildBookingTable(booking)
    const subjectLine = escapeHtml(buildSubject(name, booking))

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:560px;">
        <h2 style="font-family:Georgia,serif;color:#0E0E16;font-weight:300;font-size:24px;margin:0 0 4px;">New booking request</h2>
        <p style="color:#666;font-size:13px;margin:0 0 16px;">via gec.limo</p>
        <table style="border-collapse:collapse;">
          ${row('From', name)}
          ${row('Phone', phone)}
          ${row('Email', email)}
        </table>
        ${bookingTable}
        ${booking ? '' : `<h3 style="font-family:Georgia,serif;font-weight:400;font-size:16px;color:#0E0E16;">Message</h3><p style="font-size:14px;color:#111;line-height:1.5;">${safeMessage}</p>`}
      </div>
    `

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [TO_EMAIL],
        reply_to: email,
        subject: subjectLine,
        html,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Resend API error:', error)
      throw new Error('Failed to send email')
    }

    const data = await response.json()
    return Response.json({ success: true, message: 'Booking request sent successfully', id: data.id })

  } catch (error) {
    console.error('Contact form error:', error)
    return Response.json({
      error: `Failed to send booking request. Please email ${DEFAULT_TO} directly.`,
    }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
