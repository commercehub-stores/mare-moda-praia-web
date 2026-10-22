# Página de produto (PDP)

1. Rota `app/p/[slug]/page.tsx`: `commerce.catalog.getProduct(slug)` (aceita id numérico ou slug).
2. Variações em `product.variants` (cada uma com `price`, `listPrice`, `available`, `attributes`).
3. "Adicionar ao carrinho" é um `<form action={addToCart}>` com `variantId` e `quantity`.
4. Produto sem variação disponível: mostre indisponível, não esconda a página.
5. Metadados (`generateMetadata`) com o nome do produto.
