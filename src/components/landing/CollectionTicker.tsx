import Image from "next/image";
import Link from "next/link";
import { collections } from "@/data/collections";
import { products } from "@/data/products";
import { imageSrc } from "@/lib/image";

function getCollectionImage(slug: string): string | null {
  const product = products.find(
    (p) => p.collection === slug && p.images.length > 0
  );
  return product ? product.images[0].src : null;
}

export function CollectionTicker() {
  const items = collections
    .map((c) => ({ ...c, image: c.coverImage || getCollectionImage(c.slug) }))
    .filter((c) => c.image);

  // Duplicate exactly once — animation translates -50% (one full set) then loops
  const repeated = [...items, ...items];

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      {/* Fixed edge-fade wrapper — mask stays at viewport edges */}
      <div
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div
          className="flex animate-scroll-left"
          style={{ animationDuration: "35s" }}
        >
        {repeated.map((collection, i) => (
          <Link
            key={`${collection.slug}-${i}`}
            href={`/catalogue?collection=${collection.slug}`}
            className="flex-shrink-0 px-3"
          >
            <div className="relative w-[312px] md:w-96 aspect-[9/16] rounded-2xl overflow-hidden group">
              {/* Background image */}
              <Image
                src={imageSrc(collection.image!)}
                alt={collection.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 312px, 384px"
              />

              {/* Darken overlay */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Vignette — heavier at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Film grain */}
              <div
                className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
                  backgroundSize: "128px 128px",
                }}
              />

              {/* Collection name */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[10px] tracking-[0.3em] uppercase text-white/70">
                  Collection
                </p>
                <h3 className="text-lg text-white mt-1">{collection.name}</h3>
              </div>
            </div>
          </Link>
        ))}
        </div>
      </div>
    </section>
  );
}
