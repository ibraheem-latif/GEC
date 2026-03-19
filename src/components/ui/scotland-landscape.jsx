import { useEffect, useRef } from 'react'

const PERIOD = 3200
const FADE   = 0.80
const SPEED  = 85

// City building layouts: [startWorldX, endWorldX, heightPxAt600hCanvas]
// Defined over one PERIOD (3200px); tiles automatically via modulo
const GLASGOW_BLDGS = [
  [0,    175,  52],  [190,  370,  75],  [385,  490,  118], [505,  680,  62],
  [695,  712,  38],  [727,  915,  80],  [930,  1048, 138], [1063, 1218, 68],
  [1233, 1272, 52],  [1287, 1455, 85],  [1470, 1560, 58],  [1575, 1748, 78],
  [1763, 1868, 122], [1883, 2018, 65],  [2033, 2208, 80],  [2223, 2278, 42],
  [2293, 2458, 88],  [2473, 2578, 112], [2593, 2758, 58],  [2773, 2938, 72],
  [2953, 3022, 45],  [3037, 3199, 80],
]

const EDINBURGH_BLDGS = [
  [0,    195,  68],  [210,  395,  88],
  [410,  530,  185], [545,  640,  95],  // ← Castle Rock (185px peak)
  [655,  698,  70],  [713,  878,  82],  [893,  958,  55],  [973,  1128, 78],
  [1143, 1198, 48],  [1213, 1388, 72],  [1403, 1558, 85],  [1573, 1618, 60],
  [1633, 1813, 70],  [1828, 2008, 90],
  [2023, 2143, 185], [2158, 2248, 98],  // ← Castle again
  [2263, 2308, 72],  [2323, 2493, 85],  [2508, 2563, 58],  [2578, 2733, 78],
  [2748, 2813, 52],  [2828, 2988, 72],  [3003, 3068, 60],  [3083, 3199, 68],
]

// rim: opacity of copper rim-light on ridge line (backlit effect)
const SCENES = [
  {
    // Glasgow City Centre — sandstone Victorian meets modern towers
    sky: [[0,[8,5,3]],[0.46,[22,12,4]],[0.73,[98,48,10]],[1,[175,85,18]]],
    layers: [
      // Distant Campsie Fells / Renfrewshire hills
      { speed:0.06, base:0.50, rgb:[40,20,5], rim:0.26,
        w:[[0.0028,60,0.3],[0.0055,35,2.2],[0.0112,15,4.6]] },
      // Glasgow skyline — Victorian sandstone + towers
      { speed:0.30, base:0.47, rgb:[52,27,7], rim:0.48,
        buildings: GLASGOW_BLDGS,
        w:[[0.018,3,0.5],[0.035,2,2.8]] },
      // Foreground street-level low buildings
      { speed:0.62, base:0.74, rgb:[15,7,2], rim:0.10,
        w:[[0.0082,30,1.1],[0.0165,13,3.5],[0.042,5,5.2]] },
    ],
  },
  {
    // Edinburgh — Castle Rock, Old Town tenements, Arthur's Seat
    sky: [[0,[6,4,3]],[0.46,[18,10,4]],[0.72,[85,44,10]],[1,[162,80,18]]],
    layers: [
      // Arthur's Seat — extinct volcano, broad rounded peak
      { speed:0.07, base:0.38, rgb:[45,23,6], rim:0.30,
        w:[[0.0020,130,1.0],[0.0048,52,2.8],[0.0115,20,4.5]] },
      // Edinburgh skyline — Old Town + Castle Rock spike
      { speed:0.28, base:0.46, rgb:[50,26,8], rim:0.52,
        buildings: EDINBURGH_BLDGS,
        w:[[0.019,3,1.1],[0.038,2,3.2]] },
      // Foreground tenements / Princes Street level
      { speed:0.60, base:0.72, rgb:[14,7,2], rim:0.09,
        w:[[0.0078,28,1.4],[0.0162,11,3.9],[0.041,5,5.5]] },
    ],
  },
  {
    // Scottish Highlands — dramatic jagged peaks, amber dusk
    sky: [[0,[6,4,2]],[0.45,[18,10,3]],[0.72,[92,44,8]],[1,[168,80,16]]],
    layers: [
      { speed:0.08, base:0.33, rgb:[50,26,7],  rim:0.42,
        w:[[0.0052,148,0],[0.0091,74,1.7],[0.0198,33,3.2],[0.0421,14,5.1]] },
      { speed:0.25, base:0.52, rgb:[28,14,4],  rim:0.20,
        w:[[0.0078,92,0.9],[0.0142,48,2.6],[0.0312,20,4.3]] },
      { speed:0.55, base:0.72, rgb:[14,7,2],   rim:0.08,
        w:[[0.0115,62,1.4],[0.0238,28,3.7],[0.0511,12,5.8]] },
    ],
  },
]

