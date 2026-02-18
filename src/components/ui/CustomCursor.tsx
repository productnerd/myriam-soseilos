"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let hasMoved = false;

    const onMove = (e: MouseEvent) => {
      if (!hasMoved) {
        hasMoved = true;
        cursor.style.opacity = "1";
      }
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;

      // Check what element is under the cursor to detect light backgrounds
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        const bg = window.getComputedStyle(el).backgroundColor;
        const match = bg.match(/\d+/g);
        if (match && match.length >= 3) {
          const r = parseInt(match[0]);
          const g = parseInt(match[1]);
          const b = parseInt(match[2]);
          // Relative luminance approximation
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          if (luminance > 0.5) {
            cursor.classList.add("on-light");
          } else {
            cursor.classList.remove("on-light");
          }
        }
      }
    };

    const onDown = () => cursor.classList.add("active");
    const onUp = () => cursor.classList.remove("active");

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor hidden md:block"
      style={{ opacity: 0 }}
    />
  );
}
