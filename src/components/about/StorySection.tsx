"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { siteContent } from "@/data/siteContent";
import { fadeUp, staggerContainer, fadeIn } from "@/lib/animations";

export function StorySection() {
  return (
    <section className="pt-44 pb-24 md:pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center mb-16 md:mb-24"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs tracking-[0.3em] uppercase text-muted mb-4"
          >
            The Designer
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-serif text-display-lg">
            From Vogue Intern to Osmium Pioneer
          </motion.h1>
        </motion.div>

        {/* Three-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-start">
          {/* Column 1: Portrait */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative aspect-[3/4] overflow-hidden bg-surface rounded-lg"
          >
            <Image
              src={siteContent.images.aboutMyriam}
              alt="Myriam Soseilos"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          </motion.div>

          {/* Column 2: Story part 1 + image */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.p
              variants={fadeUp}
              className="text-foreground/60 leading-relaxed mb-5"
            >
              It started at Vogue. During a traineeship at the magazine, Myriam
              found herself quietly obsessed with the jewellery. She moved into
              advertising, climbed the ranks, but kept making pieces at her
              kitchen table. When strangers started offering to buy them, she
              stopped pretending it was a hobby.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="text-foreground/60 leading-relaxed mb-6"
            >
              Her early work was sharp and angular — architecture you could wear.
              Then came magnets: she was one of the first fine jewellers to embed
              them into precious metal, letting a single piece be worn in ten
              different configurations. She created a ring that shifts colour with
              body temperature. She became one of the first designers in the world
              to work with osmium — the densest naturally occurring element on Earth.
            </motion.p>
            <motion.div
              variants={fadeIn}
              className="relative aspect-[4/3] overflow-hidden bg-surface rounded-lg"
            >
              <Image
                src={siteContent.images.bespoke}
                alt="Myriam Soseilos craftsmanship"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </motion.div>
          </motion.div>

          {/* Column 3: Image + story part 2 */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              variants={fadeIn}
              className="relative aspect-[4/3] overflow-hidden bg-surface rounded-lg mb-6"
            >
              <Image
                src={siteContent.images.aboutJewellery}
                alt="Myriam Soseilos jewellery"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="text-foreground/60 leading-relaxed mb-5"
            >
              Her pieces have been featured in Vogue UK and Marie Claire, stocked
              at Selfridges, and walked fashion weeks in London, Paris and
              Shanghai. She gave a{" "}
              <a
                href={siteContent.about.tedTalk.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-light underline underline-offset-4 transition-colors duration-300"
              >
                TEDx talk
              </a>{" "}
              on why jewellery is the most intimate form of art — something you
              carry against your skin that says who you are without speaking.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="text-foreground/60 leading-relaxed"
            >
              Myriam doesn&apos;t design jewellery that blends in. She creates bold,
              unconventional pieces that empower the people who wear them to be
              unapologetically themselves.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
