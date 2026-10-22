# Maré Moda Praia · storefront

Vitrine Next.js sobre a VTEX (conta `quickdigitalpartnerbr`), gerada pelo painel da Quick a partir de
`storefront-vtex` v1.0.0. Leia `AGENTS.md` antes de começar.

```bash
corepack enable
yarn install
yarn dev
```

A compra termina no checkout nativo da VTEX. Nenhuma credencial da VTEX é necessária aqui.

## Maré · loja demo (Figma hKXHAdLe6aG673bUGZBmhZ)

- Layout do Figma "Maré" (Home, Categoria, Produto, Sacola em drawer), tokens em `design/tokens.json` e `app/globals.css`.
- Hero da home: vídeo `public/mare/hero.mp4`/`.webm` (sem áudio, poster `hero-poster.jpg`) ocupando 100% da primeira dobra (`100svh` − anúncio − header).
- Catálogo: departamento VTEX "Maré" (id 19) com Shorts 20, Sungas 21, Camisas 22, Camisetas 23, Bermudas 24, Calças 25 (`lib/mare.ts`). Tamanho é a variação de SKU "Tamanho".
- Rotas: `/`, `/c/[slug]` (inclui `novidades` e `sale`), `/p/[slug]`, `/busca`, `/carrinho`. A sacola abre como drawer via cookie `qs_bag` (Server Actions, sem JS obrigatório).
- Regras exibidas: 5% no Pix, até 6x sem juros (6x ≥ R$ 300, 3x ≥ R$ 100), frete grátis acima de R$ 299. Checkout: camada própria (repo mare-moda-praia-checkout) servida em `/checkout` por rewrite (multi-zones); a sacola é entregue em `/checkout/sacola/{orderFormId}`.
