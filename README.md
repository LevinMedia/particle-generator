# WebGL Background Generator

**[🌐 Live Demo](https://particle-generator.vercel.app)** 

An interactive 3D particle wave generator with real-time rendering and camera controls. Create stunning animated backgrounds with flowing wave patterns and export them for use in your projects.

**Want to use it in your own project? Easy!** 
- Ask your AI assistant of choice to clone this repo into your project, and add it to background of any page or component you'd like.
- Vist the live demo linked above and create something you like. Copy the output in **Export > Configuration object** and feed that to your agent. They'll figure out what to do.

**Here's a prompt to get you started**

```
git clone https://github.com/LevinMedia/particle-generator.git into my project 
I want to use it in the background of [insert page / component name] Lets start with the party wave preset:
// particle.config.ts - Current configuration
export const particleConfig = {
  size: 1,
  gridDensity: 143,
  waveAmplitude: 1,
  waveFrequency: 0.5,
  waveSpeed: 0.1,
  waveCount: 3,
  waveDirection: 220,
  cameraRoll: -8,
  cameraPitch: -72,
  cameraAltitude: 1000,
  colorMode: "gradient",
  particleColor: "#ff00ff",
  peakColor: "#00ffff",
  troughColor: "#ff00ff",
  backgroundColor: "#0a0a0a",
  backgroundGradient: "#1a1a2e",
} as const;
```
It's totally extensible from there. In [my own implementation](https://portfolio.levinmedia.com) I hooked up the colors to my site's theme system so it updates based on selected theme colors, and works in both light & dark mode. 

**** 

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
