import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ── World layout ─────────────────────────────────────────────────────────────
// Camera flies along -Z.  Biome zones (world Z):
//   Glasgow   :  2800 →  800
//   Edinburgh :   800 → -800
//   Highlands : -800 → -2800

const TERRAIN_W = 4400
const TERRAIN_D = 8000
const TW_SEGS   = 96
const TD_SEGS   = 200

const CAM_Z_START =  2600
const CAM_Z_END   = -2600
const CAM_SPEED   = 50
const CAM_Y       = 210
const CAM_LOOK_DZ = -650

// ── Terrain height functions ──────────────────────────────────────────────────

function glasgowH(wx, wz) {
  const nx = wx * 0.0009, nz = wz * 0.0007
  return (
    Math.sin(nx * 9.1 + nz * 6.4) * 16 +
    Math.sin(nx * 17  + nz * 12)  *  6 +
    Math.sin(nx * 34  + nz * 24)  *  2
  )
}

function edinburghH(wx, wz) {
  const nx = wx * 0.0009, nz = wz * 0.0007
  const base =
    Math.sin(nx * 6.8 + nz * 4.5) * 35 +
    Math.sin(nx * 13  + nz * 9)   * 14 +
    Math.sin(nx * 26  + nz * 18)  *  5
  const dx = wx - 180, dz = wz + 80
  const spike = Math.max(0, 1 - Math.sqrt(dx * dx + dz * dz) / 200) ** 2.2 * 160
  return base + spike
}

function highlandsH(wx, wz) {
  const nx = wx * 0.00055, nz = wz * 0.00042
  return (
    Math.sin(nx * 4.4 + nz * 2.9) * 155 +
    Math.sin(nx * 8.2 + nz * 5.5) *  65 +
    Math.sin(nx * 15  + nz * 10)  *  26 +
    Math.sin(nx * 30  + nz * 20)  *   9
  )
}

function blend01(v, lo, hi) {
  return Math.max(0, Math.min(1, (v - lo) / (hi - lo)))
}

const G_END = 800, E_END = -800, BLEND = 380

function terrainAt(wx, wz) {
  if (wz > G_END + BLEND) return glasgowH(wx, wz)
  if (wz < E_END - BLEND) return highlandsH(wx, wz)
  if (wz >= G_END - BLEND && wz <= G_END + BLEND) {
    const t = blend01(wz, G_END - BLEND, G_END + BLEND)
    return glasgowH(wx, wz) * t + edinburghH(wx, wz) * (1 - t)
  }
  if (wz >= E_END - BLEND && wz <= E_END + BLEND) {
    const t = blend01(wz, E_END - BLEND, E_END + BLEND)
    return edinburghH(wx, wz) * t + highlandsH(wx, wz) * (1 - t)
  }
  return edinburghH(wx, wz)
}

// ── Building generators ───────────────────────────────────────────────────────

function lcg(seed) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xFFFFFFFF }
}

function glasgowBuildings() {
  const r = lcg(42), out = []
  for (let i = 0; i < 60; i++) {
    const x = (r() - 0.5) * 1500
    const z = 950 + r() * 1500
    const h = r() > 0.75 ? 80 + r() * 120 : 25 + r() * 55
    out.push({ x, z, w: 42 + r() * 72, d: 42 + r() * 72, h })
  }
  for (let i = 0; i < 22; i++) {
    out.push({ x: (r() - 0.5) * 2200, z: 900 + r() * 1700, w: 28 + r() * 44, d: 28 + r() * 44, h: 14 + r() * 32 })
  }
  return out
}

function edinburghBuildings() {
  const r = lcg(17), out = []
  for (let i = 0; i < 50; i++) {
    out.push({ x: (r() - 0.5) * 1300, z: -750 + r() * 1450, w: 36 + r() * 58, d: 36 + r() * 58, h: 30 + r() * 60 })
  }
  for (let i = 0; i < 7; i++) {
    out.push({ x: 170 + (r() - 0.5) * 110, z: -75 + (r() - 0.5) * 130, w: 16 + r() * 26, d: 16 + r() * 26, h: 35 + r() * 90 })
  }
  return out
}

