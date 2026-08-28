import type { Metadata } from "next";
import localFont from "next/font/local";

import "@/app/globals.css";
import { AppShell } from "@/components/shell/app-shell";
import { ToastProvider } from "@/components/ui/toast";

const poppins = localFont({
  display: "swap",
  src: [
    { path: "../../public/fonts/Poppins-Regular.ttf", weight: "400" },
    { path: "../../public/fonts/Poppins-Medium.ttf", weight: "500" },
    { path: "../../public/fonts/Poppins-SemiBold.ttf", weight: "600" }
  ],
  variable: "--font-poppins"
});

// Product pages will carry account-specific financial data; never place them in a shared static cache.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "ACRU",
    template: "%s · ACRU"
  },
  description: "Payment infrastructure for modern platforms.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_ACRU_APP_URL ?? "http://localhost:3000"),
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={poppins.variable} lang="en">
      <body>
        <ToastProvider>
          <AppShell>{children}</AppShell>
        </ToastProvider>
      </body>
    </html>
  );
}
