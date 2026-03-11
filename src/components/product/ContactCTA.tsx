import { Button } from "@/components/ui/Button";
import { Product } from "@/data/products";

type Props = { product: Product };

export function ContactCTA({ product }: Props) {
  const subject = encodeURIComponent(`Customising the ${product.name}`);
  const body = encodeURIComponent(
    `Dear Myriam,\n\nI am interested in the ${product.name} (${product.sku}). There are certain changes I would like to make to the metal and gemstone type. Let\u2019s discuss.\n\nBest regards`
  );

  return (
    <div className="mt-10">
      <Button href={`mailto:info@myriamsos.co.uk?subject=${subject}&body=${body}`}>
        Customise This Piece
      </Button>
    </div>
  );
}
