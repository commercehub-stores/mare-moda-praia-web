import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { cookies } from "next/headers";
import Link from "next/link";
import type { ReactNode } from "react";
import { openBag } from "@/app/actions.ts";
import { BagDrawer } from "@/components/bag-drawer.tsx";
import { BAG_OPEN_COOKIE, currentCart } from "@/lib/cart.ts";
import { quickConfig } from "@/lib/config.ts";
import { NAV } from "@/lib/mare.ts";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], axes: ["SOFT", "WONK", "opsz"], style: ["normal", "italic"], variable: "--font-fraunces", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${quickConfig.storeName} · moda praia masculina`, template: `%s · ${quickConfig.storeName}` },
  description: "Shorts, sungas e camisas com estampas autorais e tecidos que secam rápido.",
};
export const viewport: Viewport = { themeColor: "#10222b" };
// Catalog and cart are read on every request (no VTEX calls at build time).
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [cart, jar] = await Promise.all([currentCart().catch(() => null), cookies()]);
  const count = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
  const bagOpen = jar.get(BAG_OPEN_COOKIE)?.value === "1";

  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <div className="announcement" role="region" aria-label="Vantagens">
          <span>Frete grátis acima de R$ 299</span>
          <span>5% off no Pix</span>
          <span>Troca fácil em 30 dias</span>
        </div>
        <header className="header">
          <div className="header-row page">
            <nav className="nav" aria-label="Categorias">
              {NAV.map((c) => (
                <Link key={c.slug} href={`/c/${c.slug}`} className={c.slug === "sale" ? "nav-sale" : undefined}>
                  {c.name}
                </Link>
              ))}
            </nav>
            <Link href="/" className="logo" aria-label="Maré Moda Praia, página inicial">
              <span className="logo-word">maré</span>
              <span className="logo-tag">MODA PRAIA</span>
            </Link>
            <div className="header-icons">
              <Link href="/busca" className="icon-btn" aria-label="Buscar">
                <img src="/icons/search.svg" alt="" width={22} height={22} />
              </Link>
              <a href={`https://${quickConfig.account}.myvtex.com/_secure/account`} className="icon-btn hide-sm" aria-label="Minha conta">
                <img src="/icons/user.svg" alt="" width={22} height={22} />
              </a>
              <span className="icon-btn hide-sm" aria-hidden="true">
                <img src="/icons/heart.svg" alt="" width={22} height={22} />
              </span>
              <form action={openBag}>
                <button className="icon-btn" aria-label={`Abrir sacola, ${count} ${count === 1 ? "item" : "itens"}`}>
                  <img src="/icons/bag.svg" alt="" width={22} height={22} />
                  {count > 0 && <span className="bag-count">{count}</span>}
                </button>
              </form>
            </div>
          </div>
          <nav className="nav-mobile" aria-label="Categorias (celular)">
            {NAV.map((c) => (
              <Link key={c.slug} href={`/c/${c.slug}`} className={c.slug === "sale" ? "nav-sale" : undefined}>
                {c.name}
              </Link>
            ))}
          </nav>
        </header>

        <main>{children}</main>

        <footer className="footer page">
          <div className="footer-cols">
            <div className="footer-brand">
              <span className="logo-word">maré</span>
              <p>Moda praia masculina feita no Rio, com estampas autorais e tecidos que secam rápido.</p>
            </div>
            <div className="footer-col">
              <strong>Institucional</strong>
              <span>Sobre a Maré</span>
              <span>Nossas lojas</span>
              <span>Trabalhe conosco</span>
              <span>Sustentabilidade</span>
            </div>
            <div className="footer-col">
              <strong>Ajuda</strong>
              <span>Trocas e devoluções</span>
              <span>Prazos de entrega</span>
              <span>Guia de medidas</span>
              <span>Fale conosco</span>
            </div>
            <div className="footer-col">
              <strong>Minha conta</strong>
              <a href={`https://${quickConfig.account}.myvtex.com/_secure/account#/orders`}>Meus pedidos</a>
              <span>Lista de desejos</span>
              <span>Endereços</span>
              <span>Cashback</span>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Maré Moda Praia · loja demo gerada pelo Quick Painel</span>
            {["Pix", "Visa", "Mastercard", "Elo", "Boleto"].map((p) => (
              <span key={p} className="pay">
                {p}
              </span>
            ))}
          </div>
        </footer>

        {bagOpen && <BagDrawer cart={cart} />}
      </body>
    </html>
  );
}
