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
    let angleX = 0;
    let angleY = 0;
    let angleZ = 0;
    let colorOffset = 0;

    const render = () => {
      const buffer: { char: string; hue: number }[][] = Array(height)
        .fill(null)
        .map(() => Array(width).fill(null).map(() => ({ char: " ", hue: 0 })));
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

              const charIndex = Math.floor(
                brightness * (ASCII_CHARS.length - 1)
              );
              
              const hue = ((u / (Math.PI * 2)) * 360 + colorOffset) % 360;
              
              buffer[screenY][screenX] = {
                char: ASCII_CHARS[charIndex],
                hue: hue
              };
            }
          }
        }
      }

      const html = buffer.map((row) => 
        '<div style="height: 1.2em; line-height: 1.2;">' +
        row.map(cell => {
          if (cell.char === " ") {
            return '<span> </span>';
          }
          const saturation = 100;
          const lightness = 60;
          return `<span style="color: hsl(${cell.hue}, ${saturation}%, ${lightness}%); text-shadow: 0 0 10px hsla(${cell.hue}, ${saturation}%, ${lightness}%, 0.8);">${cell.char}</span>`;
        }).join('') +
        '</div>'
      ).join('');

      canvas.innerHTML = html;

      angleX += 0.02;
      angleY += 0.03;
      angleZ += 0.01;
      colorOffset += 2;

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
