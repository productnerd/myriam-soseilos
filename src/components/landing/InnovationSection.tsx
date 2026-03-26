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

        {/* Images row */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 mb-10 lg:mb-14"
        >
          <motion.div variants={fadeIn} className="relative aspect-[4/3] overflow-hidden bg-surface rounded-lg">
            <Image src={imageSrc(getImage("transformers", 0))} alt="Transformer jewellery" fill className="object-cover rounded-lg" sizes="(max-width: 768px) 100vw, 33vw" />
          </motion.div>
          <motion.div variants={fadeIn} className="relative aspect-[4/5] overflow-hidden bg-surface rounded-lg">
            <Image src={imageSrc(getImage("otherworldly", 1))} alt="Otherworldly collection" fill className="object-cover rounded-lg" sizes="(max-width: 768px) 100vw, 33vw" />
          </motion.div>
          <motion.div variants={fadeIn} className="relative aspect-[3/4] overflow-hidden bg-surface rounded-lg">
            <Image src={imageSrc(getImage("jagged", 0))} alt="Jagged collection" fill className="object-cover rounded-lg" sizes="(max-width: 768px) 100vw, 33vw" />
          </motion.div>
        </motion.div>

        {/* Text row */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14"
        >
          <motion.p variants={fadeUp} className="text-foreground/60 leading-relaxed">
            Every piece starts with a question: what if it did something?
            Magnets embedded in precious metal let a single ring become ten
            different configurations. A necklace transforms into a bracelet,
            and an earring reverses to reveal a hidden face.
          </motion.p>
          <motion.p variants={fadeUp} className="text-foreground/60 leading-relaxed">
            Myriam was one of the first jewellery designers in the world to
            work with osmium, the densest naturally occurring element on
            Earth. She also created a ring that shifts colour with body
            temperature. These aren&apos;t gimmicks, they&apos;re the
            mechanical challenges that drive every collection.
          </motion.p>
          <motion.p variants={fadeUp} className="text-foreground/60 leading-relaxed">
            Jewellery shouldn&apos;t just exist to decorate. It should exist
            to declare something. Inspired by architecture, space and the
            wearer themselves, nothing here is conventional and nothing is
            quite like it anywhere else.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
