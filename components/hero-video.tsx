"use client";

import { useEffect, useRef } from "react";

/**
 * Full-bleed background video for the home hero with a parallax scroll (the video moves at ~40% of the page
 * speed). Muted + playsInline so mobile browsers autoplay it; static poster for people who prefer reduced motion.
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
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight);
        video.style.transform = `translate3d(0, ${y * 0.4}px, 0) scale(1.06)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return (
    <video ref={ref} className="hero-media" autoPlay muted loop playsInline preload="auto" poster="/mare/hero-poster.jpg" aria-hidden="true">
      <source src="/mare/hero.webm" type="video/webm" />
      <source src="/mare/hero.mp4" type="video/mp4" />
    </video>
  );
}
