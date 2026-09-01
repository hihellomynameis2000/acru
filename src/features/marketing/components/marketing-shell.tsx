import { ProfileIcon } from "@shopify/polaris-icons";
import Image from "next/image";
import Link from "next/link";
import { siFacebook, siX, siYoutube } from "simple-icons";

import { MarketingMobileMenu } from "@/features/marketing/components/marketing-mobile-menu";
import { footerColumns, marketingNavigation } from "@/features/marketing/data/marketing";

const socialLinks = [
  { href: "https://x.com/acruhq", label: "X", path: siX.path },
  { href: "https://www.facebook.com/acru", label: "Facebook", path: siFacebook.path },
  { href: "https://www.youtube.com/@acru", label: "YouTube", path: siYoutube.path },
  {
    href: "https://www.linkedin.com/company/acru",
    label: "LinkedIn",
    path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.1 20.45H3.54V9H7.1v11.45Z"
  }
] as const;

export function MarketingHeader() {
  return (
    <header className="marketing-header">
      <div className="marketing-header-inner">
        <Link aria-label="Acru home" className="marketing-brand" href="/">
          <Image alt="Acru" height={323} priority src="/marketing/acru-wordmark.png" width={660} />
        </Link>

        <nav aria-label="Main navigation" className="marketing-navigation">
          {marketingNavigation.map((item) => (
            <Link href={item.href} key={item.label}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="marketing-sign-in" href="/sign-in">
          <ProfileIcon aria-hidden="true" />
          Sign in
        </Link>

        <MarketingMobileMenu />
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="marketing-footer">
      <div className="marketing-footer-main">
        <div className="marketing-footer-brand">
          <Link aria-label="Acru home" href="/">
            <Image alt="" height={323} src="/marketing/acru-wordmark.png" width={660} />
          </Link>
          <div aria-label="Acru social media" className="marketing-footer-socials" role="navigation">
            {socialLinks.map((social) => (
              <a
                aria-label={`Acru on ${social.label}`}
                href={social.href}
                key={social.label}
                rel="noreferrer"
                target="_blank"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer navigation" className="marketing-footer-columns">
          {footerColumns.map((column) => (
            <section key={column.heading}>
              <h2>{column.heading}</h2>
              {column.links.map((link) => (
                <Link href={link.href} key={`${column.heading}-${link.label}`}>
                  {link.label}
                </Link>
              ))}
            </section>
          ))}
        </nav>
      </div>

      <div className="marketing-footer-disclosure">
        <p>
          Acru provides financial technology and software services. Availability of payment, banking, and settlement
          services is subject to eligibility, underwriting, partner terms, and applicable law. Acru is not a bank.
        </p>
      </div>

      <div className="marketing-footer-bottom">
        <p>© {new Date().getFullYear()} Acru, Inc. All rights reserved.</p>
        <div>
          <Link href="/legal">Legal center</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
          <a href="mailto:security@acru.com">Report a security issue</a>
        </div>
      </div>
    </footer>
  );
}
