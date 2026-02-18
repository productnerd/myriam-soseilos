import { Hero } from "@/components/landing/Hero";
import { FeaturedInCarousel } from "@/components/landing/FeaturedInCarousel";
import { JewelleryShowcase } from "@/components/landing/JewelleryShowcase";
import { AwardsCarousel } from "@/components/landing/AwardsCarousel";
import { BespokeSection } from "@/components/landing/BespokeSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedInCarousel />
      <JewelleryShowcase />
      <AwardsCarousel />
      <BespokeSection />
    </>
  );
}
