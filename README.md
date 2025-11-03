# WebGL Particle Simulator

An interactive particle background configurator with real-time WebGL rendering. Create custom particle effects and export them for use in your projects.

## Features

- **Real-time particle physics** - Gravity, friction, and velocity simulation
- **Visual customization** - Hue, saturation, lightness, and trail effects
- **Preset configurations** - 6 built-in styles (Drift, Burst, Rain, Cosmic, Ember, Void)
- **Mobile-first design** - Fully responsive with collapsible controls
- **Export functionality** - Copy configuration and component code
- **Modern UI** - Dark utilitarian aesthetic with mono fonts

## Configuration Parameters

### Emission
- **Particle Count** (10-500) - Total particles in simulation
- **Emission Rate** (0.1-1) - Particles spawned per frame
- **Particle Size** (0.5-8) - Base particle radius
- **Particle Life** (20-300) - Frames until particle dies

### Physics
- **Speed** (0.1-5) - Initial velocity magnitude
- **Gravity** (0-0.5) - Downward acceleration
- **Friction** (0.9-0.99) - Velocity damping
- **Explosive Force** (0.5-15) - Upward velocity multiplier
- **Spread** (0.5-10) - Emission angle variance

### Visuals
- **Hue** (0-360) - Color tone
- **Saturation** (0-100) - Color intensity
- **Lightness** (20-80) - Color brightness
- **Trail Length** (0-40) - Motion trail frames

## Usage

### Option 1: Use the Simulator
1. Open the app and configure particles in real-time
2. Click "Export Config" to copy the configuration
3. Paste into your project

### Option 2: Copy Component
1. Configure your effect
2. Click "Show Code" under the Export section
3. Copy the component code directly

### Option 3: Use Presets
1. Click any preset button (Drift, Burst, Rain, etc.)
2. Fine-tune as needed
3. Export when satisfied

## Integration Guide

1. Copy `particle-engine.ts` and `particle-types.ts` to your `lib/` folder
2. Copy `particle-canvas.tsx` to your `components/` folder
3. Create a new component or page:

\`\`\`tsx
import { ParticleCanvas } from '@/components/particle-canvas';

export default function Background() {
  const config = {
    count: 150,
    speed: 1,
    // ... rest of config
  };

  return (
    <div className="relative w-full h-screen">
      <ParticleCanvas config={config} />
      {/* Your content here */}
    </div>
  );
}
\`\`\`

## Performance Tips

- Lower particle count for older devices (target 60fps)
- Reduce trail length for better performance
- Use the Drift preset for minimal impact
- Test on mobile before deploying

## Customization

The engine supports any HSL color and physical properties. Experiment with:
- Negative gravity for floating effects
- High friction values for slow, controlled motion
- Low spread values for directional effects
- Trail effects for motion blur

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with Canvas 2D support
