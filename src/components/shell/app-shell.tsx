"use client";

import {
  AlertTriangleIcon,
  BankIcon,
  ChartVerticalIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  CodeIcon,
  ExitIcon,
  ExternalIcon,
  HomeIcon,
  MarketsIcon,
  MenuIcon,
  NotificationIcon,
  OrderIcon,
  PersonIcon,
  SearchIcon,
  SelectIcon,
  SettingsIcon,
  TeamIcon,
  XIcon
} from "@shopify/polaris-icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { ACRU_SESSION_KEY, readOnboarding, readSession } from "@/lib/auth/client";
import { portalForLocation, signInPathForPortal } from "@/lib/portal";

type PolarisIcon = ComponentType<SVGProps<SVGSVGElement>>;

const navItems: Array<{
  href: string;
  label: string;
  icon: PolarisIcon;
  keywords: string;
  children?: Array<{ href: string; label: string; keywords: string }>;
}> = [
  { href: "/dashboard", label: "Overview", icon: HomeIcon, keywords: "home dashboard summary" },
  {
    href: "/payments",
    label: "Payments",
    icon: MarketsIcon,
    keywords: "money processing",
    children: [
      { href: "/payments/transactions", label: "Transactions", keywords: "charges money activity" },
      { href: "/payments/subscriptions", label: "Subscriptions", keywords: "recurring billing plans" },
      { href: "/payments/checkout", label: "Checkout", keywords: "payment page cart hosted checkout" },
      { href: "/payments/customers", label: "Customers", keywords: "merchants people accounts" },
      { href: "/payments/payouts", label: "Payouts", keywords: "withdrawals bank transfers" },
      { href: "/payments/disputes", label: "Disputes", keywords: "chargebacks evidence" },
      { href: "/payments/refunds", label: "Refunds", keywords: "returns reversals" },
      { href: "/payments/payment-links", label: "Payment Links", keywords: "hosted checkout links" },
      { href: "/payments/invoices", label: "Invoices", keywords: "billing receivables" }
    ]
  },
  {
    href: "/reports",
    label: "Reports",
    icon: ChartVerticalIcon,
    keywords: "data reporting",
    children: [
      { href: "/reports/analytics", label: "Analytics", keywords: "metrics insights charts" },
      {
        href: "/reports/acceptance",
        label: "Acceptance rate",
        keywords: "approvals declines authorization rejection issuer auth codes"
      },
      { href: "/reports/statements", label: "Statements", keywords: "monthly account statements" },
      { href: "/reports/wallet", label: "Wallet", keywords: "balances funds withdrawals reconciliation" },
      { href: "/reports/exports", label: "Exports", keywords: "download csv data" }
    ]
  },
  {
    href: "/developers",
    label: "Developers",
    icon: CodeIcon,
    keywords: "integrations engineering",
    children: [
      { href: "/developers/api-keys", label: "API Keys", keywords: "credentials secret publishable" },
      {
        href: "/developers/verify-connection",
        label: "Verify connection",
        keywords: "test integration connectivity authentication"
      },
      { href: "/developers/webhooks", label: "Webhooks", keywords: "events endpoints" },
      { href: "/developers/logs", label: "Logs", keywords: "requests errors activity" },
      { href: "/developers/documentation", label: "Documentation", keywords: "docs guides reference" }
    ]
  },
  {
    href: "/settings",
    label: "Settings",
    icon: SettingsIcon,
    keywords: "account preferences configuration",
    children: [
      { href: "/settings/business", label: "Business", keywords: "company profile details" },
      { href: "/settings/team", label: "Team", keywords: "members roles access" },
      { href: "/settings/banking-payouts", label: "Banking & Payouts", keywords: "bank accounts settlement" },
      { href: "/settings/branding", label: "Branding", keywords: "logo colors appearance" },
      { href: "/settings/security", label: "Security", keywords: "authentication sessions fraud" },
      { href: "/settings/notifications", label: "Notifications", keywords: "alerts emails preferences" }
    ]
  }
];

