"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { getCollectionBySlug } from "@/data/collections";
import { fadeUp, staggerContainer, imageHoverZoom } from "@/lib/animations";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";

export function JewelleryShowcase() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-16 md:mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">
            The Collection
          </p>
          <h2 className="font-serif text-display-lg">
            Handcrafted Pieces
          </h2>
        </AnimatedSection>

        {/* Asymmetric grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6"
        >
          {/* First row — equal height */}
          <motion.div variants={fadeUp} className="lg:col-span-7 h-full">
            <ProductShowcaseCard product={products[0]} aspectClass="aspect-[4/3] lg:aspect-auto lg:h-[420px]" />
          </motion.div>

          <motion.div variants={fadeUp} className="lg:col-span-5 h-full">
            <ProductShowcaseCard product={products[1]} aspectClass="aspect-[4/3] lg:aspect-auto lg:h-[420px]" />
          </motion.div>

          {/* Three items in a row */}
          {products.slice(2).map((product) => (
            <motion.div key={product.slug} variants={fadeUp} className="lg:col-span-4">
              <ProductShowcaseCard product={product} aspectClass="aspect-square" />
            </motion.div>
          ))}
        </motion.div>

        <AnimatedSection className="text-center mt-16">
          <Button href="/catalogue" variant="secondary">
            View Full Catalogue
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
}

function ProductShowcaseCard({
  product,
  aspectClass,
}: {
  product: (typeof products)[0];
  aspectClass: string;
}) {
  const collection = getCollectionBySlug(product.collection);

  return (
    <Link href={`/catalogue/${product.slug}`} className="group block">
      <div className={`relative ${aspectClass} overflow-hidden bg-surface rounded-lg`}>
        <motion.div whileHover={{ ...imageHoverZoom, transition: { delay: 0.07, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }} className="h-full w-full">
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 rounded-lg" />
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
          <p className="text-xs tracking-[0.2em] uppercase text-accent">
            {collection?.name}
          </p>
          <h3 className="font-serif text-lg text-foreground mt-1">
            {product.name}
          </h3>
          <p className="text-sm text-foreground/60 mt-1">
            From &pound;{product.price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
