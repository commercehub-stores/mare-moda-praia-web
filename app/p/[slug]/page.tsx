import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { addToCart } from "@/app/actions.ts";
import { commerce } from "@/lib/store.ts";
import { formatMoney, plainText } from "@/lib/format.ts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await commerce.catalog.getProduct((await params).slug);
  return { title: product?.name ?? "Produto" };
}

export default async function ProductPage({ params }: Props) {
  const product = await commerce.catalog.getProduct((await params).slug);
  if (!product) notFound();
  const available = product.variants.filter((v) => v.available);
  const first = available[0] ?? product.variants[0];
  return (
    <article className="pdp">
      {/* eslint-disable-next-line @next/next/no-img-element -- VTEX image CDN */}
      <img src={product.images[0] ?? ""} alt={product.name} />
      <div className="stack">
        {product.brand && <span className="muted">{product.brand}</span>}
        <h1>{product.name}</h1>
        {first && (
          <p className="row">
            {first.listPrice && <span className="list-price">{formatMoney(first.listPrice)}</span>}
            <span className="price" style={{ fontSize: 24 }}>
              {formatMoney(first.price)}
            </span>
          </p>
        )}
        {available.length > 0 ? (
          <form action={addToCart} className="stack">
            {available.length > 1 && (
              <label className="stack">
                <span className="muted">Opção</span>
                <select name="variantId" className="input">
                  {available.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} · {formatMoney(v.price)}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {available.length === 1 && <input type="hidden" name="variantId" value={first?.id} />}
            <label className="row">
              <span className="muted">Quantidade</span>
              <input name="quantity" type="number" min={1} max={99} defaultValue={1} className="input" style={{ flex: "none", width: 80 }} />
            </label>
            <button className="button button-accent">Adicionar ao carrinho</button>
          </form>
        ) : (
          <p className="empty">Produto indisponível no momento.</p>
        )}
        {product.description && <p className="muted">{plainText(product.description)}</p>}
      </div>
    </article>
  );
}