// ── Vertex color helper ───────────────────────────────────────────────────────
// Maps height to warm copper gradient: low = dark brown, high = bright copper

function heightToColor(h, maxH) {
  const t = Math.max(0, Math.min(1, h / maxH)) ** 0.6
  // Dark valley  →  copper peak
  return {
    r: 0.18 + t * 0.62,   // 0.18 → 0.80
    g: 0.07 + t * 0.28,   // 0.07 → 0.35
    b: 0.01 + t * 0.04,   // 0.01 → 0.05
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ScotlandLandscape3D({ width = 1200, height = 800, className = '' }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const W = width, H = height
    if (W <= 0 || H <= 0) return

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.toneMapping = THREE.LinearToneMapping
    renderer.toneMappingExposure = 1.0
    mountRef.current.appendChild(renderer.domElement)

    // ── Scene & fog ───────────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0c0704)
    scene.fog = new THREE.FogExp2(0x1a0c05, 0.00026)

    // ── Camera ────────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(62, W / H, 1, 9000)
    camera.position.set(0, CAM_Y, CAM_Z_START)
    camera.lookAt(0, 20, CAM_Z_START + CAM_LOOK_DZ)

    // ── Lights ────────────────────────────────────────────────────────────────
    // Warm ambient — fills the whole scene
    scene.add(new THREE.AmbientLight(0x3d1a06, 3.5))

    // Key: bright copper sun from upper-left
    const key = new THREE.DirectionalLight(0xd4822a, 5.5)
    key.position.set(-900, 700, 300)
    scene.add(key)

    // Fill: softer, from right
    const fill = new THREE.DirectionalLight(0x9c5520, 2.5)
    fill.position.set(700, 350, -100)
    scene.add(fill)

    // Rim/back: hot amber from behind, kisses ridgelines
    const rim = new THREE.DirectionalLight(0xff9428, 4.0)
    rim.position.set(0, 200, 1400)
    scene.add(rim)

    // ── Terrain geometry with vertex colors ───────────────────────────────────
    const geo = new THREE.PlaneGeometry(TERRAIN_W, TERRAIN_D, TW_SEGS, TD_SEGS)
    geo.rotateX(-Math.PI / 2)

    const pos = geo.attributes.position
    const colorArr = new Float32Array(pos.count * 3)

    // Find approximate max height for color normalisation
    const MAX_H = 170

    for (let i = 0; i < pos.count; i++) {
      const wx = pos.getX(i)
      const wz = pos.getZ(i)
      const h  = terrainAt(wx, wz)
      pos.setY(i, h)
      const { r, g, b } = heightToColor(Math.max(0, h), MAX_H)
      colorArr[i * 3]     = r
      colorArr[i * 3 + 1] = g
      colorArr[i * 3 + 2] = b
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colorArr, 3))
    geo.computeVertexNormals()

    const terrainMat = new THREE.MeshLambertMaterial({ vertexColors: true })
    scene.add(new THREE.Mesh(geo, terrainMat))

    // ── Buildings ─────────────────────────────────────────────────────────────
    function buildGroup(bList, col) {
      const group = new THREE.Group()
      const mat   = new THREE.MeshLambertMaterial({ color: col })
      for (const { x, z, w, d, h } of bList) {
        const ground = terrainAt(x, z)
        const mesh   = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
        mesh.position.set(x, ground + h / 2, z)
        group.add(mesh)
      }
      return group
    }

    const glasgowGroup   = buildGroup(glasgowBuildings(),   0x6b3010)
    const edinburghGroup = buildGroup(edinburghBuildings(), 0x5a2808)
    scene.add(glasgowGroup)
    scene.add(edinburghGroup)

    // ── Sky backdrop ──────────────────────────────────────────────────────────
    const skyC = document.createElement('canvas')
    skyC.width = 2; skyC.height = 256
    const sCtx = skyC.getContext('2d')
    const sg   = sCtx.createLinearGradient(0, 0, 0, 256)
    sg.addColorStop(0.00, 'rgb(8,4,2)')
    sg.addColorStop(0.40, 'rgb(22,10,3)')
    sg.addColorStop(0.68, 'rgb(110,52,10)')
    sg.addColorStop(0.85, 'rgb(185,85,18)')
    sg.addColorStop(1.00, 'rgb(215,105,22)')
    sCtx.fillStyle = sg; sCtx.fillRect(0, 0, 2, 256)
    const skyTex  = new THREE.CanvasTexture(skyC)
    const skyMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(16000, 5000),
      new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.FrontSide, depthWrite: false })
    )
    skyMesh.position.set(0, 1200, -4200)
    scene.add(skyMesh)

    // Copper horizon glow strip
    const hC = document.createElement('canvas')
    hC.width = 2; hC.height = 64
    const hCtx = hC.getContext('2d')
    const hg   = hCtx.createLinearGradient(0, 0, 0, 64)
    hg.addColorStop(0,   'rgba(220,120,30,0)')
    hg.addColorStop(0.45,'rgba(220,120,30,0.72)')
    hg.addColorStop(1,   'rgba(220,120,30,0)')
    hCtx.fillStyle = hg; hCtx.fillRect(0, 0, 2, 64)
    const hTex  = new THREE.CanvasTexture(hC)
    const hMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(16000, 380),
      new THREE.MeshBasicMaterial({ map: hTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
    )
    hMesh.position.set(0, 22, -4000)
    scene.add(hMesh)

    // ── Fade overlay ──────────────────────────────────────────────────────────
    const overlay = document.createElement('canvas')
    overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;'
    overlay.width = W; overlay.height = H
    mountRef.current.appendChild(overlay)
    const oCtx = overlay.getContext('2d')

    // ── Render loop ───────────────────────────────────────────────────────────
    let camZ      = CAM_Z_START
    let lastT     = performance.now()
    let fadeOut   = 0
    let resetting = false
    let raf

    function tick(t) {
      raf = requestAnimationFrame(tick)
      const dt = Math.min((t - lastT) / 1000, 0.05)
      lastT = t

      if (!resetting) {
        camZ -= CAM_SPEED * dt
        if (camZ < CAM_Z_END) { resetting = true; fadeOut = 0 }
      } else {
        fadeOut += dt * 1.1
        if (fadeOut >= 1) { camZ = CAM_Z_START; resetting = false }
      }

      if (!resetting && fadeOut > 0) fadeOut = Math.max(0, fadeOut - dt * 0.85)

      const bob = Math.sin(t * 0.00038) * 10
      camera.position.set(0, CAM_Y + bob, camZ)
      camera.lookAt(0, 20 + bob * 0.25, camZ + CAM_LOOK_DZ)

      skyMesh.position.z = camZ - 4200
      hMesh.position.z   = camZ - 4000

      glasgowGroup.visible   = camZ > -400
      edinburghGroup.visible = camZ < 1600 && camZ > -1800

      renderer.render(scene, camera)

      oCtx.clearRect(0, 0, W, H)
      if (fadeOut > 0) {
        oCtx.fillStyle = `rgba(8,6,4,${Math.min(1, fadeOut).toFixed(3)})`
        oCtx.fillRect(0, 0, W, H)
      }
    }

    raf = requestAnimationFrame(tick)

    const mount = mountRef.current
    return () => {
      cancelAnimationFrame(raf)
      renderer.dispose()
      geo.dispose()
      terrainMat.dispose()
      skyTex.dispose()
      hTex.dispose()
      if (mount) {
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
        if (overlay.parentNode === mount) mount.removeChild(overlay)
      }
    }
  }, [width, height])

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ position: 'relative', width, height, overflow: 'hidden', display: 'block' }}
    />
  )
}
