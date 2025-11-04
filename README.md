# WebGL Background Generator

An interactive 3D particle wave generator with real-time rendering and camera controls. Create stunning animated backgrounds with flowing wave patterns and export them for use in your projects.

## Features

- **True 3D Wave Simulation** - Particles move through 3D space with realistic wave propagation
- **Advanced Camera Controls** - Roll, pitch, and altitude adjustments for any viewing angle
- **Gradient Color Mapping** - Dynamic colors based on wave height (peak to trough)
- **6 Beautiful Presets** - Instantly load curated configurations
- **Real-time Preview** - See changes instantly as you adjust controls
- **Mobile-First Design** - Fully responsive with collapsible control panels
- **Export Functionality** - Copy complete configuration and component code
- **Optimized Performance** - Pre-computed color lookup tables for smooth rendering at high densities

## Presets

### Default
Dense particle grid with high amplitude waves, slow movement, and elevated camera view. Perfect for subtle, meditative backgrounds.

### Party Wave
Dramatic camera angles with gradient colors flowing through complex wave patterns. High-energy visual with cyan-to-magenta gradient.

### Ocean Depths
Deep underwater aesthetic with cyan-to-blue gradients, extreme camera roll, and slow, complex waves. Immersive 3D perspective.

### Neon Tsunami
Bold hot pink/purple color scheme with large particles and high aerial view. Vibrant and eye-catching with dual wave layers.

### Ripple
Nearly top-down view with white-to-gray gradient creating concentric ripple effects. Multiple overlapping wave layers for zen-like patterns.

### Aurora
Green-to-purple gradient with high-frequency waves mimicking northern lights. Dense particles with slow, flowing motion.

## Configuration Parameters

### Particles
- **Particle Size** (1-10) - Visual size of each particle
- **Particle Color Mode** - Solid or Gradient Map
- **Particle Color** - Base color (solid mode)
- **Peak Color** - Color at wave peaks (gradient mode)
- **Trough Color** - Color at wave troughs (gradient mode)
- **Background Color** - Solid background color
- **Background Gradient** - Gradient endpoint color

### Wave Properties
- **Wave Direction** (0-360°) - Direction of wave propagation through 3D space
- **Grid Density** (3-500) - Number of particles in the grid
- **Wave Amplitude** (0-1+) - Height of the waves in 3D space
- **Wave Frequency** (0.01-0.5) - Number of wave peaks across the grid
- **Wave Speed** (0.1-5) - Animation speed
- **Wave Count** (1-5) - Number of overlapping wave layers

### Camera Controls
- **Camera Roll** (-180° to 180°) - Rotation around the viewing axis
- **Camera Pitch** (-90° to 90°) - Tilt angle (overhead to side view)
- **Camera Altitude** (-1000 to 1000) - Vertical camera position for framing

## Usage

### Quick Start
1. Load a preset to start with a curated configuration
2. Adjust individual controls to fine-tune the effect
3. Export the configuration when satisfied

### Custom Configuration
1. Open the control panel sections (Particles, Wave)
2. Adjust sliders and color pickers in real-time
3. Use camera controls to find the perfect viewing angle
4. Copy the exported code to your project

### Integration Guide

1. Copy the configuration from the Export section
2. Use the provided component code in your Next.js project
3. Customize colors and parameters as needed

Example integration:

\`\`\`tsx
import { ParticleCanvas } from '@/components/particle-canvas';

export default function Page() {
  const config = {
    size: 1,
    gridDensity: 233,
    waveAmplitude: 0.95,
    waveFrequency: 0.01,
    waveSpeed: 0.1,
    waveCount: 1,
    waveDirection: 229,
    cameraRoll: 0,
    cameraPitch: -6,
    cameraAltitude: 240,
    colorMode: "solid",
    particleColor: "#ff00ff",
    peakColor: "#00ffff",
    troughColor: "#ff00ff",
    backgroundColor: "#0a0a0a",
    backgroundGradient: "#1a1a2e",
  };

  return (
    <div className="relative w-full h-screen">
      <ParticleCanvas config={config} />
      <div className="relative z-10">
        {/* Your content here */}
      </div>
    </div>
  );
}
\`\`\`

## Performance Tips

- **Grid Density**: Start with 100-150 for good performance, up to 500 for powerful devices
- **Gradient Mode**: Uses optimized lookup tables, performs well even with high particle counts
- **Wave Count**: Multiple wave layers (3-5) add complexity; use fewer for better performance
- **Camera Altitude**: Higher altitude values may improve performance slightly

## Technical Details

### 3D Wave System
- Waves propagate through a 2D plane in 3D space
- Wave direction controls the flow pattern across the grid
- Z-axis displacement creates the wave height
- Perspective projection converts 3D coordinates to 2D canvas

### Color Mapping
- Gradient colors interpolate based on Z-displacement (wave height)
- Pre-computed 256-color lookup table for optimal performance
- Real-time color changes without performance impact

### Camera System
- Roll: Rotates view around Z-axis (screen)
- Pitch: Rotates around X-axis (tilt up/down)
- Altitude: Vertical viewport offset for framing
- All transformations applied before 2D projection

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All modern mobile browsers with Canvas 2D support

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Canvas 2D API
- Radix UI (sliders)
