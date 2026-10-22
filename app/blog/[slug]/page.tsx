import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { addLook, addToCart } from "@/app/actions.ts";
import { Avatar, BagIcon, BlogNewsletter, type LookProduct, PostMeta, toLookProduct } from "@/components/blog.tsx";
import { ReadingProgress, Share, Toc } from "@/components/reading.tsx";
import { ShopTheLook } from "@/components/shop-the-look.tsx";
import { headingId, POSTS, postBySlug, productsBySlug, readingDate, topicSlug } from "@/lib/blog.ts";
import { formatMoney } from "@/lib/format.ts";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ newsletter?: string }>;
}

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = postBySlug((await params).slug);
  if (!post) return { title: "Matéria" };
  return { title: post.title, description: post.dek, openGraph: { title: post.title, description: post.dek, images: [post.cover], type: "article" } };
}

/** Figma D8 · Blog · Matéria (shop the look) (11:704). */
export default async function PostPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { newsletter } = await searchParams;
  const post = postBySlug(slug);
  if (!post) notFound();

  const catalog = await productsBySlug([...post.products, ...(post.look?.hotspots.map((h) => h.slug) ?? [])]);
  const look = (s: string): LookProduct | null => {
    const p = catalog.get(s);
    return p ? toLookProduct(s, p) : null;
  };
  const listed = post.products.map(look).filter((p): p is LookProduct => p !== null);
  const buyable = listed.filter((p) => p.defaultVariant);
  const lookTotal = buyable.reduce((sum, p) => sum + p.priceCents, 0);
  const spots = (post.look?.hotspots ?? []).flatMap((h) => {
    const product = look(h.slug);
    return product ? [{ x: h.x, y: h.y, product }] : [];
  });
  const toc = post.body.flatMap((b) => (b.type === "h2" ? [{ id: headingId(b.text), text: b.text }] : []));
  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="post" id="materia">
      <ReadingProgress target="materia" />

      <header className="post-head page">
        <nav className="crumbs" aria-label="Você está em">
          <Link href="/blog">Diário</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/blog?tema=${topicSlug(post.topic)}`}>{post.topic}</Link>
        </nav>
        <h1 className="display post-title">{post.title}</h1>
        <p className="post-dek">{post.dek}</p>
        <div className="post-byline">
          <Avatar initials={post.author.initials} size={40} />
          <div>
            <strong>{post.author.name}</strong>
            <span className="muted">
              <time dateTime={post.date}>{readingDate(post.date)}</time> · {post.minutes} min de leitura
            </span>
          </div>
          <span className="post-rule" aria-hidden="true" />
          <Share title={post.title} />
        </div>
      </header>

      <figure className="page post-hero">
        {post.look && spots.length > 0 ? (
          <ShopTheLook image={post.look.image} alt={post.look.caption} spots={spots} />
        ) : (
          <img src={post.cover} alt="" className="post-cover" />
        )}
        {post.look && <figcaption>{post.look.caption}</figcaption>}
      </figure>

      <div className="post-layout page">
        {toc.length > 1 && <Toc items={toc} />}
        <div className="post-body">
          {post.body.map((block, i) => {
            switch (block.type) {
              case "h2":
                return (
                  <h2 key={i} id={headingId(block.text)} className={`display${i === 0 ? " sr-only" : ""}`}>
                    {block.text}
                  </h2>
                );
              case "p":
                return block.dropcap ? (
                  <p key={i} className="dropcap">
                    <span className="display" aria-hidden="true">
                      {block.text[0]}
                    </span>
                    <span className="sr-only">{block.text[0]}</span>
                    {block.text.slice(1)}
                  </p>
                ) : (
                  <p key={i}>{block.text}</p>
                );
              case "quote":
                return (
                  <blockquote key={i}>
                    <p className="display">“{block.text}”</p>
                    <cite>{block.by}</cite>
                  </blockquote>
                );
              case "images":
                return (
                  <div key={i} className="post-images">
                    {block.images.map((img) => (
                      <img key={img.src} src={img.src} alt={img.alt} loading="lazy" />
                    ))}
                  </div>
                );
              case "products":
                if (!listed.length) return null;
                return (
                  <section key={i} className="post-products" aria-labelledby="post-products-title">
                    <div className="post-products-head">
                      <h2 id="post-products-title" className="display">
                        {listed.length === 1 ? "O produto desta matéria" : "Os produtos desta matéria"}
                      </h2>
                      {buyable.length > 1 && (
                        <form action={addLook}>
                          {buyable.map((p) => (
                            <input key={p.slug} type="hidden" name="variantId" value={p.defaultVariant ?? ""} />
                          ))}
                          <button className="post-add-all">
                            Adicionar os {buyable.length} · {formatMoney({ amountCents: lookTotal, currency: "BRL" })}
                          </button>
                        </form>
                      )}
                    </div>
                    {listed.map((p) => (
                      <div key={p.slug} className="post-product">
                        <Link href={`/p/${p.slug}`} className="post-product-img">
                          {p.image && <img src={p.image} alt="" loading="lazy" />}
                        </Link>
                        <div className="post-product-info">
                          <Link href={`/p/${p.slug}`}>
                            <strong>{p.name}</strong>
                          </Link>
                          <span>{p.pix} no Pix</span>
                        </div>
                        <strong className="post-product-price">{p.price}</strong>
                        {p.defaultVariant ? (
                          <form action={addToCart}>
                            <input type="hidden" name="variantId" value={p.defaultVariant} />
                            <input type="hidden" name="quantity" value="1" />
                            <button className="post-product-add" aria-label={`Adicionar ${p.name} à sacola`}>
                              <BagIcon /> <span>Adicionar</span>
                            </button>
                          </form>
                        ) : (
                          <span className="soldout">Esgotado</span>
                        )}
                      </div>
                    ))}
                  </section>
                );
            }
          })}
          <div className="post-tags">
            {post.tags.map((t) => (
              <Link key={t} href={`/blog?q=${encodeURIComponent(t)}`} className="chip">
                #{t}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <section className="page post-related" aria-labelledby="related-title">
        <h2 id="related-title" className="display">
          Continue na maré
        </h2>
        <div className="post-related-grid">
          {related.map((p) => (
            <article key={p.slug} className="blog-card">
              <Link href={`/blog/${p.slug}`} className="blog-img" tabIndex={-1} aria-hidden="true">
                <img src={p.cover} alt="" loading="lazy" />
              </Link>
              <PostMeta post={p} />
              <h3 className="display">
                <Link href={`/blog/${p.slug}`}>{p.title}</Link>
              </h3>
            </article>
          ))}
        </div>
      </section>

      <BlogNewsletter ok={newsletter === "ok"} back={`/blog/${post.slug}`} />
    </article>
  );
}
