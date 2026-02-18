"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Product } from "@/data/products";
import { getCollectionBySlug } from "@/data/collections";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { ContactCTA } from "./ContactCTA";

type Props = { product: Product };

export function ProductInfo({ product }: Props) {
  const collection = getCollectionBySlug(product.collection);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="pt-4"
    >
      <motion.div variants={fadeUp}>
        <Link
          href={`/catalogue?collection=${product.collection}`}
          className="text-xs tracking-[0.2em] uppercase text-accent hover:text-accent-light transition-colors duration-300"
        >
          {collection?.name} Collection
        </Link>
      </motion.div>

      <motion.h1
        variants={fadeUp}
        className="font-serif text-display-md mt-3"
      >
        {product.name}
      </motion.h1>

      <motion.p variants={fadeUp} className="mt-4 font-serif text-2xl">
        &pound;{product.price.toLocaleString()}
      </motion.p>

      <motion.p
        variants={fadeUp}
        className="mt-2 text-xs text-muted"
      >
        VAT included (UK/EU only)
      </motion.p>

      <motion.div
        variants={fadeUp}
        className="w-12 h-px bg-border mt-8 mb-8"
      />

      <motion.p
        variants={fadeUp}
        className="text-foreground/60 leading-relaxed"
      >
        {product.description}
      </motion.p>

      {/* Details */}
      <motion.div variants={fadeUp} className="mt-8 space-y-4">
        <div className="flex gap-8">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-1.5">
              Materials
            </p>
            <p className="text-sm text-foreground/80">
              {product.materials.join(", ")}
            </p>
          </div>
          {product.gems.length > 0 && (
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-1.5">
                Gemstones
              </p>
              <p className="text-sm text-foreground/80">
                {product.gems.join(", ")}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <ContactCTA product={product} />
      </motion.div>
    </motion.div>
  );
}
