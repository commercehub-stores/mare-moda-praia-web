import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product-card.tsx";
import { EDITION, editionProducts, productsBySlug } from "@/lib/blog.ts";

export const metadata: Metadata = { title: `Compre a edição Nº ${EDITION.number}` };

/** "Ver os N produtos": every product featured in the edition's posts. */
export default async function EditionPage() {
  const edition = editionProducts();
  const products = await productsBySlug(edition.map((e) => e.slug));
  const list = edition.flatMap((e) => (products.has(e.slug) ? [products.get(e.slug)!] : []));
  return (
    <div className="page edition-page">
      <nav className="crumbs" aria-label="Você está em">
        <Link href="/blog">Diário</Link>
        <span aria-hidden="true">/</span>
        <span>Compre a edição</span>
      </nav>
      <header className="edition-head">
        <p className="eyebrow">Edição Nº {EDITION.number} · {EDITION.season}</p>
        <h1 className="display">Tudo o que apareceu nas matérias</h1>
        <p className="muted">{list.length} produtos das histórias deste mês.</p>
      </header>
      <ProductGrid products={list} empty="Os produtos desta edição esgotaram." />
    </div>
  );
}
