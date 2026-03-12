"use client";

import { motion } from "framer-motion";
import { siteContent } from "@/data/siteContent";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const bentoItems = [
  {
    title: "Recycled Precious Metals",
    description: siteContent.about.sustainability.points[0],
    span: "md:col-span-2 md:row-span-2",
    // Elegant line-art diamond pattern
    pattern: (
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 400 400">
        <defs>
          <pattern id="diamonds" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 0 L60 30 L30 60 L0 30Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="400" fill="url(#diamonds)" />
      </svg>
    ),
  },
  {
    title: "Conflict-Free Diamonds",
    description: siteContent.about.sustainability.points[1],
    span: "",
    pattern: (
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 400 400">
        <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="200" cy="200" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </svg>
    ),
  },
  {
    title: "Lab-Created Gems",
    description: siteContent.about.sustainability.points[2],
    span: "",
    pattern: (
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 400 400">
        <defs>
          <pattern id="hex" x="0" y="0" width="50" height="43.3" patternUnits="userSpaceOnUse">
            <path d="M25 0 L50 14.4 L50 43.3 L25 43.3 L0 28.9 L0 14.4Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="400" fill="url(#hex)" />
      </svg>
    ),
  },
  {
    title: "Ethical Sourcing",
    description: siteContent.about.sustainability.points[3],
    span: "",
    pattern: (
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 400 400">
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1="200" y1="200" x2={200 + 180 * Math.cos((i * Math.PI) / 4)} y2={200 + 180 * Math.sin((i * Math.PI) / 4)} stroke="currentColor" strokeWidth="0.5" />
        ))}
      </svg>
    ),
  },
  {
    title: "Eco-Conscious Craft",
    description: siteContent.about.sustainability.points[4],
    span: "md:col-span-2",
    pattern: (
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 800 400">
        <defs>
          <pattern id="waves" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 Q25 0 50 10 Q75 20 100 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="800" height="400" fill="url(#waves)" />
      </svg>
    ),
  },
];

export function SustainabilitySection() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-20 lg:px-28">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="mb-14 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">
            Our Philosophy
          </p>
          <h2 className="text-display-lg">
            Φιλοσοφία
          </h2>
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
              className={`${item.span} relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 md:p-10 group transition-all duration-500 hover:border-accent/20 hover:bg-white/[0.04]`}
            >
              {/* Background illustration */}
              <div className="text-foreground transition-all duration-700 group-hover:opacity-[1] group-hover:scale-110">
                {item.pattern}
              </div>

              {/* Accent line */}
              <div className="w-8 h-px bg-accent/40 mb-6 transition-all duration-500 group-hover:w-12 group-hover:bg-accent/70" />

              <h3 className="text-lg md:text-xl font-light text-foreground mb-3 tracking-wide">
                {item.title}
              </h3>
              <p className="text-sm text-foreground/40 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
