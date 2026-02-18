import { Metadata } from "next";
import { bespokePieces } from "@/data/bespoke";
import { siteContent } from "@/data/siteContent";
import { BespokePiece } from "@/components/bespoke/BespokePiece";
import { BespokeHeader } from "@/components/bespoke/BespokeHeader";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Bespoke Jewellery",
  description:
    "Fully custom, one-of-a-kind jewellery pieces designed by Myriam Soseilos. From concept to finished piece in just 3-4 weeks.",
};

export default function BespokePage() {
  return (
    <section className="pt-44 pb-24 px-6 max-w-5xl mx-auto">
      <BespokeHeader />

      {bespokePieces.map((piece, i) => (
        <BespokePiece
          key={piece.id}
          piece={piece}
          isLast={i === bespokePieces.length - 1}
          index={i}
        />
      ))}

      {/* Bottom CTA */}
      <AnimatedSection className="text-center mt-20 md:mt-28">
        <h2 className="font-serif text-display-md mb-4">
          Begin Your Story
        </h2>
        <p className="text-foreground/50 max-w-lg mx-auto leading-relaxed mb-8">
          Schedule a consultation to discuss your vision with Myriam, or pick
          a piece from the collection and work with her to make it uniquely yours.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="mailto:info@myriamsos.co.uk?subject=Bespoke%20Jewellery%20Consultation">
            Schedule a Consultation
          </Button>
          <Button href="/catalogue" variant="secondary">
            Pick from Collection
          </Button>
        </div>
      </AnimatedSection>
    </section>
  );
}
