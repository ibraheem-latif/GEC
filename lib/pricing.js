// Pricing model for Glasgow Executive Chauffeurs
// Calibrated to sit ~£5–£10 under Blacklane for the same trip:
// 10 mi Business ≈ £116, Business Van ≈ £146.
// Range shown to the user is ±10% to set honest expectations.

export const VEHICLE_CLASSES = [
  {
    id: 'business',
    label: 'Business',
    vehicle: 'Lexus ES 300h',
    capacity: 'Up to 3 · 3 bags',
    multiplier: 1.0,
  },
  {
    id: 'businessVan',
    label: 'Business Van',
    vehicle: 'Mercedes V-Class',
    capacity: 'Up to 6 · 6 bags',
    multiplier: 1.26,
  },
]

export const AIRPORTS = [
  { code: 'GLA', name: 'Glasgow Airport', coords: [-4.4351, 55.8717] },
  { code: 'EDI', name: 'Edinburgh Airport', coords: [-3.3725, 55.9500] },
  { code: 'PIK', name: 'Prestwick Airport', coords: [-4.5867, 55.5094] },
]

const AIRPORT_BASE = {
  // Distance-anchored base fares (one-way). Tuned for premium Lexus ES 300h.
  // Calibrated to sit ~£5–£10 under Blacklane for the same airport route.
  GLA: { glasgow: 85, edinburgh: 165, stirling: 115, perthshire: 185, ayrshire: 115, perDefault: 140 },
  EDI: { glasgow: 150, edinburgh: 85, stirling: 110, perthshire: 145, fife: 125, perDefault: 165 },
  PIK: { glasgow: 115, edinburgh: 200, ayrshire: 85, perDefault: 175 },
}

export const TOUR_PACKAGES = [
  { id: 'lochlomond', label: 'Loch Lomond & The Trossachs', duration: '8hrs', price: 440 },
  { id: 'highlands', label: 'Highlands & Glencoe', duration: '10hrs', price: 680 },
  { id: 'edinburgh', label: 'Edinburgh Day Tour', duration: '8hrs', price: 480 },
  { id: 'standrews', label: 'St Andrews & East Neuk', duration: '9hrs', price: 540 },
  { id: 'stirling', label: 'Stirling & Loch Katrine', duration: '8hrs', price: 480 },
  { id: 'whisky', label: 'Whisky Trail · Speyside', duration: '12hrs', price: 880 },
  { id: 'custom', label: 'Custom itinerary', duration: 'Flexible', price: null },
]

const HOURLY_RATE = 85
const HOURLY_MIN = 4

const DISTANCE_BASE = 45
const DISTANCE_PER_MILE = 7.1

const NIGHT_SURCHARGE_RATE = 0.2

const REGION_KEYWORDS = {
  glasgow: ['glasgow', 'paisley', 'clydebank', 'east kilbride', 'rutherglen', 'bearsden', 'hamilton', 'motherwell'],
  edinburgh: ['edinburgh', 'leith', 'musselburgh', 'haddington', 'south queensferry'],
  stirling: ['stirling', 'bridge of allan', 'dunblane', 'callander', 'doune'],
  perthshire: ['perth', 'pitlochry', 'aberfeldy', 'crieff', 'auchterarder'],
  ayrshire: ['ayr', 'troon', 'irvine', 'kilmarnock', 'prestwick'],
  fife: ['st andrews', 'kirkcaldy', 'dunfermline', 'cupar', 'anstruther'],
}

