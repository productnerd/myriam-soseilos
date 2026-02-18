"use client";

import { useEffect, useRef } from "react";

export function NebulaBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame: number;
    let start: number | null = null;
    const duration = 80000; // 80s full cycle — very slow

    const target = el;

    function animate(time: number) {
      if (!start) start = time;
      const t = ((time - start) % duration) / duration;

      // Gentle sine-based drifting — larger range for visible movement
      const n1x = 30 + 18 * Math.sin(t * Math.PI * 2);
      const n1y = 25 + 15 * Math.cos(t * Math.PI * 2 * 0.7);
      const n2x = 65 + 15 * Math.cos(t * Math.PI * 2 * 0.9);
      const n2y = 50 + 20 * Math.sin(t * Math.PI * 2 * 0.6);
      const n3x = 50 + 18 * Math.sin(t * Math.PI * 2 * 0.8 + 1);
      const n3y = 70 + 15 * Math.cos(t * Math.PI * 2 * 0.5 + 2);

      target.style.background = `
        radial-gradient(ellipse 60% 50% at ${n1x}% ${n1y}%, rgba(60, 45, 30, 0.6) 0%, transparent 70%),
        radial-gradient(ellipse 55% 60% at ${n2x}% ${n2y}%, rgba(70, 50, 35, 0.5) 0%, transparent 70%),
        radial-gradient(ellipse 50% 45% at ${n3x}% ${n3y}%, rgba(55, 40, 28, 0.55) 0%, transparent 65%)
      `;

      frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
