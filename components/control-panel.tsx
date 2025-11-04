"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, X, HelpCircle, Link2, Check, Github } from "lucide-react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import type { ParticleConfig } from "@/lib/particle-types"
import { ExportSection } from "./export-section"
import { presets } from "@/lib/presets"

interface ControlPanelProps {
  config: ParticleConfig
  onConfigChange: (config: ParticleConfig) => void
  onMobileClose?: () => void
}

export function ControlPanel({ config, onConfigChange, onMobileClose }: ControlPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [copiedLink, setCopiedLink] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollPositionRef = useRef(0)
  const isInitialMount = useRef(true)

  // Preserve scroll position across re-renders
  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.scrollTop = scrollPositionRef.current
    }
  })

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    scrollPositionRef.current = e.currentTarget.scrollTop
  }

  const toggleSection = (section: string) => {
    const newSections = new Set(expandedSections)
    if (newSections.has(section)) {
      newSections.delete(section)
    } else {
      newSections.add(section)
    }
    setExpandedSections(newSections)
  }

  const updateConfig = (updates: Partial<ParticleConfig>) => {
    onConfigChange({ ...config, ...updates })
  }

  // Load preset by ID
  const loadPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId)
    if (preset) {
      onConfigChange(preset.config)
      // Update URL hash
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `#${presetId}`)
      }
    }
  }

  // Load preset from URL hash on mount
  useEffect(() => {
    if (isInitialMount.current && typeof window !== "undefined") {
      isInitialMount.current = false
      const hash = window.location.hash.slice(1) // Remove the '#'
      if (hash) {
        const preset = presets.find((p) => p.id === hash)
        if (preset) {
          onConfigChange(preset.config)
        }
      }
    }
  }, [])

  // Copy current URL to clipboard
  const copyLink = () => {
    if (typeof window !== "undefined") {
      const currentPreset = presets.find((p) => JSON.stringify(p.config) === JSON.stringify(config))
      const url = currentPreset
        ? `${window.location.origin}${window.location.pathname}#${currentPreset.id}`
        : window.location.href.split("#")[0]
      
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
      })
    }
  }

  const Tooltip = ({ text }: { text: string }) => (
    <div className="group relative inline-flex">
      <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/50 hover:text-muted-foreground cursor-help transition-colors" />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-md shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-normal w-48 z-50 pointer-events-none">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover" />
      </div>
    </div>
  )

  const ControlSection = ({
    title,
    id,
    children,
  }: {
    title: string
    id: string
    children: React.ReactNode
  }) => {
    const isExpanded = expandedSections.has(id)

    return (
      <div className="border-b border-border">
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-4 py-3 flex items-center justify-between bg-muted/30 hover:bg-muted/50 active:bg-muted/70 transition-all duration-150 text-left font-mono text-sm focus-ring button-interactive"
          aria-expanded={isExpanded}
          style={{ minHeight: "48px" }}
        >
          <span className="text-muted-foreground">{title}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
        </button>
        {isExpanded && <div className="px-4 py-3 space-y-3 bg-muted/10 border-t border-border/50">{children}</div>}
      </div>
    )
  }

  const Slider = ({
    label,
    value,
    min,
    max,
    step,
    onChange,
    tooltip,
  }: {
    label: string
    value: number
    min: number
    max: number
    step: number
    onChange: (value: number) => void
    tooltip?: string
  }) => {
    const [localValue, setLocalValue] = useState(value)
    const [isDragging, setIsDragging] = useState(false)

    // Sync local value with prop when not dragging
    useEffect(() => {
      if (!isDragging) {
        setLocalValue(value)
      }
    }, [value, isDragging])

    const displayValue = isDragging ? localValue : value

    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <label className="text-xs font-mono text-muted-foreground uppercase tracking-wide">{label}</label>
          {tooltip && <Tooltip text={tooltip} />}
        </div>
        <div className="relative">
          <div className="flex justify-end mb-1">
            <span className="font-mono text-xs text-accent bg-muted/50 px-2 py-1 rounded whitespace-nowrap">
              {(displayValue ?? 0).toFixed(step < 1 ? 2 : 0)}
            </span>
          </div>
          <SliderPrimitive.Root
            className="relative flex items-center w-full h-11"
            style={{ 
              userSelect: 'none', 
              touchAction: 'none',
              WebkitUserSelect: 'none',
              cursor: 'pointer'
            }}
            value={[displayValue]}
            onValueChange={(values) => {
              setLocalValue(values[0])
            }}
            onPointerDown={() => {
              setIsDragging(true)
            }}
            onPointerUp={() => {
              setIsDragging(false)
              onChange(localValue)
            }}
            onLostPointerCapture={() => {
              setIsDragging(false)
              onChange(localValue)
            }}
            min={min}
            max={max}
            step={step}
          >
            <SliderPrimitive.Track className="bg-muted relative grow rounded-full h-1.5 cursor-pointer">
              <SliderPrimitive.Range className="absolute bg-accent/30 rounded-full h-full" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb 
              className="block w-5 h-5 bg-accent rounded-full shadow-lg hover:bg-accent/80 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 active:scale-125 transition-all"
            />
          </SliderPrimitive.Root>
        </div>
      </div>
    )
  }

  const DirectionControl = ({
    label,
    value,
    onChange,
    tooltip,
  }: {
    label: string
    value: number
    onChange: (value: number) => void
    tooltip?: string
  }) => {
    const [localValue, setLocalValue] = useState(value)
    const [isDragging, setIsDragging] = useState(false)
    const dialRef = useRef<HTMLDivElement>(null)

    // Sync local value with prop when not dragging
    useEffect(() => {
      if (!isDragging) {
        setLocalValue(value)
      }
    }, [value, isDragging])

    const calculateAngle = (clientX: number, clientY: number) => {
      if (!dialRef.current) return value

      const rect = dialRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = clientX - centerX
      const deltaY = clientY - centerY
      
      // Calculate angle in degrees (0 = right, 90 = down, 180 = left, 270 = up)
      let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
      
      // Normalize to 0-360
      if (angle < 0) angle += 360
      
      return Math.round(angle)
    }

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
          setLocalValue(calculateAngle(e.clientX, e.clientY))
        }
      }

      const handleTouchMove = (e: TouchEvent) => {
        if (isDragging) {
          setLocalValue(calculateAngle(e.touches[0].clientX, e.touches[0].clientY))
        }
      }

      const handleEnd = () => {
        if (isDragging) {
          setIsDragging(false)
          onChange(localValue)
        }
      }

      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleEnd)
        document.addEventListener("touchmove", handleTouchMove)
        document.addEventListener("touchend", handleEnd)
      }

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleEnd)
        document.removeEventListener("touchmove", handleTouchMove)
        document.removeEventListener("touchend", handleEnd)
      }
    }, [isDragging, localValue])

    const handleStart = (clientX: number, clientY: number) => {
      setIsDragging(true)
      setLocalValue(calculateAngle(clientX, clientY))
    }

    const displayValue = isDragging ? localValue : value

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wide">{label}</label>
            {tooltip && <Tooltip text={tooltip} />}
          </div>
          <span className="font-mono text-xs text-accent bg-muted/50 px-2 py-1 rounded whitespace-nowrap">
            {displayValue}°
          </span>
        </div>
        <div className="flex justify-center py-2">
          <div
            ref={dialRef}
            onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
            onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
            className="relative w-24 h-24 rounded-full border-2 border-muted bg-muted/20 cursor-pointer hover:border-accent transition-colors"
            style={{ touchAction: 'none', userSelect: 'none' }}
          >
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-accent rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10" />
            
            {/* Line indicator - rotates around center */}
            <div
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${displayValue}deg)`,
              }}
            >
              {/* Line extending from center to edge */}
              <div 
                className="absolute left-0 top-0 h-0.5 bg-accent origin-left"
                style={{ width: '42px', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const ColorPicker = ({
    label,
    value,
    onChange,
    tooltip,
  }: {
    label: string
    value: string
    onChange: (value: string) => void
    tooltip?: string
  }) => {
    const [localValue, setLocalValue] = useState(value)
    const [isSelecting, setIsSelecting] = useState(false)
    const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Sync local value with prop when not selecting
    useEffect(() => {
      if (!isSelecting) {
        setLocalValue(value)
      }
    }, [value, isSelecting])

    const handleColorInput = (newColor: string) => {
      setLocalValue(newColor)
      setIsSelecting(true)
      
      // Clear any pending update
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
      
      // Set a new timeout to update after user stops interacting
      updateTimeoutRef.current = setTimeout(() => {
        onChange(newColor)
        setIsSelecting(false)
      }, 500)
    }

    const displayValue = isSelecting ? localValue : value

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <label className="text-xs font-mono text-muted-foreground uppercase tracking-wide">{label}</label>
          {tooltip && <Tooltip text={tooltip} />}
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={displayValue}
            onInput={(e) => {
              handleColorInput((e.target as HTMLInputElement).value)
            }}
            onChange={(e) => {
              handleColorInput(e.target.value)
            }}
            className="w-12 h-8 rounded border border-border cursor-pointer"
          />
          <input
            type="text"
            value={displayValue.toUpperCase()}
            onChange={(e) => {
              const val = e.target.value
              if (val.match(/^#[0-9A-F]{6}$/i)) {
                onChange(val.toLowerCase())
              }
            }}
            className="font-mono text-xs bg-muted/30 px-2 py-1 rounded border border-border flex-1 focus-ring"
            placeholder="#000000"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm flex items-center justify-between z-10">
        <div className="min-w-0">
          <h1 className="font-mono text-lg text-foreground truncate">particle.generator</h1>
          <p className="text-xs text-muted-foreground mt-1">WebGL Background Generator</p>
        </div>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="lg:hidden px-4 py-3 rounded-lg bg-accent/80 hover:bg-accent/90 active:bg-accent text-accent-foreground border border-accent/50 transition-all duration-200 shadow-lg button-interactive focus-ring flex items-center justify-center"
            aria-label="Close panel"
            style={{
              minHeight: "44px",
            }}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto scrollable">
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex gap-2">
            <button
              onClick={copyLink}
              className="flex-1 px-3 py-2 text-xs font-mono rounded transition-all duration-150 bg-muted/20 hover:bg-muted/40 active:bg-muted/60 border border-border text-foreground button-interactive focus-ring flex items-center justify-center gap-1.5"
              title="Copy link to current preset"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
            <a
              href="https://github.com/LevinMedia/v0-particle-simulator-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 text-xs font-mono rounded transition-all duration-150 bg-muted/20 hover:bg-muted/40 active:bg-muted/60 border border-border text-foreground button-interactive focus-ring flex items-center justify-center gap-1.5"
              title="View on GitHub"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
          
          <div>
            <h2 className="text-xs font-mono uppercase text-muted-foreground mb-2">00. PRESETS</h2>
            <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => {
              const isActive = JSON.stringify(config) === JSON.stringify(preset.config)
              return (
                <button
                  key={preset.name}
                  onClick={() => loadPreset(preset.id)}
                  className={`px-3 py-2 text-xs font-mono rounded transition-all duration-150 text-left button-interactive focus-ring ${
                    isActive
                      ? "bg-accent text-accent-foreground border-2 border-accent font-bold"
                      : "bg-muted/20 hover:bg-muted/40 active:bg-muted/60 border border-border text-foreground"
                  }`}
                  style={{ minHeight: "40px" }}
                >
                  {preset.name}
                </button>
              )
            })}
            </div>
          </div>
        </div>

        <ControlSection title="01. PARTICLES" id="particles">
          <Slider
            label="Particle Size"
            value={config.size}
            min={1}
            max={10}
            step={0.5}
            onChange={(v) => updateConfig({ size: v })}
            tooltip="Controls how large each particle appears"
          />
          
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wide">Particle Color Mode</label>
              <Tooltip text="Choose between solid color or gradient map for particles" />
            </div>
            <select
              value={config.colorMode || "solid"}
              onChange={(e) => updateConfig({ colorMode: e.target.value as "solid" | "gradient" })}
              className="w-full px-3 py-2 bg-muted/30 border border-border rounded text-sm font-mono text-foreground cursor-pointer hover:bg-muted/50 focus-ring"
            >
              <option value="solid">Solid</option>
              <option value="gradient">Gradient Map</option>
            </select>
          </div>

          {config.colorMode === "gradient" ? (
            <>
              <ColorPicker
                label="Peak Color"
                value={config.peakColor}
                onChange={(v) => updateConfig({ peakColor: v })}
                tooltip="Color when particles are at the highest point in the wave"
              />
              <ColorPicker
                label="Trough Color"
                value={config.troughColor}
                onChange={(v) => updateConfig({ troughColor: v })}
                tooltip="Color when particles are at the lowest point in the wave"
              />
            </>
          ) : (
            <ColorPicker
              label="Particle Color"
              value={config.particleColor}
              onChange={(v) => updateConfig({ particleColor: v })}
              tooltip="The color of the particles in the grid"
            />
          )}
          
          <ColorPicker
            label="Background Color"
            value={config.backgroundColor}
            onChange={(v) => updateConfig({ backgroundColor: v })}
            tooltip="The solid color for the background"
          />
          <ColorPicker
            label="Background Gradient"
            value={config.backgroundGradient}
            onChange={(v) => updateConfig({ backgroundGradient: v })}
            tooltip="Creates a gradient from background color to this color"
          />
        </ControlSection>

        <ControlSection title="02. WAVE" id="wave">
          <DirectionControl
            label="Wave Direction"
            value={config.waveDirection}
            onChange={(v) => updateConfig({ waveDirection: v })}
            tooltip="Direction the wave travels through 3D space. 0° = right, 90° = down, 180° = left, 270° = up."
          />
          <Slider
            label="Camera Roll"
            value={config.cameraRoll}
            min={-180}
            max={180}
            step={1}
            onChange={(v) => updateConfig({ cameraRoll: v })}
            tooltip="Rotate the camera around the Z-axis (screen). Creates a rolling effect."
          />
          <Slider
            label="Camera Pitch"
            value={config.cameraPitch}
            min={-90}
            max={90}
            step={1}
            onChange={(v) => updateConfig({ cameraPitch: v })}
            tooltip="Tilt the camera up/down (pitch). View the wave plane from different angles."
          />
          <Slider
            label="Camera Altitude"
            value={config.cameraAltitude}
            min={-1000}
            max={1000}
            step={10}
            onChange={(v) => updateConfig({ cameraAltitude: v })}
            tooltip="Vertical camera position. Negative moves camera down (plane moves up in frame), positive moves camera up (plane moves down)."
          />
          <Slider
            label="Grid Density"
            value={config.gridDensity}
            min={3}
            max={500}
            step={10}
            onChange={(v) => updateConfig({ gridDensity: v })}
            tooltip="How many particles to display. Higher = more particles, denser grid."
          />
          <Slider
            label="Wave Amplitude"
            value={config.waveAmplitude}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) => updateConfig({ waveAmplitude: v })}
            tooltip="How far particles move during the wave. Higher = larger wave motion."
          />
          <Slider
            label="Wave Frequency"
            value={config.waveFrequency}
            min={0.01}
            max={0.5}
            step={0.01}
            onChange={(v) => updateConfig({ waveFrequency: v })}
            tooltip="How many wave peaks appear. Higher = more waves across the screen."
          />
          <Slider
            label="Wave Speed"
            value={config.waveSpeed}
            min={0.1}
            max={5}
            step={0.1}
            onChange={(v) => updateConfig({ waveSpeed: v })}
            tooltip="How fast the waves move. Higher = faster animation."
          />
          <Slider
            label="Wave Count"
            value={config.waveCount}
            min={1}
            max={5}
            step={1}
            onChange={(v) => updateConfig({ waveCount: v })}
            tooltip="Number of overlapping wave patterns. Higher = more complex motion."
          />
        </ControlSection>

        <ControlSection title="03. EXPORT" id="export">
          <ExportSection config={config} />
        </ControlSection>
      </div>
    </div>
  )
}
