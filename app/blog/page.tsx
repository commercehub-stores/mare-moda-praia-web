import type { Metadata } from "next";
import Link from "next/link";
import { addToCart } from "@/app/actions.ts";
import { Arrow, Avatar, BlogNewsletter, Clock, Plus, PostMeta, toLookProduct } from "@/components/blog.tsx";
import { BLOG_TOPICS, EDITION, editionProducts, POSTS, type Post, productsBySlug, topicSlug } from "@/lib/blog.ts";

export const metadata: Metadata = {
  title: "Diário da Maré",
  description: "Histórias de estampa, de praia e de quem vive de sal na pele.",
};

interface Props {
  searchParams: Promise<{ tema?: string; q?: string; newsletter?: string }>;
}

const normalize = (s: string) => topicSlug(s).replace(/-/g, " ");

function matches(post: Post, tema: string | undefined, q: string) {
  if (tema && topicSlug(post.topic) !== tema) return false;
  if (!q) return true;
  const hay = normalize([post.title, post.dek, post.topic, ...post.tags, ...post.body.map((b) => ("text" in b ? b.text : ""))].join(" "));
  return normalize(q)
    .split(" ")
    .filter(Boolean)
    .every((w) => hay.includes(w));
}

/** Figma D7 · Blog · Diário da Maré (11:457). */
export default async function BlogPage({ searchParams }: Props) {
  const { tema, q = "", newsletter } = await searchParams;
  const topic = BLOG_TOPICS.find((t) => topicSlug(t) === tema);
  const filtering = Boolean(topic || q.trim());
  const posts = POSTS.filter((p) => matches(p, topic ? tema : undefined, q.trim()));
  const cover: Post | undefined = filtering ? undefined : posts[0];
  const rest = filtering ? posts : posts.slice(1);
  const featured = rest[0];
  const side = rest.slice(1, 4);
  const more = rest.slice(4);

  const edition = editionProducts();
  const products = await productsBySlug(edition.map((e) => e.slug));
  const shelf = edition.filter((e) => products.has(e.slug));

  return (
    <div className="blog">
      <header className="blog-head page">
        <p className="blog-edition">
          <span>Edição Nº {EDITION.number}</span>
          <span aria-hidden="true">·</span>
          <span>{EDITION.month}</span>
          <span aria-hidden="true">·</span>
          <span>{EDITION.season}</span>
        </p>
        <h1 className="display blog-title">Diário da Maré</h1>
        <p className="blog-sub">Histórias de estampa, de praia e de quem vive de sal na pele.</p>
        <div className="blog-filters">
          <Link href="/blog" className={topic ? "chip" : "chip chip-on"} scroll={false}>
            Tudo
          </Link>
          {BLOG_TOPICS.map((t) => (
            <Link key={t} href={`/blog?tema=${topicSlug(t)}`} className={topic === t ? "chip chip-on" : "chip"} scroll={false}>
              {t}
            </Link>
          ))}
          <form action="/blog" className="blog-search" role="search">
            {topic && <input type="hidden" name="tema" value={tema} />}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="7" cy="7" r="4.8" />
              <path d="m10.6 10.6 3 3" strokeLinecap="round" />
            </svg>
            <label className="sr-only" htmlFor="blog-q">
              Buscar matérias
            </label>
            <input id="blog-q" name="q" defaultValue={q} placeholder="Buscar matérias" />
          </form>
        </div>
      </header>

      {cover && (
        <section className="page">
          <Link href={`/blog/${cover.slug}`} className="blog-cover">
            <img src={cover.cover} alt="" />
            <div className="blog-cover-shade" aria-hidden="true" />
            <div className="blog-cover-text">
              <span className="blog-pill">Matéria de capa</span>
              <h2 className="display">{cover.title}</h2>
              <p>{cover.dek}</p>
              <div className="blog-byline">
                <Avatar initials={cover.author.initials} />
                <span className="blog-by">por {cover.author.name}</span>
                <span className="post-meta light">
                  <span className="post-topic">{cover.topic}</span>
                  <span aria-hidden="true">·</span>
                  <Clock />
                  <span>{cover.minutes} min</span>
                </span>
              </div>
            </div>
            <span className="btn blog-cover-cta">
              Ler matéria <Arrow size={16} />
            </span>
          </Link>
        </section>
      )}

      {posts.length === 0 && (
        <section className="page blog-empty">
          <p className="display">Nenhuma matéria encontrada.</p>
          <Link href="/blog" className="btn btn-outline">
            Ver todas as matérias
          </Link>
        </section>
      )}

      {featured && (
        <section className="page blog-grid">
          <article className="blog-featured">
            <Link href={`/blog/${featured.slug}`} className="blog-img">
              <img src={featured.cover} alt="" loading="lazy" />
            </Link>
            <PostMeta post={featured} />
            <h2 className="display">
              <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
            </h2>
            <p className="muted">{featured.dek}</p>
          </article>
          {side.length > 0 && (
            <div className="blog-side">
              {side.map((p) => (
                <article key={p.slug} className="blog-row">
                  <Link href={`/blog/${p.slug}`} className="blog-img" tabIndex={-1} aria-hidden="true">
                    <img src={p.cover} alt="" loading="lazy" />
                  </Link>
                  <div>
                    <PostMeta post={p} />
                    <h3 className="display">
                      <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                    </h3>
                    <Link href={`/blog/${p.slug}`} className="blog-read">
                      Ler <Arrow />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {more.length > 0 && (
        <section className="page blog-more">
          {more.map((p) => (
            <article key={p.slug} className="blog-card">
              <Link href={`/blog/${p.slug}`} className="blog-img">
                <img src={p.cover} alt="" loading="lazy" />
              </Link>
              <PostMeta post={p} />
              <h3 className="display">
                <Link href={`/blog/${p.slug}`}>{p.title}</Link>
              </h3>
            </article>
          ))}
        </section>
      )}

      {shelf.length > 0 && (
        <section className="blog-shop" id="edicao">
          <div className="blog-shop-in page">
            <div className="blog-shop-head">
              <div>
                <p className="eyebrow">Compre a edição</p>
                <h2 className="display">Tudo o que apareceu nas matérias</h2>
              </div>
              <Link href="/blog/edicao" className="btn btn-outline-light">
                Ver os {shelf.length} produtos <Arrow size={16} />
              </Link>
            </div>
            <div className="blog-shelf">
              {shelf.slice(0, 5).map(({ slug, post }) => {
                const lp = toLookProduct(slug, products.get(slug)!);
                return (
                  <div key={slug} className="shelf-item">
                    <Link href={`/p/${slug}`} className="shelf-img">
                      {lp.image && <img src={lp.image} alt="" loading="lazy" />}
                      <span className="shelf-from">de: {post.short}</span>
                    </Link>
                    <Link href={`/p/${slug}`} className="shelf-name">
                      {lp.name}
                    </Link>
                    <div className="shelf-row">
                      <strong>{lp.price}</strong>
                      {lp.defaultVariant && (
                        <form action={addToCart}>
                          <input type="hidden" name="variantId" value={lp.defaultVariant} />
                          <input type="hidden" name="quantity" value="1" />
                          <button className="shelf-add" aria-label={`Adicionar ${lp.name} à sacola`}>
                            <Plus />
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <BlogNewsletter ok={newsletter === "ok"} back="/blog" />
    </div>
  );
}
