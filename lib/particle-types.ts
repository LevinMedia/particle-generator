export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  trail: Array<{ x: number; y: number }>
  hue: number
}

export interface GridParticle {
  baseX: number
  baseY: number
  x: number
  y: number
  size: number
}

export interface ParticleConfig {
  count: number
  speed: number
  size: number
  life: number
  gravity: number
  friction: number
  spread: number
  colorHue: number
  colorSaturation: number
  colorLightness: number
  trailLength: number
  explosiveForce: number
  emissionRate: number
  gridDensity: number
  waveAmplitude: number
  waveFrequency: number
  waveSpeed: number
  waveCount: number
  particleColor: string
  backgroundColor: string
  cameraAngle: number
  particleGlow: boolean
  backgroundGradient: string // color2 for gradient
}
