"use client";

import { motion } from "framer-motion";
import { siteContent } from "@/data/siteContent";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function SustainabilitySection() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection className="mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">
            Our Commitment
          </p>
          <h2 className="font-serif text-display-lg">
            Ethical &amp; Sustainable
          </h2>
          <p className="mt-6 text-foreground/50 leading-relaxed">
            {siteContent.about.sustainability.intro}
          </p>
        </AnimatedSection>

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {siteContent.about.sustainability.points.map((point, i) => (
            <motion.li
              key={i}
              variants={fadeUp}
              className="flex gap-3 items-baseline"
            >
              <span className="text-accent text-xs shrink-0">&#x2022;</span>
              <p className="text-sm text-foreground/60 leading-relaxed">
                {point}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
