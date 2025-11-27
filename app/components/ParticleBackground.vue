<template>
  <canvas
    ref="canvasRef"
    class="fixed inset-0 w-full h-full pointer-events-none z-[1]"
  />
</template>

<script setup lang="ts">
import * as THREE from 'three'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const colorMode = useColorMode()

// Configuration - responsive based on screen size
const getParticleCount = () => {
  const area = window.innerWidth * window.innerHeight
  // Scale particles based on screen area
  // Mobile (~400x800 = 320k) -> ~80 particles
  // Desktop (~1920x1080 = 2M) -> ~300+ particles (increased by 50%)
  const baseCount = Math.floor(area / 2700)
  return Math.max(80, Math.min(350, baseCount))
}

const getConnectionDistance = () => {
  // Larger screens need larger connection distance
  const diagonal = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2)
  return Math.max(100, Math.min(200, diagonal / 12))
}

let PARTICLE_COUNT = getParticleCount()
let CONNECTION_DISTANCE = getConnectionDistance()
const PARTICLE_SPEED = 0.15

// Timing synced with HeroSection whoami animation
const COMPRESSION_DURATION = 2400 // ms - during typing + pause
const EXPLOSION_START = 2400 // ms - when terminal starts moving
const EXPLOSION_DURATION = 2200 // ms - during terminal movement

// Three.js objects
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let particles: THREE.Points
let lines: THREE.LineSegments
let animationId: number

// Animation state
let animationStartTime = 0
let phase: 'compressing' | 'exploding' | 'floating' = 'compressing'

// Particle data - will be initialized with correct size
let positions: Float32Array
let startPositions: Float32Array
let compressedPositions: Float32Array
let targetPositions: Float32Array
const velocities: THREE.Vector3[] = []

// Colors based on theme
const getColors = () => {
  const isDark = colorMode.value === 'dark'
  return {
    particle: isDark ? 0x3b82f6 : 0x3b82f6, // brand-500
    line: isDark ? 0x60a5fa : 0x93c5fd, // brand-400 / brand-300
    particleOpacity: isDark ? 0.6 : 0.4,
    lineOpacity: isDark ? 0.15 : 0.1
  }
}

function initParticles() {
  // Calculate responsive particle count
  PARTICLE_COUNT = getParticleCount()
  CONNECTION_DISTANCE = getConnectionDistance()

  // Initialize arrays with correct size
  positions = new Float32Array(PARTICLE_COUNT * 3)
  startPositions = new Float32Array(PARTICLE_COUNT * 3)
  compressedPositions = new Float32Array(PARTICLE_COUNT * 3)
  targetPositions = new Float32Array(PARTICLE_COUNT * 3)
  velocities.length = 0 // Clear existing velocities

  const halfWidth = window.innerWidth / 2
  const halfHeight = window.innerHeight / 2

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2

    // Start positions: spread across 80% of screen
    const startRadius = Math.random() * Math.min(halfWidth, halfHeight) * 0.8
    startPositions[i * 3] = Math.cos(angle) * startRadius * (0.5 + Math.random())
    startPositions[i * 3 + 1] = Math.sin(angle) * startRadius * (0.5 + Math.random())
    startPositions[i * 3 + 2] = (Math.random() - 0.5) * 150

    // Compressed positions: concentrated at center (5% of screen)
    const compressedRadius = Math.random() * 40 + 10
    compressedPositions[i * 3] = Math.cos(angle) * compressedRadius
    compressedPositions[i * 3 + 1] = Math.sin(angle) * compressedRadius
    compressedPositions[i * 3 + 2] = (Math.random() - 0.5) * 30

    // Target positions: spread across entire screen (100%)
    targetPositions[i * 3] = (Math.random() - 0.5) * halfWidth * 1.9
    targetPositions[i * 3 + 1] = (Math.random() - 0.5) * halfHeight * 1.9
    targetPositions[i * 3 + 2] = (Math.random() - 0.5) * 200

    // Initialize current positions to start positions
    positions[i * 3] = startPositions[i * 3]
    positions[i * 3 + 1] = startPositions[i * 3 + 1]
    positions[i * 3 + 2] = startPositions[i * 3 + 2]

    velocities.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * PARTICLE_SPEED,
        (Math.random() - 0.5) * PARTICLE_SPEED,
        (Math.random() - 0.5) * PARTICLE_SPEED * 0.5
      )
    )
  }

  animationStartTime = performance.now()
  phase = 'compressing'
}

function createParticles() {
  const colors = getColors()
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: colors.particle,
    size: 3,
    transparent: true,
    opacity: colors.particleOpacity,
    sizeAttenuation: true
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)
}

