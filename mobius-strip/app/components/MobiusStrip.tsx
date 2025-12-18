"use client";

import { useEffect, useRef, useState } from "react";

export default function MobiusStrip() {
  const canvasRef = useRef<HTMLPreElement>(null);
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

    const ASCII_CHARS = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
    
    const render = () => {
      const buffer: string[][] = Array(height)
        .fill(null)
        .map(() => Array(width).fill(" "));
      const zBuffer: number[][] = Array(height)
        .fill(null)
        .map(() => Array(width).fill(-Infinity));

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);

      for (let u = 0; u < Math.PI * 2; u += 0.07) {
        for (let v = -0.3; v < 0.3; v += 0.05) {
          const R = 2;
          const r = 0.5;
          
          const x = (R + v * Math.cos(u / 2)) * Math.cos(u);
          const y = (R + v * Math.cos(u / 2)) * Math.sin(u);
          const z = v * Math.sin(u / 2);

          let x1 = x;
          let y1 = cosX * y - sinX * z;
          let z1 = sinX * y + cosX * z;

          let x2 = cosY * x1 + sinY * z1;
          let y2 = y1;
          let z2 = -sinY * x1 + cosY * z1;

          let x3 = cosZ * x2 - sinZ * y2;
          let y3 = sinZ * x2 + cosZ * y2;
          let z3 = z2;

          const scale = 8;
          const distance = 5;
          const perspective = distance / (distance + z3);

          const screenX = Math.floor(width / 2 + x3 * scale * perspective);
          const screenY = Math.floor(height / 2 - y3 * scale * perspective * 0.5);

          if (
            screenX >= 0 &&
            screenX < width &&
            screenY >= 0 &&
            screenY < height
          ) {
            if (z3 > zBuffer[screenY][screenX]) {
              zBuffer[screenY][screenX] = z3;

              const nx = Math.cos(u / 2) * Math.cos(u);
              const ny = Math.cos(u / 2) * Math.sin(u);
              const nz = Math.sin(u / 2);

              const lightX = 0;
              const lightY = 0;
              const lightZ = 1;

              const luminance =
                nx * lightX + ny * lightY + nz * lightZ;
              const brightness = Math.max(0, luminance);

              const charIndex = Math.floor(
                brightness * (ASCII_CHARS.length - 1)
              );
              buffer[screenY][screenX] = ASCII_CHARS[charIndex];
            }
          }
        }
      }

      canvas.textContent = buffer.map((row) => row.join("")).join("\n");

      angleX += 0.02;
      angleY += 0.03;
      angleZ += 0.01;

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
    <pre
      ref={canvasRef}
      className="font-mono text-[10px] leading-[1.2] text-green-400 whitespace-pre"
      style={{
        textShadow: "0 0 5px rgba(74, 222, 128, 0.5)",
      }}
    />
  );
}
