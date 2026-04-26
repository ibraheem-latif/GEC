// Routing helper. Uses public OSRM demo for the prototype; falls back to a
// straight-line "as-the-crow-flies" estimate if the request fails.
// Returns: { coordinates: [[lng,lat], ...], distanceMeters, durationSeconds, source }

const ROAD_FACTOR = 1.3
const AVG_SPEED_MPH = 35

function haversineMeters([lon1, lat1], [lon2, lat2]) {
  const R = 6_371_000
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

function fallbackRoute(origin, destination) {
  const meters = haversineMeters(origin, destination) * ROAD_FACTOR
  const miles = meters / 1609.34
  const hours = miles / AVG_SPEED_MPH
  return {
    coordinates: [origin, destination],
    distanceMeters: Math.round(meters),
    durationSeconds: Math.round(hours * 3600),
    source: 'estimate',
  }
}

export async function getRoute(origin, destination, { signal } = {}) {
  if (!origin || !destination) return null

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?overview=full&geometries=geojson`
    const res = await fetch(url, { signal })
    if (!res.ok) return fallbackRoute(origin, destination)
    const data = await res.json()
    const route = data.routes?.[0]
    if (!route) return fallbackRoute(origin, destination)
    return {
      coordinates: route.geometry.coordinates,
      distanceMeters: route.distance,
      durationSeconds: route.duration,
      source: 'osrm',
    }
  } catch {
    return fallbackRoute(origin, destination)
  }
}

export function formatDuration(seconds) {
  if (!seconds) return ''
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

export function formatDistance(meters) {
  if (!meters) return ''
  const miles = meters / 1609.34
  return miles < 1 ? `${(miles * 1760).toFixed(0)} yd` : `${miles.toFixed(1)} mi`
}
