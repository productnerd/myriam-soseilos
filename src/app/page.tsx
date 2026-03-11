import { Hero } from "@/components/landing/Hero";
import { FeaturedInCarousel } from "@/components/landing/FeaturedInCarousel";
import { CollectionTicker } from "@/components/landing/CollectionTicker";
import { JewelleryShowcase } from "@/components/landing/JewelleryShowcase";
import { AwardsCarousel } from "@/components/landing/AwardsCarousel";
import { BespokeSection } from "@/components/landing/BespokeSection";
import { InnovationSection } from "@/components/landing/InnovationSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedInCarousel />
      <CollectionTicker />
      <JewelleryShowcase />
      <AwardsCarousel />
      <BespokeSection />
      <InnovationSection />
    </>
  );
}
