import Link from "next/link";
import type { Product } from "@/lib/commerce/index.ts";
import { formatMoney } from "@/lib/format.ts";

export function ProductCard({ product }: { product: Product }) {
  const variant = product.variants.find((v) => v.available) ?? product.variants[0];
  return (
    <Link href={`/p/${product.slug}`} className="card">
      {/* eslint-disable-next-line @next/next/no-img-element -- VTEX image CDN; next/image would need its host configured per account */}
      <img src={product.images[0] ?? ""} alt={product.name} loading="lazy" />
      <div className="card-body">
        <span>{product.name}</span>
        {variant && (
          <span className="row">
            {variant.listPrice && <span className="list-price">{formatMoney(variant.listPrice)}</span>}
            <span className="price">{formatMoney(variant.price)}</span>
          </span>
        )}
        {variant && !variant.available && <span className="muted">Indisponível</span>}
      </div>
    </Link>
  );
}

export function ProductGrid({ products, empty }: { products: Product[]; empty: string }) {
  if (products.length === 0) return <p className="empty">{empty}</p>;
  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
