import { Button } from "@/components/ui/Button";
import { Product } from "@/data/products";

type Props = { product: Product };

export function ContactCTA({ product }: Props) {
  const subject = encodeURIComponent(`Enquiry about ${product.name}`);
  const body = encodeURIComponent(
    `Hello Myriam,\n\nI am interested in the ${product.name} (${product.sku}). I would like to learn more about this piece.\n\nThank you.`
  );

  return (
    <div className="mt-10 p-6 bg-surface rounded-lg border border-border">
      <h3 className="font-serif text-lg">Interested in this piece?</h3>
      <p className="mt-3 text-sm text-foreground/50 leading-relaxed">
        Each piece is made to order and can be fully customised — materials,
        gemstones, and sizing adjusted to your preferences. Contact Myriam
        directly to purchase or discuss a personalised version.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button href={`mailto:info@myriamsos.co.uk?subject=${subject}&body=${body}`}>
          Order
        </Button>
        <Button
          href="mailto:info@myriamsos.co.uk?subject=Custom%20Design%20Consultation"
          variant="secondary"
        >
          Customise This Piece
        </Button>
      </div>
    </div>
  );
}
