"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/data/products";
import { Media } from "@/components/ui/Media";

type Props = { product: Product };

export function ProductGallery({ product }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = product.images.length;

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % count);
  }, [count]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + count) % count);
  }, [count]);

  return (
    <div>
      {/* Main media with left/right click navigation */}
      <div className="group relative aspect-square bg-surface overflow-hidden rounded-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Media
              item={product.images[activeIndex]}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Left/right click zones + subtle arrows */}
        {count > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-0 top-0 bottom-0 w-1/2 z-10 flex items-center justify-start pl-4 cursor-pointer"
              aria-label="Previous image"
            >
              <span className="text-foreground/0 group-hover:text-foreground/30 hover:!text-foreground/60 transition-colors duration-300 text-3xl select-none">
                &#8249;
              </span>
            </button>
            <button
              onClick={goNext}
              className="absolute right-0 top-0 bottom-0 w-1/2 z-10 flex items-center justify-end pr-4 cursor-pointer"
              aria-label="Next image"
            >
              <span className="text-foreground/0 group-hover:text-foreground/30 hover:!text-foreground/60 transition-colors duration-300 text-3xl select-none">
                &#8250;
              </span>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {count > 1 && (
        <div className="flex gap-3 mt-4">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative w-20 h-20 overflow-hidden rounded-md transition-all duration-300 ${
                i === activeIndex
                  ? "ring-2 ring-accent ring-offset-2 ring-offset-background"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Media item={img} sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
