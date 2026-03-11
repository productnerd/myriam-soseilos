"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { products } from "@/data/products";
import { imageSrc } from "@/lib/image";
import { fadeUp, staggerContainer, fadeIn } from "@/lib/animations";

// Pick representative images from innovative collections
function getImage(collection: string, index: number): string {
  const items = products.filter(
    (p) => p.collection === collection && p.images.length > 0
  );
  return items[index % items.length]?.images[0]?.src ?? "";
}

export function InnovationSection() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-20 lg:px-28">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs tracking-[0.3em] uppercase text-muted mb-4"
          >
            Innovation
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-display-lg">
            But What Does It Do?
          </motion.h2>
        </motion.div>

        {/* Three-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-start">
          {/* Column 1: Image + Text + Image */}
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
                src={imageSrc(getImage("transformers", 0))}
                alt="Transformer jewellery"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="text-foreground/60 leading-relaxed mb-5"
            >
              Every piece starts with a question: what else could it do? Magnets
              embedded in precious metal let a single ring become ten different
              configurations. A necklace transforms into a bracelet. An earring
              reverses to reveal a hidden face.
            </motion.p>
            <motion.div
              variants={fadeIn}
              className="relative aspect-[3/4] overflow-hidden bg-surface rounded-lg"
            >
              <Image
                src={imageSrc(getImage("cosmic-dust", 2))}
                alt="Cosmic Dust collection"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </motion.div>
          </motion.div>

          {/* Column 2: Text + Image + Text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.p
              variants={fadeUp}
              className="text-foreground/60 leading-relaxed mb-6"
            >
              Myriam was one of the first jewellery designers in the world to
              work with osmium — the densest naturally occurring element on
              Earth. She created a ring that shifts colour with body temperature.
              These aren&apos;t gimmicks; they&apos;re complications, the
              mechanical challenges that drive every collection.
            </motion.p>
            <motion.div
              variants={fadeIn}
              className="relative aspect-[4/5] overflow-hidden bg-surface rounded-lg mb-6"
            >
              <Image
                src={imageSrc(getImage("otherworldly", 1))}
                alt="Otherworldly collection"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="text-foreground/60 leading-relaxed"
            >
              Each piece is precision-modelled in 3D before casting at a
              specialist atelier, then hand-finished with obsessive attention to
              detail. The result is jewellery that surprises — mechanically,
              materially, and emotionally.
            </motion.p>
          </motion.div>

          {/* Column 3: Image + Text + Image */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              variants={fadeIn}
              className="relative aspect-[3/4] overflow-hidden bg-surface rounded-lg mb-6"
            >
              <Image
                src={imageSrc(getImage("jagged", 0))}
                alt="Jagged collection"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="text-foreground/60 leading-relaxed mb-6"
            >
              Inspired by architecture, space and the wearer themselves — nothing
              is conventional and nothing is quite like it on the market.
              Incomparable designs from a fiercely creative mind that asks
              &ldquo;what if?&rdquo; before every project.
            </motion.p>
            <motion.div
              variants={fadeIn}
              className="relative aspect-[4/3] overflow-hidden bg-surface rounded-lg"
            >
              <Image
                src={imageSrc(getImage("skyline", 0))}
                alt="Skyline collection"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
