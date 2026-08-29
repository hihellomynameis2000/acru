import { NextRequest, NextResponse } from "next/server";

import { portalForHostname } from "@/lib/portal";

const AUTH_PATHS = new Set(["/sign-in", "/sign-up", "/forgot-password", "/confirm-email"]);

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const hostname = host.toLowerCase().split(":")[0];
  const managedHost = [
    "acrudevelopment.com",
    "merchants.acrudevelopment.com",
    "sandbox-merchant.acrudevelopment.com",
    "partners.acrudevelopment.com",
    "admin.acrudevelopment.com"
  ].includes(hostname);
  const portal = portalForHostname(host);
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  if (AUTH_PATHS.has(pathname)) {
    if (managedHost) {
      const expectedPortal = portal === "merchant" ? null : portal;
      if (url.searchParams.get("portal") !== expectedPortal) {
        if (expectedPortal) url.searchParams.set("portal", expectedPortal);
        else url.searchParams.delete("portal");
        return NextResponse.rewrite(url);
      }
    }
    return NextResponse.next();
  }

  // Preview and localhost URLs remain freely navigable for UI development.
  if (!managedHost) return NextResponse.next();

  if (portal === "sandbox") {
    if (pathname === "/") {
      url.pathname = "/sandbox";
      return NextResponse.redirect(url);
    }
    if (!pathname.startsWith("/sandbox")) {
      url.pathname = "/sandbox";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  if (portal === "partner") {
    if (pathname === "/") {
      url.pathname = "/partners";
      return NextResponse.redirect(url);
    }
    if (!pathname.startsWith("/partners")) {
      url.pathname = "/partners";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  if (portal === "admin") {
    if (pathname === "/") {
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    if (!pathname.startsWith("/admin")) {
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  if (portal === "merchant") {
    if (pathname === "/") {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    if (pathname.startsWith("/sandbox") || pathname.startsWith("/partners") || pathname.startsWith("/admin")) {
      url.pathname = "/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"]
};
