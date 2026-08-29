"use client";

import {
  ArrowRightIcon,
  ArrowUpIcon,
  BankIcon,
  ChartVerticalIcon,
  CheckCircleIcon,
  ClipboardIcon,
  CodeIcon,
  ExitIcon,
  HomeIcon,
  MoneyIcon,
  OrderIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
  TeamIcon
} from "@shopify/polaris-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { Select } from "@/components/ui/select";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  PartnerLinksView,
  PartnerMarketingView,
  PartnerMerchantsView,
  PartnerPayoutsView,
  PartnerReferralsView,
  PartnerReportsView,
  PartnerResourcesView
} from "@/features/portals/components/partner-workspace-views";
import { ACRU_SESSION_KEY, readSession } from "@/lib/auth/client";

const testKey = "sk_test_acru_51Rw9jX3mPL8cD6nK4vT";

type SandboxRequest = { id: string; method: string; path: string; status: number; latency: number; time: string };

function PortalHeader({ label, onLogout }: { label: string; onLogout: () => void }) {
  return (
    <header className="portal-header">
      <div className="portal-brand">
        <Image alt="Acru" height={32} priority src="/acru-logo.png" width={38} />
        <i />
        <span>{label}</span>
      </div>
      <button onClick={onLogout} type="button">
        <ExitIcon /> Sign out
      </button>
    </header>
  );
}

export function SandboxPortalPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [key, setKey] = useState(testKey);
  const [amount, setAmount] = useState("125.00");
  const [currency, setCurrency] = useState("usd");
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [message, setMessage] = useState("Run a read-only request to verify this test key.");
  const [requests, setRequests] = useState<SandboxRequest[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => setEmail(readSession()?.email ?? ""), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function logout() {
    localStorage.removeItem(ACRU_SESSION_KEY);
    router.push("/sign-in?portal=sandbox");
  }

  async function send(path: string, options: RequestInit, method: string) {
    const start = performance.now();
    setStatus("running");
    try {
      const response = await fetch(path, {
        ...options,
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...options.headers }
      });
      const data = (await response.json()) as { request_id?: string; message?: string; error?: { message?: string } };
      const latency = Math.max(1, Math.round(performance.now() - start));
      setRequests((current) =>
        [
          {
            id: data.request_id ?? response.headers.get("X-Acru-Request-Id") ?? "—",
            method,
            path: path.replace("/api/sandbox", "/v1"),
            status: response.status,
            latency,
            time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
          },
          ...current
        ].slice(0, 6)
      );
      setStatus(response.ok ? "success" : "error");
      setMessage(
        response.ok
          ? (data.message ?? `Connection verified in ${latency} ms.`)
          : (data.error?.message ?? "Request failed.")
      );
    } catch {
      setStatus("error");
      setMessage("The sandbox could not be reached. Try again.");
    }
  }

  return (
    <main className="portal-page">
      <PortalHeader label="API sandbox" onLogout={logout} />
      <section className="portal-content">
        <div className="portal-title-row">
          <div>
            <span className="portal-kicker">
              <i /> TEST MODE
            </span>
            <h1>Direct API sandbox</h1>
            <p>Build and validate Acru payment flows without moving real funds.</p>
          </div>
          <span className="portal-user">{email}</span>
        </div>
        <section className="sandbox-grid">
          <article className="portal-card sandbox-connect-card">
            <header>
              <span>
                <CodeIcon />
                <b>Verify your connection</b>
              </span>
              <small>GET /v1/account</small>
            </header>
            <label>
              Test secret key
              <input
                aria-label="Test secret key"
                onChange={(event) => setKey(event.target.value)}
                spellCheck={false}
                value={key}
              />
            </label>
            <div className="sandbox-result" data-state={status}>
              <span>{status === "running" ? <RefreshIcon /> : <CheckCircleIcon />}</span>
              <div>
                <b>
                  {status === "success"
                    ? "Connected"
                    : status === "error"
                      ? "Connection failed"
                      : status === "running"
                        ? "Connecting…"
                        : "Ready to test"}
                </b>
                <p>{message}</p>
              </div>
            </div>
            <button
              className="portal-primary"
              disabled={status === "running"}
              onClick={() => send("/api/sandbox/preflight", { method: "GET" }, "GET")}
              type="button"
            >
              <RefreshIcon /> Test connection
            </button>
          </article>
          <article className="portal-card sandbox-payment-card">
            <header>
              <span>
                <ArrowRightIcon />
                <b>Simulate a payment</b>
              </span>
              <small>POST /v1/payment-intents</small>
            </header>
            <div className="sandbox-fields">
              <label>
                Amount
                <input inputMode="decimal" onChange={(event) => setAmount(event.target.value)} value={amount} />
              </label>
              <label>
                Currency
                <select onChange={(event) => setCurrency(event.target.value)} value={currency}>
                  <option value="usd">USD</option>
                  <option value="usdc">USDC</option>
                </select>
              </label>
            </div>
            <p className="portal-note">
              Test payments return realistic responses and never touch the card networks or blockchain.
            </p>
            <button
              className="portal-secondary"
              onClick={() =>
                send(
                  "/api/sandbox/payment-intents",
                  { method: "POST", body: JSON.stringify({ amount: Math.round(Number(amount) * 100), currency }) },
                  "POST"
                )
              }
              type="button"
            >
              Create test payment <ArrowRightIcon />
            </button>
          </article>
        </section>
        <section className="portal-card portal-table-card">
          <header>
            <div>
              <h2>Recent requests</h2>
              <p>Requests made during this sandbox session.</p>
            </div>
            <span>{requests.length} requests</span>
          </header>
          {requests.length ? (
            <div className="portal-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Request</th>
                    <th>Endpoint</th>
                    <th>Status</th>
                    <th>Latency</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td>
                        <code>{request.id}</code>
                      </td>
                      <td>
                        <b>{request.method}</b> {request.path}
                      </td>
                      <td>
                        <span className={request.status < 300 ? "portal-status success" : "portal-status error"}>
                          {request.status}
                        </span>
                      </td>
                      <td>{request.latency} ms</td>
                      <td>{request.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="portal-empty">
              <CodeIcon />
              <h3>No sandbox requests yet</h3>
              <p>Your test API activity will appear here.</p>
            </div>
          )}
        </section>
        <p className="portal-footnote">
          This sandbox is for direct Acru API deployments. Authorize.net and NMI gateway deployments use their
          gateway-specific testing tools.
        </p>
      </section>
    </main>
  );
}

type PartnerTab =
  | "Dashboard"
  | "Merchants"
  | "Applications"
  | "Activity"
  | "Earnings"
  | "Payouts"
  | "Referrals"
  | "Custom links"
  | "Marketing materials"
  | "Reports"
  | "Resources";
