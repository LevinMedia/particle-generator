import type { Particle, ParticleConfig, GridParticle } from "./particle-types"

export class ParticleEngine {
  particles: Particle[] = []
  gridParticles: GridParticle[] = []
  config: ParticleConfig
  emissionCounter = 0
  private lastFrameTime = 0
  private fps = 0
  private time = 0
  private useGridMode = false

  constructor(
    private ctx: CanvasRenderingContext2D,
    private canvas: HTMLCanvasElement,
  ) {
    this.config = {
      count: 150,
      speed: 1,
      size: 2,
      life: 100,
      gravity: 0.1,
      friction: 0.98,
      spread: 2,
      colorHue: 0,
      colorSaturation: 100,
      colorLightness: 50,
      trailLength: 15,
      explosiveForce: 5,
      emissionRate: 0.3,
      gridDensity: 15,
      waveAmplitude: 0.25,
      waveFrequency: 0.05,
      waveSpeed: 1.2,
      waveCount: 3,
      particleColor: "#82ccdd",
      backgroundColor: "#0a3d62",
      cameraAngle: 30,
      particleGlow: true,
      backgroundGradient: "#3c6382",
    }
    this.initializeGrid()
  }

  private initializeGrid() {
    this.gridParticles = []
    const density = Math.max(3, this.config.gridDensity)
    const cellWidth = this.canvas.width / density
    const cellHeight = this.canvas.height / density

    for (let y = 0; y < density; y++) {
      for (let x = 0; x < density; x++) {
        this.gridParticles.push({
          baseX: x * cellWidth + cellWidth / 2,
          baseY: y * cellHeight + cellHeight / 2,
          x: x * cellWidth + cellWidth / 2,
          y: y * cellHeight + cellHeight / 2,
          size: 2,
        })
      }
    }
    this.useGridMode = true
  }

  private updateGridParticles() {
    this.time += this.config.waveSpeed * 0.01

    for (const p of this.gridParticles) {
      let offsetY = 0

      // Combine multiple sine waves for natural motion
      for (let i = 0; i < this.config.waveCount; i++) {
        const waveLength = (this.canvas.width / (this.config.waveCount - i)) * 0.5
        offsetY +=
          Math.sin((p.baseX / waveLength + this.time) * Math.PI * 2) * this.config.waveAmplitude * (1 - i * 0.2)
      }

      p.y = p.baseY + offsetY * 50 // Scale amplitude for visibility
    }
  }

  emit() {
    const spreadRadians = this.config.spread * (Math.PI / 180)
    const baseAngle = Math.random() * Math.PI * 2

    const count = Math.max(1, Math.floor(this.config.emissionRate * 10))
    for (let i = 0; i < count; i++) {
      const angle = baseAngle + (Math.random() - 0.5) * spreadRadians
      const speed = this.config.speed * (0.5 + Math.random() * 1.5)
      const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed * this.config.explosiveForce,
      }

      this.particles.push({
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        vx: velocity.x,
        vy: velocity.y,
        life: this.config.life,
        maxLife: this.config.life,
        size: this.config.size * (0.5 + Math.random() * 1.5),
        trail: [],
        hue: this.config.colorHue + (Math.random() - 0.5) * 30,
      })
    }
  }

  update() {
    if (this.useGridMode) {
      this.updateGridParticles()
    } else {
      this.emit()

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i]

        if (this.config.trailLength > 0) {
          p.trail.push({ x: p.x, y: p.y })
          if (p.trail.length > this.config.trailLength) {
            p.trail.shift()
          }
        }

        p.vy += this.config.gravity
        p.vx *= this.config.friction
        p.vy *= this.config.friction

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > 0.01) {
          p.vx *= 0.995
          p.vy *= 0.995
        }

        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = this.canvas.width
        if (p.x > this.canvas.width) p.x = 0
        if (p.y < 0) p.y = this.canvas.height
        if (p.y > this.canvas.height) p.y = 0

        p.life--
        if (p.life <= 0) {
          this.particles.splice(i, 1)
        }
      }
    }
  }

  private hexToHsla(hex: string, alpha = 1) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return `hsla(0, 100%, 50%, ${alpha})`

    const r = Number.parseInt(result[1], 16) / 255
    const g = Number.parseInt(result[2], 16) / 255
    const b = Number.parseInt(result[3], 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
      s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return `hsla(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, ${alpha})`
  }

  draw() {
    if (this.useGridMode) {
      const bgGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height)
      bgGradient.addColorStop(0, this.config.backgroundColor)
      bgGradient.addColorStop(1, this.config.backgroundGradient)
      this.ctx.fillStyle = bgGradient
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

      // Draw grid particles with wave motion
      const particleHsla = this.hexToHsla(this.config.particleColor, 0.8)
      const glowHsla = this.hexToHsla(this.config.particleColor, 0.3)

      for (const p of this.gridParticles) {
        this.ctx.fillStyle = particleHsla
        this.ctx.beginPath()
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        this.ctx.fill()

        if (this.config.particleGlow) {
          const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
          gradient.addColorStop(0, glowHsla)
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
          this.ctx.fillStyle = gradient
          this.ctx.beginPath()
          this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
          this.ctx.fill()
        }
      }
    } else {
      this.ctx.fillStyle = "rgba(15, 23, 42, 0.05)"
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

      for (const p of this.particles) {
        const alpha = p.life / p.maxLife

        if (p.trail.length > 1 && this.config.trailLength > 0) {
          this.ctx.strokeStyle = `hsla(${p.hue}, ${this.config.colorSaturation}%, ${this.config.colorLightness}%, ${alpha * 0.4})`
          this.ctx.lineWidth = p.size * 0.5
          this.ctx.lineCap = "round"
          this.ctx.lineJoin = "round"
          this.ctx.beginPath()
          this.ctx.moveTo(p.trail[0].x, p.trail[0].y)
          for (let i = 1; i < p.trail.length; i++) {
            this.ctx.lineTo(p.trail[i].x, p.trail[i].y)
          }
          this.ctx.stroke()
        }

        this.ctx.fillStyle = `hsla(${p.hue}, ${this.config.colorSaturation}%, ${this.config.colorLightness}%, ${alpha})`
        this.ctx.beginPath()
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        this.ctx.fill()

        if (p.size > 1.5) {
          const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2)
          gradient.addColorStop(
            0,
            `hsla(${p.hue}, ${this.config.colorSaturation}%, ${this.config.colorLightness}%, ${alpha * 0.3})`,
          )
          gradient.addColorStop(1, `hsla(${p.hue}, ${this.config.colorSaturation}%, ${this.config.colorLightness}%, 0)`)
          this.ctx.fillStyle = gradient
          this.ctx.beginPath()
          this.ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
          this.ctx.fill()
        }
      }
    }
  }

  setGridMode(enabled: boolean) {
    if (enabled && !this.useGridMode) {
      this.useGridMode = true
      this.initializeGrid()
    } else if (!enabled && this.useGridMode) {
      this.useGridMode = false
      this.particles = []
    }
  }
}
