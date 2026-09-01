"use client";

import { MenuIcon, ProfileIcon, XIcon } from "@shopify/polaris-icons";
import Link from "next/link";
import { useRef } from "react";

import { marketingNavigation } from "@/features/marketing/data/marketing";

export function MarketingMobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function openMenu() {
    dialogRef.current?.showModal();
  }

  function closeMenu() {
    dialogRef.current?.close();
  }

  return (
    <div className="marketing-mobile-menu">
      <button aria-label="Open navigation" className="marketing-mobile-menu-trigger" onClick={openMenu} type="button">
        <MenuIcon aria-hidden="true" />
      </button>

      <dialog
        aria-label="Mobile navigation menu"
        className="marketing-mobile-menu-dialog"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
        ref={dialogRef}
      >
        <div className="marketing-mobile-menu-panel">
          <div className="marketing-mobile-menu-heading">
            <button aria-label="Close navigation" onClick={closeMenu} type="button">
              <XIcon aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobile navigation">
            {marketingNavigation.map((item) => (
              <Link href={item.href} key={item.label} onClick={closeMenu}>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <Link className="marketing-mobile-menu-sign-in" href="/sign-in" onClick={closeMenu}>
            <ProfileIcon aria-hidden="true" />
            <span>Sign in</span>
          </Link>
        </div>
      </dialog>
    </div>
  );
}
