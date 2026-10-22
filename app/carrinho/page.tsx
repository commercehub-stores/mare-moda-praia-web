import type { Metadata } from "next";
import Link from "next/link";
import { goToCheckout, updateQuantity } from "@/app/actions.ts";
import { currentCart } from "@/lib/cart.ts";
import { formatMoney, normalizeCep } from "@/lib/format.ts";
import { pixPrice, splitLineName } from "@/lib/mare.ts";
import { commerce } from "@/lib/store.ts";

export const metadata: Metadata = { title: "Sacola" };

interface Props {
  searchParams: Promise<{ cep?: string }>;
}

/** Full-page bag (the drawer covers most flows; this is the no-JS / shared-link fallback). */
export default async function CartPage({ searchParams }: Props) {
  const cart = await currentCart();
  if (!cart || cart.items.length === 0) {
    return (
      <div className="plp-head page">
        <h1 className="display" style={{ fontSize: 48, margin: 0 }}>
          Sua sacola
        </h1>
        <p className="empty">
          Sua sacola está vazia. <Link href="/c/novidades">Ver novidades</Link>
        </p>
      </div>
    );
  }
  const cep = normalizeCep((await searchParams).cep ?? "");
  const quotes = cep ? await commerce.cart.estimateShipping(cart.id, { postalCode: cep, country: "BRA" }).catch(() => []) : null;

  return (
    <div className="pdp page" style={{ paddingTop: 40 }}>
      <div>
        <h1 className="display" style={{ fontSize: 48, margin: 0 }}>
          Sua sacola
        </h1>
        {cart.items.map((item) => {
          const { title, size } = splitLineName(item.name);
          return (
            <div key={item.id} className="line">
              <img src={item.imageUrl ?? ""} alt="" />
              <div className="line-info">
                <strong>{title}</strong>
                {size && <span className="muted">Tamanho {size}</span>}
                <form action={updateQuantity} className="line-row">
                  <input type="hidden" name="itemId" value={item.id} />
                  <label className="muted">
                    Qtd.{" "}
                    <input name="quantity" type="number" min={0} max={99} defaultValue={item.quantity} style={{ width: 56 }} />
                  </label>
                  <button className="line-remove">Atualizar</button>
                  <strong>{formatMoney(item.total)}</strong>
                </form>
              </div>
            </div>
          );
        })}
      </div>
      <aside className="shipping-box" aria-label="Resumo">
        <div className="sum-row">
          <span>Subtotal</span>
          <strong>{formatMoney(cart.subtotal)}</strong>
        </div>
        {cart.discount.amountCents > 0 && (
          <div className="sum-row">
            <span>Descontos</span>
            <strong>−{formatMoney(cart.discount)}</strong>
          </div>
        )}
        <form action="/carrinho">
          <input name="cep" placeholder="CEP" defaultValue={cep ?? ""} aria-label="CEP para calcular o frete" />
          <button>Calcular</button>
        </form>
        {quotes &&
          (quotes.length === 0 ? (
            <span className="muted">Nenhuma opção de entrega para este CEP.</span>
          ) : (
            quotes.map((q) => (
              <div key={q.id} className="ship-line">
                <strong>{q.service}</strong>
                <span>{q.estimatedBusinessDays} dias úteis</span>
                <strong>{formatMoney(q.price)}</strong>
              </div>
            ))
          ))}
        <div className="sum-row pix-total">
          <span>Total no Pix</span>
          <strong>{formatMoney(pixPrice(cart.total))}</strong>
        </div>
        <form action={goToCheckout} style={{ display: "block" }}>
          <button className="btn btn-coral btn-block">Finalizar compra</button>
        </form>
      </aside>
    </div>
  );
}
