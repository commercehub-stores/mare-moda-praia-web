import Link from "next/link";
import { subscribe } from "@/app/actions.ts";
import type { Product } from "@/lib/commerce/index.ts";
import { formatMoney } from "@/lib/format.ts";
import { type Post, topicSlug } from "@/lib/blog.ts";
import { leadVariant, pixPrice, productPhotos, sizeOf, sortedVariants } from "@/lib/mare.ts";

export const Clock = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" />
    <path d="M8 4.5V8l2.5 1.5" strokeLinecap="round" />
  </svg>
);

export const Arrow = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Plus = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M8 3v10M3 8h10" strokeLinecap="round" />
  </svg>
);

export const BagIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M3 5.5h10l-.8 8.5H3.8L3 5.5Z" strokeLinejoin="round" />
    <path d="M5.8 5.5V4.3a2.2 2.2 0 0 1 4.4 0v1.2" />
  </svg>
);

/** "ESTILO · ⏱ 5 min" */
export function PostMeta({ post, light = false }: { post: Post; light?: boolean }) {
  return (
    <div className={light ? "post-meta light" : "post-meta"}>
      <Link href={`/blog?tema=${topicSlug(post.topic)}`} className="post-topic">
        {post.topic}
      </Link>
      <span aria-hidden="true">·</span>
      <Clock />
      <span>{post.minutes} min</span>
    </div>
  );
}

export const Avatar = ({ initials, size = 36 }: { initials: string; size?: number }) => (
  <span className="avatar" style={{ width: size, height: size }} aria-hidden="true">
    {initials}
  </span>
);

/** Data a client component needs to show a product and add one size of it. */
export interface LookProduct {
  slug: string;
  name: string;
  image: string | null;
  price: string;
  listPrice: string | null;
  pix: string;
  priceCents: number;
  variants: { id: string; size: string; available: boolean }[];
  defaultVariant: string | null;
}

export function toLookProduct(slug: string, p: Product): LookProduct {
  const lead = leadVariant(p);
  const variants = sortedVariants(p).map((v) => ({ id: v.id, size: sizeOf(v), available: v.available }));
  const available = variants.filter((v) => v.available);
  return {
    slug,
    name: p.name,
    image: productPhotos(p)[0] ?? null,
    price: lead ? formatMoney(lead.price) : "",
    listPrice: lead?.listPrice && lead.listPrice.amountCents > lead.price.amountCents ? formatMoney(lead.listPrice) : null,
    pix: lead ? formatMoney(pixPrice(lead.price)) : "",
    priceCents: lead?.price.amountCents ?? 0,
    variants,
    defaultVariant: (available.find((v) => v.size === "M") ?? available[0])?.id ?? null,
  };
}

export function BlogNewsletter({ ok, back }: { ok: boolean; back: string }) {
  return (
    <section className="blog-news page" id="newsletter">
      <div>
        <h2 className="display">Uma maré por semana</h2>
        <p className="muted">Toda sexta: uma matéria, uma praia e um look. Leitura de 4 minutos.</p>
      </div>
      {ok ? (
        <p className="blog-news-ok">Pronto! O próximo Diário chega na sexta.</p>
      ) : (
        <form action={subscribe}>
          <input type="hidden" name="back" value={back} />
          <label className="sr-only" htmlFor="news-email">
            Seu e-mail
          </label>
          <input id="news-email" type="email" name="email" placeholder="seu@email.com" required autoComplete="email" />
          <button className="btn btn-ink">Assinar o Diário</button>
        </form>
      )}
    </section>
  );
}
