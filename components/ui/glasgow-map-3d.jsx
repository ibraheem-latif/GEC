'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const API_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY

const TOUR = [
  {
    name:     'George Square, Glasgow',
    center:   [-4.2486, 55.8610],
    zoom:     15.8,
    pitch:    62,
    bearing:  -20,
    stayMs:   18000,
    travelMs: 11000,
  },
  {
    name:     'Finnieston & The Clyde',
    center:   [-4.2898, 55.8572],
    zoom:     15.2,
    pitch:    66,
    bearing:  60,
    stayMs:   18000,
    travelMs: 11000,
  },
  {
    name:     'Cathedral & Necropolis',
    center:   [-4.2358, 55.8652],
    zoom:     15.5,
    pitch:    58,
    bearing:  160,
    stayMs:   18000,
    travelMs: 17000,
  },
  {
    name:     'Edinburgh Castle',
    center:   [-3.1997, 55.9485],
    zoom:     15.6,
    pitch:    67,
    bearing:  40,
    stayMs:   22000,
    travelMs: 15000,
  },
]

// Midnight Precision palette — cinematic gold-on-void.
// Built from scratch against MapTiler's OpenMapTiles vector schema so we sidestep
// the full streets-v2-dark style (whose paint props include unsupported AO).
function buildMidnightPrecisionStyle(apiKey) {
  return {
    version: 8,
    name: 'Midnight Precision',
    glyphs: `https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=${apiKey}`,
    sources: {
      maptiler: {
        type:     'vector',
        url:      `https://api.maptiler.com/tiles/v3/tiles.json?key=${apiKey}`,
      },
    },
    layers: [
      {
        id: 'bg',
        type: 'background',
        paint: { 'background-color': '#05050a' },
      },
      {
        id: 'landcover',
        type: 'fill',
        source: 'maptiler',
        'source-layer': 'landcover',
        paint: { 'fill-color': '#0a0a12', 'fill-opacity': 0.9 },
      },
      {
        id: 'landuse',
        type: 'fill',
        source: 'maptiler',
        'source-layer': 'landuse',
        paint: { 'fill-color': '#0b0b14', 'fill-opacity': 0.85 },
      },
      {
        id: 'park',
        type: 'fill',
        source: 'maptiler',
        'source-layer': 'park',
        paint: { 'fill-color': '#0c0f14', 'fill-opacity': 0.8 },
      },
      {
        id: 'water',
        type: 'fill',
        source: 'maptiler',
        'source-layer': 'water',
        paint: { 'fill-color': '#0d2a4a', 'fill-opacity': 1 },
      },
      {
        id: 'waterway',
        type: 'line',
        source: 'maptiler',
        'source-layer': 'waterway',
        paint: {
          'line-color': '#1d4976',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.6, 16, 1.6],
        },
      },
      {
        id: 'admin',
        type: 'line',
        source: 'maptiler',
        'source-layer': 'boundary',
        paint: { 'line-color': 'rgba(196,165,90,0.18)', 'line-width': 0.5 },
      },
      {
        id: 'road-glow',
        type: 'line',
        source: 'maptiler',
        'source-layer': 'transportation',
        filter: ['in', 'class', 'motorway', 'trunk', 'primary', 'secondary', 'tertiary'],
        paint: {
          'line-color': 'rgba(212,184,106,0.28)',
          'line-width': ['interpolate', ['linear'], ['zoom'], 11, 2, 14, 5, 16, 10],
          'line-blur': 5,
        },
        layout: { 'line-join': 'round', 'line-cap': 'round' },
      },
      {
        id: 'road-minor',
        type: 'line',
        source: 'maptiler',
        'source-layer': 'transportation',
        filter: ['in', 'class', 'minor', 'service', 'path', 'track', 'pedestrian', 'footway', 'cycleway'],
        paint: {
          'line-color': 'rgba(138,105,48,0.55)',
          'line-width': ['interpolate', ['linear'], ['zoom'], 13, 0.2, 16, 0.9, 18, 2],
        },
        layout: { 'line-join': 'round', 'line-cap': 'round' },
      },
      {
        id: 'road-residential',
        type: 'line',
        source: 'maptiler',
        'source-layer': 'transportation',
        filter: ['==', 'class', 'residential'],
        paint: {
          'line-color': 'rgba(168,137,67,0.75)',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.5, 16, 1.8, 18, 3.5],
        },
        layout: { 'line-join': 'round', 'line-cap': 'round' },
      },
      {
        id: 'road-secondary',
        type: 'line',
        source: 'maptiler',
        'source-layer': 'transportation',
        filter: ['in', 'class', 'tertiary', 'secondary'],
        paint: {
          'line-color': '#b89548',
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.5, 14, 2.2, 16, 4, 18, 6],
        },
        layout: { 'line-join': 'round', 'line-cap': 'round' },
      },
      {
        id: 'road-primary',
        type: 'line',
        source: 'maptiler',
        'source-layer': 'transportation',
        filter: ['==', 'class', 'primary'],
        paint: {
          'line-color': '#c4a55a',
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.8, 14, 2.8, 16, 5, 18, 8],
        },
        layout: { 'line-join': 'round', 'line-cap': 'round' },
      },
      {
        id: 'road-motorway',
        type: 'line',
        source: 'maptiler',
        'source-layer': 'transportation',
        filter: ['in', 'class', 'motorway', 'trunk'],
        paint: {
          'line-color': '#d4b86a',
          'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.6, 12, 2.5, 14, 4.5, 16, 7, 18, 11],
        },
        layout: { 'line-join': 'round', 'line-cap': 'round' },
      },
      {
        id: 'rail',
        type: 'line',
        source: 'maptiler',
        'source-layer': 'transportation',
        filter: ['==', 'class', 'rail'],
        paint: { 'line-color': 'rgba(180,160,110,0.4)', 'line-width': 0.6 },
      },
      {
        id: 'buildings-3d',
        type: 'fill-extrusion',
        source: 'maptiler',
        'source-layer': 'building',
        minzoom: 12,
        paint: {
          // Gradient tuned for Glasgow's ~5–30m low-rise skyline so mid-tier buildings read gold,
          // not muddy brown; pushes taller landmarks toward a bright crown.
          'fill-extrusion-color': [
            'interpolate', ['linear'],
            ['coalesce', ['get', 'render_height'], ['get', 'height'], 6],
            0,   '#1a1812',
            5,   '#3a2f1c',
            12,  '#5d4d26',
            22,  '#8f7238',
            40,  '#b8994b',
            80,  '#d4b86a',
            160, '#ead18a',
          ],
          'fill-extrusion-height':            ['coalesce', ['get', 'render_height'], ['get', 'height'], 6],
          'fill-extrusion-base':              ['coalesce', ['get', 'render_min_height'], ['get', 'min_height'], 0],
          'fill-extrusion-opacity':           0.95,
          'fill-extrusion-vertical-gradient': true,
        },
      },
    ],
  }
}