function classifyRegion(placeName = '') {
  const lower = placeName.toLowerCase()
  for (const [region, keywords] of Object.entries(REGION_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return region
  }
  return null
}

function haversineMiles([lon1, lat1], [lon2, lat2]) {
  const toRad = (d) => (d * Math.PI) / 180
  const R = 3958.8
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

const AIRPORT_KEYWORDS = {
  GLA: ['glasgow airport'],
  EDI: ['edinburgh airport'],
  PIK: ['prestwick airport', 'prestwick international'],
}

export function detectAirport(place) {
  if (!place) return null
  const name = `${place.name || ''} ${place.short || ''}`.toLowerCase()
  for (const [code, kws] of Object.entries(AIRPORT_KEYWORDS)) {
    if (kws.some(k => name.includes(k))) return code
  }
  if (place.coords) {
    for (const apt of AIRPORTS) {
      if (haversineMiles(place.coords, apt.coords) < 1.2) return apt.code
    }
  }
  return null
}

function isNightTime(time) {
  if (!time) return false
  const [h] = time.split(':').map(Number)
  return h >= 22 || h < 6
}

function buildRange(total, time) {
  const breakdown = []
  let subtotal = total
  if (isNightTime(time)) {
    const surcharge = Math.round(total * NIGHT_SURCHARGE_RATE)
    subtotal = total + surcharge
    breakdown.push({ label: 'Late-night surcharge (22:00–06:00)', amount: surcharge })
  }
  const low = Math.round(subtotal * 0.95 / 5) * 5
  const high = Math.round(subtotal * 1.05 / 5) * 5
  return { low, high, mid: subtotal, breakdown }
}

function airportSubtotal({ airport, otherLocation }) {
  if (!airport || !otherLocation?.name) return null
  const region = classifyRegion(otherLocation.name)
  const matrix = AIRPORT_BASE[airport]
  if (!matrix) return null
  if (region && matrix[region] != null) {
    return { label: `${airport} ↔ ${region.charAt(0).toUpperCase() + region.slice(1)}`, subtotal: matrix[region] }
  }
  if (otherLocation.coords) {
    const apt = AIRPORTS.find(a => a.code === airport)
    const miles = haversineMiles(apt.coords, otherLocation.coords) * 1.3
    return {
      label: `${airport} transfer · ~${Math.round(miles)} mi`,
      subtotal: Math.round(DISTANCE_BASE + miles * DISTANCE_PER_MILE),
    }
  }
  return { label: `${airport} ↔ destination`, subtotal: matrix.perDefault }
}

function tourSubtotal({ tour }) {
  const pkg = TOUR_PACKAGES.find(p => p.id === tour)
  if (!pkg) return null
  if (pkg.price == null) {
    return { custom: true, note: 'Custom itineraries are quoted within the hour. Tell us where you want to go.' }
  }
  return { label: `${pkg.label} · ${pkg.duration}`, subtotal: pkg.price }
}

function hourlySubtotal({ hours }) {
  const h = Math.max(HOURLY_MIN, Number(hours) || HOURLY_MIN)
  return { label: `${h} hrs × £${HOURLY_RATE}/hr`, subtotal: h * HOURLY_RATE }
}

function pointToPointSubtotal({ pickup, dropoff }) {
  if (!pickup?.coords || !dropoff?.coords) return null

  const pickupApt = detectAirport(pickup)
  const dropoffApt = detectAirport(dropoff)
  if (pickupApt) return airportSubtotal({ airport: pickupApt, otherLocation: dropoff })
  if (dropoffApt) return airportSubtotal({ airport: dropoffApt, otherLocation: pickup })

  const miles = haversineMiles(pickup.coords, dropoff.coords) * 1.3
  if (miles < 1) return null
  return {
    label: `Point-to-point · ~${Math.round(miles)} mi`,
    subtotal: Math.round(DISTANCE_BASE + miles * DISTANCE_PER_MILE),
  }
}

function baseSubtotal(data) {
  switch (data.service) {
    case 'airport': return airportSubtotal(data)
    case 'tour': return tourSubtotal(data)
    case 'p2p': return pointToPointSubtotal(data)
    case 'hourly': return hourlySubtotal(data)
    default: return null
  }
}

export function calculateQuotes(data) {
  if (!data?.service) return null
  const base = baseSubtotal(data)
  if (!base) return null
  if (base.custom) return { custom: true, note: base.note }
  return VEHICLE_CLASSES.map((v) => {
    const subtotal = Math.round(base.subtotal * v.multiplier)
    const range = buildRange(subtotal, data.time)
    return {
      vehicle: v,
      ...range,
      breakdown: [{ label: base.label, amount: subtotal }, ...range.breakdown],
    }
  })
}

export function findQuote(quotes, vehicleId) {
  if (!quotes) return null
  if (quotes.custom) return quotes
  return quotes.find((q) => q.vehicle.id === vehicleId) || quotes[0]
}

export function formatCurrency(n) {
  return `£${Math.round(n)}`
}
