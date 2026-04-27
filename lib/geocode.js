// Forward + reverse geocoding with progressive providers.
// Order: Google Places (if key set) → Photon (free, OSM POIs) → MapTiler (fallback for reverse).
//
// Why Photon by default: MapTiler's POI coverage is weak for restaurants/landmarks.
// Photon is OSM-based via Komoot, no key needed, with good UK POI coverage.
// Google Places gives the best results when NEXT_PUBLIC_GOOGLE_PLACES_KEY is configured.

const GLASGOW_LAT = 55.8642
const GLASGOW_LON = -4.2518
const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY

// UK postcodes typed without a space ("G776AT") confuse Photon.
// Insert the canonical space between outward + inward parts.
function normalizeUkPostcode(q) {
  const compact = q.replace(/\s+/g, '')
  const m = compact.match(/^([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{2})$/i)
  return m ? `${m[1].toUpperCase()} ${m[2].toUpperCase()}` : q
}

export async function searchPlaces(query, { signal } = {}) {
  const trimmed = normalizeUkPostcode((query || '').trim())
  if (trimmed.length < 3) return []

  if (GOOGLE_KEY) {
    const places = await searchGoogle(trimmed, { signal })
    if (places.length) return places
  }
  return searchPhoton(trimmed, { signal })
}

export async function reverseGeocode([lng, lat], { signal } = {}) {
  // Photon supports reverse and gives clean place objects without a key.
  try {
    const url = `https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}&lang=en&limit=1`
    const res = await fetch(url, { signal })
    if (res.ok) {
      const data = await res.json()
      const f = data.features?.[0]
      if (f) return photonToPlace(f)
    }
  } catch {}

  // MapTiler fallback
  if (MAPTILER_KEY) {
    try {
      const url = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${MAPTILER_KEY}&language=en&limit=1`
      const res = await fetch(url, { signal })
      if (res.ok) {
        const data = await res.json()
        const f = data.features?.[0]
        if (f) return maptilerToPlace(f)
      }
    } catch {}
  }
  return null
}

async function searchPhoton(query, { signal } = {}) {
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=8&lang=en&lat=${GLASGOW_LAT}&lon=${GLASGOW_LON}`
  const res = await fetch(url, { signal })
  if (!res.ok) return []
  const data = await res.json()
  return (data.features || [])
    .filter((f) => (f.properties?.countrycode || '').toUpperCase() === 'GB')
    .slice(0, 6)
    .map(photonToPlace)
}

async function searchGoogle(query, { signal } = {}) {
  // Google Places Autocomplete + Place Details (for coordinates).
  // Sessiontoken would normally be used per-session for billing, omitted here for simplicity.
  try {
    const acUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&components=country:gb&location=${GLASGOW_LAT},${GLASGOW_LON}&radius=80000&key=${GOOGLE_KEY}`
    const acRes = await fetch(acUrl, { signal })
    if (!acRes.ok) return []
    const acData = await acRes.json()
    const predictions = acData.predictions || []
    const top = predictions.slice(0, 6)
    const detailed = await Promise.all(top.map(async (p) => {
      const dUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${p.place_id}&fields=geometry,name,formatted_address&key=${GOOGLE_KEY}`
      const dRes = await fetch(dUrl, { signal })
      if (!dRes.ok) return null
      const d = await dRes.json()
      const r = d.result
      if (!r?.geometry?.location) return null
      return {
        id: p.place_id,
        name: r.formatted_address || p.description,
        short: r.name || p.structured_formatting?.main_text || p.description,
        context: p.structured_formatting?.secondary_text || r.formatted_address || '',
        coords: [r.geometry.location.lng, r.geometry.location.lat],
      }
    }))
    return detailed.filter(Boolean)
  } catch {
    return []
  }
}

function photonToPlace(f) {
  const p = f.properties || {}
  // Build a friendly short label: prefer the name (POI) if present, else street + number.
  const parts = []
  if (p.name) parts.push(p.name)
  else if (p.street) parts.push([p.housenumber, p.street].filter(Boolean).join(' '))

  const short = parts[0] || p.city || p.county || p.postcode || 'Location'

  const ctxBits = []
  if (p.name && (p.street || p.housenumber)) {
    ctxBits.push([p.housenumber, p.street].filter(Boolean).join(' '))
  }
  if (p.postcode) ctxBits.push(p.postcode)
  if (p.city) ctxBits.push(p.city)
  else if (p.county) ctxBits.push(p.county)

  const coords = f.geometry?.coordinates || null
  // Photon postcode-only features lack osm_id; fall back to coord-based id so React keys stay unique.
  const id = p.osm_id
    ? `${p.osm_type || 'X'}-${p.osm_id}`
    : `pc-${coords ? coords.join(',') : short}`

  return {
    id,
    name: [short, ...ctxBits].filter(Boolean).join(', '),
    short,
    context: ctxBits.filter(Boolean).join(', '),
    coords,
  }
}

function maptilerToPlace(f) {
  return {
    id: f.id,
    name: f.place_name || f.text,
    short: f.text,
    context: (f.context || []).map((c) => c.text).join(', '),
    coords: f.center,
  }
}

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve([pos.coords.longitude, pos.coords.latitude]),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 }
    )
  })
}
