"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/data/products";
import { CollectionSlug } from "@/data/collections";
import { CollectionFilter } from "./CollectionFilter";
import { ProductCard } from "./ProductCard";

export function ProductGrid() {
  const [filter, setFilter] = useState<CollectionSlug | "all">("all");

  const filtered =
    filter === "all"
      ? products
      : products.filter((p) => p.collection === filter);

  return (
    <>
      <CollectionFilter active={filter} onChange={setFilter} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        <AnimatePresence mode="popLayout">
          {filtered.map((product) => (
            <motion.div
              key={product.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
