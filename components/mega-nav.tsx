"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { MegaMenu } from "@/lib/mare.ts";

const OPEN_DELAY = 80;
const CLOSE_DELAY = 160;

/**
 * Desktop navigation: Novidades · Moda praia ▾ · Roupas ▾ · Sale · Diário. Each ▾ opens a full-width panel
 * with the categories, their subcategories (PLP quick filters) and a featured tile. Opens on hover (with a
 * small intent delay) or click/Enter; Esc, a click outside or navigating closes it.
 */
export function MegaNav({ menus }: { menus: MegaMenu[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const root = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const schedule = (value: number | null, delay: number) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(value), delay);
  };

  useEffect(() => setOpen(null), [pathname]);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(null);
      root.current?.querySelector<HTMLButtonElement>(`[data-menu="${open}"]`)?.focus();
    };
    const onClick = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  return (
    <nav className="nav" aria-label="Categorias" ref={root} onMouseLeave={() => schedule(null, CLOSE_DELAY)}>
      <Link href="/c/novidades" onMouseEnter={() => schedule(null, CLOSE_DELAY)}>
        Novidades
      </Link>
      {menus.map((menu, i) => {
        const isOpen = open === i;
        return (
          <div key={menu.label} className="mega-item" onMouseEnter={() => schedule(i, open === null ? OPEN_DELAY : 0)}>
            <button
              type="button"
              className="mega-trigger"
              data-menu={i}
              aria-expanded={isOpen}
              aria-controls={`mega-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              {menu.label}
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <path d="m2 3.5 3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div id={`mega-${i}`} className="mega-panel" hidden={!isOpen}>
              <div className="mega-inner page">
                <div className="mega-groups" style={{ gridTemplateColumns: `repeat(${menu.groups.length}, minmax(0, 1fr))` }}>
                  {menu.groups.map((g) => (
                    <div key={g.title.href} className="mega-group">
                      <Link href={g.title.href} className="mega-title">
                        {g.title.label}
                      </Link>
                      <ul>
                        {g.links.map((l) => (
                          <li key={l.href}>
                            <Link href={l.href}>{l.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <Link href={menu.feature.href} className="mega-feature">
                  <img src={menu.feature.image} alt="" loading="lazy" />
                  <span className="mega-feature-text">
                    <strong className="display">{menu.feature.title}</strong>
                    <span>{menu.feature.text}</span>
                    <span className="mega-feature-cta">Ver agora →</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
      <Link href="/c/sale" className="nav-sale" onMouseEnter={() => schedule(null, CLOSE_DELAY)}>
        Sale
      </Link>
      <Link href="/blog" className="nav-blog" onMouseEnter={() => schedule(null, CLOSE_DELAY)}>
        Diário
      </Link>
    </nav>
  );
}
