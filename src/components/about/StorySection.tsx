"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { siteContent } from "@/data/siteContent";
import { imageSrc } from "@/lib/image";
import { fadeUp, staggerContainer, fadeIn } from "@/lib/animations";

export function StorySection() {
  return (
    <section className="pt-44 pb-24 md:pb-32 px-6 md:px-20 lg:px-28">
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
            But What Does It Do?
          </motion.h1>
        </motion.div>

        {/* Three-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-start">
          {/* Column 1: Portrait + intro text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={fadeIn}
              className="relative aspect-[3/4] overflow-hidden bg-surface rounded-lg mb-6"
            >
              <Image
                src={imageSrc(siteContent.images.aboutMyriam)}
                alt="Myriam Soseilos"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="text-foreground/60 leading-relaxed"
            >
              It started at Vogue. During a traineeship at the magazine, Myriam
              was surrounded by perfection and noticed something missing: risk.
              Everything she saw was jewellery that behaved, jewellery that asked
              for approval. That didn&apos;t interest her, so she started making
              her own pieces at the kitchen table after work. When people stopped
              asking where it was from and started asking to buy it, she stopped
              pretending it was a hobby.
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
            <motion.div
              variants={fadeIn}
              className="relative aspect-[8/9] overflow-hidden bg-surface rounded-lg mb-6 lg:order-2"
            >
              <Image
                src={imageSrc("/aboutnew.jpg.jpeg")}
                alt="Myriam Soseilos craftsmanship"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="text-foreground/60 leading-relaxed mb-6 lg:order-1"
            >
              Every piece begins with a refusal to sit still. What if it
              changed? What if it did something? She{" "}
              <span className="font-medium text-foreground/80">hides magnets inside
              precious metal</span>, makes pieces that transform, and designs{" "}
              <span className="font-medium text-foreground/80">rings that react to the body</span>.
              She works with <span className="font-medium text-foreground/80">osmium, the rarest material
              on Earth</span>, and turns it into something intimate. Not for novelty,
              but because it means something.
            </motion.p>
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
              className="relative aspect-[8/9] overflow-hidden bg-surface rounded-lg mb-6"
            >
              <Image
                src={imageSrc("/about1error.jpg.jpeg")}
                alt="Error 01 collection"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="text-foreground/60 leading-relaxed mb-5"
            >
              Her work has been <span className="font-medium text-foreground/80">worn at
              Selfridges, seen in Vogue</span>, and walked across London,
              Paris and Shanghai. She gave a{" "}
              <a
                href={siteContent.about.tedTalk.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-light underline underline-offset-4 transition-colors duration-300"
              >
                TEDx talk
              </a>{" "}
              on why jewellery is the most intimate form of art, something you
              carry against your skin that says who you are without speaking.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="text-foreground/60 leading-relaxed"
            >
              Myriam Soseilos is for people who would rather be questioned than
              understood. Not &ldquo;look at me&rdquo; but &ldquo;this is who I
              am.&rdquo; <span className="font-medium text-foreground/80">You don&apos;t wear it to
              belong. You wear it because you already don&apos;t.</span>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
