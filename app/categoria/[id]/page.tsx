import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product-card.tsx";
import { commerce } from "@/lib/store.ts";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pagina?: string }>;
}

const PAGE = 24;

export default async function CategoryPage({ params, searchParams }: Props) {
  const { id } = await params;
  const page = Math.max(1, Number((await searchParams).pagina) || 1);
  const categories = await commerce.catalog.getCategories();
  const category = categories.find((c) => c.id === id);
  if (!category) notFound();
  const { items, nextCursor } = await commerce.catalog.getProducts({ categoryId: id, limit: PAGE, cursor: String((page - 1) * PAGE) });
  const children = categories.filter((c) => c.parentId === id);
  return (
    <div className="stack">
      <h1>{category.name}</h1>
      {children.length > 0 && (
        <nav className="row" aria-label="Subcategorias">
          {children.map((c) => (
            <Link key={c.id} href={`/categoria/${c.id}`} className="button button-ghost">
              {c.name}
            </Link>
          ))}
        </nav>
      )}
      <ProductGrid products={items} empty="Nenhum produto nesta categoria." />
      <nav className="row" aria-label="Paginação">
        {page > 1 && (
          <Link className="button button-ghost" href={`/categoria/${id}?pagina=${page - 1}`}>
            Anterior
          </Link>
        )}
        {nextCursor && (
          <Link className="button button-ghost" href={`/categoria/${id}?pagina=${page + 1}`}>
            Próxima
          </Link>
        )}
      </nav>
    </div>
  );
}
