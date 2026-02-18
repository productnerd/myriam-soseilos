import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { products, getProductBySlug } from "@/data/products";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
  };
}

export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <section className="pt-28 pb-24 px-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-10 flex items-center gap-2 text-xs text-muted">
        <Link
          href="/catalogue"
          className="hover:text-foreground transition-colors duration-300"
        >
          Catalogue
        </Link>
        <span>/</span>
        <span className="text-foreground/60">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
        <ProductGallery product={product} />
        <ProductInfo product={product} />
      </div>
    </section>
  );
}
