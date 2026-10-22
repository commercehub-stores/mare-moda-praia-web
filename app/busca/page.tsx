import type { Metadata } from "next";
import { ProductGrid } from "@/components/product-card.tsx";
import { withImages } from "@/lib/catalog.ts";
import { DEPARTMENT_ID } from "@/lib/mare.ts";
import { commerce } from "@/lib/store.ts";

export const metadata: Metadata = { title: "Busca" };

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const term = q.trim();
  const result = term ? await commerce.search.search({ term, filters: { category: [DEPARTMENT_ID] }, limit: 24 }).catch(() => null) : null;
  const items = withImages(result?.items ?? []);
  return (
    <>
      <div className="plp-head page">
        <h1 className="display" style={{ fontSize: 48, margin: 0 }}>
          {term ? `“${term}”` : "Buscar"}
        </h1>
        <div className="shipping-box" style={{ maxWidth: 560 }}>
          <form action="/busca" role="search">
            <label htmlFor="q" className="sr-only">
              Buscar produtos
            </label>
            <input id="q" name="q" defaultValue={term} placeholder="Short, sunga, camisa de linho…" autoFocus={!term} />
            <button>Buscar</button>
          </form>
        </div>
        {result && (
          <p className="muted" style={{ margin: 0 }}>
            {items.length} {items.length === 1 ? "produto" : "produtos"}
          </p>
        )}
      </div>
      <div className="page">{term && <ProductGrid products={items} empty="Nada encontrado. Que tal procurar por short, sunga ou camisa?" />}</div>
    </>
  );
}
