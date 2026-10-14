"use client";

import { PrintIcon } from "@shopify/polaris-icons";
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";

import { legalTocScrollTop } from "./legal-toc-scroll";

export type LegalNavigationItem = {
  id: string;
  label: string;
};

function NavigationLinks({
  activeId,
  items,
  onNavigate
}: {
  activeId: string;
  items: LegalNavigationItem[];
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
}) {
  return items.map((item) => (
    <a
      aria-current={activeId === item.id ? "location" : undefined}
      href={`#${item.id}`}
      key={item.id}
      onClick={(event) => onNavigate(event, item.id)}
    >
      {item.label}
    </a>
  ));
}

export function LegalTableOfContents({ items }: { items: LegalNavigationItem[] }) {
  const sectionIds = useMemo(() => items.map((item) => item.id), [items]);
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");
  const desktopNavigationRef = useRef<HTMLElement>(null);
  const mobileNavigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const navigations = [desktopNavigationRef.current, mobileNavigationRef.current].filter(
      (navigation): navigation is HTMLElement => navigation !== null
    );
    let frame = 0;
    const revealActiveLink = () => {
      frame = 0;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      for (const navigation of navigations) {
        const link = navigation.querySelector<HTMLElement>('[aria-current="location"]');
        if (!link) continue;
        const viewport = navigation.getBoundingClientRect();
        const item = link.getBoundingClientRect();
        const top = legalTocScrollTop({
          viewportTop: viewport.top + navigation.clientTop,
          viewportHeight: navigation.clientHeight,
          scrollTop: navigation.scrollTop,
          scrollHeight: navigation.scrollHeight,
          itemTop: item.top,
          itemHeight: item.height
        });
        // scrollIntoView would also move the policy itself. Move only this list.
        if (top !== null) navigation.scrollTo({ top, behavior: reducedMotion ? "instant" : "smooth" });
      }
    };
    const requestReveal = () => {
      if (!frame) frame = window.requestAnimationFrame(revealActiveLink);
    };
    const observer = new ResizeObserver(requestReveal);
    for (const navigation of navigations) observer.observe(navigation);
    requestReveal();
    window.addEventListener("resize", requestReveal);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", requestReveal);
    };
  }, [activeId]);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section instanceof HTMLElement);

    if (!sections.length) return;

    let frame = 0;
    const updateActiveSection = () => {
      frame = 0;
      const readingLine = Math.min(240, window.innerHeight * 0.28);
      let nextId = sections[0].id;

      for (const section of sections) {
        if (section.getBoundingClientRect().top > readingLine) break;
        nextId = section.id;
      }

      const pageBottom = window.scrollY + window.innerHeight;
      if (pageBottom >= document.documentElement.scrollHeight - 2) {
        nextId = sections.at(-1)?.id ?? nextId;
      }

      setActiveId((currentId) => (currentId === nextId ? currentId : nextId));
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [sectionIds]);

  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    window.history.replaceState(null, "", `#${id}`);
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start"
    });
  };

  return (
    <>
      <aside className="legal-toc" aria-label="On this page">
        <p>On this page</p>
        <nav ref={desktopNavigationRef}>
          <NavigationLinks activeId={activeId} items={items} onNavigate={handleNavigate} />
        </nav>
        <a className="legal-toc-contact" href="mailto:legal@acru.com">
          Questions? Contact legal
        </a>
      </aside>

      <details className="legal-mobile-toc">
        <summary>
          <span>On this page</span>
          <span>{items.length} sections</span>
        </summary>
        <nav aria-label="On this page" ref={mobileNavigationRef}>
          <NavigationLinks activeId={activeId} items={items} onNavigate={handleNavigate} />
        </nav>
      </details>
    </>
  );
}

export function LegalPrintButton() {
  return (
    <button className="legal-print-button" onClick={() => window.print()} type="button">
      <PrintIcon aria-hidden="true" />
      Print or save PDF
    </button>
  );
}
