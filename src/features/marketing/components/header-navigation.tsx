"use client";

import {
  ChevronRightIcon,
  ProfileIcon,
  CreditCardIcon,
  MoneyIcon,
  AppsIcon,
  ShieldCheckMarkIcon,
  CartIcon,
  BankIcon,
  GamesIcon,
  StoreIcon,
  OrganizationIcon,
  BookIcon
} from "@shopify/polaris-icons";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { homepageHref } from "@/features/marketing/data/editorial";
import {
  navigationDirectLinks,
  navigationPanels,
  navigationSignIn,
  type NavigationPanel
} from "@/features/marketing/data/navigation";

function MenuLines() {
  return (
    <span className="cinematic-menu-lines" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

const categoryIcons = {
  payments: CreditCardIcon,
  movement: MoneyIcon,
  platform: AppsIcon,
  protection: ShieldCheckMarkIcon,
  ecommerce: CartIcon,
  fintech: BankIcon,
  gaming: GamesIcon,
  marketplaces: StoreIcon,
  company: OrganizationIcon,
  guides: BookIcon
};

function PanelContents({ panel, onNavigate }: { panel: NavigationPanel; onNavigate: () => void }) {
  return (
    <div className="acru-mega-content" data-panel={panel.id} key={panel.id}>
      <div
        className="acru-mega-items"
        style={{ "--nav-columns": panel.items.length === 6 ? 3 : panel.items.length } as CSSProperties}
      >
        {panel.items.map((item) => {
          const Icon = categoryIcons[item.icon];
          return (
            <div className="acru-mega-item" key={item.title}>
              <a className="acru-mega-feature" href={item.href} onClick={onNavigate}>
                <span className="acru-category-icon" data-category={item.icon}>
                  <Icon aria-hidden="true" />
                </span>
                <span className="acru-category-copy">
                  <span>{item.title}</span>
                  <small>{item.description}</small>
                </span>
              </a>
              {item.links ? (
                <ul className="acru-mega-detail-links">
                  {item.links.map(([label, href]) => (
                    <li key={label}>
                      <a href={href} onClick={onNavigate}>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <a className="acru-mega-learn" href={item.href} onClick={onNavigate}>
                  Learn more<span className="ui-sr-only"> about {item.title}</span>
                </a>
              )}
            </div>
          );
        })}
      </div>
      <nav className="acru-mega-aside" aria-label={`${panel.label} links`}>
        {panel.links.map(([label, href]) => (
          <a key={label} href={href} onClick={onNavigate}>
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}

export function HeaderNavigation({
  onExpandedChange,
  onHomepage = true
}: {
  onExpandedChange: (expanded: boolean) => void;
  onHomepage?: boolean;
}) {
  const panels = useMemo(
    () =>
      navigationPanels.map((panel) => ({
        ...panel,
        items: panel.items.map((item) => ({
          ...item,
          href: homepageHref(item.href, onHomepage),
          links: item.links?.map(([label, href]) => [label, homepageHref(href, onHomepage)] as const)
        })),
        links: panel.links.map(([label, href]) => [label, homepageHref(href, onHomepage)] as const)
      })),
    [onHomepage]
  );
  const [desktopPanel, setDesktopPanel] = useState<NavigationPanel | null>(null);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<NavigationPanel | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const desktopContent = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusPanel = useRef(false);

  function cancelHover() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  }
  function closeDesktop() {
    cancelHover();
    setDesktopOpen(false);
  }
  function scheduleDesktopClose() {
    cancelHover();
    hoverTimer.current = setTimeout(() => {
      hoverTimer.current = null;
      setDesktopOpen(false);
    }, 550);
  }
  function openDesktop(panel: NavigationPanel) {
    cancelHover();
    setDesktopPanel(panel);
    setDesktopOpen(true);
  }
  function openMobile() {
    closeDesktop();
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
    setMobilePanel(null);
    if (!dialog.current?.open) {
      dialog.current?.showModal();
      dialog.current?.querySelector(".cinematic-menu-lines")?.getBoundingClientRect();
      dialog.current?.querySelector<HTMLButtonElement>(".cinematic-menu-toggle")?.focus();
    }
    setMenuOpen(true);
  }
  function closeMobile() {
    setMenuOpen(false);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialog.current?.close();
    } else {
      closeTimer.current = setTimeout(() => {
        dialog.current?.close();
        closeTimer.current = null;
      }, 320);
    }
  }

  useEffect(() => {
    onExpandedChange(desktopOpen || menuOpen);
  }, [desktopOpen, menuOpen, onExpandedChange]);
  useEffect(() => {
    if (desktopOpen && focusPanel.current) {
      focusPanel.current = false;
      desktopContent.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    }
  }, [desktopOpen, desktopPanel]);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [menuOpen]);
  useEffect(() => {
    const desktop = matchMedia("(min-width: 1025px)");
    function onResize() {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
      dialog.current?.close();
      setMenuOpen(false);
      setDesktopOpen(false);
    }
    desktop.addEventListener("change", onResize);
    return () => {
      desktop.removeEventListener("change", onResize);
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <div
      className="acru-nav-host"
      ref={root}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeDesktop();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && desktopOpen) {
          event.preventDefault();
          closeDesktop();
          root.current?.querySelector<HTMLButtonElement>(`[data-nav-trigger="${desktopPanel?.id}"]`)?.focus();
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        scheduleDesktopClose();
      }}
      onPointerEnter={cancelHover}
    >
      <nav className="cinematic-navigation" aria-label="Main navigation">
        {panels.map((panel) => (
          <button
            type="button"
            key={panel.id}
            data-nav-trigger={panel.id}
            aria-expanded={desktopOpen && desktopPanel?.id === panel.id}
            aria-controls="acru-desktop-navigation"
            onPointerEnter={(event) => {
              if (event.pointerType !== "mouse") return;
              cancelHover();
              hoverTimer.current = setTimeout(() => openDesktop(panel), desktopOpen ? 70 : 140);
            }}
            onClick={() => (desktopOpen && desktopPanel?.id === panel.id ? closeDesktop() : openDesktop(panel))}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                focusPanel.current = true;
                if (desktopOpen && desktopPanel?.id === panel.id)
                  desktopContent.current?.querySelector<HTMLAnchorElement>("a")?.focus();
                else openDesktop(panel);
              }
            }}
          >
            {panel.label}
          </button>
        ))}
        {navigationDirectLinks.map(([label, href]) => (
          <a
            key={label}
            href={homepageHref(href, onHomepage)}
            onPointerEnter={scheduleDesktopClose}
            onClick={closeDesktop}
          >
            {label}
          </a>
        ))}
      </nav>
      <a className="cinematic-sign-in" href={navigationSignIn} onPointerEnter={scheduleDesktopClose}>
        <ProfileIcon aria-hidden="true" /> Sign in
      </a>
      <button
        className="cinematic-menu-trigger"
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-controls="cinematic-mobile-menu"
        aria-expanded={menuOpen}
        aria-haspopup="dialog"
        onClick={menuOpen ? closeMobile : openMobile}
      >
        <MenuLines />
      </button>
      <button
        className="acru-nav-scrim"
        type="button"
        tabIndex={-1}
        aria-label="Close navigation"
        aria-hidden={!desktopOpen}
        data-open={desktopOpen}
        onPointerEnter={scheduleDesktopClose}
        onClick={closeDesktop}
      />
      <div
        className="acru-mega-panel"
        id="acru-desktop-navigation"
        data-open={desktopOpen}
        inert={!desktopOpen}
        aria-hidden={!desktopOpen}
        ref={desktopContent}
        onPointerEnter={cancelHover}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") scheduleDesktopClose();
        }}
      >
        <div className="acru-mega-clip">
          {desktopPanel && <PanelContents panel={desktopPanel} onNavigate={closeDesktop} />}
        </div>
      </div>
      <noscript>
        <nav className="acru-no-js-nav" aria-label="Navigation">
          <a href={homepageHref("#products", onHomepage)}>Products</a>
          <a href={homepageHref("#businesses", onHomepage)}>Solutions</a>
          <Link href="/developers/documentation">Developers</Link>
          <a href={navigationSignIn}>Sign in</a>
        </nav>
        <style>{`.cinematic-navigation,.cinematic-menu-trigger{display:none!important}`}</style>
      </noscript>
      <dialog
        className="cinematic-menu acru-mobile-navigation"
        id="cinematic-mobile-menu"
        aria-label="Navigation"
        data-expanded={menuOpen}
        ref={dialog}
        onCancel={(event) => {
          event.preventDefault();
          closeMobile();
        }}
        onClose={() => {
          setMenuOpen(false);
          if (closeTimer.current) clearTimeout(closeTimer.current);
          closeTimer.current = null;
        }}
      >
        <Link className="acru-mobile-wordmark" href="/" aria-label="Acru home" onClick={closeMobile}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/marketing/acru-wordmark.png" width={660} height={323} alt="Acru" />
        </Link>
        <button
          className="cinematic-menu-toggle"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="cinematic-mobile-menu"
          type="button"
          onClick={menuOpen ? closeMobile : openMobile}
        >
          <MenuLines />
        </button>
        <div className="acru-mobile-content">
          <nav className="acru-mobile-primary" aria-label="Main navigation">
            {panels.map((panel) => (
              <MobileNavigationSection
                key={panel.id}
                panel={panel}
                expanded={mobilePanel?.id === panel.id}
                onToggle={() => setMobilePanel(mobilePanel?.id === panel.id ? null : panel)}
                onNavigate={closeMobile}
              />
            ))}
            {navigationDirectLinks.map(([label, href]) => (
              <a href={homepageHref(href, onHomepage)} key={label} onClick={closeMobile}>
                {label}
              </a>
            ))}
            <a className="acru-mobile-sign-in" href={navigationSignIn} onClick={closeMobile}>
              <ProfileIcon aria-hidden="true" /> Sign in
            </a>
          </nav>
        </div>
      </dialog>
    </div>
  );
}

function MobileNavigationSection({
  panel,
  expanded,
  onToggle,
  onNavigate
}: {
  panel: NavigationPanel;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  // Retain visited contents through the closing animation, but never request
  // their artwork before the user opens this section.
  const [visited, setVisited] = useState(false);
  const id = `acru-mobile-section-${panel.id}`;
  return (
    <div className="acru-mobile-section" data-open={expanded}>
      <button
        type="button"
        className="acru-mobile-section-trigger"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => {
          setVisited(true);
          onToggle();
        }}
      >
        {panel.label}
        <ChevronRightIcon aria-hidden="true" />
      </button>
      <div id={id} className="acru-mobile-section-body" inert={!expanded} aria-hidden={!expanded}>
        <div className="acru-mobile-section-clip">
          {visited && <PanelContents panel={panel} onNavigate={onNavigate} />}
        </div>
      </div>
    </div>
  );
}
