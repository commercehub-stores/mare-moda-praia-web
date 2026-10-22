"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { addToCart } from "@/app/actions.ts";
import type { LookProduct } from "@/components/blog.tsx";

interface Spot {
  x: number;
  y: number;
  product: LookProduct;
}

/** Figma "Shop the look" (11:759): photo with hotspots; each opens a card to pick a size and add to the bag. */
export function ShopTheLook({
  image,
  alt,
  spots,
}: {
  image: string;
  alt: string;
  spots: Spot[];
}) {
  const [open, setOpen] = useState<number | null>(spots.length ? 0 : null);
  const root = useRef<HTMLDivElement>(null);
  const current = open === null ? null : (spots[open] ?? null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onClick = (e: MouseEvent) =>
      root.current && !root.current.contains(e.target as Node) && setOpen(null);
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div className="look" ref={root}>
      <div className="look-photo">
        <img src={image} alt={alt} />
        <p className="look-hint">
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="2.2" />
            <circle cx="8" cy="8" r="6.2" />
          </svg>
          Toque nos pontos para comprar o look
        </p>
        {spots.map((spot, i) => {
          const p = spot.product;
          const isOpen = open === i;
          return (
            <button
              key={p.slug}
              type="button"
              className={isOpen ? "hotspot on" : "hotspot"}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              aria-expanded={isOpen}
              aria-label={`${p.name}, ${p.price}`}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(isOpen ? null : i);
              }}
            >
              <span />
            </button>
          );
        })}
      </div>
      {current && (
        <LookCard
          key={current.product.slug}
          product={current.product}
          style={cardPosition(current)}
        />
      )}
    </div>
  );
}

/** Desktop: the card floats beside its hotspot, toward the side with more room (phones dock it under the photo). */
function cardPosition({ x, y }: Spot): CSSProperties {
  const horizontal =
    x > 55
      ? { right: `calc(${100 - x}% + 33px)` }
      : { left: `calc(${x}% + 33px)` };
  const vertical =
    y > 60
      ? { bottom: `calc(${100 - y}% - 50px)` }
      : { top: `calc(${y}% - 50px)` };
  return { ...horizontal, ...vertical };
}

function LookCard({
  product: p,
  style,
}: {
  product: LookProduct;
  style: CSSProperties;
}) {
  const [variant, setVariant] = useState(p.defaultVariant);
  const [pending, setPending] = useState(false);
  return (
    <form
      className="look-card"
      style={style}
      action={async (data) => {
        setPending(true);
        try {
          await addToCart(data);
        } finally {
          setPending(false);
        }
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Link href={`/p/${p.slug}`} className="look-card-img">
        {p.image && <img src={p.image} alt="" />}
      </Link>
      <div className="look-card-info">
        <Link href={`/p/${p.slug}`} className="look-card-name">
          {p.name}
        </Link>
        <p className="look-card-price">
          <strong>{p.price}</strong>
          {p.listPrice && <s>{p.listPrice}</s>}
        </p>
        <p className="look-card-pix">{p.pix} no Pix</p>
        <div className="look-sizes" role="radiogroup" aria-label="Tamanho">
          {p.variants.map((v) => (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={variant === v.id}
              disabled={!v.available}
              className={variant === v.id ? "on" : undefined}
              onClick={() => setVariant(v.id)}
            >
              {v.size}
            </button>
          ))}
        </div>
      </div>
      <input type="hidden" name="variantId" value={variant ?? ""} />
      <input type="hidden" name="quantity" value="1" />
      <button
        className="look-add"
        disabled={!variant || pending}
        aria-label={`Adicionar ${p.name} à sacola`}
      >
        {pending ? (
          <span className="spin" aria-hidden="true" />
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <path d="M3 5.5h10l-.8 8.5H3.8L3 5.5Z" strokeLinejoin="round" />
            <path d="M5.8 5.5V4.3a2.2 2.2 0 0 1 4.4 0v1.2" />
          </svg>
        )}
      </button>
    </form>
  );
}
