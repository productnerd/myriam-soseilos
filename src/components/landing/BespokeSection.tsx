"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { siteContent } from "@/data/siteContent";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";

export function BespokeSection() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/*
          3-column rectangle layout:
          ┌──────────┬──────────────────────┐
          │          │  Text + CTA          │
          │  Tall    ├──────────┬───────────┤
          │  Image   │  Image 2 │  Image 3  │
          └──────────┴──────────┴───────────┘
        */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left column — tall image spanning full height */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative overflow-hidden bg-surface rounded-lg lg:row-span-2 aspect-[3/4] lg:aspect-auto"
          >
            <Image
              src={siteContent.images.bespoke}
              alt="Bespoke jewellery creation"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          </motion.div>

          {/* Right two columns — text on top */}
          <div className="lg:col-span-2 flex flex-col justify-center px-2 lg:px-8 py-4">
            <AnimatedSection>
              <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">
                Made for You
              </p>
              <h2 className="font-serif text-display-lg">
                {siteContent.bespoke.heading}
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="mt-6 text-foreground/60 leading-relaxed">
                {siteContent.bespoke.description}
              </p>
              <p className="mt-4 text-foreground/60 leading-relaxed">
                Each piece is a deeply personal collaboration. Myriam works
                closely with you to bring your vision to life, from initial
                concept through to the finished creation.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.4}>
              <div className="mt-8">
                <Button href="/bespoke">
                  See Past Creations
                </Button>
              </div>
            </AnimatedSection>
          </div>

          {/* Bottom right — two images side by side */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 grid grid-cols-2 gap-4"
          >
            <motion.div
              variants={fadeUp}
              className="relative aspect-[4/3] overflow-hidden bg-surface rounded-lg"
            >
              <Image
                src={siteContent.images.aboutJewellery}
                alt="Custom bracelet and ring"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
            </motion.div>
            <motion.div
              variants={fadeUp}
              className="relative aspect-[4/3] overflow-hidden bg-surface rounded-lg"
            >
              <Image
                src={siteContent.images.categories.rings}
                alt="Bespoke rings"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
