import { useEffect, useRef } from 'react'

const SEGS    = 1600
const SEG_LEN = 200
const ROAD_HW = 1200
const CAM_H   = 1500
const CAM_D   = 0.84
const DRAW    = 140   // segments rendered — 140 covers the visible horizon cleanly
const TWO_PI  = Math.PI * 2

// Lateral curves: 7 + 18 + 40 waves (sweeping bends + mid-frequency wiggles)
const CURVES = Array.from({ length: SEGS }, (_, i) =>
  Math.sin((i / SEGS) * TWO_PI * 7)  * 5.0 +
  Math.sin((i / SEGS) * TWO_PI * 18) * 2.0 +
  Math.sin((i / SEGS) * TWO_PI * 40) * 0.4
)

// Vertical pitch: 12 + 30 waves → half-period = 67 segs, so you see a full
// crest AND descent within the visible draw range
const PITCH = Array.from({ length: SEGS }, (_, i) =>
  Math.sin((i / SEGS) * TWO_PI * 12) * 5.0 +
  Math.sin((i / SEGS) * TWO_PI * 30) * 1.5
)

// Pre-allocate segment objects once — avoids GC pressure in render loop
const pts = Array.from({ length: DRAW }, () => ({
  sx: 0, sy: 0, rw: 0, alt: false, valid: false,
}))

