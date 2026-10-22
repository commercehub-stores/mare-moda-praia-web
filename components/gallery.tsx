"use client";

import { useState } from "react";

/** PDP gallery (Figma "Galeria"): vertical thumbnails + main photo with badge and favourite. */
export function Gallery({ images, name, badge }: { images: string[]; name: string; badge: string | null }) {
  const [current, setCurrent] = useState(0);
  const main = images[current] ?? images[0] ?? "";
  return (
    <div className="gallery">
      <div className="thumbs" role="tablist" aria-label="Fotos do produto">
        {images.map((src, i) => (
          <button key={src} type="button" role="tab" className="thumb" aria-selected={i === current} aria-current={i === current ? "true" : undefined} aria-label={`Foto ${i + 1}`} onClick={() => setCurrent(i)}>
            <img src={src} alt="" />
          </button>
        ))}
      </div>
      <div className="gallery-main">
        <img src={main} alt={name} />
        <div className="card-top">
          {badge && <span className="badge">{badge}</span>}
          <span className="fav" aria-hidden="true">
            <img src="/icons/heart-18.svg" alt="" width={18} height={18} />
          </span>
        </div>
      </div>
    </div>
  );
}
