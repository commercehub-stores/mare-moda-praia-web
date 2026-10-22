import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product-card.tsx";
import { collectionProducts, withImages } from "@/lib/catalog.ts";
import type { Product } from "@/lib/commerce/index.ts";
import { COLLECTIONS, collectionBySlug, discountPercent, leadVariant, SIZE_ORDER, sizeOf, slugify } from "@/lib/mare.ts";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tipo?: string; tamanho?: string; preco?: string; ordem?: string; mostrar?: string }>;
}

const PAGE = 12;
const PRICES = [
  { key: "ate-200", label: "Até R$ 200", test: (c: number) => c <= 20_000 },
  { key: "200-400", label: "R$ 200 a R$ 400", test: (c: number) => c > 20_000 && c <= 40_000 },
  { key: "400-mais", label: "Acima de R$ 400", test: (c: number) => c > 40_000 },
];
const SORTS = [
  { key: "relevancia", label: "Mais vendidos" },
  { key: "menor-preco", label: "Menor preço" },
  { key: "maior-preco", label: "Maior preço" },
  { key: "desconto", label: "Maior desconto" },
];

const priceOf = (p: Product) => leadVariant(p)?.price.amountCents ?? 0;
const hasSize = (p: Product, size: string) => p.variants.some((v) => v.available && sizeOf(v) === size);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = collectionBySlug((await params).slug);
  return { title: c?.name ?? "Categoria", description: c?.description };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const collection = collectionBySlug(slug);
  if (!collection) notFound();
  const q = await searchParams;
  const all = withImages(await collectionProducts(collection).catch(() => []));

  const chip = collection.chips?.find((c) => slugify(c.label) === q.tipo);
  const price = PRICES.find((p) => p.key === q.preco);
  let list = all.filter((p) => (!chip || chip.match.test(p.name)) && (!q.tamanho || hasSize(p, q.tamanho)) && (!price || price.test(priceOf(p))));
  const sort = SORTS.find((s) => s.key === q.ordem)?.key ?? "relevancia";
  if (sort === "menor-preco") list = [...list].sort((a, b) => priceOf(a) - priceOf(b));
  if (sort === "maior-preco") list = [...list].sort((a, b) => priceOf(b) - priceOf(a));
  if (sort === "desconto") list = [...list].sort((a, b) => discountPercent(leadVariant(b)) - discountPercent(leadVariant(a)));

  const shown = Math.min(list.length, Math.max(PAGE, Number(q.mostrar) || PAGE));
  const sizes = SIZE_ORDER.filter((s) => all.some((p) => p.variants.some((v) => sizeOf(v) === s)));
  const href = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries({ tipo: q.tipo, tamanho: q.tamanho, preco: q.preco, ordem: q.ordem, ...patch })) if (v) next.set(k, v);
    const s = next.toString();
    return `/c/${slug}${s ? `?${s}` : ""}`;
  };
  const active = [
    chip && { label: chip.label, href: href({ tipo: undefined }) },
    q.tamanho && { label: `Tamanho ${q.tamanho}`, href: href({ tamanho: undefined }) },
    price && { label: price.label, href: href({ preco: undefined }) },
  ].filter((a): a is { label: string; href: string } => Boolean(a));

  return (
    <>
      <div className="plp-head page">
        <nav className="crumbs" aria-label="Você está em">
          <Link href="/">Início</Link>
          <span>/</span>
          <span>{collection.name}</span>
        </nav>
        <div className="plp-title">
          <div>
            <h1 className="display">{collection.name}</h1>
            <p>
              {collection.description} {all.length} {all.length === 1 ? "produto" : "produtos"}.
            </p>
          </div>
          <form className="sort" action={`/c/${slug}`}>
            {q.tipo && <input type="hidden" name="tipo" value={q.tipo} />}
            {q.tamanho && <input type="hidden" name="tamanho" value={q.tamanho} />}
            {q.preco && <input type="hidden" name="preco" value={q.preco} />}
            <label htmlFor="ordem">Ordenar por</label>
            <select id="ordem" name="ordem" defaultValue={sort}>
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            <button>Aplicar</button>
          </form>
        </div>
        <nav className="chips" aria-label="Coleções e tipos">
          {collection.chips ? (
            <>
              <Link href={href({ tipo: undefined })} className="chip" aria-current={!chip ? "true" : undefined}>
                Todos
              </Link>
              {collection.chips.map((c) => (
                <Link key={c.label} href={href({ tipo: slugify(c.label) })} className="chip" aria-current={chip?.label === c.label ? "true" : undefined}>
                  {c.label}
                </Link>
              ))}
            </>
          ) : (
            COLLECTIONS.filter((c) => c.categoryId).map((c) => (
              <Link key={c.slug} href={`/c/${c.slug}`} className="chip">
                {c.name}
              </Link>
            ))
          )}
        </nav>
      </div>

      <div className="plp-body page">
        <aside className="filters" aria-label="Filtros">
          <div className="filters-head">
            <img src="/icons/filter.svg" alt="" width={18} height={18} />
            <strong>Filtros</strong>
            {active.length > 0 && <Link href={`/c/${slug}`}>Limpar</Link>}
          </div>
          {active.length > 0 && (
            <div className="active-filters">
              {active.map((a) => (
                <Link key={a.label} href={a.href} aria-label={`Remover filtro ${a.label}`}>
                  {a.label}
                  <img src="/icons/x-small.svg" alt="" width={12} height={12} />
                </Link>
              ))}
            </div>
          )}
          <details className="filter-group" open>
            <summary>
              <span>Tamanho</span>
              <img src="/icons/chevron-down.svg" alt="" width={14} height={14} />
            </summary>
            <div className="filter-body">
              {sizes.map((s) => (
                <Link key={s} href={href({ tamanho: q.tamanho === s ? undefined : s })} className="size-box" aria-current={q.tamanho === s ? "true" : undefined}>
                  {s}
                </Link>
              ))}
            </div>
          </details>
          <details className="filter-group" open>
            <summary>
              <span>Preço</span>
              <img src="/icons/chevron-down.svg" alt="" width={14} height={14} />
            </summary>
            <div className="filter-body">
              {PRICES.map((p) => {
                const count = all.filter((x) => p.test(priceOf(x))).length;
                const on = price?.key === p.key;
                return (
                  <Link key={p.key} href={href({ preco: on ? undefined : p.key })} className="check-row" aria-current={on ? "true" : undefined}>
                    <span className="box">{on && <img src="/icons/check.svg" alt="" width={12} height={12} />}</span>
                    {p.label}
                    <span className="count">{count}</span>
                  </Link>
                );
              })}
            </div>
          </details>
        </aside>

        <div>
          <ProductGrid products={list.slice(0, shown)} empty="Nenhum produto com esses filtros. Tente limpar algum." columns={3} />
          {list.length > 0 && (
            <div className="load-more">
              <span>
                Você viu {shown} de {list.length} produtos
              </span>
              <div className="progress" aria-hidden="true">
                <span style={{ width: `${Math.round((shown / list.length) * 100)}%` }} />
              </div>
              {shown < list.length && (
                <Link href={`${href({})}${href({}).includes("?") ? "&" : "?"}mostrar=${shown + PAGE}`} className="btn btn-outline" scroll={false}>
                  Carregar mais
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
