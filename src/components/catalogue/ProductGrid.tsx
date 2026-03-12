"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { products, Category } from "@/data/products";
import { CollectionSlug, collections } from "@/data/collections";
import { ProductCard } from "./ProductCard";

const CATEGORIES: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "rings", label: "Rings" },
  { value: "earrings", label: "Earrings" },
  { value: "necklaces", label: "Necklaces" },
  { value: "bracelets", label: "Bracelets" },
  { value: "multi", label: "Multi-wear" },
  { value: "cufflinks", label: "Cufflinks" },
];

const pillClass = (active: boolean) =>
  `text-xs tracking-[0.15em] uppercase transition-colors duration-300 pb-1.5 border-b ${
    active
      ? "text-foreground border-foreground"
      : "text-muted border-transparent hover:text-foreground"
  }`;

export function ProductGrid() {
  const searchParams = useSearchParams();
  const [collection, setCollection] = useState<CollectionSlug | "all">("all");
  const [category, setCategory] = useState<Category | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const param = searchParams.get("collection");
    if (param && collections.some((c) => c.slug === param)) {
      setCollection(param as CollectionSlug);
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter((p) => {
      if (collection !== "all" && p.collection !== collection) return false;
      if (category !== "all" && p.category !== category) return false;
      if (q) {
        const haystack =
          `${p.name} ${p.materials.join(" ")} ${p.gems.join(" ")} ${p.description}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [collection, category, search]);

  return (
    <>
      {/* Search */}
      <div className="max-w-sm mx-auto mb-10">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, material or gemstone..."
          className="w-full bg-transparent border border-border rounded px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors duration-300"
        />
      </div>

      {/* Collection filter */}
      <div className="flex justify-center gap-4 md:gap-6 flex-wrap mb-6">
        <button onClick={() => setCollection("all")} className={pillClass(collection === "all")}>
          All Collections
        </button>
        {collections.map((c) => (
          <button
            key={c.slug}
            onClick={() => setCollection(c.slug)}
            className={pillClass(collection === c.slug)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex justify-center gap-4 md:gap-6 flex-wrap mb-16">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={pillClass(category === c.value)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-muted text-center mb-8">
        {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {filtered.length === 0 && (
        <p className="text-center text-muted mt-16">
          No pieces match your filters. Try adjusting your search.
        </p>
      )}
    </>
  );
}
