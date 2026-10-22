# Carrinho e checkout

1. O carrinho é o orderForm da VTEX; o id fica no cookie `qs_cart` (`lib/cart.ts`).
2. Adicionar: `commerce.cart.addItem(id, { variantId, quantity })`. Alterar/remover:
   `updateItem(id, itemId, quantity)` (0 remove). `itemId` é o `id` do item no carrinho.
3. Frete: `estimateShipping(id, { postalCode, country: "BRA" })` — lista vazia significa que a conta não
   tem logística para o CEP (veja a Prontidão da loja no painel).
4. Finalizar: `goToCheckout` chama `getCheckoutUrl` e redireciona para o checkout nativo da VTEX.
   O pagamento **não** acontece neste repo.
