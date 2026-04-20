"use client";

import { useEffect, useRef } from "react";

export default function Visualizer({ isActive }: { isActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let bars: { height: number; targetHeight: number; hue: number }[] = [];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = 180; // Slightly taller for more presence
      bars = [];
      const barCount = Math.min(Math.floor(window.innerWidth / 6), 200); // Higher resolution
      for (let i = 0; i < barCount; i++) {
        bars.push({
          height: 5,
          targetHeight: 5,
          hue: (i / barCount) * 100 + 260 // Neon purple to cyber blue range
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / bars.length;

      bars.forEach((bar, i) => {
        if (isActive) {
          // Add some organic "noise" to the movement
          const noise = Math.sin(Date.now() * 0.005 + i * 0.1) * 20;
          bar.targetHeight = Math.random() * 80 + 20 + noise;
        } else {
          bar.targetHeight = 5;
        }

        // Smooth interpolation
        bar.height += (bar.targetHeight - bar.height) * 0.15;

        const x = i * barWidth;
        const y = canvas.height - bar.height;

        // Main Bar Gradient
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, y);
        gradient.addColorStop(0, `hsla(${bar.hue}, 100%, 50%, 0.8)`);
        gradient.addColorStop(1, `hsla(${bar.hue}, 100%, 70%, 0.2)`);

        // Add "Glow" shadow effect manually
        ctx.shadowBlur = isActive ? 15 : 0;
        ctx.shadowColor = `hsla(${bar.hue}, 100%, 50%, 0.5)`;

        ctx.fillStyle = gradient;
        // Rounded corners for the bars
        ctx.beginPath();
        const r = 2; // Radius
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + barWidth - 4 - r, y);
        ctx.quadraticCurveTo(x + barWidth - 4, y, x + barWidth - 4, y + r);
        ctx.lineTo(x + barWidth - 4, canvas.height);
        ctx.lineTo(x, canvas.height);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
        
        ctx.shadowBlur = 0; // Reset for next bar performance
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", init);
    init();
    animate();

    return () => {
      window.removeEventListener("resize", init);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive]);

  return (
    <div
      className={`visualizer-container ${isActive ? "active" : ""}`}
      id="visualizerContainer"
      style={{
        maskImage: 'linear-gradient(to top, black 80%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to top, black 80%, transparent 100%)'
      }}
    >
      <canvas ref={canvasRef} id="visualizer"></canvas>
    </div>
  );
}
