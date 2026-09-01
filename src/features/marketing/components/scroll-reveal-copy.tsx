"use client";

import { useEffect, useMemo, useRef } from "react";

export function ScrollRevealCopy({ children }: { children: string }) {
  const copyRef = useRef<HTMLParagraphElement>(null);
  const words = useMemo(() => children.trim().split(/\s+/), [children]);

  useEffect(() => {
    const copy = copyRef.current;
    if (!copy) return;

    const wordElements = Array.from(copy.querySelectorAll<HTMLElement>(".marketing-scroll-reveal-word"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      wordElements.forEach((word) => word.style.setProperty("--word-progress", "1"));
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = copy.getBoundingClientRect();
      const revealStart = window.innerHeight * 0.86;
      const revealEnd = window.innerHeight * 0.3;
      const sectionProgress = Math.min(1, Math.max(0, (revealStart - bounds.top) / (revealStart - revealEnd)));
      const revealSpan = Math.max(1, wordElements.length - 1);

      wordElements.forEach((word, index) => {
        const wordStart = (index / revealSpan) * 0.82;
        const wordProgress = Math.min(1, Math.max(0, (sectionProgress - wordStart) / 0.18));
        word.style.setProperty("--word-progress", wordProgress.toFixed(3));
      });
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [words]);

  return (
    <p className="marketing-scroll-reveal" ref={copyRef}>
      {words.map((word, index) => (
        <span className="marketing-scroll-reveal-word" key={`${index}-${word}`}>
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
