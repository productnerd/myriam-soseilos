"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { awards } from "@/data/awards";
import { awardLogoMap } from "@/components/ui/BrandLogos";

export function AwardsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">
            Recognition
          </p>
          <h2 className="font-serif text-display-lg">Awards &amp; Accolades</h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map((award, i) => {
            const LogoComponent = awardLogoMap[award.organization];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: 0.3 + i * 0.08,
                }}
                className="flex flex-col items-center text-center p-8 bg-surface border border-border rounded-lg"
              >
                {/* Winner/finalist tag */}
                <span
                  className={`text-[8px] tracking-[0.25em] uppercase px-2 py-0.5 rounded mb-3 ${
                    award.type === "winner"
                      ? "bg-accent/10 text-accent"
                      : "bg-foreground/5 text-muted"
                  }`}
                >
                  {award.type}
                </span>

                {/* Organization logo */}
                <div className="h-12 flex items-center justify-center mb-1">
                  {LogoComponent ? (
                    <LogoComponent className="w-auto h-12 max-w-[200px] text-foreground/50" />
                  ) : (
                    <span className="font-serif text-base text-foreground/50">
                      {award.organization}
                    </span>
                  )}
                </div>

                <span className="text-xl font-serif text-foreground/20 mb-3">
                  {award.year}
                </span>
                <h3 className="font-serif text-lg text-accent/80">
                  {award.title}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
