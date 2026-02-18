"use client";

import { awards } from "@/data/awards";

export function AwardsCarousel() {
  const doubled = [...awards, ...awards];

  return (
    <section className="py-10 border-y border-border overflow-hidden">
      <div className="flex animate-scroll-left">
        {doubled.map((award, i) => (
          <div
            key={i}
            className="flex items-center gap-3 whitespace-nowrap px-10"
          >
            <span className="text-[10px] tracking-[0.2em] uppercase text-accent">
              {award.type === "winner" ? "Winner" : "Finalist"}
            </span>
            <span className="w-px h-4 bg-border" />
            <span className="font-serif text-base text-foreground/80">
              {award.title}
            </span>
            <span className="text-xs text-muted">
              {award.organization}, {award.year}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
