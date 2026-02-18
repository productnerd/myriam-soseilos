"use client";

import { pressFeatures } from "@/data/awards";
import { pressLogoMap } from "@/components/ui/BrandLogos";

export function FeaturedInCarousel() {
  const doubledPress = [...pressFeatures, ...pressFeatures];

  return (
    <section className="py-8 border-b border-border overflow-hidden">
      <p className="text-center text-[10px] tracking-[0.3em] uppercase text-muted mb-6">
        As Featured In
      </p>
      <div className="flex items-center animate-scroll-left" style={{ animationDuration: "25s" }}>
        {doubledPress.map((feature, i) => {
          const LogoComponent = pressLogoMap[feature.name];
          return (
            <div
              key={i}
              className="shrink-0 px-10 flex items-center"
            >
              {LogoComponent ? (
                <LogoComponent className="w-auto h-7 text-foreground/30 hover:text-foreground/60 transition-colors" />
              ) : (
                <span className="whitespace-nowrap font-serif text-lg text-foreground/30 hover:text-foreground/60 transition-colors">
                  {feature.name}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
