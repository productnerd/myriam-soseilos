import { Metadata } from "next";
import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Browse the Myriam Soseilos fine jewellery collection. Each piece is handcrafted with ethically sourced materials.",
};

export default function CataloguePage() {
  return (
    <section className="pt-44 pb-24 px-6 max-w-7xl mx-auto">
      <AnimatedSection className="text-center mb-16">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">
          Browse
        </p>
        <h1 className="font-serif text-display-lg">The Collection</h1>
        <p className="mt-5 text-foreground/50 max-w-lg mx-auto leading-relaxed text-sm">
          Each piece is handcrafted with ethically sourced materials. Every
          design can be customised to your specifications. To purchase or
          enquire, contact Myriam directly.
        </p>
      </AnimatedSection>
      <ProductGrid />
    </section>
  );
}