export default function InfiniteRoad({ width = 440, height = 600, className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    const dpr    = window.devicePixelRatio || 1

    canvas.width        = width  * dpr
    canvas.height       = height * dpr
    canvas.style.width  = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    const BASE_HORIZON = height * 0.44
    const isDesktop    = width >= 400
    const curveFactor  = isDesktop ? 0.50 : 0.28
    const pitchFactor  = isDesktop ? 0.62 : 0
    const speed        = isDesktop ? 550  : 280

    // Pre-build vignette gradient — never changes after mount
    const vigGrad = ctx.createLinearGradient(0, height * 0.76, 0, height)
    vigGrad.addColorStop(0, 'rgba(8,6,4,0)')
    vigGrad.addColorStop(1, '#080604')

    // Horizon-dependent gradients — cached and only rebuilt when HORIZON shifts
    let cachedHorizon = -9999
    let horizGlow, fogMask, edgeGrad, centerGrad

    function rebuildHorizonGrads(H) {
      horizGlow = ctx.createLinearGradient(0, H - 30, 0, H + 50)
      horizGlow.addColorStop(0,   'rgba(200,115,40,0)')
      horizGlow.addColorStop(0.5, 'rgba(200,115,40,0.08)')
      horizGlow.addColorStop(1,   'rgba(200,115,40,0)')

      fogMask = ctx.createLinearGradient(0, H - 10, 0, H + height * 0.14)
      fogMask.addColorStop(0,   'rgba(8,6,4,0.9)')
      fogMask.addColorStop(0.3, 'rgba(8,6,4,0.55)')
      fogMask.addColorStop(1,   'rgba(8,6,4,0)')

      // Edge lines: dim at horizon, bright near camera
      edgeGrad = ctx.createLinearGradient(0, H, 0, height)
      edgeGrad.addColorStop(0, 'rgba(200,115,40,0.06)')
      edgeGrad.addColorStop(1, 'rgba(200,115,40,0.88)')

      // Centerline: same fade profile
      centerGrad = ctx.createLinearGradient(0, H, 0, height)
      centerGrad.addColorStop(0, 'rgba(229,221,208,0.02)')
      centerGrad.addColorStop(1, 'rgba(229,221,208,0.52)')
    }

    let camZ  = 0
    let lastT = performance.now()
    let raf

    function render(t) {
      raf = requestAnimationFrame(render)
      const dt = Math.min((t - lastT) / 1000, 0.05)
      lastT = t
      camZ += speed * dt

      ctx.fillStyle = '#080604'
      ctx.fillRect(0, 0, width, height)

      const camSeg   = Math.floor(camZ / SEG_LEN)
      const segOff   = camZ % SEG_LEN
      const camPitch = PITCH[camSeg % SEGS]
      const HORIZON  = BASE_HORIZON - camPitch * 5.5

      // Rebuild horizon gradients only when HORIZON shifts by >1px
      const horizInt = HORIZON | 0
      if (horizInt !== cachedHorizon) {
        cachedHorizon = horizInt
        rebuildHorizonGrads(HORIZON)
      }

      ctx.fillStyle = horizGlow
      ctx.fillRect(0, HORIZON - 30, width, 80)

      // ── Project segments ────────────────────────────────────────────────
      let numPts = 0
      let cx = 0, cy = 0

      for (let i = 0; i < DRAW; i++) {
        const wz = (i + 1) * SEG_LEN - segOff
        const p  = pts[i]
        if (wz <= 0) { p.valid = false; continue }

        const sc = (CAM_D * height) / wz
        p.sx    = width / 2 + cx
        p.sy    = HORIZON + cy + CAM_H * sc
        p.rw    = ROAD_HW * sc
        p.alt   = (camSeg + i) % 2 === 0
        p.valid = true
        numPts  = i + 1

        const idx = (camSeg + i) % SEGS
        cx += CURVES[idx] * curveFactor
        cy -= PITCH[idx]  * pitchFactor
      }

      // ── Road fills (two batched passes — identical adjacent colours so
      //    z-order artefacts are invisible) ────────────────────────────────
      ctx.beginPath()
      for (let i = numPts - 1; i >= 1; i--) {
        const f = pts[i], n = pts[i - 1]
        if (!f.valid || !n.valid || !n.alt) continue
        const fy = Math.max(f.sy, HORIZON - 5), ny = n.sy
        if (fy >= ny - 0.5) continue
        ctx.moveTo(n.sx - n.rw, ny); ctx.lineTo(n.sx + n.rw, ny)
        ctx.lineTo(f.sx + f.rw, fy); ctx.lineTo(f.sx - f.rw, fy)
        ctx.closePath()
      }
      ctx.fillStyle = '#121009'
      ctx.fill()

      ctx.beginPath()
      for (let i = numPts - 1; i >= 1; i--) {
        const f = pts[i], n = pts[i - 1]
        if (!f.valid || !n.valid || n.alt) continue
        const fy = Math.max(f.sy, HORIZON - 5), ny = n.sy
        if (fy >= ny - 0.5) continue
        ctx.moveTo(n.sx - n.rw, ny); ctx.lineTo(n.sx + n.rw, ny)
        ctx.lineTo(f.sx + f.rw, fy); ctx.lineTo(f.sx - f.rw, fy)
        ctx.closePath()
      }
      ctx.fillStyle = '#0e0c07'
      ctx.fill()

      // ── Left edge (single batched polyline) ─────────────────────────────
      ctx.strokeStyle = edgeGrad
      ctx.lineWidth   = 2

      ctx.beginPath()
      let lStarted = false
      for (let i = numPts - 1; i >= 1; i--) {
        const f = pts[i], n = pts[i - 1]
        if (!f.valid || !n.valid) { lStarted = false; continue }
        const fy = Math.max(f.sy, HORIZON - 5), ny = n.sy
        if (fy >= ny - 0.5) { lStarted = false; continue }
        if (!lStarted) { ctx.moveTo(f.sx - f.rw, fy); lStarted = true }
        ctx.lineTo(n.sx - n.rw, ny)
      }
      ctx.stroke()

      // ── Right edge ───────────────────────────────────────────────────────
      ctx.beginPath()
      let rStarted = false
      for (let i = numPts - 1; i >= 1; i--) {
        const f = pts[i], n = pts[i - 1]
        if (!f.valid || !n.valid) { rStarted = false; continue }
        const fy = Math.max(f.sy, HORIZON - 5), ny = n.sy
        if (fy >= ny - 0.5) { rStarted = false; continue }
        if (!rStarted) { ctx.moveTo(f.sx + f.rw, fy); rStarted = true }
        ctx.lineTo(n.sx + n.rw, ny)
      }
      ctx.stroke()

      // ── Dashed centreline (alt segments only → natural gaps) ────────────
      ctx.strokeStyle = centerGrad
      ctx.lineWidth   = 1.2
      ctx.beginPath()
      for (let i = numPts - 1; i >= 1; i--) {
        const f = pts[i], n = pts[i - 1]
        if (!f.valid || !n.valid || !n.alt) continue
        const fy = Math.max(f.sy, HORIZON - 5), ny = n.sy
        if (fy >= ny - 0.5) continue
        ctx.moveTo(f.sx, fy)
        ctx.lineTo(n.sx, ny)
      }
      ctx.stroke()

      // ── Horizon fog (drawn after road so crests can peek through) ────────
      ctx.fillStyle = fogMask
      ctx.fillRect(0, HORIZON - 10, width, height * 0.18)

      // ── Bottom vignette ─────────────────────────────────────────────────
      ctx.fillStyle = vigGrad
      ctx.fillRect(0, height * 0.76, width, height * 0.24)
    }

    raf = requestAnimationFrame(render)
    return () => cancelAnimationFrame(raf)
  }, [width, height])

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block' }}
      className={className}
    />
  )
}
