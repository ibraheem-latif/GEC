import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const API_KEY = import.meta.env.VITE_MAPTILER_KEY

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

function buildStyle(key) {
  return {
    version: 8,
    sources: {
      city: {
        type:        'vector',
        tiles:       [`https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=${key}`],
        minzoom:     0,
        maxzoom:     14,
        attribution: '© OpenStreetMap contributors, © MapTiler',
      },
    },
    layers: [
      { id: 'bg', type: 'background',
        paint: { 'background-color': '#080604' } },

      { id: 'landcover', type: 'fill',
        source: 'city', 'source-layer': 'landcover',
        paint: { 'fill-color': '#0c0804' } },

      { id: 'water', type: 'fill',
        source: 'city', 'source-layer': 'water',
        paint: { 'fill-color': '#06080c' } },

      { id: 'road-minor', type: 'line',
        source: 'city', 'source-layer': 'transportation',
        filter: ['in', 'class', 'minor', 'service', 'path', 'track'],
        paint: { 'line-color': '#1c0e05',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.4, 16, 1.0] } },

      { id: 'road-major', type: 'line',
        source: 'city', 'source-layer': 'transportation',
        filter: ['in', 'class', 'primary', 'secondary', 'tertiary', 'trunk', 'motorway', 'residential'],
        paint: { 'line-color': '#2e1808',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.7, 16, 2.2] } },

      { id: 'building-base', type: 'fill',
        source: 'city', 'source-layer': 'building',
        paint: { 'fill-color': '#140902', 'fill-opacity': 0.9 } },

      { id: 'buildings-3d', type: 'fill-extrusion',
        source: 'city', 'source-layer': 'building',
        minzoom: 12,
        paint: {
          'fill-extrusion-color': [
            'interpolate', ['linear'],
            ['coalesce', ['get', 'render_height'], ['get', 'height'], 6],
            0,   '#1a0c04',  10,  '#2e1608',
            28,  '#4e2612',  55,  '#743e1a',
            100, '#a85e22',  160, '#c87328',
            280, '#e08830',
          ],
          'fill-extrusion-height':            ['coalesce', ['get', 'render_height'],     ['get', 'height'],     6],
          'fill-extrusion-base':              ['coalesce', ['get', 'render_min_height'], ['get', 'min_height'], 0],
          'fill-extrusion-opacity':           0.93,
          'fill-extrusion-vertical-gradient': true,
        },
      },

    ],
  }
}

export default function GlasgowMap3D({ className = '' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || !API_KEY) return

    const first = TOUR[0]
    const map = new maplibregl.Map({
      container:          containerRef.current,
      style:              buildStyle(API_KEY),
      center:             first.center,
      zoom:               first.zoom,
      pitch:              first.pitch,
      bearing:            first.bearing,
      antialias:          true,
      interactive:        false,
      attributionControl: false,
    })

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
      map.easeTo({ bearing: wp.bearing + 38, padding: PAD, duration: wp.stayMs, easing: t => t })
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
