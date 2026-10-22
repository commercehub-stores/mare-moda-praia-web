import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { addToCart, buyNow } from "@/app/actions.ts";
import { Gallery } from "@/components/gallery.tsx";
import { ProductCard } from "@/components/product-card.tsx";
import { Quantity } from "@/components/quantity.tsx";
import { collectionProducts, withImages } from "@/lib/catalog.ts";
import type { ShippingQuote } from "@/lib/commerce/index.ts";
import { formatMoney, normalizeCep, plainText } from "@/lib/format.ts";
import { collectionByCategoryId, collectionBySlug, discountPercent, FREE_SHIPPING_CENTS, installments, leadVariant, pixPrice, productPhotos, sizeOf, sortedVariants } from "@/lib/mare.ts";
import { commerce } from "@/lib/store.ts";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cep?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await commerce.catalog.getProduct((await params).slug).catch(() => null);
  return { title: product?.name ?? "Produto", description: product ? plainText(product.description).slice(0, 160) : undefined };
}

/** Quotes for one unit of this SKU: a throwaway orderForm, since the adapter simulates from a cart. */
async function quote(variantId: string, cep: string): Promise<ShippingQuote[]> {
  const cart = await commerce.cart.create();
  await commerce.cart.addItem(cart.id, { variantId, quantity: 1 });
  return commerce.cart.estimateShipping(cart.id, { postalCode: cep, country: "BRA" });
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const product = await commerce.catalog.getProduct(slug).catch(() => null);
  if (!product) notFound();

  const variants = sortedVariants(product);
  const lead = leadVariant(product);
  const firstAvailable = variants.find((v) => v.available);
  const off = discountPercent(lead);
  const parcel = lead ? installments(lead.price) : null;
  const collection = product.categoryIds.map(collectionByCategoryId).find(Boolean) ?? null;
  const kind = product.name.split(" ").slice(0, 2).join(" ");

  const cep = normalizeCep((await searchParams).cep ?? "");
  const quotes = cep && firstAvailable ? await quote(firstAvailable.id, cep).catch(() => null) : null;

  const pairWith = collectionBySlug(collection?.slug === "camisas" || collection?.slug === "camisetas" ? "shorts" : "camisas");
  const related = pairWith ? withImages(await collectionProducts(pairWith).catch(() => [])).slice(0, 4) : [];

  return (
    <>
      <nav className="crumbs crumbs-pad page" aria-label="Você está em">
        <Link href="/">Início</Link>
        <span>/</span>
        {collection && (
          <>
            <Link href={`/c/${collection.slug}`}>{collection.name}</Link>
            <span>/</span>
          </>
        )}
        <span>{product.name}</span>
      </nav>

      <div className="pdp page">
        <Gallery images={productPhotos(product).length ? productPhotos(product) : [""]} name={product.name} badge={off > 0 ? `-${off}%` : null} />

        <div className="info">
          <p className="eyebrow">{[collection?.name, "Coleção Verão 27"].filter(Boolean).join(" · ")}</p>
          <h1 className="display">{product.name}</h1>

          {lead && (
            <div className="price-block">
              <span className="price-big">
                {formatMoney(lead.price)}
                {lead.listPrice && <span className="list-price">{formatMoney(lead.listPrice)}</span>}
              </span>
              <span className="pix-big">
                {formatMoney(pixPrice(lead.price))} no Pix <span className="tag-sea">5% OFF</span>
              </span>
              {parcel && (
                <span className="installments">
                  ou {parcel.count}x de {formatMoney(parcel.each)} sem juros
                </span>
              )}
            </div>
          )}

          <hr className="hr" />

          {firstAvailable ? (
            <form className="info" action={addToCart}>
              <fieldset className="info" style={{ border: 0, padding: 0, margin: 0, gap: 12 }}>
                <legend className="sr-only">Tamanho</legend>
                <div className="opt-label">
                  <strong>Tamanho:</strong>
                  <span className="muted">escolha abaixo</span>
                  <span className="guide">
                    <img src="/icons/ruler.svg" alt="" width={16} height={16} />
                    Guia de medidas
                  </span>
                </div>
                <div className="sizes">
                  {variants.map((v) => (
                    <label key={v.id}>
                      <input type="radio" name="variantId" value={v.id} defaultChecked={v.id === firstAvailable.id} disabled={!v.available} required />
                      <span>{sizeOf(v)}</span>
                    </label>
                  ))}
                </div>
                <p className="size-note">Veste ajustado · se preferir mais largo, peça um número acima.</p>
              </fieldset>
              <div className="buy-row">
                <Quantity />
                <button className="btn btn-coral">Adicionar à sacola</button>
              </div>
              <button formAction={buyNow} className="btn btn-outline btn-block btn-pix">
                <img src="/icons/bolt.svg" alt="" width={16} height={16} />
                Comprar com Pix em 1 clique
              </button>
            </form>
          ) : (
            <p className="empty">Esgotado no momento. Volte logo: a maré traz reposição.</p>
          )}

          <div className="shipping-box">
            <strong>
              <img src="/icons/truck-18.svg" alt="" width={18} height={18} />
              Calcule o frete
            </strong>
            <form action={`/p/${slug}`}>
              <label htmlFor="cep" className="sr-only">
                CEP
              </label>
              <input id="cep" name="cep" inputMode="numeric" placeholder="00000-000" defaultValue={cep ?? ""} autoComplete="postal-code" />
              <button>Calcular</button>
            </form>
            {quotes === null && cep && <span className="muted">Não foi possível calcular agora. Tente de novo no checkout.</span>}
            {quotes && quotes.length === 0 && <span className="muted">Nenhuma opção de entrega para este CEP.</span>}
            {quotes?.map((q) => (
              <div key={q.id} className="ship-line">
                <strong>{q.service}</strong>
                <span>em até {q.estimatedBusinessDays} dias úteis</span>
                {q.price.amountCents === 0 || (lead && lead.price.amountCents >= FREE_SHIPPING_CENTS) ? <span className="free">Grátis</span> : <strong>{formatMoney(q.price)}</strong>}
              </div>
            ))}
          </div>

          <div>
            <details className="accordion" open>
              <summary>
                <span>Descrição</span>
                <img className="minus" src="/icons/minus.svg" alt="" width={16} height={16} />
                <img className="plus" src="/icons/plus.svg" alt="" width={16} height={16} />
              </summary>
              <p>{plainText(product.description) || `${kind} da coleção Verão 27 da Maré.`}</p>
            </details>
            <details className="accordion">
              <summary>
                <span>Composição e cuidados</span>
                <img className="minus" src="/icons/minus.svg" alt="" width={16} height={16} />
                <img className="plus" src="/icons/plus.svg" alt="" width={16} height={16} />
              </summary>
              <p>Lave à mão ou na máquina em ciclo delicado, com água fria. Não use alvejante. Seque à sombra e passe em temperatura baixa, pelo avesso.</p>
            </details>
            <details className="accordion">
              <summary>
                <span>Trocas e devoluções</span>
                <img className="minus" src="/icons/minus.svg" alt="" width={16} height={16} />
                <img className="plus" src="/icons/plus.svg" alt="" width={16} height={16} />
              </summary>
              <p>A primeira troca é grátis em até 30 dias após o recebimento. A peça precisa estar sem uso e com etiqueta.</p>
            </details>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section page pdp-related">
          <h2 className="display">Combine com</h2>
          <div className="products">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