const searchDestinations = navItems.flatMap((item) => [
  { href: item.href, label: item.label, icon: item.icon, keywords: item.keywords },
  ...(item.children ?? []).map((child) => ({ ...child, icon: item.icon }))
]);

const workspaceAccounts = [
  {
    id: "northstar-studio",
    name: "Northstar Studio",
    email: "hello@northstar.studio",
    detail: "Production account",
    avatar: "N",
    tone: "blue"
  },
  {
    id: "northstar-labs",
    name: "Northstar Labs",
    email: "labs@northstar.studio",
    detail: "Sandbox account",
    avatar: "L",
    tone: "purple"
  },
  {
    id: "northstar-europe",
    name: "Northstar Europe",
    email: "finance-eu@northstar.studio",
    detail: "EUR settlement account",
    avatar: "E",
    tone: "green"
  }
];

const ACRU_ACTIVE_WORKSPACE_KEY = "acru.active-workspace";

const initialNotifications: Array<{
  id: string;
  title: string;
  detail: string;
  time: string;
  href: string;
  tone: string;
  icon: PolarisIcon;
  read: boolean;
}> = [
  {
    id: "payout-scheduled",
    title: "Payout scheduled",
    detail: "$98,443.12 to Wells Fargo •••• 4242",
    time: "Tomorrow",
    href: "/balances",
    tone: "purple",
    icon: BankIcon,
    read: false
  },
  {
    id: "disputes-attention",
    title: "2 disputes require attention",
    detail: "Responses are due before May 7",
    time: "12 min ago",
    href: "/payments",
    tone: "gold",
    icon: AlertTriangleIcon,
    read: false
  },
  {
    id: "information-requests",
    title: "3 information requests",
    detail: "Additional documents are needed",
    time: "1 hr ago",
    href: "/settings",
    tone: "blue",
    icon: ClockIcon,
    read: false
  },
  {
    id: "payment-succeeded",
    title: "Payment succeeded",
    detail: "$8,320.00 received via USDC",
    time: "2 hrs ago",
    href: "/payments",
    tone: "green",
    icon: CheckCircleIcon,
    read: true
  }
];

