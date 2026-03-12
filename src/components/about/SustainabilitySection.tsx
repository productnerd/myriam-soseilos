"use client";

import { motion } from "framer-motion";
import { siteContent } from "@/data/siteContent";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const bentoItems = [
  {
    title: "Recycled Metals",
    description: siteContent.about.sustainability.points[0],
    icon: "♻️",
    span: "md:col-span-2",
  },
  {
    title: "Conflict-Free Diamonds",
    description: siteContent.about.sustainability.points[1],
    icon: "💎",
    span: "",
  },
  {
    title: "Lab-Created Gems",
    description: siteContent.about.sustainability.points[2],
    icon: "🔬",
    span: "",
  },
  {
    title: "Ethical Sourcing",
    description: siteContent.about.sustainability.points[3],
    icon: "🤝",
    span: "md:col-span-2",
  },
  {
    title: "Eco-Friendly",
    description: siteContent.about.sustainability.points[4],
    icon: "🌿",
    span: "md:col-span-3",
  },
];

export function SustainabilitySection() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-20 lg:px-28">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="mb-12 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">
            Our Commitment
          </p>
          <h2 className="text-display-lg">
            Ethical &amp; Sustainable
          </h2>
          <p className="mt-6 text-foreground/50 leading-relaxed max-w-2xl mx-auto">
            {siteContent.about.sustainability.intro}
          </p>
        </AnimatedSection>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {bentoItems.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={`${item.span} rounded-2xl border border-border bg-card/30 p-6 md:p-8 backdrop-blur-sm`}
            >
              <span className="text-2xl">{item.icon}</span>
              <h3 className="text-sm font-medium text-foreground mt-3 mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-foreground/50 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
