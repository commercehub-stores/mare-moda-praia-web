# Lista de produtos (categoria, busca, coleção)

1. Categoria: `commerce.catalog.getProducts({ categoryId, limit, cursor })`; ids em `getCategories()`.
2. Busca: `commerce.search.search({ term, sort, limit })` — `sort`: relevance, price_asc, price_desc, newest.
3. Paginação: `nextCursor` (string). No máximo 50 itens por chamada.
4. Renderize com `ProductGrid` (`components/product-card.tsx`), que já trata preço "de/por" e indisponível.
5. Teste com o MCP `catalog_search` para ver dados reais da conta antes de escrever a tela.
