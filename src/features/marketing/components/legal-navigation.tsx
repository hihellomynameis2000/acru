"use client";

import { PrintIcon } from "@shopify/polaris-icons";
import { useEffect, useMemo, useState } from "react";

export type LegalNavigationItem = {
  id: string;
  label: string;
};

function NavigationLinks({ activeId, items }: { activeId: string; items: LegalNavigationItem[] }) {
  return items.map((item) => (
    <a aria-current={activeId === item.id ? "location" : undefined} href={`#${item.id}`} key={item.id}>
      {item.label}
    </a>
  ));
}

export function LegalTableOfContents({ items }: { items: LegalNavigationItem[] }) {
  const sectionIds = useMemo(() => items.map((item) => item.id), [items]);
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section instanceof HTMLElement);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-14% 0px -72% 0px", threshold: [0, 0.1, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [sectionIds]);

  return (
    <>
      <aside className="legal-toc" aria-label="On this page">
        <p>On this page</p>
        <nav>
          <NavigationLinks activeId={activeId} items={items} />
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
        <nav aria-label="On this page">
          <NavigationLinks activeId={activeId} items={items} />
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