// Extra yaw applied during each dwell so the camera keeps slowly rotating — gives the
// hero a continuous parallax feel instead of locking when a waypoint is reached.
const DWELL_ROTATION_DEG = 38

export default function GlasgowMap3D({ className = '' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || !API_KEY) return

    const first = TOUR[0]
    const map = new maplibregl.Map({
      container:          containerRef.current,
      style:              buildMidnightPrecisionStyle(API_KEY),
      center:             first.center,
      zoom:               first.zoom,
      pitch:              first.pitch,
      bearing:            first.bearing,
      antialias:          true,
      interactive:        false,
      attributionControl: false,
    })
    if (process.env.NODE_ENV === 'development') window.__gmap = map

    const timers = []
    let idx = 0

    function easeInOut(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    }

    const PAD = {
      left:   Math.round(containerRef.current.offsetWidth * 0.42),
      right:  0, top: 0, bottom: 0,
    }

    function stay(wp, onDone) {
      map.easeTo({ bearing: wp.bearing + DWELL_ROTATION_DEG, padding: PAD, duration: wp.stayMs, easing: t => t })
      timers.push(setTimeout(onDone, wp.stayMs))
    }

    function flyTo(wp, onDone) {
      map.easeTo({
        center: wp.center, zoom: wp.zoom, pitch: wp.pitch,
        bearing: wp.bearing, padding: PAD,
        duration: wp.travelMs, easing: easeInOut,
      })
      timers.push(setTimeout(onDone, wp.travelMs))
    }

    function runTour() {
      stay(TOUR[idx], () => {
        idx = (idx + 1) % TOUR.length
        flyTo(TOUR[idx], runTour)
      })
    }

    map.on('load', () => {
      map.setPadding(PAD)
      runTour()
    })

    return () => {
      timers.forEach(clearTimeout)
      map.remove()
      if (process.env.NODE_ENV === 'development') delete window.__gmap
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  )
}
