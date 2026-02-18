"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { siteContent } from "@/data/siteContent";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background image or video — no motion wrapper to avoid hydration flash */}
      <div className="absolute inset-0 animate-[fadeIn_1s_ease-out]">
        {siteContent.images.heroVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="object-cover w-full h-full"
          >
            <source src={siteContent.images.heroVideo} />
          </video>
        ) : (
          <Image
            src={siteContent.images.hero}
            alt="Myriam Soseilos jewellery"
            fill
            className="object-cover rounded-none"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-background/65" />
      </div>

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-6 max-w-4xl"
      >
        <motion.p
          variants={fadeUp}
          className="text-xs tracking-[0.35em] uppercase text-accent mb-6"
        >
          Fine Jewellery
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="font-serif text-display-xl text-foreground"
        >
          Myriam Soseilos
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-6 text-sm md:text-base tracking-wide text-foreground/60 max-w-xl mx-auto leading-relaxed"
        >
          {siteContent.brand.heroSubtitle}
        </motion.p>
        <motion.div variants={fadeUp} className="mt-10">
          <Button href="/catalogue">Explore Collection</Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-12 bg-foreground/20"
        />
      </motion.div>
    </section>
  );
}
