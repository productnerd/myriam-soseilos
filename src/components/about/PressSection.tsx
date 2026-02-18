"use client";

import { useRef, useEffect, useState } from "react";
import { pressFeatures } from "@/data/awards";
import { pressLogoMap } from "@/components/ui/BrandLogos";

export function PressSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Clear inline styles after entrance animation so CSS hover works
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setDone(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <section ref={ref} className="py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div
          className="text-center mb-16"
          style={
            done
              ? undefined
              : {
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: "opacity 1s ease-out, transform 1s ease-out",
                }
          }
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">
            Press &amp; Features
          </p>
          <h2 className="font-serif text-display-lg">As Seen In</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {pressFeatures.map((feature, i) => {
            const LogoComponent = pressLogoMap[feature.name];
            return (
              <div
                key={i}
                className="flex flex-col items-center justify-center text-center p-8 bg-surface border border-border rounded-lg min-h-[120px] transition-all duration-300 hover:border-foreground/20 hover:bg-foreground/[0.05] hover:-translate-y-1"
                style={
                  done
                    ? undefined
                    : {
                        opacity: visible ? 1 : 0,
                        transform: visible
                          ? "translateY(0)"
                          : "translateY(24px)",
                        transition: visible
                          ? `opacity 1.2s ease-out ${0.3 + i * 0.1}s, transform 1.2s ease-out ${0.3 + i * 0.1}s`
                          : "none",
                      }
                }
              >
                {LogoComponent ? (
                  <LogoComponent className="w-full max-w-[160px] h-10 text-foreground/60" />
                ) : (
                  <span className="font-serif text-lg text-foreground/60">
                    {feature.name}
                  </span>
                )}
                <span className="mt-3 text-[10px] tracking-[0.2em] uppercase text-muted">
                  {feature.type === "publication"
                    ? "Publication"
                    : feature.type === "retail"
                    ? "Retail Partner"
                    : feature.type === "event"
                    ? "Fashion Week"
                    : "Speaker"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
