"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

/**
 * Header shell. On the home page it floats transparent over the hero video (white logo and icons) and turns
 * solid on hover/focus or as soon as the page scrolls — the BlueMan behaviour. Elsewhere it is always solid.
 */
export function SiteHeader({ children }: { children: ReactNode }) {
  const isHome = usePathname() === "/";
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);
  return (
    <header className="header" data-home={isHome ? "true" : undefined} data-overlay={isHome && !scrolled ? "true" : undefined}>
      {children}
    </header>
  );
}
