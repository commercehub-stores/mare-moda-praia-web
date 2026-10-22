"use client";

import { useEffect, useState } from "react";

/** Coral bar under the header that fills as the article is read (Figma 11:732). */
export function ReadingProgress({ target }: { target: string }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = document.getElementById(target);
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      setProgress(total <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / total)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [target]);
  return (
    <div className="read-progress" role="progressbar" aria-label="Progresso de leitura" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
      <span style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}

/** "Nesta matéria": table of contents that highlights the section being read. */
export function Toc({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  useEffect(() => {
    const headings = items.map((i) => document.getElementById(i.id)).filter((h): h is HTMLElement => Boolean(h));
    const onScroll = () => {
      const line = window.innerHeight * 0.3;
      let current = headings[0]?.id ?? "";
      for (const h of headings) if (h.getBoundingClientRect().top <= line) current = h.id;
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);
  return (
    <nav className="toc" aria-label="Nesta matéria">
      <p className="toc-title">Nesta matéria</p>
      {items.map((i) => (
        <a key={i.id} href={`#${i.id}`} className={active === i.id ? "on" : undefined} aria-current={active === i.id ? "location" : undefined}>
          {i.text}
        </a>
      ))}
    </nav>
  );
}

/** Share buttons: copy link, WhatsApp and e-mail. */
export function Share({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = () => window.location.href.split("#")[0] ?? "";
  return (
    <div className="share">
      <button
        type="button"
        aria-label={copied ? "Link copiado" : "Copiar link"}
        title={copied ? "Link copiado" : "Copiar link"}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            // clipboard unavailable (insecure context): nothing to do
          }
        }}
      >
        {copied ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="m3 8.5 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M6.5 9.5a3 3 0 0 0 4.2 0l2.3-2.3a3 3 0 0 0-4.2-4.2l-.9.9M9.5 6.5a3 3 0 0 0-4.2 0L3 8.8A3 3 0 0 0 7.2 13l.9-.9" strokeLinecap="round" />
          </svg>
        )}
      </button>
      <button type="button" aria-label="Compartilhar no WhatsApp" title="WhatsApp" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url()}`)}`, "_blank", "noopener")}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M2.5 13.5 3.4 11A5.8 5.8 0 1 1 5.6 13l-3.1.5Z" strokeLinejoin="round" />
          <path d="M6 5.8c.2 1.8 1.6 3.4 3.6 4" strokeLinecap="round" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Enviar por e-mail"
        title="E-mail"
        onClick={() => {
          window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url())}`;
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
          <path d="m2.5 4.5 5.5 4 5.5-4" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
