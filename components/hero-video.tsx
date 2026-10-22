"use client";

import { useEffect, useRef } from "react";

/**
 * Full-bleed background video for the home hero. Muted + playsInline so mobile browsers autoplay it;
 * paused (poster only) for people who prefer reduced motion.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }
    video.play().catch(() => {
      // Autoplay blocked (e.g. low-power mode): the poster stays visible.
    });
  }, []);
  return (
    <video ref={ref} className="hero-media" autoPlay muted loop playsInline preload="auto" poster="/mare/hero-poster.jpg" aria-hidden="true">
      <source src="/mare/hero.webm" type="video/webm" />
      <source src="/mare/hero.mp4" type="video/mp4" />
    </video>
  );
}
