import Link from "next/link";
import type { Product } from "@/lib/commerce/index.ts";
import { formatMoney } from "@/lib/format.ts";
import { discountPercent, installments, leadVariant, pixPrice, productPhotos, sizeOf, sortedVariants } from "@/lib/mare.ts";

/** Figma component "Card/Produto" (2:13): photo with badge + favourite, sizes, name, price, Pix price, installments. */
export function ProductCard({ product, badge }: { product: Product; badge?: string }) {
  const lead = leadVariant(product);
  const off = discountPercent(lead);
  const label = badge ?? (off > 0 ? `-${off}%` : null);
  const soldOut = !product.variants.some((v) => v.available);
  const parcel = lead ? installments(lead.price) : null;
  const [photo, hover] = productPhotos(product);
  return (
    <Link href={`/p/${product.slug}`} className="card">
      <div className="card-media">
        <img src={photo ?? ""} alt={product.name} loading="lazy" />
        {hover && <img className="alt" src={hover} alt="" loading="lazy" />}
        <div className="card-top">
          {label && <span className="badge">{label}</span>}
          <span className="fav" aria-hidden="true">
            <img src="/icons/heart-16.svg" alt="" width={16} height={16} />
          </span>
        </div>
      </div>
      <div className="card-sizes" aria-label="Tamanhos">
        {sortedVariants(product).map((v) => (
          <span key={v.id} className={v.available ? undefined : "off"}>
            {sizeOf(v)}
          </span>
        ))}
      </div>
      <p className="card-name">{product.name}</p>
      {lead && (
        <div className="price-row">
          <span className="price">{formatMoney(lead.price)}</span>
          {lead.listPrice && <span className="list-price">{formatMoney(lead.listPrice)}</span>}
          <span className="pix">{formatMoney(pixPrice(lead.price))} no Pix</span>
        </div>
      )}
      {soldOut ? (
        <span className="soldout">Esgotado</span>
      ) : (
        parcel && (
          <p className="installments">
            ou {parcel.count}x de {formatMoney(parcel.each)} sem juros
          </p>
        )
      )}
    </Link>
  );
}

export function ProductGrid({ products, empty, columns = 4 }: { products: Product[]; empty: string; columns?: 3 | 4 }) {
  if (products.length === 0) return <p className="empty">{empty}</p>;
  return (
    <div className={columns === 3 ? "products products-3" : "products"}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
