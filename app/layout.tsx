import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { currentCart } from "@/lib/cart.ts";
import { quickConfig } from "@/lib/config.ts";
import { commerce } from "@/lib/store.ts";
import "./globals.css";

export const metadata: Metadata = { title: { default: quickConfig.storeName, template: `%s · ${quickConfig.storeName}` } };
// Catalog and cart are read on every request (no VTEX calls at build time).
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [categories, cart] = await Promise.all([commerce.catalog.getCategories().catch(() => []), currentCart().catch(() => null)]);
  const top = categories.filter((c) => c.parentId === null);
  const count = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
  return (
    <html lang="pt-BR">
      <body>
        <header className="header">
          <div className="container header-row">
            <Link href="/" className="logo">
              {quickConfig.storeName}
            </Link>
            <form action="/busca" className="search" role="search">
              <input name="q" className="input" placeholder="Buscar produtos" aria-label="Buscar produtos" />
              <button className="button">Buscar</button>
            </form>
            <Link href="/carrinho" className="button button-ghost">
              Carrinho{count > 0 ? ` (${count})` : ""}
            </Link>
          </div>
          {top.length > 0 && (
            <nav className="container nav" aria-label="Categorias">
              {top.map((c) => (
                <Link key={c.id} href={`/categoria/${c.id}`}>
                  {c.name}
                </Link>
              ))}
            </nav>
          )}
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
