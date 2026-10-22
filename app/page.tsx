import Link from "next/link";
import { subscribe } from "@/app/actions.ts";
import { HeroVideo } from "@/components/hero-video.tsx";
import { ProductCard } from "@/components/product-card.tsx";
import { collectionProducts, departmentProducts, withImages } from "@/lib/catalog.ts";
import { collectionBySlug } from "@/lib/mare.ts";

interface Props {
  searchParams: Promise<{ vitrine?: string; newsletter?: string }>;
}

const SHOWCASE_TABS = ["shorts", "sungas", "camisas", "camisetas"] as const;
const CATEGORY_TILES = [
  { slug: "shorts", label: "Shorts", img: "/mare/cat-shorts.jpg" },
  { slug: "sungas", label: "Sungas", img: "/mare/cat-sungas.jpg" },
  { slug: "camisas", label: "Camisas", img: "/mare/cat-camisas.jpg" },
  { slug: "camisetas", label: "Camisetas", img: "/mare/cat-camisetas.jpg" },
  { slug: "bermudas", label: "Bermudas", img: "/mare/cat-bermudas.jpg" },
];
const BENEFITS = [
  { icon: "truck", title: "Frete grátis", text: "acima de R$ 299" },
  { icon: "pix", title: "5% off no Pix", text: "aprovação na hora" },
  { icon: "card", title: "Até 6x sem juros", text: "em todos os cartões" },
  { icon: "swap", title: "Troca grátis", text: "em até 30 dias" },
];

function SectionHead({ eyebrow, title, href, link }: { eyebrow: string; title: string; href: string; link: string }) {
  return (
    <div className="section-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display">{title}</h2>
      </div>
      <Link href={href} className="link-arrow">
        {link}
        <img src="/icons/arrow.svg" alt="" width={16} height={16} />
      </Link>
    </div>
  );
}

export default async function Home({ searchParams }: Props) {
  const { vitrine = "shorts", newsletter } = await searchParams;
  const tab = SHOWCASE_TABS.find((t) => t === vitrine) ?? "shorts";
  const tabCollection = collectionBySlug(tab);
  const [showcase, newest] = await Promise.all([
    tabCollection ? collectionProducts(tabCollection).catch(() => []) : [],
    departmentProducts("newest").catch(() => []),
  ]);
  const bestSellers = withImages(showcase).slice(0, 4);
  const arrivals = withImages(newest)
    .filter((p) => !bestSellers.some((b) => b.id === p.id))
    .slice(0, 4);

  return (
    <>
      <section className="hero page" aria-label="Coleção Verão 27">
        <HeroVideo />
        <p className="eyebrow">Coleção Verão 27</p>
        <h1 className="display">
          Verão sem
          <br />
          roteiro.
        </h1>
        <p>Estampas pintadas à mão, tecidos leves e o caimento de sempre.</p>
        <div className="hero-ctas">
          <Link href="/c/novidades" className="btn btn-coral">
            Ver coleção
          </Link>
          <Link href="/c/shorts" className="btn btn-outline-light">
            Shorts estampados
          </Link>
        </div>
        <span className="hero-scroll" aria-hidden="true">
          ROLE ↓
        </span>
      </section>

      <section className="benefits page" aria-label="Benefícios">
        {BENEFITS.map((b) => (
          <div key={b.icon} className="benefit">
            <img src={`/icons/${b.icon}.svg`} alt="" width={24} height={24} />
            <div>
              <strong>{b.title}</strong>
              <span>{b.text}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="section page">
        <SectionHead eyebrow="Categorias" title="Escolha pelo seu mar" href="/c/novidades" link="Ver todas" />
        <div className="categories">
          {CATEGORY_TILES.map((c) => (
            <Link key={c.slug} href={`/c/${c.slug}`} className="category">
              <div className="category-img">
                <img src={c.img} alt="" loading="lazy" />
              </div>
              <span>
                {c.label}
                <img src="/icons/arrow-14.svg" alt="" width={14} height={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section page" id="vitrine">
        <SectionHead eyebrow="Destaques" title="Mais vendidos" href={`/c/${tab}`} link="Ver tudo" />
        <nav className="chips" aria-label="Filtrar vitrine">
          {SHOWCASE_TABS.map((t) => (
            <Link key={t} href={`/?vitrine=${t}#vitrine`} className="chip" aria-current={t === tab ? "true" : undefined} scroll={false}>
              {collectionBySlug(t)?.name}
            </Link>
          ))}
        </nav>
        <div className="products">
          {bestSellers.map((p, i) => (
            <ProductCard key={p.id} product={p} badge={i === 0 ? "Mais vendido" : undefined} />
          ))}
        </div>
      </section>

      <section className="editorial page">
        <div className="editorial-img">
          <img src="/mare/editorial-linho.jpg" alt="Camisa de linho off white" loading="lazy" />
        </div>
        <div className="editorial-copy">
          <p className="eyebrow">Linho &amp; viscose</p>
          <h2 className="display">
            Tecidos que respiram
            <br />
            com você.
          </h2>
          <p>Camisas leves para o fim de tarde na orla e o jantar depois. Corte reto, botões de coco e lavagem que deixa tudo mais macio.</p>
          <Link href="/c/camisas" className="btn btn-ink">
            Ver camisas
            <img src="/icons/arrow-white.svg" alt="" width={16} height={16} />
          </Link>
        </div>
      </section>

      <section className="section page">
        <SectionHead eyebrow="Acabou de chegar" title="Novidades" href="/c/novidades" link="Ver tudo" />
        <div className="products">
          {arrivals.map((p) => (
            <ProductCard key={p.id} product={p} badge="Novo" />
          ))}
        </div>
      </section>

      <section className="section page">
        <SectionHead eyebrow="Na areia com a gente" title="#VerãoMaré" href="/c/novidades" link="@mare.modapraia" />
        <div className="ugc">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <img key={n} src={`/mare/ugc-${n}.jpg`} alt="" loading="lazy" />
          ))}
        </div>
      </section>

      <section className="newsletter-wrap page" id="newsletter">
        <div className="newsletter">
          <div>
            <h2 className="display">10% na primeira compra</h2>
            <p>Receba lançamentos de estampa antes de todo mundo. Sem spam, prometido.</p>
          </div>
          {newsletter === "ok" ? (
            <p className="thanks">Pronto! Seu cupom chega no e-mail.</p>
          ) : (
            <form action={subscribe}>
              <label htmlFor="email" className="sr-only">
                E-mail
              </label>
              <input id="email" name="email" type="email" required placeholder="seu@email.com" autoComplete="email" />
              <button className="btn btn-coral">Quero meu cupom</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
