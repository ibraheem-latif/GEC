import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

export default function RotatingEarth({ width = 400, height = 400, className = '' }) {
  const canvasRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return

    const containerWidth = width
    const containerHeight = height
    const radius = Math.min(containerWidth, containerHeight) / 2.2

    const dpr = window.devicePixelRatio || 1
    canvas.width = containerWidth * dpr
    canvas.height = containerHeight * dpr
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`
    context.scale(dpr, dpr)

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90)

    const path = d3.geoPath().projection(projection).context(context)

    const pointInPolygon = (point, polygon) => {
      const [x, y] = point
      let inside = false
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i]
        const [xj, yj] = polygon[j]
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside
        }
      }
      return inside
    }

    const pointInFeature = (point, feature) => {
      const geometry = feature.geometry
      if (geometry.type === 'Polygon') {
        const coords = geometry.coordinates
        if (!pointInPolygon(point, coords[0])) return false
        for (let i = 1; i < coords.length; i++) {
          if (pointInPolygon(point, coords[i])) return false
        }
        return true
      } else if (geometry.type === 'MultiPolygon') {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) { inHole = true; break }
            }
            if (!inHole) return true
          }
        }
        return false
      }
      return false
    }

    const generateDotsInPolygon = (feature, dotSpacing = 18) => {
      const dots = []
      const bounds = d3.geoBounds(feature)
      const [[minLng, minLat], [maxLng, maxLat]] = bounds
      const stepSize = dotSpacing * 0.08
      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point = [lng, lat]
          if (pointInFeature(point, feature)) dots.push(point)
        }
      }
      return dots
    }

    const allDots = []
    let landFeatures

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight)
      const currentScale = projection.scale()
      const sf = currentScale / radius

      // Ocean
      context.beginPath()
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI)
      context.fillStyle = '#080604'
      context.fill()
      context.strokeStyle = 'rgba(200, 115, 40, 0.35)'
      context.lineWidth = 1.5 * sf
      context.stroke()

      if (landFeatures) {
        // Graticule
        const graticule = d3.geoGraticule()
        context.beginPath()
        path(graticule())
        context.strokeStyle = 'rgba(200, 115, 40, 0.12)'
        context.lineWidth = 0.75 * sf
        context.globalAlpha = 1
        context.stroke()

        // Land outlines
        context.beginPath()
        landFeatures.features.forEach(feature => { path(feature) })
        context.strokeStyle = 'rgba(200, 115, 40, 0.55)'
        context.lineWidth = 0.9 * sf
        context.stroke()

        // Dots
        allDots.forEach(dot => {
          const projected = projection([dot.lng, dot.lat])
          if (
            projected &&
            projected[0] >= 0 && projected[0] <= containerWidth &&
            projected[1] >= 0 && projected[1] <= containerHeight
          ) {
            context.beginPath()
            context.arc(projected[0], projected[1], 1.1 * sf, 0, 2 * Math.PI)
            context.fillStyle = '#c87328'
            context.fill()
          }
        })
      }
    }

    const loadWorldData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json',
        )
        if (!response.ok) throw new Error('Failed to load land data')
        landFeatures = await response.json()
        landFeatures.features.forEach(feature => {
          const dots = generateDotsInPolygon(feature, 18)
          dots.forEach(([lng, lat]) => allDots.push({ lng, lat }))
        })
        render()
        setIsLoading(false)
      } catch {
        setError('Failed to load globe data')
        setIsLoading(false)
      }
    }

    const rotation = [0, 0]
    let autoRotate = true

    const rotate = () => {
      if (autoRotate) {
        rotation[0] += 0.4
        projection.rotate(rotation)
        render()
      }
    }

    const rotationTimer = d3.timer(rotate)

    const handleMouseDown = event => {
      autoRotate = false
      const startX = event.clientX
      const startY = event.clientY
      const startRotation = [...rotation]

      const handleMouseMove = moveEvent => {
        rotation[0] = startRotation[0] + (moveEvent.clientX - startX) * 0.5
        rotation[1] = Math.max(-90, Math.min(90, startRotation[1] - (moveEvent.clientY - startY) * 0.5))
        projection.rotate(rotation)
        render()
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        setTimeout(() => { autoRotate = true }, 10)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    const handleWheel = event => {
      event.preventDefault()
      const sf = event.deltaY > 0 ? 0.9 : 1.1
      projection.scale(Math.max(radius * 0.5, Math.min(radius * 3, projection.scale() * sf)))
      render()
    }

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('wheel', handleWheel, { passive: false })

    loadWorldData()

    return () => {
      rotationTimer.stop()
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('wheel', handleWheel)
    }
  }, [width, height])

  if (error) return null

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '2rem',
              height: '2rem',
              border: '2px solid rgba(200, 115, 40, 0.2)',
              borderTop: '2px solid #c87328',
              borderRadius: '50%',
            }}
            className="animate-spin"
          />
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          cursor: 'grab',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.6s ease',
        }}
      />
    </div>
  )
}
