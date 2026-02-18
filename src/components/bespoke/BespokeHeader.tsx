"use client";

import { motion } from "framer-motion";
import { siteContent } from "@/data/siteContent";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function BespokeHeader() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="text-center mb-20 md:mb-28"
    >
      <motion.p
        variants={fadeUp}
        className="text-xs tracking-[0.3em] uppercase text-muted mb-4"
      >
        Made for You
      </motion.p>
      <motion.h1 variants={fadeUp} className="font-serif text-display-lg">
        Bespoke Jewellery
      </motion.h1>
      <motion.p
        variants={fadeUp}
        className="mt-6 text-foreground/50 max-w-2xl mx-auto leading-relaxed"
      >
        {siteContent.bespoke.description}
      </motion.p>
    </motion.div>
  );
}
