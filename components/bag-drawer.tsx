import { closeBag, goToCheckout, updateQuantity } from "@/app/actions.ts";
import type { Cart } from "@/lib/commerce/index.ts";
import { formatMoney } from "@/lib/format.ts";
import { FREE_SHIPPING_CENTS, pixPrice, splitLineName } from "@/lib/mare.ts";

/** The bag as a side drawer (Figma "D4 · Sacola"). Server-rendered; every control is a form posting a Server Action. */
export function BagDrawer({ cart }: { cart: Cart | null }) {
  const items = cart?.items ?? [];
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart?.subtotal ?? { amountCents: 0, currency: "BRL" };
  const missing = Math.max(0, FREE_SHIPPING_CENTS - subtotal.amountCents);
  const progress = Math.min(100, Math.round((subtotal.amountCents / FREE_SHIPPING_CENTS) * 100));

  return (
    <>
      <form action={closeBag}>
        <button className="drawer-overlay" aria-label="Fechar sacola" />
      </form>
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="bag-title">
        <div className="drawer-head">
          <h2 id="bag-title" className="display">
            Sua sacola ({count})
          </h2>
          <form action={closeBag}>
            <button aria-label="Fechar sacola">
              <img src="/icons/close.svg" alt="" width={20} height={20} />
            </button>
          </form>
        </div>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <p>Sua sacola está vazia por enquanto.</p>
            <form action={closeBag}>
              <button className="btn btn-ink">Ver novidades</button>
            </form>
          </div>
        ) : (
          <>
            <div className="free-ship">
              <span>{missing === 0 ? "Você ganhou frete grátis" : `Faltam ${formatMoney({ ...subtotal, amountCents: missing })} para o frete grátis`}</span>
              <div className="bar" aria-hidden="true">
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="drawer-items">
              {items.map((item) => {
                const { title, size } = splitLineName(item.name);
                return (
                  <div key={item.id} className="line">
                    <img src={item.imageUrl ?? ""} alt="" />
                    <div className="line-info">
                      <strong>{title}</strong>
                      {size && <span className="muted">Tamanho {size}</span>}
                      <div className="line-row">
                        <div className="stepper">
                          <form action={updateQuantity}>
                            <input type="hidden" name="itemId" value={item.id} />
                            <input type="hidden" name="quantity" value={item.quantity - 1} />
                            <button aria-label={`Diminuir ${title}`}>
                              <img src="/icons/minus-12.svg" alt="" width={12} height={12} />
                            </button>
                          </form>
                          <span aria-label="Quantidade">{item.quantity}</span>
                          <form action={updateQuantity}>
                            <input type="hidden" name="itemId" value={item.id} />
                            <input type="hidden" name="quantity" value={item.quantity + 1} />
                            <button aria-label={`Aumentar ${title}`}>
                              <img src="/icons/plus-12.svg" alt="" width={12} height={12} />
                            </button>
                          </form>
                        </div>
                        <strong>{formatMoney(item.total)}</strong>
                      </div>
                      <form action={updateQuantity}>
                        <input type="hidden" name="itemId" value={item.id} />
                        <input type="hidden" name="quantity" value={0} />
                        <button className="line-remove">Remover</button>
                      </form>
                    </div>
                  </div>
                );
              })}
              <div className="gift">
                <img src="/icons/gift.svg" alt="" width={18} height={18} />
                Embalar para presente (+ R$ 9,90) · escolha no checkout
              </div>
            </div>

            <div className="drawer-foot">
              <div className="sum-row">
                <span>Subtotal</span>
                <strong>{formatMoney(subtotal)}</strong>
              </div>
              {cart && cart.discount.amountCents > 0 && (
                <div className="sum-row">
                  <span>Descontos</span>
                  <strong>−{formatMoney(cart.discount)}</strong>
                </div>
              )}
              <div className="sum-row">
                <span>Frete</span>
                <strong>{missing === 0 ? "grátis" : "calcular no checkout"}</strong>
              </div>
              <div className="sum-row pix-total">
                <span>Total no Pix</span>
                <strong>{formatMoney(pixPrice(cart?.total ?? subtotal))}</strong>
              </div>
              <form action={goToCheckout}>
                <button className="btn btn-coral btn-block">Finalizar compra</button>
              </form>
              <form action={closeBag} style={{ alignSelf: "center" }}>
                <button className="continue">Continuar comprando</button>
              </form>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
