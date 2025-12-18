"use client";

import { useEffect, useRef, useState } from "react";

export default function MobiusStrip() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 80, height: 40 });

  useEffect(() => {
    const updateDimensions = () => {
      const width = Math.floor(Math.min(window.innerWidth / 12, 120));
      const height = Math.floor(Math.min(window.innerHeight / 24, 50));
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = dimensions;
    let animationId: number;
    let angle = 0;
    let colorOffset = 0;

    const ASCII_CHARS = ['█', '▓', '▒', '░', '▪', '·', ' '];

    const hslToRgb = (h: number, s: number, l: number): string => {
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;
      let r: number, g: number, b: number;
      if (h < 60) { r = c; g = x; b = 0; }
      else if (h < 120) { r = x; g = c; b = 0; }
      else if (h < 180) { r = 0; g = c; b = x; }
      else if (h < 240) { r = 0; g = x; b = c; }
      else if (h < 300) { r = x; g = 0; b = c; }
      else { r = c; g = 0; b = x; }
      return `rgb(${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)})`;
    };

    const render = () => {
      const buffer: string[][] = Array(height)
        .fill(null)
        .map(() => Array(width).fill(" "));
      const colorBuffer: string[][] = Array(height)
        .fill(null)
        .map(() => Array(width).fill(""));
      const zBuffer: number[][] = Array(height)
        .fill(null)
        .map(() => Array(width).fill(-Infinity));

      // Clockwise rotation around Y axis (negative angle)
      for (let u = 0; u < Math.PI * 2; u += 0.05) {
        for (let v = -0.5; v < 0.5; v += 0.08) {
          const R = 3;
          const twist = u / 2;

          // Möbius strip parametric equations
          const px = (R + v * Math.cos(twist)) * Math.cos(u);
          const py = (R + v * Math.cos(twist)) * Math.sin(u);
          const pz = v * Math.sin(twist);

          // Clockwise rotation around Y axis (negative angle for clockwise)
          const cosT = Math.cos(-angle);
          const sinT = Math.sin(-angle);
          const rx = px * cosT - pz * sinT;
          const ry = py;
          const rz = px * sinT + pz * cosT;

          // Project to 2D with perspective
          const scale = 8;
          const distance = 10;
          const perspective = distance / (distance + rz);

          const screenX = Math.floor(width / 2 + rx * scale * perspective);
          const screenY = Math.floor(height / 2 - ry * scale * perspective * 0.5);

          if (
            screenX >= 0 &&
            screenX < width &&
            screenY >= 0 &&
            screenY < height
          ) {
            if (rz > zBuffer[screenY][screenX]) {
              zBuffer[screenY][screenX] = rz;

              // Calculate rainbow color based on position along the strip
              // Adding colorOffset creates the rotating rainbow effect
              const hue = ((u / (Math.PI * 2)) * 360 + colorOffset) % 360;
              const brightness = (rz + 4) / 8;
              const saturation = 0.9;
              const lightness = Math.max(0.3, Math.min(0.7, brightness * 0.7));

              colorBuffer[screenY][screenX] = hslToRgb(hue, saturation, lightness);

              // Character based on depth
              const depth = Math.floor((rz + 3.5) * 1.5);
              const charIndex = Math.max(0, Math.min(ASCII_CHARS.length - 1, depth));
              buffer[screenY][screenX] = ASCII_CHARS[charIndex];
            }
          }
        }
      }

      // Convert to HTML with colored spans
      let result = '';
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const char = buffer[y][x];
          const color = colorBuffer[y][x] || 'rgb(100,100,100)';
          result += `<span style="color:${color}">${char}</span>`;
        }
        result += '\n';
      }

      canvas.innerHTML = result;

      angle += 0.04;
      colorOffset += 2; // Rotate the rainbow colors clockwise

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [dimensions]);

  return (
    <div
      ref={canvasRef}
      className="font-mono text-[10px] leading-[1.2] whitespace-pre"
    />
  );
}
