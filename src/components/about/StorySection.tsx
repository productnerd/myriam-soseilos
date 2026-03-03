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
          <motion.h1 variants={fadeUp} className="text-display-lg">
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
              found herself quietly obsessed with the jewellery — not the safe,
              predictable kind, but the pieces that made you stop and think. She
              moved into advertising, climbed the ranks, but kept making pieces
              at her kitchen table. When strangers started offering to buy them,
              she stopped pretending it was a hobby.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="text-foreground/60 leading-relaxed mb-6"
            >
              Her early work was sharp and angular — architecture you could wear.
              Then came the question that drives everything she does: &ldquo;what
              else could it do?&rdquo; Her Transformer collection was born from
              this obsession with complications — the mechanical challenge of
              making jewellery that does something. She embedded magnets into
              precious metal, letting a single piece be worn in ten different
              configurations. She created a ring that shifts colour with body
              temperature. She became one of the first designers in the world to
              work with osmium — the densest naturally occurring element on
              Earth. One client picked up a piece and simply asked, &ldquo;but
              what does it do?&rdquo; — and that question became her design
              philosophy.
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
              Myriam wouldn&apos;t enjoy working on something she didn&apos;t
              love or didn&apos;t feel was different — and that integrity shapes
              every piece. Her collaborations with brands like Candy Crush show
              the same fearless creativity. Style, she believes, should be a
              mirror for the soul. Her pieces are for the bold of heart — less
              &ldquo;look at me&rdquo;, more &ldquo;this is who I am&rdquo;.
              When you wear a Myriam Soseilos piece, you&apos;re joining a group
              of one.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
