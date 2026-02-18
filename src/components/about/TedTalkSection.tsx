"use client";

import { siteContent } from "@/data/siteContent";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function TedTalkSection() {
  const { tedTalk } = siteContent.about;
  // Extract YouTube video ID
  const videoId = tedTalk.url.split("v=")[1]?.split("&")[0];
  if (!videoId) return null;

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">
            TEDx Talk
          </p>
          <h2 className="font-serif text-display-md">In Her Own Words</h2>
          <p className="mt-4 text-foreground/50 max-w-lg mx-auto leading-relaxed">
            {tedTalk.title}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="relative aspect-video overflow-hidden rounded-lg bg-surface">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
              title="Myriam Soseilos TEDx Talk"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
