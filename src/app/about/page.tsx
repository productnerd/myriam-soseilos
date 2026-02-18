import { Metadata } from "next";
import { StorySection } from "@/components/about/StorySection";
import { PressSection } from "@/components/about/PressSection";
import { AwardsSection } from "@/components/about/AwardsSection";
import { SustainabilitySection } from "@/components/about/SustainabilitySection";

export const metadata: Metadata = {
  title: "About Myriam",
  description:
    "The story behind Myriam Soseilos, award-winning fine jewellery designer featured in Vogue UK, Marie Claire and Selfridges.",
};

export default function AboutPage() {
  return (
    <>
      <StorySection />
      <PressSection />
      <AwardsSection />
      <SustainabilitySection />
    </>
  );
}
