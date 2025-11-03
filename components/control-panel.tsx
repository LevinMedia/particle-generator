"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, X } from "lucide-react"
import type { ParticleConfig } from "@/lib/particle-types"
import { ExportSection } from "./export-section"

interface ControlPanelProps {
  config: ParticleConfig
  onConfigChange: (config: ParticleConfig) => void
  onMobileClose?: () => void
}

export function ControlPanel({ config, onConfigChange, onMobileClose }: ControlPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["wave"]))

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
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/30 active:bg-muted/50 transition-all duration-150 text-left font-mono text-sm focus-ring button-interactive"
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
  }: {
    label: string
    value: number
    min: number
    max: number
    step: number
    onChange: (value: number) => void
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-mono text-muted-foreground uppercase tracking-wide">{label}</label>
        <span className="font-mono text-xs text-accent bg-muted/50 px-2 py-1 rounded whitespace-nowrap">
          {(value ?? 0).toFixed(step < 1 ? 2 : 0)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value ?? 0}
        onChange={(e) => onChange(Number.parseFloat(e.target.value))}
        className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer slider focus-ring"
        style={{ minHeight: "32px" }}
      />
    </div>
  )

  const ColorPicker = ({
    label,
    value,
    onChange,
  }: {
    label: string
    value: string
    onChange: (value: string) => void
  }) => (
    <div className="space-y-2">
      <label className="text-xs font-mono text-muted-foreground uppercase tracking-wide">{label}</label>
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 rounded border border-border cursor-pointer"
        />
        <input
          type="text"
          value={value.toUpperCase()}
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

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm flex items-center justify-between z-10">
        <div className="min-w-0">
          <h1 className="font-mono text-lg text-foreground truncate">particle.config</h1>
          <p className="text-xs text-muted-foreground mt-1">WebGL Background Simulator</p>
        </div>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="lg:hidden p-2 hover:bg-muted/30 active:bg-muted/50 rounded transition-all duration-150 flex-shrink-0 button-interactive focus-ring"
            aria-label="Close panel"
            style={{ minHeight: "44px", minWidth: "44px" }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollable">
        <ControlSection title="00. COLORS" id="colors">
          <ColorPicker
            label="Background Color"
            value={config.backgroundColor}
            onChange={(v) => updateConfig({ backgroundColor: v })}
          />
          <ColorPicker
            label="Background Gradient"
            value={config.backgroundGradient}
            onChange={(v) => updateConfig({ backgroundGradient: v })}
          />
          <ColorPicker
            label="Particle Color"
            value={config.particleColor}
            onChange={(v) => updateConfig({ particleColor: v })}
          />
        </ControlSection>

        <ControlSection title="01. WAVE" id="wave">
          <Slider
            label="Grid Density"
            value={config.gridDensity}
            min={3}
            max={1000}
            step={10}
            onChange={(v) => updateConfig({ gridDensity: v })}
          />
          <Slider
            label="Wave Amplitude"
            value={config.waveAmplitude}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) => updateConfig({ waveAmplitude: v })}
          />
          <Slider
            label="Wave Frequency"
            value={config.waveFrequency}
            min={0.01}
            max={0.5}
            step={0.01}
            onChange={(v) => updateConfig({ waveFrequency: v })}
          />
          <Slider
            label="Wave Speed"
            value={config.waveSpeed}
            min={0.1}
            max={5}
            step={0.1}
            onChange={(v) => updateConfig({ waveSpeed: v })}
          />
          <Slider
            label="Wave Count"
            value={config.waveCount}
            min={1}
            max={5}
            step={1}
            onChange={(v) => updateConfig({ waveCount: v })}
          />
          <label className="flex items-center gap-2 px-2 py-2 hover:bg-muted/20 rounded cursor-pointer">
            <input
              type="checkbox"
              checked={config.particleGlow}
              onChange={(e) => updateConfig({ particleGlow: e.target.checked })}
              className="w-4 h-4 rounded cursor-pointer"
            />
            <span className="text-xs font-mono text-muted-foreground">Particle Glow</span>
          </label>
        </ControlSection>

        <div className="p-4 border-t border-border">
          <ExportSection config={config} />
        </div>
      </div>
    </div>
  )
}