function ShellIcon({ icon: Icon, className }: { icon: PolarisIcon; className?: string }) {
  return <Icon aria-hidden="true" className={className} />;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const authRoute = ["/login", "/sign-in", "/sign-up", "/confirm-email"].includes(pathname);
  const onboardingRoute = pathname === "/onboarding";
  const standalonePortalRoute = pathname === "/sandbox" || pathname === "/partners" || pathname === "/admin";
  const searchRef = useRef<HTMLDivElement>(null);
  const accountMenusRef = useRef<HTMLDivElement>(null);
  const workspaceMenuRef = useRef<HTMLDivElement>(null);
  const organizationMenuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [organizationOpen, setOrganizationOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(workspaceAccounts[0].id);
  const [accessReady, setAccessReady] = useState(authRoute);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [query, setQuery] = useState("");
  const [activeResult, setActiveResult] = useState(0);
  const [openGroup, setOpenGroup] = useState<string | null>(
    () => navItems.find((item) => item.children && pathname.startsWith(item.href))?.href ?? null
  );
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return searchDestinations;
    return searchDestinations.filter((item) =>
      `${item.label} ${item.keywords} ${item.href}`.toLowerCase().includes(normalized)
    );
  }, [query]);
  const compactResults = results.slice(0, 6);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    if (authRoute) return;
    const timer = window.setTimeout(() => {
      setAccessReady(false);
      if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
        setAccessReady(true);
        return;
      }
      const portal = portalForLocation(window.location.hostname, pathname);
      const session = readSession();
      if (!session?.verified || (session.portal ?? "merchant") !== portal) {
        router.replace(signInPathForPortal(portal));
        return;
      }
      if (portal === "merchant" && !onboardingRoute && !readOnboarding().submitted) {
        router.replace("/onboarding");
        return;
      }
      setAccessReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [authRoute, onboardingRoute, pathname, router]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(false);
        setActiveResult(0);
        setCommandOpen(true);
      }
      if (event.key === "Escape") {
        if (mobileNavOpen) setMobileNavOpen(false);
        else if (commandOpen) setCommandOpen(false);
        else if (notificationOpen || profileOpen || workspaceOpen || organizationOpen) {
          setNotificationOpen(false);
          setProfileOpen(false);
          setWorkspaceOpen(false);
          setOrganizationOpen(false);
        } else if (searchOpen) {
          setSearchOpen(false);
          inputRef.current?.blur();
        }
      }
    }
    function handleOutsideClick(event: MouseEvent) {
      if (!searchRef.current?.contains(event.target as Node)) setSearchOpen(false);
      if (!accountMenusRef.current?.contains(event.target as Node)) {
        setNotificationOpen(false);
        setProfileOpen(false);
      }
      if (!workspaceMenuRef.current?.contains(event.target as Node)) setWorkspaceOpen(false);
      if (!organizationMenuRef.current?.contains(event.target as Node)) setOrganizationOpen(false);
    }
    window.addEventListener("keydown", handleShortcut);
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [commandOpen, mobileNavOpen, notificationOpen, organizationOpen, profileOpen, searchOpen, workspaceOpen]);

  useEffect(() => {
    const timer = window.setTimeout(() => setMobileNavOpen(false), 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (commandOpen) commandInputRef.current?.focus();
  }, [commandOpen]);

  useEffect(() => {
    const savedWorkspace = window.localStorage.getItem(ACRU_ACTIVE_WORKSPACE_KEY);
    const timer = window.setTimeout(() => {
      if (workspaceAccounts.some((workspace) => workspace.id === savedWorkspace)) setActiveWorkspaceId(savedWorkspace!);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function openResult(index: number) {
    const result = results[index];
    if (!result) return;
    setSearchOpen(false);
    setCommandOpen(false);
    setQuery("");
    setOpenGroup(navItems.find((item) => item.children && result.href.startsWith(item.href))?.href ?? null);
    router.push(result.href);
  }

  function openNotification(id: string, href: string) {
    setNotifications((current) =>
      current.map((notification) => (notification.id === id ? { ...notification, read: true } : notification))
    );
    setNotificationOpen(false);
    setOpenGroup(navItems.find((item) => item.children && href.startsWith(item.href))?.href ?? null);
    router.push(href);
  }

  function switchWorkspace(id: string) {
    setActiveWorkspaceId(id);
    window.localStorage.setItem(ACRU_ACTIVE_WORKSPACE_KEY, id);
    setWorkspaceOpen(false);
    setOrganizationOpen(false);
    setNotificationOpen(false);
    setProfileOpen(false);
    setOpenGroup(null);
    router.push("/dashboard");
  }

  const activeWorkspace =
    workspaceAccounts.find((workspace) => workspace.id === activeWorkspaceId) ?? workspaceAccounts[0];

  if (authRoute) return <>{children}</>;
  if (!accessReady)
    return (
      <main className="onboarding-loading">
        <i className="auth-spinner" />
      </main>
    );
  if (onboardingRoute || standalonePortalRoute) return <>{children}</>;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="global-topbar">
        <button
          aria-expanded={mobileNavOpen}
          aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
          className="mobile-nav-toggle"
          onClick={() => setMobileNavOpen((open) => !open)}
          type="button"
        >
          {mobileNavOpen ? <XIcon aria-hidden="true" /> : <MenuIcon aria-hidden="true" />}
        </button>
        <div className="workspace-switcher" ref={workspaceMenuRef}>
          <Link
            className="acru-logo-link"
            href="/dashboard"
            aria-label="ACRU overview"
            onClick={() => setOpenGroup(null)}
          >
            <Image className="acru-logo" src="/acru-logo.png" alt="ACRU" width={38} height={32} priority />
          </Link>
          <span className="workspace-divider" />
          <button
            className="workspace-picker"
            type="button"
            aria-label={`Switch account, current account ${activeWorkspace.name}`}
            aria-expanded={workspaceOpen}
            onClick={() => {
              setNotificationOpen(false);
              setProfileOpen(false);
              setOrganizationOpen(false);
              setWorkspaceOpen((open) => !open);
            }}
          >
            <span className={`workspace-avatar ${activeWorkspace.tone}`} aria-hidden="true">
              {activeWorkspace.avatar}
            </span>
            <span className="workspace-picker-copy">
              <strong>{activeWorkspace.name}</strong>
              <small>{activeWorkspace.detail}</small>
            </span>
            <ShellIcon icon={SelectIcon} className="workspace-picker-carets" />
          </button>
          {workspaceOpen ? (
            <section className="workspace-account-menu" aria-label="Switch account">
              <header>
                <span>Accounts</span>
                <small>{workspaceAccounts.length} available</small>
              </header>
              <div className="workspace-account-list">
                {workspaceAccounts.map((workspace) => (
                  <button
                    type="button"
                    key={workspace.id}
                    data-active={workspace.id === activeWorkspace.id}
                    onClick={() => switchWorkspace(workspace.id)}
                  >
                    <span className={`workspace-menu-avatar ${workspace.tone}`}>{workspace.avatar}</span>
                    <span>
                      <strong>{workspace.name}</strong>
                      <small>{workspace.detail}</small>
                    </span>
                    {workspace.id === activeWorkspace.id ? <ShellIcon icon={CheckCircleIcon} /> : null}
                  </button>
                ))}
              </div>
              <footer>
                <Link
                  href="/settings/business"
                  onClick={() => {
                    setWorkspaceOpen(false);
                    setOpenGroup("/settings");
                  }}
                >
                  <ShellIcon icon={SettingsIcon} /> Account settings
                </Link>
                <Link
                  href="/settings/business"
                  onClick={() => {
                    setWorkspaceOpen(false);
                    setOpenGroup("/settings");
                  }}
                >
                  <span>+</span> Manage accounts
                </Link>
              </footer>
            </section>
          ) : null}
        </div>

        <div className="account-actions" ref={accountMenusRef}>
          <div className="topbar-menu-wrap">
            <button
              className="notification-button"
              type="button"
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
              aria-expanded={notificationOpen}
              onClick={() => {
                setProfileOpen(false);
                setWorkspaceOpen(false);
                setOrganizationOpen(false);
                setNotificationOpen((open) => !open);
              }}
            >
              <ShellIcon icon={NotificationIcon} />
              {unreadCount ? <span className="notification-badge">{unreadCount}</span> : null}
            </button>
            {notificationOpen ? (
              <section className="notification-menu" aria-label="Notifications">
                <header>
                  <span>
                    <strong>Notifications</strong>
                    <small>{unreadCount ? `${unreadCount} unread` : "You’re all caught up"}</small>
                  </span>
                  {unreadCount ? (
                    <button
                      type="button"
                      onClick={() => setNotifications((current) => current.map((item) => ({ ...item, read: true })))}
                    >
                      Mark all read
                    </button>
                  ) : null}
                </header>
                <div className="notification-list">
                  {notifications.map((notification) => {
                    const NotificationTypeIcon = notification.icon;
                    return (
                      <button
                        className="notification-item"
                        data-read={notification.read}
                        type="button"
                        key={notification.id}
                        onClick={() => openNotification(notification.id, notification.href)}
                      >
                        <span className={`notification-type-icon ${notification.tone}`}>
                          <NotificationTypeIcon />
                        </span>
                        <span>
                          <strong>{notification.title}</strong>
                          <small>{notification.detail}</small>
                          <time>{notification.time}</time>
                        </span>
                        {!notification.read ? <i aria-label="Unread" /> : null}
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : null}
          </div>
          <div className="topbar-menu-wrap">
            <button
              className="user-avatar"
              type="button"
              aria-label="Open Christian Brown account menu"
              aria-expanded={profileOpen}
              onClick={() => {
                setNotificationOpen(false);
                setWorkspaceOpen(false);
                setOrganizationOpen(false);
                setProfileOpen((open) => !open);
              }}
            >
              CB
            </button>
            {profileOpen ? (
              <section className="profile-menu" aria-label="Account menu">
                <header className="profile-menu-identity">
                  <span className="profile-menu-avatar">CB</span>
                  <span>
                    <strong>Christian Brown</strong>
                    <small>christian@northstar.studio</small>
                  </span>
                </header>
                <nav className="profile-menu-links" aria-label="Account navigation">
                  <Link
                    href="/settings/business"
                    onClick={() => {
                      setProfileOpen(false);
                      setOpenGroup("/settings");
                    }}
                  >
                    <PersonIcon /> <span>Account</span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => {
                      setProfileOpen(false);
                      setOpenGroup("/settings");
                    }}
                  >
                    <SettingsIcon /> <span>Settings</span>
                  </Link>
                  <Link
                    href="/settings/team"
                    onClick={() => {
                      setProfileOpen(false);
                      setOpenGroup("/settings");
                    }}
                  >
                    <TeamIcon /> <span>Team members</span>
                  </Link>
                </nav>
                <div className="profile-menu-meta">
                  <span>
                    <ClockIcon />
                    <span>
                      <small>Timezone</small>
                      <strong>America/New_York</strong>
                    </span>
                  </span>
                </div>
                <button
                  className="profile-logout"
                  type="button"
                  onClick={() => {
                    const portal = portalForLocation(window.location.hostname, pathname);
                    window.localStorage.removeItem(ACRU_SESSION_KEY);
                    setProfileOpen(false);
                    router.push(signInPathForPortal(portal));
                  }}
                >
                  <ExitIcon /> <span>Log out</span>
                </button>
              </section>
            ) : null}
          </div>
        </div>
      </header>

      {mobileNavOpen ? (
        <button
          aria-label="Close navigation"
          className="mobile-nav-backdrop"
          onClick={() => setMobileNavOpen(false)}
          type="button"
        />
      ) : null}
      <aside aria-label="Application navigation" className="sidebar" data-mobile-open={mobileNavOpen}>
        <div className="sidebar-search-wrap" role="search" ref={searchRef}>
          <div className="sidebar-search" data-open={searchOpen}>
            <ShellIcon icon={SearchIcon} />
            <input
              ref={inputRef}
              type="search"
              value={query}
              placeholder="Search"
              role="combobox"
              aria-label="Search ACRU"
              aria-autocomplete="list"
              aria-controls="sidebar-search-results"
              aria-expanded={searchOpen}
              onFocus={() => setSearchOpen(true)}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveResult(0);
                setSearchOpen(true);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setActiveResult((index) => (compactResults.length ? (index + 1) % compactResults.length : 0));
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActiveResult((index) =>
                    compactResults.length ? (index - 1 + compactResults.length) % compactResults.length : 0
                  );
                } else if (event.key === "Enter") {
                  event.preventDefault();
                  openResult(activeResult);
                }
              }}
            />
            <button
              className="sidebar-search-shortcut"
              type="button"
              aria-label="Open command search"
              onClick={() => {
                setSearchOpen(false);
                setActiveResult(0);
                setCommandOpen(true);
              }}
            >
              <kbd>⌘ k</kbd>
            </button>
          </div>
          {searchOpen ? (
            <div className="sidebar-search-results" id="sidebar-search-results" role="listbox">
              {compactResults.length ? (
                compactResults.map((item, index) => (
                  <button
                    type="button"
                    role="option"
                    aria-selected={activeResult === index}
                    className="sidebar-search-result"
                    key={item.href}
                    onMouseEnter={() => setActiveResult(index)}
                    onClick={() => openResult(index)}
                  >
                    <ShellIcon icon={item.icon} />
                    <span>{item.label}</span>
                    <small>{item.href}</small>
                  </button>
                ))
              ) : (
                <div className="sidebar-search-empty">No results for “{query}”</div>
              )}
            </div>
          ) : null}
        </div>

        <nav className="nav-group" aria-label="Primary navigation">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            if (item.children) {
              const expanded = openGroup === item.href;
              return (
                <div className="nav-section" key={item.label}>
                  <button
                    className="nav-link nav-parent"
                    type="button"
                    data-active={active}
                    aria-expanded={expanded}
                    onClick={() => setOpenGroup(expanded ? null : item.href)}
                  >
                    <ShellIcon icon={item.icon} className="nav-icon" />
                    <span>{item.label}</span>
                    <ShellIcon icon={ChevronDownIcon} className="nav-chevron" />
                  </button>
                  <div className="nav-submenu" data-open={expanded}>
                    {item.children.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          className="nav-sublink"
                          aria-current={childActive ? "page" : undefined}
                          href={child.href}
                          data-active={childActive}
                          key={child.href}
                          onClick={() => {
                            setOpenGroup(item.href);
                            setMobileNavOpen(false);
                          }}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={item.label}
                className="nav-link"
                aria-current={active ? "page" : undefined}
                href={item.href}
                data-active={active}
                onClick={() => {
                  setOpenGroup(null);
                  setMobileNavOpen(false);
                }}
              >
                <ShellIcon icon={item.icon} className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-lower">
          <section className="setup-card" aria-labelledby="setup-title">
            <div className="setup-heading">
              <span className="setup-icon">
                <ShellIcon icon={OrderIcon} />
              </span>
              <div>
                <h2 id="setup-title">Complete your account</h2>
                <p>
                  Unlock all features and
                  <br />
                  start getting paid
                </p>
              </div>
            </div>
            <div className="setup-progress-row">
              <span className="setup-progress">
                <span />
              </span>
              <span>3 / 5</span>
            </div>
            <button className="setup-button" onClick={() => router.push("/onboarding")} type="button">
              Continue setup <span>→</span>
            </button>
          </section>

          <nav className="resource-links" aria-label="Help resources">
            <a href="mailto:support@acru.com">
              Support <ShellIcon icon={ExternalIcon} />
            </a>
            <Link href="/developers/documentation">
              Documentation <ShellIcon icon={ExternalIcon} />
            </Link>
          </nav>

          <div className="organization-switcher-wrap" ref={organizationMenuRef}>
            {organizationOpen ? (
              <section className="organization-account-menu" aria-label="Account and workspace menu">
                <header>
                  <span className="organization-profile-avatar">CB</span>
                  <span>
                    <strong>Christian Brown</strong>
                    <small>christian@northstar.studio</small>
                    <em>Owner</em>
                  </span>
                </header>
                <div className="organization-current-account">
                  <small>Current account</small>
                  <button type="button" onClick={() => switchWorkspace(activeWorkspace.id)}>
                    <span className={`workspace-menu-avatar ${activeWorkspace.tone}`}>{activeWorkspace.avatar}</span>
                    <span>
                      <strong>{activeWorkspace.name}</strong>
                      <small>{activeWorkspace.email}</small>
                    </span>
                    <ShellIcon icon={CheckCircleIcon} />
                  </button>
                </div>
                <nav aria-label="Workspace account actions">
                  <Link
                    href="/settings/business"
                    onClick={() => {
                      setOrganizationOpen(false);
                      setOpenGroup("/settings");
                    }}
                  >
                    <ShellIcon icon={PersonIcon} />
                    <span>
                      <strong>Account settings</strong>
                      <small>Business profile and identity</small>
                    </span>
                    <span>›</span>
                  </Link>
                  <Link
                    href="/settings/team"
                    onClick={() => {
                      setOrganizationOpen(false);
                      setOpenGroup("/settings");
                    }}
                  >
                    <ShellIcon icon={TeamIcon} />
                    <span>
                      <strong>Team & access</strong>
                      <small>Members, roles, and permissions</small>
                    </span>
                    <span>›</span>
                  </Link>
                  <Link
                    href="/settings/security"
                    onClick={() => {
                      setOrganizationOpen(false);
                      setOpenGroup("/settings");
                    }}
                  >
                    <ShellIcon icon={SettingsIcon} />
                    <span>
                      <strong>Security</strong>
                      <small>2-step verification and devices</small>
                    </span>
                    <span>›</span>
                  </Link>
                </nav>
                <div className="organization-switch-list">
                  <small>Switch account</small>
                  {workspaceAccounts
                    .filter((workspace) => workspace.id !== activeWorkspace.id)
                    .map((workspace) => (
                      <button type="button" key={workspace.id} onClick={() => switchWorkspace(workspace.id)}>
                        <span className={`workspace-menu-avatar ${workspace.tone}`}>{workspace.avatar}</span>
                        <span>
                          <strong>{workspace.name}</strong>
                          <small>{workspace.detail}</small>
                        </span>
                      </button>
                    ))}
                </div>
                <button
                  className="organization-menu-logout"
                  type="button"
                  onClick={() => {
                    const portal = portalForLocation(window.location.hostname, pathname);
                    window.localStorage.removeItem(ACRU_SESSION_KEY);
                    setOrganizationOpen(false);
                    router.push(signInPathForPortal(portal));
                  }}
                >
                  <ShellIcon icon={ExitIcon} /> Log out Christian Brown
                </button>
              </section>
            ) : null}
            <button
              className="organization-switcher"
              type="button"
              aria-label={`Open account menu for ${activeWorkspace.name}`}
              aria-expanded={organizationOpen}
              onClick={() => {
                setWorkspaceOpen(false);
                setNotificationOpen(false);
                setProfileOpen(false);
                setOrganizationOpen((open) => !open);
              }}
            >
              <span className={`organization-avatar ${activeWorkspace.tone}`}>{activeWorkspace.avatar}</span>
              <span className="organization-copy">
                <strong>{activeWorkspace.name}</strong>
                <small>{activeWorkspace.email}</small>
              </span>
              <span className="organization-carets">
                <ShellIcon icon={SelectIcon} />
              </span>
            </button>
          </div>
        </div>
      </aside>

      <main className="main" id="main-content" tabIndex={-1}>
        <div className="content">{children}</div>
      </main>

      {commandOpen ? (
        <div
          className="command-search-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCommandOpen(false);
          }}
        >
          <section className="command-search-dialog" role="dialog" aria-modal="true" aria-label="Search ACRU">
            <div className="command-search-input">
              <ShellIcon icon={SearchIcon} />
              <input
                ref={commandInputRef}
                type="search"
                role="combobox"
                value={query}
                placeholder="Search ACRU"
                aria-label="Search pages and actions"
                aria-autocomplete="list"
                aria-controls="command-search-results"
                aria-expanded="true"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveResult(0);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setActiveResult((index) => (results.length ? (index + 1) % results.length : 0));
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setActiveResult((index) => (results.length ? (index - 1 + results.length) % results.length : 0));
                  } else if (event.key === "Enter") {
                    event.preventDefault();
                    openResult(activeResult);
                  }
                }}
              />
              <kbd>ESC</kbd>
            </div>
            <div className="command-search-body" id="command-search-results" role="listbox">
              <small className="command-search-heading">{query ? "Search results" : "Suggested"}</small>
              {results.length ? (
                results.map((item, index) => (
                  <button
                    className="command-search-result"
                    type="button"
                    role="option"
                    aria-selected={activeResult === index}
                    key={item.href}
                    onMouseEnter={() => setActiveResult(index)}
                    onClick={() => openResult(index)}
                  >
                    <span className="command-result-icon">
                      <ShellIcon icon={item.icon} />
                    </span>
                    <span>
                      <strong>{item.label}</strong>
                      <small>{item.keywords.split(" ").slice(0, 3).join(" · ")}</small>
                    </span>
                    <kbd>↵</kbd>
                  </button>
                ))
              ) : (
                <div className="command-search-empty">
                  <SearchIcon />
                  <strong>No results found</strong>
                  <small>Try searching for payments, reports, customers, or settings.</small>
                </div>
              )}
            </div>
            <footer className="command-search-footer">
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> Navigate
              </span>
              <span>
                <kbd>↵</kbd> Open
              </span>
              <span>
                <kbd>ESC</kbd> Close
              </span>
            </footer>
          </section>
        </div>
      ) : null}
    </div>
  );
}
