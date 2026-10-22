import { ProductGrid } from "@/components/product-card.tsx";
import { commerce } from "@/lib/store.ts";

interface Props {
  searchParams: Promise<{ q?: string; ordem?: string }>;
}

const SORTS = { relevancia: "relevance", "menor-preco": "price_asc", "maior-preco": "price_desc", novidades: "newest" } as const;

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", ordem = "relevancia" } = await searchParams;
  const sort = SORTS[ordem as keyof typeof SORTS] ?? "relevance";
  const result = await commerce.search.search({ term: q.trim(), sort, limit: 24 });
  return (
    <div className="stack">
      <h1>{q ? `Resultados para “${q}”` : "Todos os produtos"}</h1>
      <form className="row" action="/busca">
        <input type="hidden" name="q" value={q} />
        <label className="muted" htmlFor="ordem">
          Ordenar por
        </label>
        <select id="ordem" name="ordem" defaultValue={ordem} className="input" style={{ flex: "none", width: "auto" }}>
          <option value="relevancia">Relevância</option>
          <option value="menor-preco">Menor preço</option>
          <option value="maior-preco">Maior preço</option>
          <option value="novidades">Novidades</option>
        </select>
        <button className="button button-ghost">Aplicar</button>
        <span className="muted">{result.total} produtos</span>
      </form>
      <ProductGrid products={result.items} empty="Nenhum produto encontrado." />
    </div>
  );
}
