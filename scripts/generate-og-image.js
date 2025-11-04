const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const width = 1200;
const height = 630;

const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Background gradient
const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
bgGradient.addColorStop(0, '#0a0a0a');
bgGradient.addColorStop(1, '#1a1a2e');
ctx.fillStyle = bgGradient;
ctx.fillRect(0, 0, width, height);

// Particle gradient
const particleGradient = ctx.createLinearGradient(0, 0, width, height);
particleGradient.addColorStop(0, '#00ffff');
particleGradient.addColorStop(1, '#ff00ff');

// Draw particles in a grid pattern
ctx.fillStyle = particleGradient;
ctx.globalAlpha = 0.8;

for (let i = 0; i < 20; i++) {
  for (let j = 0; j < 12; j++) {
    const x = 100 + i * 50;
    const y = 100 + j * 35;
    const offset = Math.sin(i * 0.5 + j * 0.3) * 15;
    
    ctx.beginPath();
    ctx.arc(x, y + offset, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Draw wave pattern
ctx.strokeStyle = particleGradient;
ctx.globalAlpha = 0.6;
ctx.lineWidth = 2;

ctx.beginPath();
ctx.moveTo(0, 400);
for (let x = 0; x <= width; x += 10) {
  const y = 400 + Math.sin(x * 0.01) * 20;
  ctx.lineTo(x, y);
}
ctx.stroke();

ctx.globalAlpha = 0.4;
ctx.beginPath();
ctx.moveTo(0, 450);
for (let x = 0; x <= width; x += 10) {
  const y = 450 + Math.sin(x * 0.01 + Math.PI * 0.5) * 20;
  ctx.lineTo(x, y);
}
ctx.stroke();

// Title
ctx.globalAlpha = 1;
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 72px system-ui, -apple-system, sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('particle.generator', width / 2, 280);

// Subtitle
ctx.fillStyle = '#cccccc';
ctx.font = '32px system-ui, -apple-system, sans-serif';
ctx.fillText('Interactive 3D Particle Wave Generator', width / 2, 340);

// Save the image with compression
const buffer = canvas.toBuffer('image/png', { compressionLevel: 9 });
const outputPath = path.join(__dirname, '../public/og-image.png');
fs.writeFileSync(outputPath, buffer);
console.log('OG image PNG created at:', outputPath);

// Check file size
const stats = fs.statSync(outputPath);
const fileSizeKB = (stats.size / 1024).toFixed(2);
console.log(`File size: ${fileSizeKB} KB`);
