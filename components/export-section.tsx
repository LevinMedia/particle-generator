"use client"

import { useState } from "react"
import { Copy, Download } from "lucide-react"
import type { ParticleConfig } from "@/lib/particle-types"

interface ExportSectionProps {
  config: ParticleConfig
}

export function ExportSection({ config }: ExportSectionProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const componentCode = `'use client';

import { useEffect, useRef } from 'react';
import { ParticleEngine } from '@/lib/particle-engine';
import type { ParticleConfig } from '@/lib/particle-types';

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ParticleEngine | null>(null);

  const config: ParticleConfig = {
    size: ${config.size},
    gridDensity: ${config.gridDensity},
    waveAmplitude: ${config.waveAmplitude},
    waveFrequency: ${config.waveFrequency},
    waveSpeed: ${config.waveSpeed},
    waveCount: ${config.waveCount},
    waveDirection: ${config.waveDirection},
    cameraRoll: ${config.cameraRoll},
    cameraPitch: ${config.cameraPitch},
    cameraAltitude: ${config.cameraAltitude},
    colorMode: "${config.colorMode}",
    particleColor: "${config.particleColor}",
    peakColor: "${config.peakColor}",
    troughColor: "${config.troughColor}",
    backgroundColor: "${config.backgroundColor}",
    backgroundGradient: "${config.backgroundGradient}",
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    if (!engineRef.current) {
      engineRef.current = new ParticleEngine(ctx, canvas);
    }

    engineRef.current.updateConfig(config);
    const isGridMode = config.waveAmplitude > 0 && config.gridDensity > 0;
    engineRef.current.setGridMode(isGridMode);

    let animationFrameId: number;
    const animate = () => {
      engineRef.current?.update();
      engineRef.current?.draw();
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full absolute inset-0"
      style={{
        background: config.backgroundColor,
        pointerEvents: "none",
        transform: "scale(1.5)",
        transformOrigin: "center center",
      }}
    />
  );
}`

  const configCode = `// particle.config.ts - Current configuration
export const particleConfig = {
  size: ${config.size},
  gridDensity: ${config.gridDensity},
  waveAmplitude: ${config.waveAmplitude},
  waveFrequency: ${config.waveFrequency},
  waveSpeed: ${config.waveSpeed},
  waveCount: ${config.waveCount},
  waveDirection: ${config.waveDirection},
  cameraRoll: ${config.cameraRoll},
  cameraPitch: ${config.cameraPitch},
  cameraAltitude: ${config.cameraAltitude},
  colorMode: "${config.colorMode}",
  particleColor: "${config.particleColor}",
  peakColor: "${config.peakColor}",
  troughColor: "${config.troughColor}",
  backgroundColor: "${config.backgroundColor}",
  backgroundGradient: "${config.backgroundGradient}",
} as const;`

  const usageCode = `// Usage in your Next.js app
import { ParticleBackground } from '@/components/particle-background';

export default function Page() {
  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0">
        <ParticleBackground />
      </div>
      {/* Your content here */}
      <div className="relative z-10">
        {/* Content */}
      </div>
    </div>
  );
}`

  const ExportBox = ({
    title,
    code,
    type,
  }: {
    title: string
    code: string
    type: string
  }) => (
    <div className="space-y-2 p-3 bg-muted/10 rounded border border-border/50">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono text-muted-foreground uppercase truncate">{title}</span>
        <button
          onClick={() => copyToClipboard(code, type)}
          className="p-1.5 hover:bg-muted/30 active:bg-muted/50 rounded transition-all duration-150 flex-shrink-0 button-interactive focus-ring"
          aria-label={`Copy ${title}`}
          style={{ minHeight: "32px", minWidth: "32px" }}
        >
          <Copy className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
        </button>
      </div>
      <pre className="text-[10px] p-2 bg-background rounded border border-border/30 overflow-x-auto max-h-32 overflow-y-auto text-muted-foreground scrollable">
        <code>{code}</code>
      </pre>
      {copied === type && <div className="text-xs text-accent font-mono">Copied!</div>}
    </div>
  )

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-xs font-mono uppercase text-foreground">Export Code</h3>
        <p className="text-xs text-muted-foreground">Copy these snippets to your project</p>
      </div>

      <ExportBox title="Configuration Object" code={configCode} type="config" />
      <ExportBox title="Component Code" code={componentCode} type="component" />
      <ExportBox title="Usage Example" code={usageCode} type="usage" />

      <a
        href="#"
        className="flex items-center justify-center gap-2 px-3 py-2 bg-accent/20 hover:bg-accent/30 active:bg-accent/40 text-accent text-xs font-mono border border-accent/30 rounded transition-all duration-150 w-full button-interactive focus-ring"
        style={{ minHeight: "40px" }}
      >
        <Download className="w-3.5 h-3.5" />
        Download All Files
      </a>
    </div>
  )
}
