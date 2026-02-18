"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { getCollectionBySlug } from "@/data/collections";
import { imageHoverZoom } from "@/lib/animations";

type Props = { product: Product };

export function ProductCard({ product }: Props) {
  const collection = getCollectionBySlug(product.collection);

  return (
    <Link href={`/catalogue/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-surface rounded-lg">
        <motion.div whileHover={{ ...imageHoverZoom, transition: { delay: 0.07, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }} className="h-full w-full">
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>
      </div>
      <div className="mt-5 space-y-1.5">
        <p className="text-[10px] tracking-[0.2em] uppercase text-muted">
          {collection?.name}
        </p>
        <h3 className="font-serif text-lg text-foreground group-hover:text-accent transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-sm text-muted">
          From &pound;{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