type PartnerStatus = "Invited" | "In progress" | "Pending review" | "Approved" | "Needs information";
type PartnerApplicant = {
  id: string;
  name: string;
  email: string;
  signedUp: string;
  step: number;
  status: PartnerStatus;
  volume: string;
  earnings: string;
};
type PartnerWithdrawal = {
  id: string;
  date: string;
  method: "ACH" | "USDC";
  destination: string;
  amount: number;
  status: "Processing" | "Paid";
};
type PartnerActivity = {
  id: string;
  merchant: string;
  customer: string;
  amount: number;
  rail: "Visa" | "Mastercard" | "Apple Pay" | "ACH" | "USDC";
  rate: number;
  cut: number;
  time: string;
  status: "Available" | "Pending";
};
type PartnerActivityFilter = "All" | "Card" | "ACH" | "USDC";

const partnerNavigation = [
  { label: "Dashboard", icon: HomeIcon },
  { label: "Merchants", icon: TeamIcon },
  { label: "Applications", icon: ClipboardIcon },
  { label: "Activity", icon: OrderIcon },
  { label: "Earnings", icon: ChartVerticalIcon },
  { label: "Payouts", icon: BankIcon },
  { label: "Referrals", icon: TeamIcon },
  { label: "Custom links", icon: CodeIcon },
  { label: "Marketing materials", icon: ClipboardIcon },
  { label: "Reports", icon: ChartVerticalIcon },
  { label: "Resources", icon: HomeIcon }
] as const;

type EarningsRange = "7D" | "30D" | "3M" | "1Y";

const earningsTrendData: Record<EarningsRange, { total: string; change: string; labels: string[]; values: number[] }> =
  {
    "7D": {
      total: "$5,100.42",
      change: "+12.4%",
      labels: ["Aug 19", "Aug 20", "Aug 21", "Aug 22", "Aug 23", "Aug 24", "Aug 25"],
      values: [420, 580, 510, 760, 890, 830, 1110]
    },
    "30D": {
      total: "$18,420.00",
      change: "+14.8%",
      labels: ["Jul 27", "Aug 1", "Aug 6", "Aug 11", "Aug 16", "Aug 21", "Aug 25"],
      values: [1320, 1980, 2510, 2220, 3190, 3980, 4620]
    },
    "3M": {
      total: "$51,842.60",
      change: "+21.6%",
      labels: ["Jun 1", "Jun 15", "Jul 1", "Jul 15", "Aug 1", "Aug 15", "Aug 25"],
      values: [2800, 3400, 5200, 4600, 6100, 7400, 8900]
    },
    "1Y": {
      total: "$142,684.72",
      change: "+38.2%",
      labels: ["Sep", "Nov", "Jan", "Mar", "May", "Jul", "Aug"],
      values: [5800, 8200, 9600, 11300, 14200, 16800, 18420]
    }
  };

const earningsRangeMultiplier: Record<EarningsRange, number> = {
  "7D": 0.28,
  "30D": 1,
  "3M": 2.81,
  "1Y": 7.75
};

function parseCurrency(value: string) {
  return Number(value.replace(/[$,]/g, "")) || 0;
}

function parseCompactCurrency(value: string) {
  const normalized = value.replace(/[$,]/g, "").trim().toUpperCase();
  const amount = Number.parseFloat(normalized) || 0;
  if (normalized.endsWith("M")) return amount * 1_000_000;
  if (normalized.endsWith("K")) return amount * 1_000;
  return amount;
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1000 ? 1 : 0
  }).format(value);
}

const merchantBrandAssets: Record<string, string> = {
  Bitunix: "/merchant-brands/bitunix.svg",
  "Northwind Coffee Co.": "/merchant-brands/northwind.svg",
  "Lumen Digital": "/merchant-brands/lumen.svg",
  "Crescent Retail": "/merchant-brands/crescent.svg"
};

function MerchantBrandPreview({ name }: { name: string }) {
  const source = merchantBrandAssets[name];
  return source ? (
    <span className="partner-merchant-brand-preview">
      <Image alt={`${name} brand`} height={36} src={source} width={36} />
    </span>
  ) : (
    <span className="partner-merchant-brand-preview fallback" aria-hidden="true">
      {name.slice(0, 1)}
    </span>
  );
}

function smoothEarningsPath(points: Array<{ x: number; y: number }>) {
  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = points[index - 1];
    const controlX = (previous.x + point.x) / 2;
    return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
  }, "");
}