export default function ScotlandLandscape({ width = 440, height = 600, className = '' }) {
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

    const scale = height / 600

    // Pre-allocated y-value buffer — avoids GC per frame
    const ys = new Float32Array(Math.ceil(width / 2) + 2)

    // Cache one gradient per scene
    const skyGrads = SCENES.map(({ sky }) => {
      const g = ctx.createLinearGradient(0, 0, 0, height * 0.88)
      for (const [stop, [r, gr, b]] of sky) g.addColorStop(stop, `rgb(${r},${gr},${b})`)
      return g
    })

    // Static overlay gradients — created once at mount
    const vigGrad = ctx.createLinearGradient(0, height * 0.72, 0, height)
    vigGrad.addColorStop(0, 'rgba(8,6,4,0)')
    vigGrad.addColorStop(1, '#080604')

    // Warm amber atmosphere haze
    const atmGrad = ctx.createLinearGradient(0, height * 0.28, 0, height * 0.62)
    atmGrad.addColorStop(0, 'rgba(10,5,2,0.60)')
    atmGrad.addColorStop(0.4, 'rgba(10,5,2,0.22)')
    atmGrad.addColorStop(1, 'rgba(10,5,2,0)')

    // Strong copper horizon band
    const copperGlow = ctx.createLinearGradient(0, height * 0.44, 0, height * 0.70)
    copperGlow.addColorStop(0,   'rgba(200,115,40,0)')
    copperGlow.addColorStop(0.35,'rgba(200,115,40,0.32)')
    copperGlow.addColorStop(0.65,'rgba(200,115,40,0.22)')
    copperGlow.addColorStop(1,   'rgba(200,115,40,0)')

    function drawLayer(layer, worldOffset) {
      const { base, rgb: [r, g, b], w, buildings, rim = 0 } = layer
      const step = 2
      let   i    = 0

      ctx.beginPath()
      ctx.moveTo(0, height + 10)
      for (let px = 0; px <= width; px += step, i++) {
        const wx = px + worldOffset
        if (buildings) {
          // Building silhouette profile
          const localX = ((wx % PERIOD) + PERIOD) % PERIOD
          let bh = 0
          for (const [s, e, h] of buildings) {
            if (localX >= s && localX <= e) { bh = h; break }
          }
          // Tiny rooftop noise for texture (only on building surfaces)
          const noise = (bh > 0 && w)
            ? w.reduce((sum, [f, a, p]) => sum + Math.sin(wx * f + p) * a, 0) * 0.05
            : 0
          ys[i] = (bh + noise) * scale
        } else {
          ys[i] = w.reduce((s, [f, a, p]) => s + Math.sin(wx * f + p) * a * scale, 0)
        }
        ctx.lineTo(px, base * height - ys[i])
      }
      ctx.lineTo(width, height + 10)
      ctx.closePath()
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.fill()

      // Copper rim-light — backlit ridge / rooftop glow
      if (rim > 0) {
        ctx.beginPath()
        for (let j = 0, px = 0; px <= width; j++, px += step) {
          const cy = base * height - ys[j]
          j === 0 ? ctx.moveTo(px, cy) : ctx.lineTo(px, cy)
        }
        ctx.strokeStyle = `rgba(200,115,40,${rim})`
        ctx.lineWidth   = 1.5
        ctx.stroke()
      }
    }

    function renderScene(idx, alpha, worldX) {
      ctx.globalAlpha = alpha
      ctx.fillStyle   = skyGrads[idx]
      ctx.fillRect(0, 0, width, height)
      for (const layer of SCENES[idx].layers) drawLayer(layer, worldX * layer.speed)
    }

    let camX  = 0
    let lastT = performance.now()
    let raf

    function render(t) {
      raf = requestAnimationFrame(render)
      const dt = Math.min((t - lastT) / 1000, 0.05)
      lastT = t
      camX += SPEED * dt

      const progress = (camX % PERIOD) / PERIOD
      const sceneIdx = Math.floor(camX / PERIOD) % SCENES.length
      const nextIdx  = (sceneIdx + 1) % SCENES.length
      const blend    = progress < FADE ? 0 : (progress - FADE) / (1 - FADE)

      ctx.globalAlpha = 1
      ctx.fillStyle   = '#080604'
      ctx.fillRect(0, 0, width, height)

      renderScene(sceneIdx, 1 - blend, camX)
      if (blend > 0) renderScene(nextIdx, blend, camX)

      ctx.globalAlpha = 1

      // Copper horizon band
      ctx.fillStyle = copperGlow
      ctx.fillRect(0, height * 0.40, width, height * 0.35)

      // Atmosphere haze — depth separation between layers
      ctx.fillStyle = atmGrad
      ctx.fillRect(0, height * 0.26, width, height * 0.38)

      // Bottom vignette
      ctx.fillStyle = vigGrad
      ctx.fillRect(0, height * 0.72, width, height * 0.28)
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
