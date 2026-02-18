"use client";

import { motion } from "framer-motion";
import { BespokePieceData } from "@/data/bespoke";
import { Media } from "@/components/ui/Media";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

type Props = {
  piece: BespokePieceData;
  isLast: boolean;
  index: number;
};

export function BespokePiece({ piece, isLast, index }: Props) {
  // First piece gets extra delay so it appears after the header
  const baseDelay = index === 0 ? 0.6 : 0;

  return (
    <div className={`py-20 md:py-28 ${!isLast ? "border-b border-border" : ""}`}>
      {/* Title + subtitle */}
      <AnimatedSection delay={baseDelay}>
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted mb-3">
          {piece.subtitle}
        </p>
        <h2 className="font-serif text-display-md">{piece.title}</h2>
      </AnimatedSection>

      {/* Metadata bar */}
      <AnimatedSection delay={baseDelay + 0.1} className="mt-6">
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <div>
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted">Year</span>
            <p className="text-foreground/70 mt-1">{piece.year}</p>
          </div>
          <div>
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted">Duration</span>
            <p className="text-foreground/70 mt-1">{piece.duration}</p>
          </div>
          <div>
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted">Materials</span>
            <p className="text-foreground/70 mt-1">{piece.materials.join(", ")}</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Two-column story */}
      <AnimatedSection delay={baseDelay + 0.2} className="mt-8">
        <div className="md:columns-2 gap-10 text-foreground/60 leading-relaxed">
          {piece.story}
        </div>
      </AnimatedSection>

      {/* Media grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={`grid gap-4 mt-12 ${
          piece.media.length === 3
            ? "grid-cols-1 md:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {piece.media.map((item, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="relative aspect-[4/3] overflow-hidden bg-surface rounded-lg"
          >
            <Media item={item} sizes="(max-width: 768px) 100vw, 50vw" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
