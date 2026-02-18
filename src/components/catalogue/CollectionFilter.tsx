"use client";

import { CollectionSlug } from "@/data/collections";
import { collections } from "@/data/collections";

type Props = {
  active: CollectionSlug | "all";
  onChange: (filter: CollectionSlug | "all") => void;
};

export function CollectionFilter({ active, onChange }: Props) {
  return (
    <div className="flex justify-center gap-6 md:gap-8 flex-wrap">
      <button
        onClick={() => onChange("all")}
        className={`text-xs tracking-[0.15em] uppercase transition-colors duration-300 pb-1.5 border-b ${
          active === "all"
            ? "text-foreground border-foreground"
            : "text-muted border-transparent hover:text-foreground"
        }`}
      >
        All Pieces
      </button>
      {collections.map((c) => (
        <button
          key={c.slug}
          onClick={() => onChange(c.slug)}
          className={`text-xs tracking-[0.15em] uppercase transition-colors duration-300 pb-1.5 border-b ${
            active === c.slug
              ? "text-foreground border-foreground"
              : "text-muted border-transparent hover:text-foreground"
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
