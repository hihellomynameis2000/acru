import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { DemoRequestForm } from "@/features/marketing/components/demo-request-form";

export const metadata: Metadata = {
  title: "Request a demo",
  description: "Explore how Acru can support your payment flow. Request a conversation tailored to your business.",
  robots: { index: true, follow: true }
};

export default function DemoPage() {
  return (
    <div className="demo-page">
      <header className="demo-header">
        <div className="demo-header-inner">
          <Link href="/" className="demo-brand" aria-label="Acru home">
            <Image src="/marketing/acru-wordmark.png" width={660} height={323} alt="Acru" sizes="116px" />
          </Link>
          <Link href="/" className="demo-back">
            <ArrowLeft aria-hidden="true" /> Back to Acru
          </Link>
        </div>
      </header>
      <main className="demo-layout">
        <section className="demo-intro" aria-labelledby="demo-heading">
          <h1 id="demo-heading">
            Your business.
            <br />
            Let’s see what’s possible.
          </h1>
          <p className="demo-description">
            Take a closer look at Acru, with a conversation built around your payment flow.
          </p>
          <ul className="demo-benefits">
            <li>
              <Check aria-hidden="true" />
              <div>
                <h2>Start with your customers.</h2>
                <p>Explore Apple Pay, Google Pay, PayPal, local payments, and buy now, pay later for your checkout.</p>
              </div>
            </li>
            <li>
              <Check aria-hidden="true" />
              <div>
                <h2>Follow the money.</h2>
                <p>Walk through payments, balances, risk, and settlement in one place.</p>
              </div>
            </li>
            <li>
              <Check aria-hidden="true" />
              <div>
                <h2>Plan your next step.</h2>
                <p>Talk through integration, your business requirements, and how to get started.</p>
              </div>
            </li>
          </ul>
          <div className="demo-art">
            <Image
              src="/marketing/guides/clarity-v1/payments-blue.webp"
              width={1200}
              height={800}
              alt="Blue payment card and glass gateway connected by a sculpted track"
              sizes="(max-width: 800px) 90vw, 420px"
            />
          </div>
          <p className="demo-email">
            Prefer to email? <a href="mailto:sales@acru.com">sales@acru.com</a>
          </p>
        </section>
        <section className="demo-form-panel" aria-label="Request your Acru demo">
          <DemoRequestForm />
        </section>
      </main>
      <footer className="demo-footer">
        <span>© {new Date().getFullYear()} Acru, Inc.</span>
        <nav aria-label="Legal">
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
        </nav>
      </footer>
    </div>
  );
}
