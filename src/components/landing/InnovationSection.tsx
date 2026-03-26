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

        {/* Three-column interleaved layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-start">
          {/* Column 1: Image + text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeIn} className="relative aspect-[4/3] overflow-hidden bg-surface rounded-lg mb-6">
              <Image src={imageSrc("/innovation1.jpeg")} alt="Innovation in jewellery" fill className="object-cover rounded-lg" sizes="(max-width: 768px) 100vw, 33vw" />
            </motion.div>
            <motion.p variants={fadeUp} className="text-foreground/60 leading-relaxed">
              Every piece starts with a question: what if it did something?
              <span className="font-medium text-foreground/80">Magnets embedded in precious metal</span> let
              a single ring become ten different configurations. A necklace
              transforms into a bracelet, and an earring reverses to reveal a
              hidden face.
            </motion.p>
          </motion.div>

          {/* Column 2: Image + text on mobile, text + image on desktop */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col"
          >
            <motion.div variants={fadeIn} className="relative aspect-[4/5] overflow-hidden bg-surface rounded-lg mb-6 lg:order-2">
              <Image src={imageSrc("/innovation2.jpeg")} alt="Osmium jewellery" fill className="object-cover rounded-lg" sizes="(max-width: 768px) 100vw, 33vw" />
            </motion.div>
            <motion.p variants={fadeUp} className="text-foreground/60 leading-relaxed mb-6 lg:mb-6 lg:order-1">
              Myriam was <span className="font-medium text-foreground/80">one of the first jewellery
              designers in the world to work with osmium</span>, the densest
              naturally occurring element on Earth. She also created a{" "}
              <span className="font-medium text-foreground/80">ring that shifts colour with body
              temperature</span>. These aren&apos;t gimmicks, they&apos;re the
              mechanical challenges that drive every collection.
            </motion.p>
          </motion.div>

          {/* Column 3: Image + text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={fadeIn} className="relative aspect-[3/4] overflow-hidden bg-surface rounded-lg mb-6">
              <Image src={imageSrc("/innovation4.jpg")} alt="Architectural jewellery" fill className="object-cover rounded-lg" sizes="(max-width: 768px) 100vw, 33vw" />
            </motion.div>
            <motion.p variants={fadeUp} className="text-foreground/60 leading-relaxed">
              Jewellery shouldn&apos;t just exist to decorate. It should exist
              to declare something. Inspired by architecture, space and the
              wearer themselves, nothing here is conventional and nothing is
              quite like it anywhere else.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
