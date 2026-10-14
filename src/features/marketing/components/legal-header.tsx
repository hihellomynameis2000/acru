"use client";

import Link from "next/link";
import { useState } from "react";
import { HeaderNavigation } from "@/features/marketing/components/header-navigation";

export function LegalHeader() {
  const [navigationOpen, setNavigationOpen] = useState(false);
  return (
    <header className="cinematic-header" data-menu-open={navigationOpen}>
      <div className="cinematic-header-inner">
        <Link className="cinematic-brand" href="/" aria-label="Acru home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/marketing/acru-wordmark.png" width="660" height="323" alt="Acru" />
        </Link>
        <HeaderNavigation onExpandedChange={setNavigationOpen} onHomepage={false} />
      </div>
    </header>
  );
}
