'use client'

import { useEffect, useRef, useState } from 'react'
import { getRoute, formatDuration, formatDistance } from '@/lib/routing'

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY

export default function RouteMap({ pickup, dropoff }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const animRafRef = useRef(null)
  const [route, setRoute] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mapReady, setMapReady] = useState(false)

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    if (!MAPTILER_KEY) return

    let cancelled = false
    let map

    ;(async () => {
      const maplibregl = (await import('maplibre-gl')).default
      await import('maplibre-gl/dist/maplibre-gl.css')
      if (cancelled || !containerRef.current) return

      map = new maplibregl.Map({
        container: containerRef.current,
        style: `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_KEY}`,
        center: [-4.2518, 55.8642],
        zoom: 9,
        attributionControl: false,
        cooperativeGestures: true,
      })

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
      map.addControl(new maplibregl.AttributionControl({ compact: true }))
      mapRef.current = map

      map.on('load', () => {
        map.addSource('route', {
          type: 'geojson',
          data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } },
        })
        map.addLayer({
          id: 'route-shadow',
          type: 'line',
          source: 'route',
          paint: {
            'line-color': '#000',
            'line-width': 8,
            'line-opacity': 0.35,
            'line-blur': 1.5,
          },
        })
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          paint: {
            'line-color': '#C4A55A',
            'line-width': 4,
            'line-opacity': 0.95,
          },
          layout: { 'line-cap': 'round', 'line-join': 'round' },
        })
        if (!cancelled) setMapReady(true)
      })
    })()

    return () => {
      cancelled = true
      if (animRafRef.current) cancelAnimationFrame(animRafRef.current)
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []
      if (mapRef.current) mapRef.current.remove()
      mapRef.current = null
      setMapReady(false)
    }
  }, [])

  // Fetch + draw route
  useEffect(() => {
    if (!pickup?.coords || !dropoff?.coords) {
      setRoute(null)
      // clear existing
      const map = mapRef.current
      if (map?.isStyleLoaded()) {
        const src = map.getSource('route')
        if (src) src.setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: [] } })
      }
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []
      return
    }

    const controller = new AbortController()
    setLoading(true)
    getRoute(pickup.coords, dropoff.coords, { signal: controller.signal })
      .then((r) => setRoute(r))
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [pickup?.coords?.[0], pickup?.coords?.[1], dropoff?.coords?.[0], dropoff?.coords?.[1]])

  // When route arrives + map is ready, animate the polyline + place markers + fit bounds
  useEffect(() => {
    if (!mapReady) return
    const map = mapRef.current
    if (!map || !route || !pickup?.coords || !dropoff?.coords) return

    let cancelled = false
    ;(async () => {
      const maplibregl = (await import('maplibre-gl')).default
      if (cancelled) return
      const coords = route.coordinates

      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []
      const m1 = new maplibregl.Marker({ element: makeMarker('A', '#C4A55A'), anchor: 'bottom' })
        .setLngLat(pickup.coords).addTo(map)
      const m2 = new maplibregl.Marker({ element: makeMarker('B', '#F0EDE6'), anchor: 'bottom' })
        .setLngLat(dropoff.coords).addTo(map)
      markersRef.current = [m1, m2]

      const bounds = coords.reduce(
        (b, c) => b.extend(c),
        new maplibregl.LngLatBounds(coords[0], coords[0])
      )
      map.fitBounds(bounds, { padding: 56, duration: 1100, essential: true })

      if (animRafRef.current) cancelAnimationFrame(animRafRef.current)
      const src = map.getSource('route')
      if (!src) return
      const start = performance.now()
      const duration = 900
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 3)
        const cut = Math.max(2, Math.floor(coords.length * eased))
        src.setData({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: coords.slice(0, cut) },
        })
        if (t < 1) animRafRef.current = requestAnimationFrame(tick)
      }
      animRafRef.current = requestAnimationFrame(tick)
    })()

    return () => { cancelled = true }
  }, [mapReady, route, pickup?.coords?.[0], pickup?.coords?.[1], dropoff?.coords?.[0], dropoff?.coords?.[1]])

  if (!MAPTILER_KEY) return null

  return (
    <div className="route-map-wrap">
      <div ref={containerRef} className="route-map" aria-label="Route preview" />
      {!pickup?.coords && !dropoff?.coords && (
        <div className="route-map-overlay">
          <span className="label" style={{ color: 'var(--white-dim)' }}>Enter pickup & drop-off to preview the route</span>
        </div>
      )}
      {route && (
        <div className="route-map-pill">
          <div>
            <div className="label" style={{ marginBottom: '2px' }}>{loading ? 'Updating…' : 'Estimated drive'}</div>
            <div style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: '1.5rem',
              fontWeight: 400,
              color: 'var(--white)',
              lineHeight: 1,
            }}>
              {formatDuration(route.durationSeconds)}
            </div>
          </div>
          <div style={{
            paddingLeft: '0.875rem',
            marginLeft: '0.875rem',
            borderLeft: '1px solid var(--line)',
          }}>
            <div className="label" style={{ marginBottom: '2px' }}>Distance</div>
            <div style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '0.95rem',
              color: 'var(--white)',
            }}>
              {formatDistance(route.distanceMeters)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function makeMarker(letter, color) {
  const el = document.createElement('div')
  el.className = 'route-marker'
  el.style.setProperty('--marker-color', color)
  el.innerHTML = `<span>${letter}</span>`
  return el
}
