'use client'

import { useEffect, useRef, useState } from 'react'
import { reverseGeocode } from '@/lib/geocode'

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY
const GLASGOW_CENTER = [-4.2518, 55.8642]
const FOCUS_ZOOM = 17

// points: [{ key: 'pickup'|'dropoff'|..., label: 'A'|'B', color, value, onChange }]
export default function TripMap({ points }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const mapReadyRef = useRef(false)
  const maplibreRef = useRef(null)
  const markersRef = useRef({})
  const pointsRef = useRef(points)
  const [focusedKey, setFocusedKey] = useState(null)

  useEffect(() => { pointsRef.current = points }, [points])

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !MAPTILER_KEY) return
    let cancelled = false

    ;(async () => {
      const maplibregl = (await import('maplibre-gl')).default
      await import('maplibre-gl/dist/maplibre-gl.css')
      if (cancelled || !containerRef.current) return
      maplibreRef.current = maplibregl

      const valid = points.filter((p) => p.value?.coords)
      const center = valid[0]?.value?.coords || GLASGOW_CENTER

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_KEY}`,
        center,
        zoom: 13,
        attributionControl: false,
        cooperativeGestures: true,
      })
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
      map.addControl(new maplibregl.AttributionControl({ compact: true }))
      mapRef.current = map

      map.on('load', () => {
        mapReadyRef.current = true
        syncMarkers()
        applyView()
      })
    })()

    return () => {
      cancelled = true
      Object.values(markersRef.current).forEach((m) => m.remove())
      markersRef.current = {}
      if (mapRef.current) mapRef.current.remove()
      mapRef.current = null
      mapReadyRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!mapReadyRef.current) return
    syncMarkers()
    applyView()
  }, [points.map((p) => `${p.key}:${p.value?.coords?.join(',') || ''}`).join('|')])

  useEffect(() => {
    if (!mapReadyRef.current) return
    applyView()
  }, [focusedKey])

  function syncMarkers() {
    const map = mapRef.current
    const maplibregl = maplibreRef.current
    if (!map || !maplibregl) return

    const seen = new Set()
    for (const p of pointsRef.current) {
      seen.add(p.key)
      const existing = markersRef.current[p.key]
      if (!p.value?.coords) {
        if (existing) { existing.remove(); delete markersRef.current[p.key] }
        continue
      }
      if (existing) {
        const cur = existing.getLngLat()
        if (Math.abs(cur.lng - p.value.coords[0]) > 1e-7 || Math.abs(cur.lat - p.value.coords[1]) > 1e-7) {
          existing.setLngLat(p.value.coords)
        }
        continue
      }
      const el = document.createElement('div')
      el.className = 'trip-map-pin'
      el.style.setProperty('--pin-color', p.color || '#C4A55A')
      const span = document.createElement('span')
      span.textContent = p.label || ''
      el.appendChild(span)

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom', draggable: true })
        .setLngLat(p.value.coords)
        .addTo(map)
      let dragged = false
      marker.on('dragstart', () => { dragged = true })
      marker.on('dragend', () => {
        handleDragEnd(p.key, marker)
        setTimeout(() => { dragged = false }, 50)
      })
      el.addEventListener('click', (e) => {
        if (dragged) return
        e.stopPropagation()
        setFocusedKey(p.key)
      })
      markersRef.current[p.key] = marker
    }
    for (const k of Object.keys(markersRef.current)) {
      if (!seen.has(k)) { markersRef.current[k].remove(); delete markersRef.current[k] }
    }
  }

  async function handleDragEnd(key, marker) {
    const ll = marker.getLngLat()
    const coords = [ll.lng, ll.lat]
    const place = await reverseGeocode(coords).catch(() => null)
    const cur = pointsRef.current.find((x) => x.key === key)
    if (!cur) return
    const prev = cur.value || {}
    const next = place
      ? { ...place, details: prev.details || '' }
      : { ...prev, coords, name: 'Custom location', short: 'Custom location', context: '' }
    cur.onChange(next)
  }

  function applyView() {
    const map = mapRef.current
    const maplibregl = maplibreRef.current
    if (!map || !maplibregl) return
    const focused = focusedKey
      ? pointsRef.current.find((p) => p.key === focusedKey && p.value?.coords)
      : null
    if (focused) {
      map.easeTo({ center: focused.value.coords, zoom: FOCUS_ZOOM, duration: 600 })
      return
    }
    const valid = pointsRef.current.filter((p) => p.value?.coords)
    if (valid.length === 0) return
    if (valid.length === 1) {
      map.easeTo({ center: valid[0].value.coords, zoom: Math.max(map.getZoom(), 14), duration: 600 })
      return
    }
    const bounds = new maplibregl.LngLatBounds()
    valid.forEach((p) => bounds.extend(p.value.coords))
    map.fitBounds(bounds, { padding: 60, maxZoom: 14, duration: 700 })
  }

  if (!MAPTILER_KEY) return null

  const valid = points.filter((p) => p.value?.coords)
  const focusedPoint = focusedKey ? valid.find((p) => p.key === focusedKey) : null
  const hint = focusedPoint
    ? `Drag pin ${focusedPoint.label || ''} to fine-tune — tap "Show both" to exit`
    : valid.length === 0
      ? 'Pick a location above to drop a pin'
      : valid.length === 1
        ? 'Tap the pin to zoom in and fine-tune'
        : 'Tap a pin to zoom in · drag to fine-tune'

  return (
    <div className="trip-map-wrap">
      <div ref={containerRef} className="trip-map" aria-label="Tap a pin to zoom and drag to fine-tune" />
      {focusedPoint && (
        <button
          type="button"
          className="trip-map-exit"
          onClick={() => setFocusedKey(null)}
          aria-label="Show both pins"
        >
          ← Show both
        </button>
      )}
      <div className="trip-map-hint label">{hint}</div>
    </div>
  )
}