function createLines() {
  const colors = getColors()
  const geometry = new THREE.BufferGeometry()
  const material = new THREE.LineBasicMaterial({
    color: colors.line,
    transparent: true,
    opacity: colors.lineOpacity
  })

  lines = new THREE.LineSegments(geometry, material)
  scene.add(lines)
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

function updateParticles() {
  const halfWidth = window.innerWidth / 2
  const halfHeight = window.innerHeight / 2
  const currentTime = performance.now()
  const elapsed = currentTime - animationStartTime

  // Phase transitions based on HeroSection timing
  if (phase === 'compressing' && elapsed >= COMPRESSION_DURATION) {
    phase = 'exploding'
  } else if (phase === 'exploding' && elapsed >= EXPLOSION_START + EXPLOSION_DURATION) {
    phase = 'floating'
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    if (phase === 'compressing') {
      // Compression: 80% -> 5% with easing (no mouse interaction)
      const progress = Math.min(elapsed / COMPRESSION_DURATION, 1)
      const easedProgress = easeInOutCubic(progress)

      positions[i * 3] = startPositions[i * 3] + (compressedPositions[i * 3] - startPositions[i * 3]) * easedProgress
      positions[i * 3 + 1] = startPositions[i * 3 + 1] + (compressedPositions[i * 3 + 1] - startPositions[i * 3 + 1]) * easedProgress
      positions[i * 3 + 2] = startPositions[i * 3 + 2] + (compressedPositions[i * 3 + 2] - startPositions[i * 3 + 2]) * easedProgress
    } else if (phase === 'exploding') {
      // Explosion: 5% -> 100% with exponential easing (no mouse interaction)
      const explosionElapsed = elapsed - EXPLOSION_START
      const progress = Math.min(explosionElapsed / EXPLOSION_DURATION, 1)
      const easedProgress = easeOutExpo(progress)

      positions[i * 3] = compressedPositions[i * 3] + (targetPositions[i * 3] - compressedPositions[i * 3]) * easedProgress
      positions[i * 3 + 1] = compressedPositions[i * 3 + 1] + (targetPositions[i * 3 + 1] - compressedPositions[i * 3 + 1]) * easedProgress
      positions[i * 3 + 2] = compressedPositions[i * 3 + 2] + (targetPositions[i * 3 + 2] - compressedPositions[i * 3 + 2]) * easedProgress
    } else {
      // Floating: gentle organic motion
      // Add small random drift to keep particles moving
      velocities[i].x += (Math.random() - 0.5) * 0.01
      velocities[i].y += (Math.random() - 0.5) * 0.01
      velocities[i].z += (Math.random() - 0.5) * 0.005

      // Damping - slightly less to keep momentum
      velocities[i].multiplyScalar(0.98)

      // Update positions
      positions[i * 3] += velocities[i].x
      positions[i * 3 + 1] += velocities[i].y
      positions[i * 3 + 2] += velocities[i].z

      // Soft boundary - bounce back gently
      const margin = 50
      const bounceStrength = 0.03

      if (positions[i * 3] > halfWidth - margin) {
        velocities[i].x -= bounceStrength
      } else if (positions[i * 3] < -halfWidth + margin) {
        velocities[i].x += bounceStrength
      }

      if (positions[i * 3 + 1] > halfHeight - margin) {
        velocities[i].y -= bounceStrength
      } else if (positions[i * 3 + 1] < -halfHeight + margin) {
        velocities[i].y += bounceStrength
      }

      if (positions[i * 3 + 2] > 100) {
        velocities[i].z -= bounceStrength
      } else if (positions[i * 3 + 2] < -100) {
        velocities[i].z += bounceStrength
      }
    }
  }

  particles.geometry.attributes.position.needsUpdate = true
}

function updateLines() {
  const linePositions: number[] = []

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    for (let j = i + 1; j < PARTICLE_COUNT; j++) {
      const dx = positions[i * 3] - positions[j * 3]
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

      if (distance < CONNECTION_DISTANCE) {
        linePositions.push(
          positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
          positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
        )
      }
    }
  }

  lines.geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(linePositions, 3)
  )
}

function updateColors() {
  const colors = getColors()

  if (particles?.material) {
    const mat = particles.material as THREE.PointsMaterial
    mat.color.setHex(colors.particle)
    mat.opacity = colors.particleOpacity
  }

  if (lines?.material) {
    const mat = lines.material as THREE.LineBasicMaterial
    mat.color.setHex(colors.line)
    mat.opacity = colors.lineOpacity
  }
}

function animate() {
  animationId = requestAnimationFrame(animate)

  updateParticles()
  updateLines()

  renderer.render(scene, camera)
}

function handleResize() {
  if (!canvasRef.value || !renderer || !camera) return

  const width = window.innerWidth
  const height = window.innerHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)
}

function init() {
  if (!canvasRef.value) return

  // Scene
  scene = new THREE.Scene()

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  )
  camera.position.z = 300

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Initialize particles
  initParticles()
  createParticles()
  createLines()

  // Event listeners
  window.addEventListener('resize', handleResize)

  // Start animation
  animate()
}

function dispose() {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)

  if (particles) {
    particles.geometry.dispose()
    ;(particles.material as THREE.Material).dispose()
  }

  if (lines) {
    lines.geometry.dispose()
    ;(lines.material as THREE.Material).dispose()
  }

  if (renderer) {
    renderer.dispose()
  }
}

// Watch for color mode changes
watch(() => colorMode.value, () => {
  updateColors()
})

onMounted(() => {
  init()
})

onUnmounted(() => {
  dispose()
})
</script>