function PartnerEarningsCharts({
  applicants,
  dashboard = false,
  onViewMerchants
}: {
  applicants: PartnerApplicant[];
  dashboard?: boolean;
  onViewMerchants?: () => void;
}) {
  const [range, setRange] = useState<EarningsRange>("30D");
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const trend = earningsTrendData[range];
  const maxValue = Math.max(...trend.values) * 1.15;
  const points = trend.values.map((value, index) => ({
    x: 10 + (index * 620) / (trend.values.length - 1),
    y: 190 - (value / maxValue) * 142,
    value,
    label: trend.labels[index]
  }));
  const linePath = smoothEarningsPath(points);
  const areaPath = `${linePath} L ${points.at(-1)?.x ?? 630} 190 L ${points[0].x} 190 Z`;
  const multiplier = earningsRangeMultiplier[range];
  const merchantData = applicants
    .filter((item) => item.status === "Approved" && parseCurrency(item.earnings) > 0)
    .map((item) => ({ name: item.name, value: parseCurrency(item.earnings) * multiplier, volume: item.volume }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  const merchantTotal = merchantData.reduce((total, item) => total + item.value, 0);
  const topMerchant = merchantData[0];

  function updateActivePoint(event: React.PointerEvent<SVGRectElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const position = Math.max(0, Math.min(bounds.width, event.clientX - bounds.left));
    setActivePoint(Math.round((position / bounds.width) * (points.length - 1)));
  }

  return (
    <section className="partner-earnings-charts" aria-label="Partner earnings charts">
      <article className="portal-card partner-chart-card partner-trend-card">
        <header>
          <div>
            <h2>Earnings over time</h2>
            <p>Commission earned from approved merchant activity.</p>
          </div>
          <div className="partner-chart-range" aria-label="Earnings chart date range">
            {(["7D", "30D", "3M", "1Y"] as EarningsRange[]).map((item) => (
              <button
                className={range === item ? "active" : undefined}
                key={item}
                onClick={() => setRange(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </header>
        <div className="partner-chart-value">
          <strong>{trend.total}</strong>
          <span>
            <ArrowUpIcon /> {trend.change}
          </span>
          <small>vs. previous period</small>
        </div>
        <div className="partner-line-chart" onPointerLeave={() => setActivePoint(null)}>
          <svg aria-label={`Earnings trend for ${range}`} preserveAspectRatio="none" role="img" viewBox="0 0 640 225">
            <defs>
              <linearGradient id="partnerEarningsArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#4aa8dc" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#4aa8dc" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[48, 95, 142, 190].map((y) => (
              <line className="partner-chart-gridline" key={y} x1="10" x2="630" y1={y} y2={y} />
            ))}
            <path className="partner-chart-area" d={areaPath} />
            <path className="partner-chart-line" d={linePath} />
            {activePoint !== null ? (
              <>
                <line
                  className="partner-chart-cursor"
                  x1={points[activePoint].x}
                  x2={points[activePoint].x}
                  y1="35"
                  y2="190"
                />
                <circle
                  className="partner-chart-point active"
                  cx={points[activePoint].x}
                  cy={points[activePoint].y}
                  r="5"
                />
              </>
            ) : null}
            <rect
              className="partner-chart-hitbox"
              height="165"
              onPointerDown={updateActivePoint}
              onPointerMove={updateActivePoint}
              width="620"
              x="10"
              y="30"
            />
            {points.map((point) => (
              <circle className="partner-chart-point" cx={point.x} cy={point.y} key={point.label} r="3" />
            ))}
            {points.map((point, index) => (
              <text
                className="partner-chart-label"
                key={point.label}
                textAnchor={index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"}
                x={point.x}
                y="216"
              >
                {point.label}
              </text>
            ))}
          </svg>
          {activePoint !== null ? (
            <div className="partner-chart-tooltip" style={{ left: `${(points[activePoint].x / 640) * 100}%` }}>
              <span>{points[activePoint].label}</span>
              <strong>{formatCompactCurrency(points[activePoint].value)}</strong>
            </div>
          ) : null}
        </div>
      </article>

      {dashboard ? (
        <article className="portal-card partner-chart-card partner-dashboard-top-merchants">
          <header>
            <div>
              <h2>Top merchants</h2>
              <p>Highest commission contributors this period.</p>
            </div>
            <button onClick={onViewMerchants} type="button">
              View all
            </button>
          </header>
          <div className="partner-dashboard-merchant-head">
            <span>Merchant</span>
            <span>Volume</span>
            <span>Commission</span>
          </div>
          <div className="partner-dashboard-merchant-list">
            {merchantData.map((merchant) => (
              <button key={merchant.name} onClick={onViewMerchants} type="button">
                <span>
                  <MerchantBrandPreview name={merchant.name} />
                  <b>{merchant.name}</b>
                </span>
                <span>{merchant.volume}</span>
                <strong>{formatCompactCurrency(merchant.value)}</strong>
              </button>
            ))}
          </div>
        </article>
      ) : (
        <article className="portal-card partner-chart-card partner-contribution-card">
          <header>
            <div>
              <h2>Earnings by merchant</h2>
              <p>Which referrals generated commission in the selected period.</p>
            </div>
            <span className="partner-selected-period">{range === "30D" ? "Last 30 days" : range}</span>
          </header>
          <div className="partner-chart-value">
            <strong>{topMerchant ? formatCompactCurrency(topMerchant.value) : "$0"}</strong>
            <span className="neutral">Top merchant</span>
            <small>{topMerchant?.name ?? "No earnings"}</small>
          </div>
          <div className="partner-merchant-bars">
            {merchantData.map((merchant) => {
              const share = merchantTotal ? (merchant.value / merchantTotal) * 100 : 0;
              return (
                <div key={merchant.name}>
                  <MerchantBrandPreview name={merchant.name} />
                  <span className="partner-bar-copy">
                    <b>{merchant.name}</b>
                    <i>
                      <span style={{ width: `${share}%` }} />
                    </i>
                  </span>
                  <span className="partner-bar-value">
                    <b>{formatCompactCurrency(merchant.value)}</b>
                    <small>{share.toFixed(1)}%</small>
                  </span>
                </div>
              );
            })}
          </div>
        </article>
      )}
    </section>
  );
}

const partnerStages = ["Account", "Business", "Owners", "Settlement", "Review"];
const applicationProfileStages = ["Submitted", "Compliance review", "Merchant review", "Approved", "Live"];
const starterApplicants: PartnerApplicant[] = [
  {
    id: "app_8Qm4aL",
    name: "Bitunix",
    email: "payments@bitunix.com",
    signedUp: "Aug 21, 2026",
    step: 5,
    status: "Approved",
    volume: "$1.84M",
    earnings: "$9,614.20"
  },
  {
    id: "app_3Kt7vB",
    name: "Apex Casino Group",
    email: "finance@apex.example",
    signedUp: "Aug 20, 2026",
    step: 4,
    status: "Pending review",
    volume: "$684K",
    earnings: "$3,248.10"
  },
  {
    id: "app_7Hs2pN",
    name: "Northwind Coffee Co.",
    email: "ops@northwind.coffee",
    signedUp: "Aug 18, 2026",
    step: 5,
    status: "Approved",
    volume: "$218K",
    earnings: "$1,472.80"
  },
  {
    id: "app_5Ld9xC",
    name: "Harbor Commerce",
    email: "team@harborcommerce.io",
    signedUp: "Aug 16, 2026",
    step: 3,
    status: "In progress",
    volume: "$0",
    earnings: "$0.00"
  },
  {
    id: "app_2Pw6rF",
    name: "Atlas Interactive",
    email: "payments@atlas.gg",
    signedUp: "Aug 14, 2026",
    step: 2,
    status: "Needs information",
    volume: "$0",
    earnings: "$0.00"
  },
  {
    id: "app_1Nc8yJ",
    name: "Vertex Markets",
    email: "finance@vertexmarkets.co",
    signedUp: "Aug 12, 2026",
    step: 1,
    status: "Invited",
    volume: "$0",
    earnings: "$0.00"
  },
  {
    id: "app_9Ar4mT",
    name: "Lumen Digital",
    email: "hello@lumendigital.com",
    signedUp: "Aug 10, 2026",
    step: 5,
    status: "Approved",
    volume: "$492K",
    earnings: "$2,386.42"
  },
  {
    id: "app_4Bx1qS",
    name: "Copper State Labs",
    email: "ops@copperstate.dev",
    signedUp: "Aug 8, 2026",
    step: 4,
    status: "Pending review",
    volume: "$0",
    earnings: "$0.00"
  },
  {
    id: "app_6Vm3eD",
    name: "Crescent Retail",
    email: "payments@crescentretail.com",
    signedUp: "Aug 5, 2026",
    step: 5,
    status: "Approved",
    volume: "$306K",
    earnings: "$1,698.48"
  }
];

const recentPartnerConversions = [
  {
    id: "BTX-98374",
    merchant: "Bitunix",
    time: "Today · 10:42 AM",
    revenue: "$1,248.50",
    commission: "$24.97",
    status: "Approved"
  },
  {
    id: "LUM-78221",
    merchant: "Lumen Digital",
    time: "Today · 9:15 AM",
    revenue: "$987.20",
    commission: "$19.74",
    status: "Approved"
  },
  {
    id: "CRS-98068",
    merchant: "Crescent Retail",
    time: "Yesterday · 8:33 PM",
    revenue: "$654.00",
    commission: "$13.08",
    status: "Approved"
  },
  {
    id: "NWC-97915",
    merchant: "Northwind Coffee Co.",
    time: "Yesterday · 6:21 PM",
    revenue: "$310.00",
    commission: "$6.20",
    status: "Pending"
  }
];

const topPartnerLinks = [
  { name: "Bitunix · Main link", clicks: "8,942", conversions: "324", commission: "$2,876.40" },
  { name: "Lumen · Summer campaign", clicks: "6,231", conversions: "218", commission: "$1,784.22" },
  { name: "Crescent · Retail banner", clicks: "4,112", conversions: "156", commission: "$1,245.84" },
  { name: "Northwind · Email", clicks: "3,409", conversions: "112", commission: "$876.31" }
];

const initialWithdrawals: PartnerWithdrawal[] = [
  {
    id: "wd_82Qm41",
    date: "Aug 1, 2026",
    method: "ACH",
    destination: "Wells Fargo •••• 4242",
    amount: 12500,
    status: "Paid"
  },
  {
    id: "wd_71Kt39",
    date: "Jul 15, 2026",
    method: "USDC",
    destination: "0x71F2…8A4C · Base",
    amount: 8400,
    status: "Paid"
  },
  {
    id: "wd_64Hs20",
    date: "Jul 1, 2026",
    method: "ACH",
    destination: "Wells Fargo •••• 4242",
    amount: 10750,
    status: "Paid"
  }
];

const initialPartnerActivity: PartnerActivity[] = [
  {
    id: "pay_8H2Q1L",
    merchant: "Bitunix",
    customer: "M. Carter",
    amount: 2450,
    rail: "Visa",
    rate: 0.52,
    cut: 12.74,
    time: "Just now",
    status: "Pending"
  },
  {
    id: "pay_7K9D4M",
    merchant: "Lumen Digital",
    customer: "0x8A91…42CE",
    amount: 8200,
    rail: "USDC",
    rate: 0.5,
    cut: 41,
    time: "18 sec ago",
    status: "Pending"
  },
  {
    id: "pay_5V6N2P",
    merchant: "Northwind Coffee Co.",
    customer: "J. Reynolds",
    amount: 184.75,
    rail: "Apple Pay",
    rate: 0.6,
    cut: 1.11,
    time: "42 sec ago",
    status: "Available"
  },
  {
    id: "pay_3C8R7W",
    merchant: "Crescent Retail",
    customer: "A. Patel",
    amount: 692.4,
    rail: "Mastercard",
    rate: 0.6,
    cut: 4.15,
    time: "1 min ago",
    status: "Available"
  },
  {
    id: "pay_2M4T9X",
    merchant: "Bitunix",
    customer: "E. Thompson",
    amount: 3750,
    rail: "ACH",
    rate: 0.42,
    cut: 15.75,
    time: "2 min ago",
    status: "Pending"
  },
  {
    id: "pay_1A7F5J",
    merchant: "Lumen Digital",
    customer: "0x71F2…8A4C",
    amount: 12400,
    rail: "USDC",
    rate: 0.5,
    cut: 62,
    time: "3 min ago",
    status: "Available"
  },
  {
    id: "pay_9P3B6S",
    merchant: "Northwind Coffee Co.",
    customer: "S. Williams",
    amount: 328.2,
    rail: "Visa",
    rate: 0.6,
    cut: 1.97,
    time: "4 min ago",
    status: "Available"
  },
  {
    id: "pay_4D8L2N",
    merchant: "Crescent Retail",
    customer: "R. Anderson",
    amount: 1128,
    rail: "Mastercard",
    rate: 0.6,
    cut: 6.77,
    time: "5 min ago",
    status: "Pending"
  }
];

function PartnerLiveActivity({
  activity,
  condensed = false,
  onViewAll
}: {
  activity: PartnerActivity[];
  condensed?: boolean;
  onViewAll?: () => void;
}) {
  const [filter, setFilter] = useState<PartnerActivityFilter>("All");
  const visibleActivity = activity
    .filter((item) => {
      if (filter === "All") return true;
      if (filter === "Card") return ["Visa", "Mastercard", "Apple Pay"].includes(item.rail);
      return item.rail === filter;
    })
    .slice(0, condensed ? 6 : 18);

  return (
    <section className={`portal-card portal-table-card partner-live-card${condensed ? " condensed" : ""}`}>
      <header>
        <div>
          <h2>Recent merchant activity</h2>
          <p>Successful payments and the commission attributed to each transaction.</p>
        </div>
      </header>
      {!condensed ? (
        <div className="partner-live-filters" aria-label="Filter activity by payment rail">
          {(["All", "Card", "ACH", "USDC"] as PartnerActivityFilter[]).map((item) => (
            <button
              className={filter === item ? "active" : undefined}
              key={item}
              onClick={() => setFilter(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
      <div className="portal-table-wrap partner-live-table">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Merchant</th>
              <th>Customer</th>
              <th>Payment</th>
              <th>Rail</th>
              <th>Your rate</th>
              <th>Your cut</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleActivity.map((item) => (
              <tr key={item.id}>
                <td>
                  <span className="partner-activity-time">{item.time}</span>
                  <small>{item.id}</small>
                </td>
                <td>
                  <span className="partner-activity-merchant">
                    <i>{item.merchant.slice(0, 1)}</i>
                    <b>{item.merchant}</b>
                  </span>
                </td>
                <td>{item.customer}</td>
                <td>
                  <b>${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</b>
                </td>
                <td>{item.rail}</td>
                <td>{item.rate.toFixed(2)}%</td>
                <td>
                  <strong className="partner-activity-cut">
                    +${item.cut.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </strong>
                </td>
                <td>
                  <span className={`portal-status ${item.status === "Available" ? "success" : "review"}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {condensed && onViewAll ? (
        <footer className="partner-live-footer">
          <button onClick={onViewAll} type="button">
            View all activity <ArrowRightIcon />
          </button>
        </footer>
      ) : null}
    </section>
  );
}

export function PartnerPortalPage() {
  const router = useRouter();
  const [tab, setTab] = useState<PartnerTab>("Dashboard");
  const [applicants, setApplicants] = useState(starterApplicants);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [page, setPage] = useState(1);
  const [selectedApplicationId, setSelectedApplicationId] = useState(starterApplicants[0].id);
  const [copied, setCopied] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(18420.48);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<"ACH" | "USDC">("ACH");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawals, setWithdrawals] = useState(initialWithdrawals);
  const activity = initialPartnerActivity;
  const pendingBalance = 6380.2;
  const earningsToday = 1284.72;
  const filteredApplicants = applicants.filter((applicant) => {
    const normalized = query.trim().toLowerCase();
    return (
      (!normalized || `${applicant.name} ${applicant.email} ${applicant.id}`.toLowerCase().includes(normalized)) &&
      (statusFilter === "All statuses" || applicant.status === statusFilter)
    );
  });
  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(filteredApplicants.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleApplicants = filteredApplicants.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const earningApplicants = applicants.filter((applicant) => applicant.status === "Approved");
  const approvedCount = earningApplicants.length;
  const attributedVolume = earningApplicants.reduce(
    (total, applicant) => total + parseCompactCurrency(applicant.volume),
    0
  );
  const monthlyCommission = 18420;
  const effectiveCommissionRate = attributedVolume ? (monthlyCommission / attributedVolume) * 100 : 0;
  const selectedApplication =
    applicants.find((applicant) => applicant.id === selectedApplicationId) ?? visibleApplicants[0] ?? applicants[0];
  const selectedApplicationStage = selectedApplication
    ? selectedApplication.status === "Approved" && selectedApplication.volume !== "$0"
      ? applicationProfileStages.length
      : selectedApplication.status === "Approved"
        ? 4
        : selectedApplication.status === "Pending review"
          ? selectedApplication.step >= 4
            ? 2
            : 1
          : selectedApplication.status === "Needs information"
            ? 1
            : 0
    : 0;
  const selectedApplicationDocuments: Array<[string, boolean]> = selectedApplication
    ? [
        ["Business license", selectedApplication.step >= 2],
        ["Tax identification", selectedApplication.step >= 4],
        ["Bank account verification", selectedApplication.status === "Approved"]
      ]
    : [];

  function logout() {
    localStorage.removeItem(ACRU_SESSION_KEY);
    router.push("/sign-in?portal=partner");
  }
  function selectApplication(applicationId: string) {
    setSelectedApplicationId(applicationId);
    window.requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>(".partner-application-profile")
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }
  function addClient(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setApplicants((current) => [
      {
        id: `app_${window.crypto.randomUUID().replaceAll("-", "").slice(0, 6)}`,
        name: name.trim(),
        email: email.trim(),
        signedUp: "Just now",
        step: 1,
        status: "Invited",
        volume: "$0",
        earnings: "$0.00"
      },
      ...current
    ]);
    setName("");
    setEmail("");
    setShowForm(false);
    setTab("Applications");
    setPage(1);
  }
  async function copyReferral() {
    await navigator.clipboard.writeText("https://merchants.acrudevelopment.com/sign-up?ref=PTR-NORTHSTAR");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }
  function withdraw(event: FormEvent) {
    event.preventDefault();
    const amount = Number(withdrawAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setWithdrawError("Enter a valid withdrawal amount.");
      return;
    }
    if (amount > availableBalance) {
      setWithdrawError("The amount exceeds your available balance.");
      return;
    }
    const withdrawal: PartnerWithdrawal = {
      id: `wd_${window.crypto.randomUUID().replaceAll("-", "").slice(0, 6)}`,
      date: "Today",
      method: withdrawMethod,
      destination: withdrawMethod === "ACH" ? "Wells Fargo •••• 4242" : "0x71F2…8A4C · Base",
      amount,
      status: "Processing"
    };
    setAvailableBalance((balance) => balance - amount);
    setWithdrawals((current) => [withdrawal, ...current]);
    setWithdrawAmount("");
    setWithdrawError("");
    setWithdrawOpen(false);
  }

  return (
    <main className="portal-page partner-portal">
      <PortalHeader label="Partners" onLogout={logout} />
      <aside className="partner-sidebar">
        <button className="partner-sidebar-account" onClick={() => setTab("Dashboard")} type="button">
          <span>N</span>
          <span>
            <b>Northstar Partners</b>
            <small>Partner ID: PTR-NORTHSTAR</small>
          </span>
        </button>
        <nav aria-label="Partner workspace">
          {partnerNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={tab === item.label ? "active" : undefined}
                key={item.label}
                onClick={() => setTab(item.label)}
                type="button"
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="partner-sidebar-lower">
          <section className="partner-manager-card" aria-label="Your partner manager">
            <header>
              <span className="partner-manager-avatar" aria-hidden="true">
                CJ
              </span>
              <span>
                <small>Your partner manager</small>
                <b>Claire Johnson</b>
                <small>claire.johnson@acru.com</small>
              </span>
            </header>
            <a href="mailto:claire.johnson@acru.com">
              <TeamIcon /> Contact manager
            </a>
          </section>
        </div>
      </aside>
      <section className="portal-content partner-main">
        <div className="portal-title-row partner-title-row">
          <div>
            <span className="portal-kicker">Partner workspace</span>
            <h1>{tab === "Dashboard" ? "Good morning, Alex" : tab}</h1>
            <p>
              {tab === "Dashboard"
                ? "Monitor merchant onboarding, posted payment activity, and the earnings those referrals generate."
                : tab === "Applications"
                  ? "Track every referred merchant from invitation through approval."
                  : tab === "Activity"
                    ? "Review successful merchant payments and your share of each posted transaction."
                    : tab === "Merchants"
                      ? "See revenue, conversions, commission, and payout status for every approved merchant."
                      : tab === "Earnings"
                        ? "Analyze commission performance by time period and merchant."
                        : tab === "Payouts"
                          ? "Manage payout methods and withdraw available partner earnings."
                          : tab === "Referrals"
                            ? "Trace every referral from first click through active merchant."
                            : tab === "Custom links"
                              ? "Create trackable onboarding links for campaigns and channels."
                              : tab === "Marketing materials"
                                ? "Use approved creative, copy, and partner campaign assets."
                                : tab === "Reports"
                                  ? "Filter and export granular referral and earnings performance."
                                  : "Find partner guides, payment policies, and integration references."}
            </p>
          </div>
          <div className="partner-title-actions">
            {["Dashboard", "Merchants", "Applications", "Referrals", "Custom links"].includes(tab) ? (
              <button className="portal-secondary" onClick={copyReferral} type="button">
                <ClipboardIcon /> {copied ? "Copied" : "Copy onboarding link"}
              </button>
            ) : null}
            {tab === "Applications" ? (
              <button className="portal-primary" onClick={() => setShowForm(true)} type="button">
                <PlusIcon /> Create merchant
              </button>
            ) : null}
            {tab === "Earnings" || tab === "Payouts" ? (
              <button className="portal-primary" onClick={() => setWithdrawOpen(true)} type="button">
                Request withdrawal
              </button>
            ) : null}
          </div>
        </div>

        {tab === "Dashboard" ? (
          <>
            <section className="partner-dashboard-metrics" aria-label="Partner performance overview">
              {[
                { label: "Clicks", value: "48,742", change: "+18.6%", icon: ChartVerticalIcon },
                { label: "Conversions", value: "1,248", change: "+22.4%", icon: OrderIcon },
                { label: "Gross revenue", value: "$96,842.34", change: "+16.2%", icon: MoneyIcon },
                { label: "Commission earned", value: "$18,420.00", change: "+14.8%", icon: BankIcon },
                {
                  label: "Pending commission",
                  value: `$${pendingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                  change: "+9.6%",
                  icon: RefreshIcon
                },
                {
                  label: "Available to withdraw",
                  value: `$${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                  change: "Ready now",
                  icon: CheckCircleIcon
                }
              ].map(({ label, value, change, icon: Icon }) => (
                <article className="portal-card" key={label}>
                  <span className="partner-dashboard-metric-icon">
                    <Icon />
                  </span>
                  <div>
                    <p>{label}</p>
                    <strong>{value}</strong>
                    <small className={change === "Ready now" ? "neutral" : undefined}>{change}</small>
                  </div>
                </article>
              ))}
            </section>
            <PartnerEarningsCharts applicants={applicants} dashboard onViewMerchants={() => setTab("Merchants")} />
            <section className="partner-dashboard-bottom">
              <article className="portal-card partner-dashboard-breakdown">
                <header>
                  <div>
                    <h2>Commission breakdown</h2>
                    <p>How this month&apos;s earnings were generated.</p>
                  </div>
                </header>
                <div className="partner-dashboard-donut-row">
                  <div className="partner-dashboard-donut">
                    <span>
                      <strong>$18.4K</strong>
                      <small>Total</small>
                    </span>
                  </div>
                  <dl>
                    {[
                      ["Rev share", "$8,542.10", "46.4%"],
                      ["CPA", "$5,236.90", "28.4%"],
                      ["Hybrid", "$3,402.00", "18.5%"],
                      ["Bonuses", "$1,239.00", "6.7%"]
                    ].map(([label, amount, share], index) => (
                      <div key={label}>
                        <dt>
                          <i data-index={index} /> {label}
                        </dt>
                        <dd>
                          <b>{amount}</b>
                          <span>{share}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
              <article className="portal-card partner-dashboard-activity">
                <header>
                  <div>
                    <h2>Recent activity</h2>
                    <p>Posted partner and merchant events.</p>
                  </div>
                  <button onClick={() => setTab("Activity")} type="button">
                    View all
                  </button>
                </header>
                <div>
                  {[
                    ["Application submitted", "The Edge Markets", "2h ago", ClipboardIcon],
                    ["Merchant approved", "Crescent Retail", "5h ago", CheckCircleIcon],
                    ["Commission earned", "$432.18 from Bitunix", "1d ago", MoneyIcon],
                    ["Payout sent", "$6,240.00 to •••• 4242", "2d ago", BankIcon]
                  ].map(([label, detail, time, icon], index) => {
                    const Icon = icon as typeof HomeIcon;
                    return (
                      <div key={String(label)}>
                        <span className={`tone-${index}`}>
                          <Icon />
                        </span>
                        <p>
                          <b>{String(label)}</b>
                          <small>{String(detail)}</small>
                        </p>
                        <time>{String(time)}</time>
                      </div>
                    );
                  })}
                </div>
              </article>
              <article className="portal-card partner-dashboard-actions">
                <header>
                  <div>
                    <h2>Quick actions</h2>
                    <p>Common partner workflows.</p>
                  </div>
                </header>
                <div>
                  <button onClick={copyReferral} type="button">
                    <CodeIcon />
                    <span>
                      <b>{copied ? "Link copied" : "Copy onboarding link"}</b>
                      <small>Invite a merchant</small>
                    </span>
                  </button>
                  <button onClick={() => setTab("Applications")} type="button">
                    <ClipboardIcon />
                    <span>
                      <b>View applications</b>
                      <small>Track approvals</small>
                    </span>
                  </button>
                  <button onClick={() => setWithdrawOpen(true)} type="button">
                    <BankIcon />
                    <span>
                      <b>Request withdrawal</b>
                      <small>Move earnings</small>
                    </span>
                  </button>
                  <button onClick={() => setTab("Reports")} type="button">
                    <ChartVerticalIcon />
                    <span>
                      <b>View reports</b>
                      <small>Analyze performance</small>
                    </span>
                  </button>
                </div>
              </article>
              <article className="portal-card partner-dashboard-goal">
                <header>
                  <div>
                    <h2>Monthly goal</h2>
                    <p>August 2026</p>
                  </div>
                  <strong>73%</strong>
                </header>
                <p>
                  <strong>$18,420.00</strong>
                  <span>/ $25,000.00</span>
                </p>
                <div className="partner-dashboard-goal-track">
                  <span style={{ width: "73%" }} />
                </div>
                <small className="partner-dashboard-goal-status">
                  <CheckCircleIcon /> On track to hit your goal
                </small>
                <dl>
                  <div>
                    <dt>Projected earnings</dt>
                    <dd>$22,180.00</dd>
                  </div>
                  <div>
                    <dt>Days remaining</dt>
                    <dd>6</dd>
                  </div>
                </dl>
              </article>
            </section>
          </>
        ) : null}

        {tab === "Merchants" ? <PartnerMerchantsView applicants={applicants} /> : null}
        {tab === "Payouts" ? (
          <PartnerPayoutsView
            availableBalance={availableBalance}
            pendingBalance={pendingBalance}
            withdrawals={withdrawals}
          />
        ) : null}
        {tab === "Referrals" ? <PartnerReferralsView applicants={applicants} /> : null}
        {tab === "Custom links" ? <PartnerLinksView /> : null}
        {tab === "Marketing materials" ? <PartnerMarketingView /> : null}
        {tab === "Reports" ? <PartnerReportsView applicants={applicants} /> : null}
        {tab === "Resources" ? <PartnerResourcesView /> : null}

        {showForm ? (
          <form className="portal-card partner-form" onSubmit={addClient}>
            <header>
              <div>
                <h2>Create merchant invitation</h2>
                <p>Send a tracked onboarding link to a new referred merchant.</p>
              </div>
              <button onClick={() => setShowForm(false)} type="button">
                Cancel
              </button>
            </header>
            <div>
              <label>
                Company name
                <input
                  autoFocus
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Company name"
                  value={name}
                />
              </label>
              <label>
                Contact email
                <input
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                />
              </label>
              <button className="portal-primary" type="submit">
                Create invitation <ArrowRightIcon />
              </button>
            </div>
          </form>
        ) : null}
        {tab === "Activity" ? (
          <>
            <section className="partner-live-metrics">
              <article>
                <span>Earnings today</span>
                <strong>${earningsToday.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                <small>From posted merchant activity</small>
              </article>
              <article>
                <span>Merchant payments today</span>
                <strong>{(142 + activity.length).toLocaleString()}</strong>
                <small>Across {approvedCount} active merchants</small>
              </article>
              <article>
                <span>Pending partner balance</span>
                <strong>${pendingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                <small>Releases as underlying payments settle</small>
              </article>
            </section>
            <PartnerLiveActivity activity={activity} />
          </>
        ) : null}
        {tab === "Applications" ? (
          <>
            <section className="partner-application-metrics" aria-label="Application status overview">
              <article className="portal-card">
                <ClipboardIcon />
                <span>
                  <small>Total applications</small>
                  <strong>{applicants.length}</strong>
                  <em>Last 30 days</em>
                </span>
              </article>
              <article className="portal-card">
                <RefreshIcon />
                <span>
                  <small>Under review</small>
                  <strong>{applicants.filter((item) => item.status === "Pending review").length}</strong>
                  <em>Compliance or merchant review</em>
                </span>
              </article>
              <article className="portal-card success">
                <CheckCircleIcon />
                <span>
                  <small>Approved</small>
                  <strong>{approvedCount}</strong>
                  <em>Ready or processing</em>
                </span>
              </article>
              <article className="portal-card">
                <TeamIcon />
                <span>
                  <small>In progress</small>
                  <strong>{applicants.filter((item) => item.status === "In progress").length}</strong>
                  <em>Merchant completing setup</em>
                </span>
              </article>
              <article className="portal-card warning">
                <OrderIcon />
                <span>
                  <small>Action needed</small>
                  <strong>{applicants.filter((item) => item.status === "Needs information").length}</strong>
                  <em>Missing information</em>
                </span>
              </article>
            </section>
            <section className="portal-card portal-table-card partner-applicants-card">
              <header className="partner-table-toolbar">
                <div>
                  <h2>Referred merchants</h2>
                  <p>{filteredApplicants.length} applicants in this view</p>
                </div>
                <div>
                  <label>
                    <SearchIcon />
                    <input
                      onChange={(event) => {
                        setQuery(event.target.value);
                        setPage(1);
                      }}
                      placeholder="Search applicants"
                      value={query}
                    />
                  </label>
                  <Select
                    aria-label="Application status"
                    onChange={(event) => {
                      setStatusFilter(event.target.value);
                      setPage(1);
                    }}
                    value={statusFilter}
                  >
                    <option>All statuses</option>
                    <option>Invited</option>
                    <option>In progress</option>
                    <option>Pending review</option>
                    <option>Needs information</option>
                    <option>Approved</option>
                  </Select>
                </div>
              </header>
              <div className="portal-table-wrap partner-applications-list-scroll">
                <table className="partner-applicants-table">
                  <thead>
                    <tr>
                      <th>Merchant</th>
                      <th>Signed up</th>
                      <th>Status</th>
                      <th>Onboarding progress</th>
                      <th>Attributed volume</th>
                      <th>Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleApplicants.map((applicant) => (
                      <tr
                        aria-selected={selectedApplication?.id === applicant.id}
                        className={selectedApplication?.id === applicant.id ? "selected" : undefined}
                        key={applicant.id}
                        onClick={() => selectApplication(applicant.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") selectApplication(applicant.id);
                        }}
                        tabIndex={0}
                      >
                        <td>
                          <b>{applicant.name}</b>
                          <small>{applicant.email}</small>
                        </td>
                        <td>{applicant.signedUp}</td>
                        <td>
                          <span className={`portal-status ${applicant.status.toLowerCase().replaceAll(" ", "-")}`}>
                            {applicant.status}
                          </span>
                        </td>
                        <td>
                          <div
                            className="partner-progress"
                            aria-label={`${applicant.step} of ${partnerStages.length} onboarding steps complete`}
                          >
                            {partnerStages.map((stage, index) => (
                              <span
                                className={
                                  index < applicant.step ? "complete" : index === applicant.step ? "current" : undefined
                                }
                                key={stage}
                              >
                                <i>{index < applicant.step ? "✓" : index + 1}</i>
                                <small>{stage}</small>
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>{applicant.volume}</td>
                        <td>{applicant.earnings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <TablePagination
                className="partner-pagination"
                onPageChange={setPage}
                page={currentPage}
                pageSize={pageSize}
                totalItems={filteredApplicants.length}
              />
            </section>
            {selectedApplication ? (
              <section className="portal-card partner-application-profile" key={selectedApplication.id}>
                <header>
                  <div className="partner-application-profile-title">
                    <i>{selectedApplication.name.slice(0, 1)}</i>
                    <span>
                      <span>
                        <h2>{selectedApplication.name}</h2>
                        <span
                          className={`portal-status ${selectedApplication.status.toLowerCase().replaceAll(" ", "-")}`}
                        >
                          {selectedApplication.status}
                        </span>
                      </span>
                      <small>
                        {selectedApplication.id} · Submitted {selectedApplication.signedUp}
                      </small>
                    </span>
                  </div>
                  <div className="partner-application-profile-actions">
                    <span>
                      <small>{selectedApplication.status === "Approved" ? "Approved" : "Expected decision"}</small>
                      <b>{selectedApplication.status === "Approved" ? selectedApplication.signedUp : "Aug 28, 2026"}</b>
                    </span>
                    <button type="button">
                      <TeamIcon /> Contact manager
                    </button>
                  </div>
                </header>
                <div className="partner-application-profile-grid">
                  <article className="partner-application-stage-card">
                    <h3>Progress stage</h3>
                    <div className="partner-application-stage-track">
                      {applicationProfileStages.map((stage, index) => {
                        const complete = index < selectedApplicationStage;
                        const current = index === selectedApplicationStage;
                        return (
                          <span className={complete ? "complete" : current ? "current" : undefined} key={stage}>
                            <i>{complete ? "✓" : index + 1}</i>
                            <b>{stage}</b>
                            <small>{complete ? "Complete" : current ? "In progress" : "Pending"}</small>
                          </span>
                        );
                      })}
                    </div>
                    <div className="partner-application-note">
                      <h3>Notes from Acru</h3>
                      <p>
                        {selectedApplication.status === "Approved"
                          ? "This merchant is approved. Integration and first-volume monitoring can continue."
                          : selectedApplication.status === "Needs information"
                            ? "Additional tax and bank-verification documents are required to continue review."
                            : "The compliance team is reviewing the submitted business and settlement information."}
                      </p>
                      <small>— Claire Johnson · Aug 25, 2026 10:24 AM</small>
                    </div>
                  </article>
                  <article className="partner-application-documents">
                    <header>
                      <h3>Required documents</h3>
                      <span>
                        {selectedApplicationDocuments.filter(([, complete]) => complete).length} / 3 submitted
                      </span>
                    </header>
                    {selectedApplicationDocuments.map(([document, complete]) => (
                      <div className={complete ? "complete" : "missing"} key={String(document)}>
                        <CheckCircleIcon />
                        <span>
                          <b>{String(document)}</b>
                          <small>{complete ? "Received and verified" : "Missing"}</small>
                        </span>
                      </div>
                    ))}
                    {selectedApplication.step < 5 ? <button type="button">Request documents</button> : null}
                  </article>
                  <article className="partner-application-timeline">
                    <h3>Recent activity</h3>
                    {[
                      ["Application submitted", selectedApplication.signedUp],
                      ["Business details received", "Aug 22, 2026 9:18 AM"],
                      [
                        selectedApplication.status === "Approved" ? "Merchant approved" : "Compliance review started",
                        "Aug 23, 2026 10:24 AM"
                      ]
                    ].map(([event, date], index) => (
                      <div className={index === 0 ? "active" : undefined} key={event}>
                        <i />
                        <span>
                          <b>{event}</b>
                          <small>{date}</small>
                        </span>
                      </div>
                    ))}
                    <button type="button">View full timeline</button>
                  </article>
                </div>
              </section>
            ) : null}
          </>
        ) : null}

        {tab === "Earnings" ? (
          <>
            <section
              className="partner-dashboard-metrics partner-earnings-metrics"
              aria-label="Earnings performance overview"
            >
              {[
                {
                  label: "Attributed volume",
                  value: `$${(attributedVolume / 1_000_000).toFixed(2)}M`,
                  change: "+18.3% vs. last month",
                  icon: ChartVerticalIcon
                },
                {
                  label: "Commission earned",
                  value: `$${monthlyCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                  change: "+14.8% vs. last month",
                  icon: MoneyIcon
                },
                {
                  label: "Pending commission",
                  value: `$${pendingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                  change: "Next release Aug 28",
                  icon: RefreshIcon,
                  neutral: true
                },
                {
                  label: "Available to withdraw",
                  value: `$${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                  change: "Available now",
                  icon: BankIcon,
                  neutral: true
                },
                {
                  label: "Average conversion value",
                  value: "$79.36",
                  change: "+11.3% vs. last month",
                  icon: OrderIcon
                },
                {
                  label: "Effective commission rate",
                  value: `${effectiveCommissionRate.toFixed(2)}%`,
                  change: "+0.08 pts vs. last month",
                  icon: TeamIcon
                }
              ].map(({ label, value, change, icon: Icon, neutral }) => (
                <article className="portal-card" key={label}>
                  <span className="partner-dashboard-metric-icon">
                    <Icon />
                  </span>
                  <div>
                    <p>{label}</p>
                    <strong>{value}</strong>
                    <small className={neutral ? "neutral" : undefined}>{change}</small>
                  </div>
                </article>
              ))}
            </section>
            <PartnerEarningsCharts applicants={applicants} />
            <section className="partner-earnings-grid">
              <article className="portal-card partner-commission-table">
                <header>
                  <div>
                    <h2>Merchant earnings</h2>
                    <p>Approved earnings attributed this month.</p>
                  </div>
                </header>
                <div className="partner-earnings-table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Merchant</th>
                        <th>Processed</th>
                        <th>Commission</th>
                        <th>Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {earningApplicants.map((applicant) => {
                        const merchantVolume = parseCompactCurrency(applicant.volume);
                        const merchantRate = merchantVolume
                          ? (parseCurrency(applicant.earnings) / merchantVolume) * 100
                          : 0;
                        return (
                          <tr key={applicant.id}>
                            <td>
                              <span className="partner-commission-merchant">
                                <MerchantBrandPreview name={applicant.name} />
                                <b>{applicant.name}</b>
                              </span>
                            </td>
                            <td>{applicant.volume}</td>
                            <td>
                              <strong>{applicant.earnings}</strong>
                            </td>
                            <td>{merchantRate.toFixed(2)}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </article>
              <article className="portal-card partner-earnings-detail-card partner-top-links-card">
                <header>
                  <div>
                    <h2>Top-performing links</h2>
                    <p>Referral links ranked by approved commission.</p>
                  </div>
                  <button onClick={() => setTab("Custom links")} type="button">
                    View links
                  </button>
                </header>
                <div className="partner-earnings-table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Link</th>
                        <th>Clicks</th>
                        <th>Conversions</th>
                        <th>Commission</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topPartnerLinks.map((link) => (
                        <tr key={link.name}>
                          <td>{link.name}</td>
                          <td>{link.clicks}</td>
                          <td>{link.conversions}</td>
                          <td>
                            <strong>{link.commission}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            </section>
            <section className="partner-earnings-insights-grid">
              <article className="portal-card partner-earnings-detail-card partner-commission-status-card">
                <header>
                  <div>
                    <h2>Commission status</h2>
                    <p>What is available, pending release, or adjusted.</p>
                  </div>
                </header>
                <div className="partner-commission-status-total">
                  <span>Recorded commission</span>
                  <strong>$24,619.60</strong>
                </div>
                <div className="partner-commission-status-list">
                  {[
                    { label: "Available", value: "$18,420.00", share: 74.8, tone: "available" },
                    { label: "Pending release", value: "$6,380.20", share: 25.9, tone: "pending" },
                    { label: "Adjustments", value: "−$180.60", share: 0.7, tone: "adjusted" }
                  ].map((item) => (
                    <div key={item.label}>
                      <span>
                        <i className={item.tone} />
                        <b>{item.label}</b>
                      </span>
                      <span>
                        <strong>{item.value}</strong>
                        <small>{item.share}%</small>
                      </span>
                    </div>
                  ))}
                </div>
              </article>
              <article className="portal-card partner-earnings-detail-card partner-recent-conversions-card">
                <header>
                  <div>
                    <h2>Recent conversions</h2>
                    <p>Latest approved merchant activity generating commission.</p>
                  </div>
                  <button onClick={() => setTab("Activity")} type="button">
                    View activity
                  </button>
                </header>
                <div className="partner-earnings-table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Merchant</th>
                        <th>Order</th>
                        <th>Processed</th>
                        <th>Commission</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPartnerConversions.map((conversion) => (
                        <tr key={conversion.id}>
                          <td>
                            <span className="partner-conversion-merchant">
                              <MerchantBrandPreview name={conversion.merchant} />
                              <span>
                                <b>{conversion.merchant}</b>
                                <small>{conversion.time}</small>
                              </span>
                            </span>
                          </td>
                          <td>{conversion.id}</td>
                          <td>{conversion.revenue}</td>
                          <td>{conversion.commission}</td>
                          <td>
                            <span className={`portal-status ${conversion.status.toLowerCase()}`}>
                              {conversion.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            </section>
          </>
        ) : null}
      </section>
      {withdrawOpen ? (
        <div
          className="partner-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setWithdrawOpen(false);
          }}
        >
          <form className="partner-withdraw-dialog" onSubmit={withdraw}>
            <header>
              <div>
                <h2>Withdraw partner earnings</h2>
                <p>${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} available</p>
              </div>
              <button onClick={() => setWithdrawOpen(false)} type="button">
                Cancel
              </button>
            </header>
            <div className="partner-withdraw-body">
              <fieldset>
                <legend>Delivery method</legend>
                {(["ACH", "USDC"] as const).map((method) => (
                  <button
                    className={withdrawMethod === method ? "active" : undefined}
                    key={method}
                    onClick={() => {
                      setWithdrawMethod(method);
                      setWithdrawError("");
                    }}
                    type="button"
                  >
                    {method === "ACH" ? <BankIcon /> : <MoneyIcon />}
                    <span>
                      <b>{method}</b>
                      <small>
                        {method === "ACH" ? "Wells Fargo •••• 4242 · 1–2 business days" : "USDC on Base · 0x71F2…8A4C"}
                      </small>
                    </span>
                    {withdrawMethod === method ? <CheckCircleIcon /> : null}
                  </button>
                ))}
              </fieldset>
              <label>
                Amount
                <div>
                  <span>$</span>
                  <input
                    autoFocus
                    inputMode="decimal"
                    onChange={(event) => {
                      setWithdrawAmount(event.target.value);
                      setWithdrawError("");
                    }}
                    placeholder="0.00"
                    value={withdrawAmount}
                  />
                </div>
              </label>
              <div className="partner-withdraw-details">
                <span>
                  Fee <b>$0.00</b>
                </span>
                <span>
                  You receive{" "}
                  <b>${Number(withdrawAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</b>
                </span>
                <span>
                  Arrival <b>{withdrawMethod === "ACH" ? "1–2 business days" : "Usually within minutes"}</b>
                </span>
              </div>
              {withdrawError ? <p className="partner-withdraw-error">{withdrawError}</p> : null}
            </div>
            <footer>
              <button onClick={() => setWithdrawOpen(false)} type="button">
                Back
              </button>
              <button className="portal-primary" type="submit">
                Withdraw
              </button>
            </footer>
          </form>
        </div>
      ) : null}
    </main>
  );
}
