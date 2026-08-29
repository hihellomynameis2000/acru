"use client";

import {
  BankIcon,
  ChartVerticalIcon,
  CheckCircleIcon,
  ClipboardIcon,
  CodeIcon,
  EmailIcon,
  MoneyIcon,
  PlusIcon,
  SearchIcon,
  TeamIcon
} from "@shopify/polaris-icons";
import worldMap from "@svg-maps/world";
import Image from "next/image";
import QRCode from "qrcode";
import {
  FocusEvent as ReactFocusEvent,
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useState
} from "react";

import { Select } from "@/components/ui/select";

type Applicant = {
  id: string;
  name: string;
  email: string;
  signedUp: string;
  step: number;
  status: string;
  volume: string;
  earnings: string;
};

type Withdrawal = {
  id: string;
  date: string;
  method: string;
  destination: string;
  amount: number;
  status: string;
};

const merchantConversions = [342, 214, 149, 121, 96, 68, 45, 38, 12];
const merchantClicks = [12842, 8421, 6732, 4892, 3764, 2844, 2341, 1987, 924];
type MerchantRange = "7D" | "30D" | "3M";

const merchantTrendData: Record<
  MerchantRange,
  { labels: string[]; volume: number[]; commission: number[]; multiplier: number }
> = {
  "7D": {
    labels: ["Aug 19", "Aug 20", "Aug 21", "Aug 22", "Aug 23", "Aug 24", "Aug 25"],
    volume: [0.71, 0.88, 0.82, 1.04, 0.96, 1.18, 1.31],
    commission: [0.62, 0.84, 0.72, 1.11, 0.86, 1.27, 1.08],
    multiplier: 0.28
  },
  "30D": {
    labels: ["Jul 27", "Aug 1", "Aug 6", "Aug 11", "Aug 16", "Aug 21", "Aug 25"],
    volume: [0.82, 0.95, 0.91, 1.08, 1.02, 1.19, 1.34],
    commission: [0.64, 0.92, 0.74, 1.13, 0.86, 1.31, 1.09],
    multiplier: 1
  },
  "3M": {
    labels: ["Jun 1", "Jun 15", "Jul 1", "Jul 15", "Aug 1", "Aug 15", "Aug 25"],
    volume: [0.68, 0.77, 0.91, 0.86, 1.06, 1.22, 1.38],
    commission: [0.59, 0.81, 0.7, 0.96, 0.88, 1.3, 1.12],
    multiplier: 2.81
  }
};

type TrendPoint = {
  x: number;
  y: number;
  value: number;
  label: string;
};

function parseCompactCurrency(value: string) {
  const amount = Number(value.replaceAll(/[$,A-Z]/g, ""));
  if (value.endsWith("M")) return amount * 1_000_000;
  if (value.endsWith("K")) return amount * 1_000;
  return amount;
}

function formatChartCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: value >= 100_000 ? "compact" : "standard",
    maximumFractionDigits: value >= 100_000 ? 1 : 2
  }).format(value);
}

function smoothPath(points: TrendPoint[]) {
  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = points[index - 1];
    const controlX = (previous.x + point.x) / 2;
    return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
  }, "");
}

function MerchantPerformanceChart({ merchant }: { merchant: Applicant }) {
  const [range, setRange] = useState<MerchantRange>("30D");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const trend = merchantTrendData[range];
  const totalVolume = parseCompactCurrency(merchant.volume) * trend.multiplier;
  const totalCommission = parseCompactCurrency(merchant.earnings) * trend.multiplier;
  const volumeWeightTotal = trend.volume.reduce((total, value) => total + value, 0);
  const commissionWeightTotal = trend.commission.reduce((total, value) => total + value, 0);
  const dailyVolume = trend.volume.map((weight) => (totalVolume * weight) / volumeWeightTotal);
  const dailyCommission = trend.commission.map((weight) => (totalCommission * weight) / commissionWeightTotal);
  const commissionScale = totalCommission ? totalVolume / totalCommission : 1;
  const scaledCommission = dailyCommission.map((value) => value * commissionScale);
  const chartMax = Math.max(...dailyVolume, ...scaledCommission) * 1.14;
  const xFor = (index: number) => 12 + (index * 536) / (trend.labels.length - 1);
  const yFor = (value: number) => 150 - (value / chartMax) * 116;
  const volumePoints = dailyVolume.map((value, index) => ({
    x: xFor(index),
    y: yFor(value),
    value,
    label: trend.labels[index]
  }));
  const commissionPoints = dailyCommission.map((value, index) => ({
    x: xFor(index),
    y: yFor(scaledCommission[index]),
    value,
    label: trend.labels[index]
  }));
  const volumeLine = smoothPath(volumePoints);
  const commissionLine = smoothPath(commissionPoints);
  const volumeArea = `${volumeLine} L 548 150 L 12 150 Z`;
  const activeVolume = activeIndex === null ? null : volumePoints[activeIndex];
  const activeCommission = activeIndex === null ? null : commissionPoints[activeIndex];

  function moveTooltip(event: React.PointerEvent<SVGRectElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    setActiveIndex(Math.round(position * (volumePoints.length - 1)));
  }

  return (
    <div className="partner-performance-chart" onPointerLeave={() => setActiveIndex(null)}>
      <div className="partner-performance-legend" aria-label="Chart series">
        <span className="volume">Attributed volume</span>
        <span className="commission">Commission</span>
        <div className="partner-performance-ranges" aria-label="Merchant chart range">
          {(["7D", "30D", "3M"] as MerchantRange[]).map((item) => (
            <button
              className={range === item ? "active" : undefined}
              key={item}
              onClick={() => {
                setRange(item);
                setActiveIndex(null);
              }}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="partner-performance-plot">
        <svg
          aria-label={`Revenue and commission trend for ${merchant.name}`}
          preserveAspectRatio="none"
          role="img"
          viewBox="0 0 560 166"
        >
          <defs>
            <linearGradient id="merchantRevenueArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#4aa8dc" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#4aa8dc" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[34, 72, 110, 150].map((y) => (
            <line className="partner-performance-gridline" key={y} x1="12" x2="548" y1={y} y2={y} />
          ))}
          <path className="partner-performance-area" d={volumeArea} />
          <path className="partner-performance-line volume" d={volumeLine} />
          <path className="partner-performance-line commission" d={commissionLine} />
          {activeVolume && activeCommission ? (
            <>
              <line className="partner-performance-cursor" x1={activeVolume.x} x2={activeVolume.x} y1="24" y2="150" />
              <circle className="partner-performance-point volume" cx={activeVolume.x} cy={activeVolume.y} r="4" />
              <circle
                className="partner-performance-point commission"
                cx={activeCommission.x}
                cy={activeCommission.y}
                r="4"
              />
            </>
          ) : null}
          <rect
            className="partner-performance-hitbox"
            height="142"
            onPointerDown={moveTooltip}
            onPointerMove={moveTooltip}
            width="536"
            x="12"
            y="16"
          />
        </svg>
        {activeVolume && activeCommission ? (
          <div
            className="partner-performance-tooltip"
            style={{ left: `${Math.max(14, Math.min(86, (activeVolume.x / 560) * 100))}%` }}
          >
            <time>{activeVolume.label}</time>
            <span>
              <i className="volume" /> Attributed volume <b>{formatChartCurrency(activeVolume.value)}</b>
            </span>
            <span>
              <i className="commission" /> Commission <b>{formatChartCurrency(activeCommission.value)}</b>
            </span>
          </div>
        ) : null}
      </div>
      <div className="partner-performance-axis" aria-hidden="true">
        <span>{trend.labels[0]}</span>
        <span>{trend.labels[3]}</span>
        <span>{trend.labels.at(-1)}</span>
      </div>
    </div>
  );
}

function Status({ children }: { children: string }) {
  return <span className={`partner-data-status ${children.toLowerCase().replaceAll(" ", "-")}`}>{children}</span>;
}

const referralBrandAssets: Record<string, string> = {
  Bitunix: "/merchant-brands/bitunix.svg",
  "Crescent Retail": "/merchant-brands/crescent.svg",
  "Northwind Coffee Co.": "/merchant-brands/northwind.svg",
  "Lumen Digital": "/merchant-brands/lumen.svg"
};

function ReferralBrandMark({ name }: { name: string }) {
  const source = referralBrandAssets[name];
  return (
    <span className="partner-referral-brand">
      {source ? <Image alt={`${name} brand`} height={34} src={source} width={34} /> : name.slice(0, 1)}
    </span>
  );
}

function PartnerMetricStrip({ items }: { items: Array<[string, string, string]> }) {
  return (
    <section className="partner-data-metrics">
      {items.map(([label, value, detail], index) => (
        <article key={label}>
          <span>{index % 2 ? <ChartVerticalIcon /> : <MoneyIcon />}</span>
          <p>{label}</p>
          <strong>{value}</strong>
          <small>{detail}</small>
        </article>
      ))}
    </section>
  );
}

export function PartnerMerchantsView({ applicants }: { applicants: Applicant[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Applicant | null>(null);
  const approved = applicants.filter((item) => item.status === "Approved");
  const rows = approved.filter((item) => `${item.name} ${item.email}`.toLowerCase().includes(query.toLowerCase()));
  const selectedIndex = selected
    ? Math.max(
        0,
        applicants.findIndex((item) => item.id === selected.id)
      )
    : 0;
  return (
    <>
      <PartnerMetricStrip
        items={[
          ["Referred merchants", String(applicants.length), "+20.0% vs. prior 30 days"],
          ["Approved merchants", String(approved.length), "+15.4% vs. prior 30 days"],
          ["Active merchants", String(Math.max(0, approved.length - 1)), "+9.1% vs. prior 30 days"],
          ["Attributed volume", "$4.72M", "+18.3% vs. prior 30 days"],
          ["Commission earned", "$18,420.48", "+14.8% vs. prior 30 days"]
        ]}
      />
      <section className="portal-card partner-data-table">
        <header>
          <div>
            <h2>Referred merchants</h2>
            <p>Revenue, conversions, commission, and payout status in one view.</p>
          </div>
          <label>
            <SearchIcon />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search merchants" />
          </label>
        </header>
        <div className="portal-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Status</th>
                <th>First conversion</th>
                <th>Clicks</th>
                <th>Conversions</th>
                <th>Gross revenue</th>
                <th>Commission</th>
                <th>Rate</th>
                <th>Last activity</th>
                <th>Payout</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((merchant) => {
                const originalIndex = applicants.findIndex((item) => item.id === merchant.id);
                return (
                  <tr key={merchant.id} onClick={() => setSelected(merchant)}>
                    <td>
                      <span className="partner-data-name">
                        <i>{merchant.name[0]}</i>
                        <span>
                          <b>{merchant.name}</b>
                          <small>{merchant.id}</small>
                        </span>
                      </span>
                    </td>
                    <td>
                      <Status>{merchant.status}</Status>
                    </td>
                    <td>{merchant.signedUp}</td>
                    <td>{merchantClicks[originalIndex] ?? 1784}</td>
                    <td>{merchantConversions[originalIndex] ?? 32}</td>
                    <td>
                      <b>{merchant.volume}</b>
                    </td>
                    <td>
                      <b>{merchant.earnings}</b>
                    </td>
                    <td>{originalIndex % 2 ? "18.0%" : "20.0%"}</td>
                    <td>{originalIndex * 7 + 2}m ago</td>
                    <td>
                      <Status>Paid</Status>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <footer>
          Showing {rows.length} approved merchants{" "}
          <span>
            <button disabled>‹</button>
            <button className="active">1</button>
            <button>2</button>
            <button>›</button>
          </span>
        </footer>
      </section>
      {selected ? (
        <aside className="partner-merchant-drawer">
          <header>
            <span className="partner-data-name">
              <i>{selected.name[0]}</i>
              <span>
                <h2>{selected.name}</h2>
                <small>{selected.id}</small>
              </span>
            </span>
            <button onClick={() => setSelected(null)} type="button">
              ×
            </button>
          </header>
          <section className="partner-merchant-chart-section">
            <h3>Revenue & commission</h3>
            <MerchantPerformanceChart merchant={selected} />
          </section>
          <dl className="partner-merchant-summary">
            <div>
              <dt>Commission rate</dt>
              <dd>{selectedIndex % 2 ? "18.00%" : "20.00%"}</dd>
            </div>
            <div>
              <dt>Last conversion</dt>
              <dd>Aug 25, 2026</dd>
            </div>
            <div>
              <dt>Approval date</dt>
              <dd>{selected.signedUp}</dd>
            </div>
            <div>
              <dt>First conversion</dt>
              <dd>{selected.signedUp}</dd>
            </div>
          </dl>
          <section className="partner-merchant-conversions">
            <header>
              <h3>Recent conversions</h3>
              <button type="button">View all</button>
            </header>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Order</th>
                    <th>Revenue</th>
                    <th>Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Aug 25", "0x8f3a…9c7e", "BTX-98374", "$1,248.50", "$249.70"],
                    ["Aug 24", "0x6e2b…4a1d", "BTX-98221", "$987.20", "$197.44"],
                    ["Aug 23", "0x1c4d…7e99", "BTX-98068", "$654.00", "$130.80"]
                  ].map(([date, customer, order, revenue, commission]) => (
                    <tr key={order}>
                      <td>{date}</td>
                      <td>{customer}</td>
                      <td>{order}</td>
                      <td>{revenue}</td>
                      <td>{commission}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="partner-merchant-top-link">
            <header>
              <div>
                <h3>Top performing link</h3>
                <p>Highest-converting onboarding source.</p>
              </div>
              <button type="button">View links</button>
            </header>
            <code>{selected.name} — Standard referral link</code>
            <dl>
              <div>
                <dt>Clicks</dt>
                <dd>{(merchantClicks[selectedIndex] ?? 1784).toLocaleString()}</dd>
              </div>
              <div>
                <dt>Conversions</dt>
                <dd>{(merchantConversions[selectedIndex] ?? 32).toLocaleString()}</dd>
              </div>
              <div>
                <dt>Conversion rate</dt>
                <dd>
                  {(
                    ((merchantConversions[selectedIndex] ?? 32) / (merchantClicks[selectedIndex] ?? 1784)) *
                    100
                  ).toFixed(2)}
                  %
                </dd>
              </div>
              <div>
                <dt>Commission</dt>
                <dd>{selected.earnings}</dd>
              </div>
            </dl>
          </section>
        </aside>
      ) : null}
    </>
  );
}

export function PartnerPayoutsView({
  availableBalance,
  pendingBalance,
  withdrawals
}: {
  availableBalance: number;
  pendingBalance: number;
  withdrawals: Withdrawal[];
}) {
  const payoutRows = [
    ...withdrawals,
    {
      id: "wd_52Qm18",
      date: "Jun 15, 2026",
      method: "ACH",
      destination: "Wells Fargo •••• 4242",
      amount: 7171.58,
      status: "Paid"
    },
    {
      id: "wd_48Kt11",
      date: "May 31, 2026",
      method: "USDC",
      destination: "0x71F2…8A4C · Base",
      amount: 6842.34,
      status: "Paid"
    }
  ];
  const balanceDisplay = `$${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  const pendingDisplay = `$${pendingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <>
      <section className="partner-payout-kpis" aria-label="Payout overview">
        <article>
          <div>
            <p>Available to withdraw</p>
            <strong>{balanceDisplay}</strong>
            <small className="available">
              <CheckCircleIcon /> Available now
            </small>
          </div>
        </article>
        <article>
          <div>
            <p>Pending release</p>
            <strong>{pendingDisplay}</strong>
            <small>Expected Aug 28</small>
          </div>
        </article>
        <article>
          <div>
            <p>Next payout date</p>
            <strong>Aug 28, 2026</strong>
            <small>In 3 days</small>
          </div>
        </article>
        <article>
          <div>
            <p>Lifetime paid</p>
            <strong>$96,842.34</strong>
            <small>12 completed payouts</small>
          </div>
        </article>
      </section>

      <section className="partner-payout-workspace">
        <article className="portal-card partner-data-table partner-payout-history">
          <header>
            <div>
              <h2>Payout history</h2>
              <p>Completed and pending withdrawals across every payout method.</p>
            </div>
            <button type="button">View all</button>
          </header>
          <div className="portal-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Statement</th>
                  <th>Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {payoutRows.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>
                      <b>${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</b>
                    </td>
                    <td>
                      <span className="partner-payout-table-method">
                        <span className={`partner-payout-method-preview ${item.method.toLowerCase()}`}>
                          <Image
                            alt=""
                            height={item.method === "ACH" ? 16 : 23}
                            src={item.method === "ACH" ? "/payment-rails/ach.svg" : "/payment-rails/usdc-white.svg"}
                            width={item.method === "ACH" ? 50 : 23}
                          />
                        </span>
                        <span>
                          <b>{item.method === "ACH" ? "ACH bank transfer" : "USDC wallet"}</b>
                          <small>{item.destination}</small>
                        </span>
                      </span>
                    </td>
                    <td>
                      <Status>{item.status}</Status>
                    </td>
                    <td>
                      <button type="button">Download</button>
                    </td>
                    <td>
                      <code>{item.id}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <footer>
            <p>Showing {payoutRows.length} of 12 payouts</p>
            <span>
              <button className="active" type="button">
                1
              </button>
              <button type="button">2</button>
            </span>
          </footer>
        </article>

        <aside className="portal-card partner-payout-methods-card">
          <header>
            <h2>Payout methods</h2>
            <p>Choose where available earnings are delivered.</p>
          </header>
          <button className="partner-payout-method-row" type="button">
            <span className="partner-payout-method-preview ach">
              <Image alt="ACH" height={16} src="/payment-rails/ach.svg" width={50} />
            </span>
            <span className="partner-payout-method-copy">
              <span>
                <b>ACH bank transfer</b>
                <Status>Primary</Status>
              </span>
              <small>Wells Fargo •••• 4242</small>
              <em>1–2 business days</em>
            </span>
          </button>
          <button className="partner-payout-method-row" type="button">
            <span className="partner-payout-method-preview usdc">
              <Image alt="USDC" height={25} src="/payment-rails/usdc-white.svg" width={25} />
            </span>
            <span className="partner-payout-method-copy">
              <span>
                <b>USDC wallet</b>
                <Status>Active</Status>
              </span>
              <small>0x71F2…8A4C · Base</small>
              <em>Usually arrives in minutes</em>
            </span>
          </button>
          <button className="partner-payout-method-add" type="button">
            <PlusIcon /> Add payout method
          </button>
        </aside>
      </section>

      <section className="partner-payout-support-grid">
        <article className="portal-card partner-payout-support-card">
          <header>
            <div>
              <h2>Tax &amp; compliance</h2>
              <p>Your payout profile is ready.</p>
            </div>
            <Status>On file</Status>
          </header>
          <div className="partner-payout-tax-row">
            <span>
              <CheckCircleIcon />
            </span>
            <div>
              <strong>W-9 form verified</strong>
              <small>Submitted Jan 12, 2026</small>
            </div>
          </div>
          <button type="button">Review tax profile</button>
        </article>

        <article className="portal-card partner-payout-support-card partner-payout-threshold-card">
          <header>
            <div>
              <h2>Payout threshold</h2>
              <p>Minimum balance required to withdraw.</p>
            </div>
          </header>
          <dl>
            <div>
              <dt>Minimum threshold</dt>
              <dd>$100.00</dd>
            </div>
            <div>
              <dt>Current balance</dt>
              <dd>{balanceDisplay}</dd>
            </div>
          </dl>
          <div className="partner-payout-threshold-track" aria-label="Payout threshold reached">
            <span />
          </div>
          <small className="partner-payout-threshold-status">
            <CheckCircleIcon /> You have reached the payout threshold
          </small>
        </article>

        <article className="portal-card partner-payout-support-card partner-payout-upcoming-card">
          <header>
            <div>
              <h2>Estimated upcoming payout</h2>
              <p>Based on commission pending release.</p>
            </div>
          </header>
          <div className="partner-payout-upcoming-value">
            <span className="partner-payout-kpi-icon">
              <BankIcon />
            </span>
            <div>
              <strong>Aug 28, 2026</strong>
              <small>Estimated payout date</small>
            </div>
            <b>{pendingDisplay}</b>
          </div>
          <dl>
            <div>
              <dt>Destination</dt>
              <dd>Wells Fargo •••• 4242</dd>
            </div>
            <div>
              <dt>Method</dt>
              <dd>ACH</dd>
            </div>
          </dl>
          <p className="partner-payout-note">Final amount may change as pending merchant activity settles.</p>
        </article>
      </section>
    </>
  );
}

export function PartnerReferralsView({ applicants }: { applicants: Applicant[] }) {
  const [selected, setSelected] = useState<Applicant | null>(null);
  const [query, setQuery] = useState("");
  const stages = [
    ["Clicked link", "2,941", "100%"],
    ["Signed up", "1,248", "42.4%"],
    ["Applied", "632", "21.5%"],
    ["Approved", "186", "6.3%"],
    ["First revenue", "102", "3.5%"],
    ["Active merchant", "78", "2.7%"]
  ];
  const sources = [
    {
      name: "Main affiliate link",
      campaign: "aff_12345",
      landingPage: "https://acrudevelopment.com/partners/bitunix",
      utm: "may_launch",
      subId: "subid_7f3a9d2e"
    },
    {
      name: "Twitter campaign",
      campaign: "tw_may_launch",
      landingPage: "https://acrudevelopment.com/partners/apex",
      utm: "twitter_launch",
      subId: "subid_4a8c1f5b"
    },
    {
      name: "Email newsletter",
      campaign: "email_may25",
      landingPage: "https://acrudevelopment.com/partners/northwind",
      utm: "coffee_may",
      subId: "subid_8c2e4b1a"
    },
    {
      name: "Blog post",
      campaign: "blog_may25",
      landingPage: "https://acrudevelopment.com/partners/harbor",
      utm: "merchant_guide",
      subId: "subid_2d9f6e3c"
    },
    {
      name: "YouTube review",
      campaign: "yt_review_may",
      landingPage: "https://acrudevelopment.com/partners/atlas",
      utm: "atlas_review",
      subId: "subid_5b7a1d9e"
    },
    {
      name: "Paid ads",
      campaign: "ads_may25",
      landingPage: "https://acrudevelopment.com/partners/vertex",
      utm: "paid_search",
      subId: "subid_1e6c8a4f"
    },
    {
      name: "Partner directory",
      campaign: "directory_q3",
      landingPage: "https://acrudevelopment.com/partners/lumen",
      utm: "directory",
      subId: "subid_9a3d7c2e"
    }
  ];
  const rows = applicants.slice(0, 7).filter((item) => {
    const normalized = query.trim().toLowerCase();
    return !normalized || `${item.name} ${item.email} ${item.status}`.toLowerCase().includes(normalized);
  });
  const selectedIndex = selected
    ? Math.max(
        0,
        applicants.findIndex((item) => item.id === selected.id)
      )
    : 0;
  const selectedSource = sources[selectedIndex] ?? sources[0];
  const selectedClicks = 47 - selectedIndex * 4;
  const selectedConversions = Math.max(0, 3 - Math.floor(selectedIndex / 2));
  const completedStages = selected
    ? selected.status === "Approved" && selected.volume !== "$0"
      ? 6
      : selected.step
    : 0;
  const journeyStages = ["First click", "Signed up", "Applied", "Approved", "First revenue event", "Active merchant"];

  return (
    <>
      <section className="partner-referral-kpis" aria-label="Referral performance overview">
        {[
          ["Total referrals", "1,248", "+18.6%", TeamIcon],
          ["Active referrals", "342", "+16.2%", CheckCircleIcon],
          ["Qualified referrals", "186", "+22.4%", ClipboardIcon],
          ["Conversion rate", "14.9%", "+2.6pp", ChartVerticalIcon],
          ["Earnings from referrals", "$18,420.48", "+14.8%", MoneyIcon]
        ].map(([label, value, detail, Icon]) => (
          <article key={String(label)}>
            <span>
              <Icon />
            </span>
            <div>
              <p>{String(label)}</p>
              <strong>{String(value)}</strong>
              <small>{String(detail)} vs. prior 30 days</small>
            </div>
          </article>
        ))}
      </section>

      <section className="portal-card partner-funnel">
        <header>
          <div>
            <h2>Referral funnel</h2>
            <p>How referral traffic moves from first click to active merchant.</p>
          </div>
          <span>Last 30 days</span>
        </header>
        <div>
          {stages.map(([label, value, share]) => (
            <span key={label}>
              <small>{label}</small>
              <strong>{value}</strong>
              <em>{share}</em>
            </span>
          ))}
        </div>
        <footer>
          Overall conversion rate <b>2.7%</b>
          <span>
            Average time to active <b>21 days</b>
          </span>
        </footer>
      </section>

      <article className="portal-card partner-data-table partner-referral-table">
        <header>
          <div>
            <h2>Referral journeys</h2>
            <p>Attribution, conversion, revenue, commission, and most recent activity.</p>
          </div>
          <div className="partner-referral-controls">
            <label>
              <SearchIcon />
              <input onChange={(event) => setQuery(event.target.value)} placeholder="Search referrals" value={query} />
            </label>
            <button type="button">Filters</button>
            <button type="button">Export</button>
          </div>
        </header>
        <div className="portal-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Referral / merchant</th>
                <th>Source link or campaign</th>
                <th>Status</th>
                <th>Referred on</th>
                <th>Clicks</th>
                <th>Conversions</th>
                <th>Revenue generated</th>
                <th>Commission earned</th>
                <th>Last activity</th>
                <th aria-label="Open referral details" />
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => {
                const index = applicants.findIndex((candidate) => candidate.id === item.id);
                const source = sources[index] ?? sources[0];
                return (
                  <tr
                    aria-expanded={selected?.id === item.id}
                    className={selected?.id === item.id ? "selected" : undefined}
                    key={item.id}
                    onClick={() => setSelected(item)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelected(item);
                      }
                    }}
                    tabIndex={0}
                  >
                    <td>
                      <span className="partner-referral-name">
                        <ReferralBrandMark name={item.name} />
                        <span>
                          <b>{item.name}</b>
                          <small>{item.email}</small>
                        </span>
                      </span>
                    </td>
                    <td>
                      <b>{source.name}</b>
                      <small>{source.campaign}</small>
                    </td>
                    <td>
                      <Status>{item.status}</Status>
                    </td>
                    <td>{item.signedUp}</td>
                    <td>{47 - index * 4}</td>
                    <td>{Math.max(0, 3 - Math.floor(index / 2))}</td>
                    <td>{item.volume}</td>
                    <td>{item.earnings}</td>
                    <td>{index ? `${index * 7 + 2}m ago` : "2m ago"}</td>
                    <td className="partner-referral-open">›</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <footer>
          Showing {rows.length} of 1,248 referrals
          <span>
            <button disabled type="button">
              ‹
            </button>
            <button className="active" type="button">
              1
            </button>
            <button type="button">2</button>
            <button type="button">3</button>
            <button type="button">…</button>
            <button type="button">125</button>
            <button type="button">›</button>
          </span>
        </footer>
      </article>

      {selected ? (
        <aside aria-label={`${selected.name} referral details`} className="partner-referral-drawer">
          <header>
            <span className="partner-referral-name">
              <ReferralBrandMark name={selected.name} />
              <span>
                <h2>{selected.name}</h2>
                <small>{selected.email}</small>
              </span>
            </span>
            <span>
              <Status>{selected.status}</Status>
              <button aria-label="Close referral details" onClick={() => setSelected(null)} type="button">
                ×
              </button>
            </span>
          </header>

          <dl className="partner-referral-origin-summary">
            <div>
              <dt>Referred on</dt>
              <dd>{selected.signedUp}</dd>
            </div>
            <div>
              <dt>Referred by</dt>
              <dd>{selectedSource.name}</dd>
            </div>
          </dl>

          <section className="partner-referral-performance">
            <header>
              <div>
                <h3>Performance overview</h3>
                <p>Attributed activity over the last 30 days.</p>
              </div>
            </header>
            <MerchantPerformanceChart merchant={selected} />
            <dl>
              <div>
                <dt>Clicks</dt>
                <dd>{selectedClicks}</dd>
              </div>
              <div>
                <dt>Conversions</dt>
                <dd>{selectedConversions}</dd>
              </div>
              <div>
                <dt>Revenue</dt>
                <dd>{selected.volume}</dd>
              </div>
              <div>
                <dt>Commission earned</dt>
                <dd>{selected.earnings}</dd>
              </div>
            </dl>
          </section>

          <section className="partner-referral-source">
            <header>
              <h3>Attribution source</h3>
            </header>
            <dl>
              <div>
                <dt>Source</dt>
                <dd>{selectedSource.name}</dd>
              </div>
              <div>
                <dt>First click</dt>
                <dd>{selected.signedUp}, 9:14 AM</dd>
              </div>
              <div>
                <dt>Landing page</dt>
                <dd className="link">{selectedSource.landingPage}</dd>
              </div>
              <div>
                <dt>UTM campaign</dt>
                <dd>{selectedSource.utm}</dd>
              </div>
              <div>
                <dt>Sub-ID</dt>
                <dd>{selectedSource.subId}</dd>
              </div>
            </dl>
          </section>

          <section className="partner-referral-journey">
            <header>
              <h3>Referral journey</h3>
            </header>
            {journeyStages.map((stage, index) => {
              const complete = index < completedStages;
              return (
                <div className={complete ? "complete" : undefined} key={stage}>
                  <i>{complete ? "✓" : index + 1}</i>
                  <span>
                    <b>{stage}</b>
                    <small>
                      {complete
                        ? `${selected.signedUp}, ${["9:14 AM", "9:18 AM", "11:02 AM", "2:47 PM", "10:21 AM", "11:03 AM"][index]}`
                        : "Pending"}
                    </small>
                  </span>
                  {stage === "First revenue event" && complete ? <strong>$1,240.00</strong> : null}
                </div>
              );
            })}
          </section>
        </aside>
      ) : null}
    </>
  );
}

type SavedLink = {
  name: string;
  merchant: string;
  destination: string;
  shortUrl: string;
  alias: string;
  clicks: number;
  conversions: number;
  revenue: string;
  commission: string;
  created: string;
};

export function PartnerLinksView() {
  const [links, setLinks] = useState<SavedLink[]>([
    {
      name: "Bitunix · Main referral",
      merchant: "Bitunix",
      destination: "https://merchants.acrudevelopment.com/sign-up?ref=PTR-NORTHSTAR&utm_source=partner",
      shortUrl: "https://acru.link/bitunix-main",
      alias: "bitunix-main",
      clicks: 8942,
      conversions: 324,
      revenue: "$39,842.12",
      commission: "$2,876.40",
      created: "May 31, 2026"
    },
    {
      name: "Lumen Digital · Email",
      merchant: "Lumen Digital",
      destination:
        "https://merchants.acrudevelopment.com/sign-up?ref=PTR-NORTHSTAR&utm_source=newsletter&utm_medium=email",
      shortUrl: "https://acru.link/lumen-email",
      alias: "lumen-email",
      clicks: 6231,
      conversions: 218,
      revenue: "$23,414.55",
      commission: "$1,784.22",
      created: "May 28, 2026"
    },
    {
      name: "Northwind · Coffee Blog",
      merchant: "Northwind Coffee Co.",
      destination:
        "https://merchants.acrudevelopment.com/sign-up?ref=PTR-NORTHSTAR&utm_source=coffee-blog&utm_medium=content",
      shortUrl: "https://acru.link/northwind-blog",
      alias: "northwind-blog",
      clicks: 3409,
      conversions: 112,
      revenue: "$9,842.11",
      commission: "$876.31",
      created: "May 26, 2026"
    },
    {
      name: "Crescent Retail · Paid social",
      merchant: "Crescent Retail",
      destination:
        "https://merchants.acrudevelopment.com/sign-up?ref=PTR-NORTHSTAR&utm_source=linkedin&utm_medium=paid-social",
      shortUrl: "https://acru.link/crescent-social",
      alias: "crescent-social",
      clicks: 2817,
      conversions: 94,
      revenue: "$15,678.23",
      commission: "$722.32",
      created: "May 24, 2026"
    },
    {
      name: "The Edge Markets · Review",
      merchant: "The Edge Markets",
      destination:
        "https://merchants.acrudevelopment.com/sign-up?ref=PTR-NORTHSTAR&utm_source=youtube&utm_medium=review",
      shortUrl: "https://acru.link/edge-review",
      alias: "edge-review",
      clicks: 1984,
      conversions: 63,
      revenue: "$8,055.33",
      commission: "$468.58",
      created: "May 22, 2026"
    }
  ]);
  const [destination, setDestination] = useState("https://merchants.acrudevelopment.com/sign-up");
  const [merchant, setMerchant] = useState("Bitunix");
  const [campaign, setCampaign] = useState("");
  const [alias, setAlias] = useState("");
  const [subId, setSubId] = useState("");
  const [utmSource, setUtmSource] = useState("partner");
  const [utmMedium, setUtmMedium] = useState("referral");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [created, setCreated] = useState(links[0]);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(created.shortUrl, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 360,
      color: { dark: "#111111", light: "#ffffff" }
    }).then((value) => {
      if (active) setQrDataUrl(value);
    });
    return () => {
      active = false;
    };
  }, [created.shortUrl]);
  function generate(event: FormEvent) {
    event.preventDefault();
    if (!campaign.trim()) return;
    const slug = (alias.trim() || campaign.trim())
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, "-")
      .replaceAll(/(^-|-$)/g, "")
      .slice(0, 42);
    const target = new URL(destination);
    target.searchParams.set("ref", "PTR-NORTHSTAR");
    if (subId.trim()) target.searchParams.set("sub_id", subId.trim());
    if (utmSource.trim()) target.searchParams.set("utm_source", utmSource.trim());
    if (utmMedium.trim()) target.searchParams.set("utm_medium", utmMedium.trim());
    if (utmCampaign.trim()) target.searchParams.set("utm_campaign", utmCampaign.trim());
    const link = {
      name: campaign.trim(),
      merchant,
      destination: target.toString(),
      shortUrl: `https://acru.link/${slug || "partner-link"}`,
      alias: slug || "partner-link",
      clicks: 0,
      conversions: 0,
      revenue: "$0.00",
      commission: "$0.00",
      created: "Aug 25, 2026"
    };
    setLinks((current) => [link, ...current]);
    setCreated(link);
    setCampaign("");
    setAlias("");
    setUtmCampaign("");
  }
  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }
  function downloadQr() {
    if (!qrDataUrl) return;
    const anchor = document.createElement("a");
    anchor.download = `${created.alias}-qr.png`;
    anchor.href = qrDataUrl;
    anchor.click();
  }
  const rankedLinks = [...links].sort(
    (first, second) =>
      Number(second.commission.replaceAll(/[$,]/g, "")) - Number(first.commission.replaceAll(/[$,]/g, ""))
  );
  return (
    <>
      <section className="partner-links-grid">
        <form className="portal-card partner-link-form" onSubmit={generate}>
          <header>
            <div>
              <h2>Create custom link</h2>
              <p>Build a tracked onboarding link for a campaign, channel, or merchant.</p>
            </div>
            <span>* Required fields</span>
          </header>
          <div className="partner-link-fields">
            <label>
              Destination URL *
              <input
                onChange={(event) => setDestination(event.target.value)}
                placeholder="https://merchants.acrudevelopment.com/sign-up"
                required
                type="url"
                value={destination}
              />
            </label>
            <label>
              Merchant *
              <Select onChange={(event) => setMerchant(event.target.value)} value={merchant}>
                <option>Bitunix</option>
                <option>Lumen Digital</option>
                <option>Northwind Coffee Co.</option>
                <option>Crescent Retail</option>
                <option>The Edge Markets</option>
              </Select>
            </label>
            <label>
              Campaign name *
              <input
                onChange={(event) => setCampaign(event.target.value)}
                placeholder="e.g. Q4 acquisition"
                required
                value={campaign}
              />
            </label>
            <label>
              Link alias *
              <input
                onChange={(event) => setAlias(event.target.value)}
                placeholder="e.g. q4-acquisition"
                required
                value={alias}
              />
            </label>
            <label>
              Sub-ID
              <input onChange={(event) => setSubId(event.target.value)} placeholder="e.g. banner-1" value={subId} />
            </label>
            <label>
              UTM source *
              <input onChange={(event) => setUtmSource(event.target.value)} required value={utmSource} />
            </label>
            <label>
              UTM medium *
              <input onChange={(event) => setUtmMedium(event.target.value)} required value={utmMedium} />
            </label>
            <label>
              UTM campaign
              <input
                onChange={(event) => setUtmCampaign(event.target.value)}
                placeholder="e.g. q4-acquisition"
                value={utmCampaign}
              />
            </label>
          </div>
          <footer>
            <button
              onClick={() => {
                setCampaign("");
                setAlias("");
                setSubId("");
                setUtmCampaign("");
              }}
              type="button"
            >
              Reset
            </button>
            <button className="portal-primary" type="submit">
              <CodeIcon /> Generate link
            </button>
          </footer>
        </form>
        <article className="portal-card partner-created-link">
          <header>
            <div>
              <h2>Your referral link</h2>
              <p>Share this link or its QR code to attribute every signup.</p>
            </div>
            <Status>Ready</Status>
          </header>
          <div className="partner-created-link-value">
            <code>{created.shortUrl}</code>
            <button onClick={() => copy(created.shortUrl)} type="button">
              <ClipboardIcon /> {copied ? "Copied" : "Copy link"}
            </button>
          </div>
          <dl className="partner-created-link-meta">
            <div>
              <dt>Destination</dt>
              <dd>{created.merchant}</dd>
            </div>
            <div>
              <dt>Campaign</dt>
              <dd>{created.name}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{created.created}</dd>
            </div>
            <div>
              <dt>Link type</dt>
              <dd>Tracked short link</dd>
            </div>
          </dl>
          <section className="partner-created-link-qr">
            <div>
              <h3>QR code</h3>
              <p>Scan to open this exact tracked link.</p>
              <button disabled={!qrDataUrl} onClick={downloadQr} type="button">
                Download QR code
              </button>
              <small>Updates automatically when the selected link changes.</small>
            </div>
            <figure>
              {qrDataUrl ? (
                <Image alt={`QR code for ${created.name}`} height={132} src={qrDataUrl} unoptimized width={132} />
              ) : (
                <span>Generating QR…</span>
              )}
            </figure>
          </section>
        </article>
      </section>
      <section className="partner-link-analytics-grid">
        <article className="portal-card partner-data-table partner-saved-links">
          <header>
            <div>
              <h2>Saved links</h2>
              <p>Traffic, conversion, revenue, and commission by tracked link.</p>
            </div>
            <label>
              <SearchIcon />
              <input placeholder="Search saved links" />
            </label>
          </header>
          <div className="portal-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Link</th>
                  <th>Merchant</th>
                  <th>Clicks</th>
                  <th>Conversions</th>
                  <th>Conversion rate</th>
                  <th>Revenue</th>
                  <th>Commission</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link.shortUrl}>
                    <td>
                      <b>{link.name}</b>
                      <small>{link.alias}</small>
                    </td>
                    <td>
                      <span className="partner-referral-name">
                        <ReferralBrandMark name={link.merchant} />
                        <b>{link.merchant}</b>
                      </span>
                    </td>
                    <td>{link.clicks.toLocaleString()}</td>
                    <td>{link.conversions}</td>
                    <td>{link.clicks ? `${((link.conversions / link.clicks) * 100).toFixed(2)}%` : "0.00%"}</td>
                    <td>{link.revenue}</td>
                    <td>
                      <b>{link.commission}</b>
                    </td>
                    <td>{link.created}</td>
                    <td>
                      <span className="partner-link-row-actions">
                        <button onClick={() => copy(link.shortUrl)} type="button">
                          Copy
                        </button>
                        <button onClick={() => setCreated(link)} type="button">
                          QR
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <footer>
            Showing 1–{links.length} of 12 links
            <span>
              <button className="active" type="button">
                1
              </button>
              <button type="button">2</button>
              <button type="button">›</button>
            </span>
          </footer>
        </article>

        <aside className="portal-card partner-top-links">
          <header>
            <div>
              <h2>Top performing links</h2>
              <p>Ranked by commission in the last 30 days.</p>
            </div>
            <span>30D</span>
          </header>
          <nav aria-label="Top performing links">
            {rankedLinks.slice(0, 5).map((link, index) => (
              <button key={link.shortUrl} onClick={() => setCreated(link)} type="button">
                <i>{index + 1}</i>
                <ReferralBrandMark name={link.merchant} />
                <span>
                  <b>{link.name}</b>
                  <small>{link.clicks.toLocaleString()} clicks</small>
                </span>
                <strong>{link.commission}</strong>
              </button>
            ))}
          </nav>
        </aside>
      </section>
    </>
  );
}

type MarketingCategory =
  "Banners" | "Email copy" | "Social copy" | "Landing pages" | "Logos" | "Brand guidelines" | "Videos";

type MarketingAsset = {
  id: string;
  name: string;
  merchant: string;
  category: MarketingCategory;
  campaign: string;
  size: string;
  format: string;
  updated: string;
  headline: string;
  description: string;
  variant: "market" | "signal" | "retail" | "coffee" | "copy" | "brand" | "video";
};

const marketingCategories: MarketingCategory[] = [
  "Banners",
  "Email copy",
  "Social copy",
  "Landing pages",
  "Logos",
  "Brand guidelines",
  "Videos"
];

const marketingAssets: MarketingAsset[] = [
  {
    id: "bitunix-leaderboard",
    name: "Bitunix · Leaderboard",
    merchant: "Bitunix",
    category: "Banners",
    campaign: "Trade smarter",
    size: "728 × 90",
    format: "PNG",
    updated: "Aug 25, 2026",
    headline: "Trade smarter. Earn more.",
    description: "Desktop leaderboard for acquisition and comparison pages.",
    variant: "market"
  },
  {
    id: "lumen-growth-square",
    name: "Lumen Digital · Growth square",
    merchant: "Lumen Digital",
    category: "Banners",
    campaign: "Always on",
    size: "300 × 250",
    format: "PNG",
    updated: "Aug 24, 2026",
    headline: "Enterprise SEO that compounds.",
    description: "Square placement for newsletters and partner resource pages.",
    variant: "signal"
  },
  {
    id: "crescent-retail-banner",
    name: "Crescent Retail · Premium banner",
    merchant: "Crescent Retail",
    category: "Banners",
    campaign: "Fall collection",
    size: "728 × 90",
    format: "PNG",
    updated: "Aug 23, 2026",
    headline: "Elevate every shopping experience.",
    description: "Wide premium retail banner for editorial placements.",
    variant: "retail"
  },
  {
    id: "northwind-coffee-square",
    name: "Northwind · Coffee square",
    merchant: "Northwind Coffee Co.",
    category: "Banners",
    campaign: "Coffee lovers",
    size: "300 × 250",
    format: "PNG",
    updated: "Aug 22, 2026",
    headline: "Better coffee. Better day.",
    description: "Square creative for social, review, and content placements.",
    variant: "coffee"
  },
  {
    id: "bitunix-welcome-email",
    name: "Bitunix · Welcome email",
    merchant: "Bitunix",
    category: "Email copy",
    campaign: "Trade smarter",
    size: "3 blocks",
    format: "HTML",
    updated: "Aug 21, 2026",
    headline: "A sharper way to trade is here.",
    description: "Approved subject line, introduction, proof points, and CTA.",
    variant: "copy"
  },
  {
    id: "crescent-promotion-email",
    name: "Crescent Retail · Promotion email",
    merchant: "Crescent Retail",
    category: "Email copy",
    campaign: "Fall collection",
    size: "4 blocks",
    format: "HTML",
    updated: "Aug 20, 2026",
    headline: "The fall edit has arrived.",
    description: "Launch email with approved offer language and merchant CTA.",
    variant: "copy"
  },
  {
    id: "lumen-linkedin-posts",
    name: "Lumen Digital · LinkedIn set",
    merchant: "Lumen Digital",
    category: "Social copy",
    campaign: "Always on",
    size: "5 posts",
    format: "TXT",
    updated: "Aug 19, 2026",
    headline: "Organic growth built for serious teams.",
    description: "Five approved LinkedIn posts with tags and disclosure copy.",
    variant: "copy"
  },
  {
    id: "northwind-social-captions",
    name: "Northwind · Social captions",
    merchant: "Northwind Coffee Co.",
    category: "Social copy",
    campaign: "Coffee lovers",
    size: "8 posts",
    format: "TXT",
    updated: "Aug 18, 2026",
    headline: "Small-batch coffee, delivered fresh.",
    description: "Short and long captions for organic social placements.",
    variant: "copy"
  },
  {
    id: "bitunix-product-landing",
    name: "Bitunix · Product landing page",
    merchant: "Bitunix",
    category: "Landing pages",
    campaign: "Trade smarter",
    size: "Responsive",
    format: "URL",
    updated: "Aug 17, 2026",
    headline: "Built for the next move.",
    description: "Conversion-ready co-branded landing page with attribution.",
    variant: "market"
  },
  {
    id: "lumen-audit-landing",
    name: "Lumen Digital · Audit landing page",
    merchant: "Lumen Digital",
    category: "Landing pages",
    campaign: "SEO audit",
    size: "Responsive",
    format: "URL",
    updated: "Aug 16, 2026",
    headline: "Find the growth your site is missing.",
    description: "Lead-generation landing page for partner SEO campaigns.",
    variant: "signal"
  },
  {
    id: "acru-partner-logo-kit",
    name: "Acru · Partner logo kit",
    merchant: "Acru",
    category: "Logos",
    campaign: "Brand",
    size: "12 files",
    format: "ZIP",
    updated: "Aug 15, 2026",
    headline: "Acru partner marks",
    description: "Light, dark, horizontal, and icon-only brand assets.",
    variant: "brand"
  },
  {
    id: "partner-brand-guidelines",
    name: "Acru · Partner brand guidelines",
    merchant: "Acru",
    category: "Brand guidelines",
    campaign: "Brand",
    size: "18 pages",
    format: "PDF",
    updated: "Aug 14, 2026",
    headline: "Use the Acru brand with confidence.",
    description: "Logo, color, typography, disclosure, and usage guidance.",
    variant: "brand"
  },
  {
    id: "partner-platform-overview",
    name: "Acru · Platform overview",
    merchant: "Acru",
    category: "Videos",
    campaign: "Partner enablement",
    size: "01:42",
    format: "MP4",
    updated: "Aug 13, 2026",
    headline: "Acru in under two minutes.",
    description: "Approved product overview for partner sites and sales flows.",
    variant: "video"
  }
];

function MarketingAssetPreview({ asset, compact = false }: { asset: MarketingAsset; compact?: boolean }) {
  return (
    <div className={`partner-marketing-visual ${asset.variant}${compact ? " compact" : ""}`}>
      <div className="partner-marketing-brand-row">
        {asset.merchant === "Acru" ? (
          <Image alt="Acru" height={24} src="/acru-mark.svg" width={24} />
        ) : (
          <ReferralBrandMark name={asset.merchant} />
        )}
        <b>{asset.merchant}</b>
      </div>
      <div className="partner-marketing-creative-copy">
        <strong>{asset.headline}</strong>
        <span>{asset.campaign}</span>
      </div>
      {asset.variant === "market" ? (
        <svg aria-hidden="true" className="partner-marketing-spark" viewBox="0 0 180 56">
          <path d="M2 48 C 26 46, 28 34, 45 36 S 68 18, 86 25 S 111 8, 128 16 S 157 2, 178 7" />
          <path d="M2 54 L2 48 C 26 46, 28 34, 45 36 S 68 18, 86 25 S 111 8, 128 16 S 157 2, 178 7 L178 54 Z" />
        </svg>
      ) : null}
      {asset.variant === "signal" ? (
        <div className="partner-marketing-ring">
          <b>78%</b>
          <small>growth</small>
        </div>
      ) : null}
      {asset.variant === "retail" ? (
        <div className="partner-marketing-product">
          <i />
          <i />
          <i />
        </div>
      ) : null}
      {asset.variant === "coffee" ? (
        <div className="partner-marketing-coffee">
          <i>NW</i>
        </div>
      ) : null}
      {asset.variant === "copy" ? (
        <div className="partner-marketing-copy-lines">
          <i />
          <i />
          <i />
        </div>
      ) : null}
      {asset.variant === "brand" ? <div className="partner-marketing-brand-mark">A</div> : null}
      {asset.variant === "video" ? <div className="partner-marketing-play">▶</div> : null}
    </div>
  );
}

export function PartnerMarketingView() {
  const [category, setCategory] = useState<MarketingCategory>("Banners");
  const [query, setQuery] = useState("");
  const [merchant, setMerchant] = useState("All merchants");
  const [campaign, setCampaign] = useState("All campaigns");
  const [size, setSize] = useState("All sizes");
  const [format, setFormat] = useState("All formats");
  const [preview, setPreview] = useState<MarketingAsset | null>(null);
  const [notice, setNotice] = useState("");
  const quickEmail =
    "Trade smarter with Bitunix. Access deep liquidity, fast execution, and a platform built for your next move.";
  const quickSocial =
    "Organic growth should compound. See how Lumen Digital turns search visibility into measurable revenue. #SEO #Partner";
  const merchants = [...new Set(marketingAssets.map((asset) => asset.merchant))];
  const campaigns = [...new Set(marketingAssets.map((asset) => asset.campaign))];
  const sizes = [...new Set(marketingAssets.map((asset) => asset.size))];
  const formats = [...new Set(marketingAssets.map((asset) => asset.format))];
  const filteredAssets = marketingAssets.filter((asset) => {
    const matchesCategory = asset.category === category;
    const matchesQuery = `${asset.name} ${asset.merchant} ${asset.campaign}`
      .toLowerCase()
      .includes(query.toLowerCase());
    return (
      matchesCategory &&
      matchesQuery &&
      (merchant === "All merchants" || asset.merchant === merchant) &&
      (campaign === "All campaigns" || asset.campaign === campaign) &&
      (size === "All sizes" || asset.size === size) &&
      (format === "All formats" || asset.format === format)
    );
  });

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 1800);
  }

  async function copyText(text: string, message: string) {
    await navigator.clipboard.writeText(text);
    flash(message);
  }

  function getLink(asset: MarketingAsset) {
    void copyText(`https://partners.acrudevelopment.com/assets/${asset.id}?ref=northstar`, "Trackable link copied");
  }

  function downloadAsset(asset: MarketingAsset) {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 400;
    const context = canvas.getContext("2d");
    if (!context) return;
    const gradient = context.createLinearGradient(0, 0, 1200, 400);
    gradient.addColorStop(0, "#0d151a");
    gradient.addColorStop(1, "#253640");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1200, 400);
    context.fillStyle = "#55b8e8";
    context.fillRect(72, 70, 14, 260);
    context.fillStyle = "#ffffff";
    context.font = "600 34px Arial";
    context.fillText(asset.merchant, 116, 112);
    context.font = "700 58px Arial";
    context.fillText(asset.headline, 116, 218, 940);
    context.fillStyle = "#9fb0ba";
    context.font = "400 26px Arial";
    context.fillText(`${asset.campaign} · Approved partner creative`, 116, 278);
    context.fillStyle = "#55b8e8";
    context.fillRect(116, 310, 210, 8);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const anchor = document.createElement("a");
      anchor.download = `${asset.id}.png`;
      anchor.href = URL.createObjectURL(blob);
      anchor.click();
      URL.revokeObjectURL(anchor.href);
      flash(`${asset.name} downloaded`);
    }, "image/png");
  }

  function clearFilters() {
    setQuery("");
    setMerchant("All merchants");
    setCampaign("All campaigns");
    setSize("All sizes");
    setFormat("All formats");
  }

  return (
    <>
      {notice ? <div className="partner-marketing-notice">{notice}</div> : null}
      <nav aria-label="Marketing material categories" className="partner-marketing-tabs">
        {marketingCategories.map((item) => (
          <button
            className={category === item ? "active" : undefined}
            key={item}
            onClick={() => {
              setCategory(item);
              clearFilters();
            }}
            type="button"
          >
            {item}
            <span>{marketingAssets.filter((asset) => asset.category === item).length}</span>
          </button>
        ))}
      </nav>

      <section aria-label="Filter marketing assets" className="portal-card partner-marketing-filters">
        <label className="partner-marketing-search">
          <SearchIcon />
          <input onChange={(event) => setQuery(event.target.value)} placeholder="Search assets" value={query} />
        </label>
        <Select aria-label="Filter by merchant" onChange={(event) => setMerchant(event.target.value)} value={merchant}>
          <option>All merchants</option>
          {merchants.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
        <Select aria-label="Filter by campaign" onChange={(event) => setCampaign(event.target.value)} value={campaign}>
          <option>All campaigns</option>
          {campaigns.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
        <Select aria-label="Filter by size" onChange={(event) => setSize(event.target.value)} value={size}>
          <option>All sizes</option>
          {sizes.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
        <Select aria-label="Filter by format" onChange={(event) => setFormat(event.target.value)} value={format}>
          <option>All formats</option>
          {formats.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
        <button onClick={clearFilters} type="button">
          Clear filters
        </button>
      </section>

      <section className="portal-card partner-featured-assets">
        <header>
          <div>
            <h2>Featured {category.toLowerCase()}</h2>
            <p>Approved, current creative ready for partner campaigns.</p>
          </div>
          <span>{filteredAssets.length} available</span>
        </header>
        {filteredAssets.length ? (
          <div className="partner-featured-grid">
            {filteredAssets.slice(0, 4).map((asset) => (
              <article key={asset.id}>
                <button aria-label={`Preview ${asset.name}`} onClick={() => setPreview(asset)} type="button">
                  <MarketingAssetPreview asset={asset} />
                </button>
                <div>
                  <b>{asset.name}</b>
                  <span>
                    {asset.size} · {asset.format}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="partner-marketing-empty">
            <SearchIcon />
            <b>No matching assets</b>
            <span>Clear the filters to see approved material.</span>
          </div>
        )}
      </section>

      <section className="partner-marketing-copy-grid">
        <article className="portal-card">
          <header>
            <span>
              <EmailIcon />
            </span>
            <div>
              <h2>Email copy</h2>
              <p>Approved language for campaign sends.</p>
            </div>
            <button onClick={() => void copyText(quickEmail, "Email copy copied")} type="button">
              Copy
            </button>
          </header>
          <b>Bitunix · Welcome email</b>
          <p>{quickEmail}</p>
        </article>
        <article className="portal-card">
          <header>
            <span>
              <TeamIcon />
            </span>
            <div>
              <h2>Social copy</h2>
              <p>Post-ready copy with disclosures.</p>
            </div>
            <button onClick={() => void copyText(quickSocial, "Social copy copied")} type="button">
              Copy
            </button>
          </header>
          <b>Lumen Digital · LinkedIn</b>
          <p>{quickSocial}</p>
        </article>
      </section>

      <section className="portal-card partner-data-table partner-marketing-library">
        <header>
          <div>
            <h2>Asset library</h2>
            <p>Preview, download, or create a trackable link for every approved asset.</p>
          </div>
          <span>{filteredAssets.length} results</span>
        </header>
        <div className="portal-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Preview</th>
                <th>Asset</th>
                <th>Merchant</th>
                <th>Campaign</th>
                <th>Size</th>
                <th>Format</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.id}>
                  <td>
                    <button className="partner-marketing-table-preview" onClick={() => setPreview(asset)} type="button">
                      <MarketingAssetPreview asset={asset} compact />
                    </button>
                  </td>
                  <td>
                    <b>{asset.name}</b>
                    <small>{asset.description}</small>
                  </td>
                  <td>
                    <span className="partner-marketing-merchant">
                      {asset.merchant === "Acru" ? (
                        <Image alt="Acru" height={24} src="/acru-mark.svg" width={24} />
                      ) : (
                        <ReferralBrandMark name={asset.merchant} />
                      )}
                      {asset.merchant}
                    </span>
                  </td>
                  <td>{asset.campaign}</td>
                  <td>{asset.size}</td>
                  <td>
                    <span className="partner-marketing-format">{asset.format}</span>
                  </td>
                  <td>{asset.updated}</td>
                  <td>
                    <span className="partner-marketing-actions">
                      <button onClick={() => setPreview(asset)} type="button">
                        Preview
                      </button>
                      <button onClick={() => downloadAsset(asset)} type="button">
                        Download
                      </button>
                      <button onClick={() => getLink(asset)} type="button">
                        Get link
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <footer>
          Showing {filteredAssets.length} of {marketingAssets.filter((asset) => asset.category === category).length}{" "}
          assets
          <span>
            <button className="active" type="button">
              1
            </button>
          </span>
        </footer>
      </section>

      {preview ? (
        <div className="partner-marketing-modal" role="presentation">
          <button aria-label="Close asset preview" onClick={() => setPreview(null)} type="button" />
          <article aria-label={`${preview.name} preview`} aria-modal="true" className="portal-card" role="dialog">
            <header>
              <div>
                <span>{preview.category}</span>
                <h2>{preview.name}</h2>
                <p>{preview.description}</p>
              </div>
              <button aria-label="Close preview" onClick={() => setPreview(null)} type="button">
                ×
              </button>
            </header>
            <MarketingAssetPreview asset={preview} />
            <dl>
              <div>
                <dt>Merchant</dt>
                <dd>{preview.merchant}</dd>
              </div>
              <div>
                <dt>Campaign</dt>
                <dd>{preview.campaign}</dd>
              </div>
              <div>
                <dt>Dimensions</dt>
                <dd>{preview.size}</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>{preview.format}</dd>
              </div>
            </dl>
            <footer>
              <button onClick={() => downloadAsset(preview)} type="button">
                Download asset
              </button>
              <button onClick={() => getLink(preview)} type="button">
                Copy trackable link
              </button>
            </footer>
          </article>
        </div>
      ) : null}
    </>
  );
}

type PartnerReportRange = "7D" | "30D" | "3M" | "1Y";
type PartnerReportTab = "Performance" | "Merchants" | "Links" | "Referrals";

type PartnerReportRow = {
  label: string;
  clicks: number;
  conversions: number;
  revenue: number;
  commission: number;
};

const partnerReportTrend: Record<
  PartnerReportRange,
  { labels: string[]; clicks: number[]; conversions: number[]; commission: number[] }
> = {
  "7D": {
    labels: ["Aug 19", "Aug 20", "Aug 21", "Aug 22", "Aug 23", "Aug 24", "Aug 25"],
    clicks: [1512, 1628, 1584, 1711, 1768, 1692, 1842],
    conversions: [41, 45, 43, 49, 51, 48, 53],
    commission: [612, 668, 641, 724, 756, 718, 799]
  },
  "30D": {
    labels: ["Jul 27", "Jul 30", "Aug 2", "Aug 5", "Aug 8", "Aug 11", "Aug 14", "Aug 17", "Aug 20", "Aug 23", "Aug 25"],
    clicks: [2820, 3410, 3320, 4180, 4720, 5960, 5480, 6320, 6880, 7410, 7240],
    conversions: [32, 38, 37, 42, 45, 49, 46, 51, 50, 56, 53],
    commission: [428, 512, 486, 641, 734, 921, 842, 1108, 1042, 1328, 1246]
  },
  "3M": {
    labels: ["Jun 1", "Jun 10", "Jun 20", "Jul 1", "Jul 10", "Jul 20", "Aug 1", "Aug 10", "Aug 20", "Aug 25"],
    clicks: [9120, 10840, 10220, 12460, 13820, 15140, 14680, 17120, 18430, 19320],
    conversions: [186, 214, 202, 248, 271, 296, 282, 331, 357, 372],
    commission: [3240, 3860, 3510, 4420, 4980, 5370, 5120, 6210, 6830, 7140]
  },
  "1Y": {
    labels: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    clicks: [22800, 24600, 27100, 26300, 29400, 31800, 34200, 36100, 39800, 42100, 45600, 48742],
    conversions: [542, 588, 624, 612, 681, 736, 804, 862, 948, 1032, 1148, 1248],
    commission: [8420, 9160, 9870, 9540, 10820, 11940, 12880, 13720, 14960, 15840, 17120, 18420]
  }
};

const partnerCountryData = [
  { name: "United States", code: "US", clicks: 23842, share: 48.9 },
  { name: "United Kingdom", code: "GB", clicks: 5642, share: 11.6 },
  { name: "Canada", code: "CA", clicks: 3984, share: 8.2 },
  { name: "Australia", code: "AU", clicks: 2761, share: 5.7 },
  { name: "Germany", code: "DE", clicks: 2450, share: 5.0 }
];

const partnerCountryDataByCode = new Map(partnerCountryData.map((item) => [item.code.toLowerCase(), item]));
const partnerCountryIntensityByCode = new Map(
  partnerCountryData.map((item, index) => [item.code.toLowerCase(), partnerCountryData.length - index])
);

type PartnerCountryTooltip = {
  code: string;
  name: string;
  x: number;
  y: number;
};

type SvgMapLocation = {
  id: string;
  name: string;
  path: string;
};

const partnerDeviceData = [
  { name: "Desktop", clicks: 30409, share: 62.4, color: "#4ba9df" },
  { name: "Mobile", clicks: 15509, share: 31.8, color: "#78ccec" },
  { name: "Tablet", clicks: 2824, share: 5.8, color: "#a9b7c2" }
];

function PartnerReportChart({
  range,
  scale,
  onRangeChange
}: {
  range: PartnerReportRange;
  scale: number;
  onRangeChange: (range: PartnerReportRange) => void;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const data = partnerReportTrend[range];
  const width = 720;
  const top = 24;
  const bottom = 170;
  const xFor = (index: number) => 18 + (index * (width - 36)) / (data.labels.length - 1);
  const pointsFor = (values: number[]) => {
    const minimum = Math.min(...values);
    const maximum = Math.max(...values);
    const spread = Math.max(maximum - minimum, Math.abs(maximum) * 0.1, 1);
    const domainMinimum = minimum - spread * 0.08;
    const domainMaximum = maximum + spread * 0.08;
    return values.map((value, index) => ({
      x: xFor(index),
      y: bottom - ((value - domainMinimum) / (domainMaximum - domainMinimum)) * (bottom - top),
      value: value * scale,
      label: data.labels[index]
    }));
  };
  const clickPoints = pointsFor(data.clicks);
  const conversionPoints = pointsFor(data.conversions);
  const commissionPoints = pointsFor(data.commission);
  const clickPath = smoothPath(clickPoints);
  const conversionPath = smoothPath(conversionPoints);
  const commissionPath = smoothPath(commissionPoints);
  const clickArea = `${clickPath} L ${width - 18} ${bottom} L 18 ${bottom} Z`;

  function moveTooltip(event: React.PointerEvent<SVGRectElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    setActiveIndex(Math.round(position * (data.labels.length - 1)));
  }

  return (
    <div className="partner-report-performance-chart" onPointerLeave={() => setActiveIndex(null)}>
      <div className="partner-report-chart-legend">
        <span className="clicks">Clicks</span>
        <span className="conversions">Conversions</span>
        <span className="commission">Commission</span>
        <nav aria-label="Report chart range">
          {(["7D", "30D", "3M", "1Y"] as PartnerReportRange[]).map((item) => (
            <button
              className={range === item ? "active" : undefined}
              key={item}
              onClick={() => {
                onRangeChange(item);
                setActiveIndex(null);
              }}
              type="button"
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
      <div className="partner-report-chart-plot">
        <svg
          aria-label="Clicks, conversions, and commission over time"
          preserveAspectRatio="none"
          role="img"
          viewBox="0 0 720 198"
        >
          <defs>
            <linearGradient id="partnerReportClicksArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#4caedf" stopOpacity=".22" />
              <stop offset="100%" stopColor="#4caedf" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[36, 80, 124, 170].map((y) => (
            <line className="grid" key={y} x1="18" x2="702" y1={y} y2={y} />
          ))}
          <path className="area" d={clickArea} />
          <path className="series clicks" d={clickPath} />
          <path className="series conversions" d={conversionPath} />
          <path className="series commission" d={commissionPath} />
          {activeIndex === null ? null : (
            <>
              <line
                className="cursor"
                x1={clickPoints[activeIndex].x}
                x2={clickPoints[activeIndex].x}
                y1={top}
                y2={bottom}
              />
              <circle
                className="point clicks"
                cx={clickPoints[activeIndex].x}
                cy={clickPoints[activeIndex].y}
                r="3.5"
              />
              <circle
                className="point conversions"
                cx={conversionPoints[activeIndex].x}
                cy={conversionPoints[activeIndex].y}
                r="3.5"
              />
              <circle
                className="point commission"
                cx={commissionPoints[activeIndex].x}
                cy={commissionPoints[activeIndex].y}
                r="3.5"
              />
            </>
          )}
          <rect
            className="hitbox"
            height="158"
            onPointerDown={moveTooltip}
            onPointerMove={moveTooltip}
            width="684"
            x="18"
            y="18"
          />
          <text x="18" y="193">
            {data.labels[0]}
          </text>
          <text textAnchor="middle" x="360" y="193">
            {data.labels[Math.floor(data.labels.length / 2)]}
          </text>
          <text textAnchor="end" x="702" y="193">
            {data.labels.at(-1)}
          </text>
        </svg>
        {activeIndex === null ? null : (
          <div
            className="partner-report-chart-tooltip"
            style={{ left: `${Math.max(13, Math.min(84, (clickPoints[activeIndex].x / width) * 100))}%` }}
          >
            <time>{data.labels[activeIndex]}</time>
            <span>
              <i className="clicks" /> Clicks <b>{Math.round(clickPoints[activeIndex].value).toLocaleString()}</b>
            </span>
            <span>
              <i className="conversions" /> Conversions{" "}
              <b>{Math.round(conversionPoints[activeIndex].value).toLocaleString()}</b>
            </span>
            <span>
              <i className="commission" /> Commission <b>{formatChartCurrency(commissionPoints[activeIndex].value)}</b>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function createPartnerReportRows(tab: PartnerReportTab): PartnerReportRow[] {
  if (tab === "Merchants") {
    return [
      ["Bitunix", 12842, 342, 39842.12, 7968.42],
      ["Lumen Digital", 8421, 214, 23414.55, 4682.31],
      ["Crescent Retail", 6732, 187, 15678.23, 2823.02],
      ["Northwind Coffee Co.", 5421, 149, 9842.11, 1771.58],
      ["The Edge Markets", 4892, 121, 8055.33, 1174.07]
    ].map(([label, clicks, conversions, revenue, commission]) => ({
      label: String(label),
      clicks: Number(clicks),
      conversions: Number(conversions),
      revenue: Number(revenue),
      commission: Number(commission)
    }));
  }
  if (tab === "Links") {
    return [
      ["Bitunix · Main referral", 8942, 324, 39842.12, 2876.4],
      ["Lumen Digital · Email", 6231, 218, 23414.55, 1784.22],
      ["Northwind · Coffee blog", 3409, 112, 9842.11, 876.31],
      ["Crescent · Paid social", 2817, 94, 15678.23, 722.32],
      ["Edge Markets · Review", 1984, 63, 8055.33, 468.58]
    ].map(([label, clicks, conversions, revenue, commission]) => ({
      label: String(label),
      clicks: Number(clicks),
      conversions: Number(conversions),
      revenue: Number(revenue),
      commission: Number(commission)
    }));
  }
  if (tab === "Referrals") {
    return [
      ["Main affiliate link", 21420, 534, 42184.2, 8104.2],
      ["Email newsletter", 12680, 328, 24786.42, 4782.4],
      ["Partner directory", 7798, 201, 15146.72, 2948.0],
      ["Paid campaigns", 4386, 119, 9038.0, 1657.8],
      ["Other sources", 2458, 66, 5686.98, 927.6]
    ].map(([label, clicks, conversions, revenue, commission]) => ({
      label: String(label),
      clicks: Number(clicks),
      conversions: Number(conversions),
      revenue: Number(revenue),
      commission: Number(commission)
    }));
  }
  return [31, 30, 29, 28, 27, 26, 25].map((day, index) => ({
    label: `Aug ${day}, 2026`,
    clicks: 1842 - index * 86,
    conversions: 53 - index * 3,
    revenue: 4128.34 - index * 286.13,
    commission: 798.72 - index * 62.54
  }));
}

export function PartnerReportsView({ applicants }: { applicants: Applicant[] }) {
  const [tab, setTab] = useState<PartnerReportTab>("Performance");
  const [range, setRange] = useState<PartnerReportRange>("30D");
  const [merchant, setMerchant] = useState("All merchants");
  const [campaign, setCampaign] = useState("All campaigns");
  const [link, setLink] = useState("All links");
  const [status, setStatus] = useState("All statuses");
  const [country, setCountry] = useState("All countries");
  const [device, setDevice] = useState("All devices");
  const [countryTooltip, setCountryTooltip] = useState<PartnerCountryTooltip | null>(null);
  const [sortKey, setSortKey] = useState<keyof PartnerReportRow>("label");
  const [ascending, setAscending] = useState(false);
  const countryShare =
    country === "All countries" ? 1 : (partnerCountryData.find((item) => item.name === country)?.share ?? 100) / 100;
  const deviceShare =
    device === "All devices" ? 1 : (partnerDeviceData.find((item) => item.name === device)?.share ?? 100) / 100;
  const merchantIndex = applicants.findIndex((item) => item.name === merchant);
  const merchantShare =
    merchant === "All merchants" ? 1 : [0.41, 0.24, 0.16, 0.1, 0.09][Math.max(0, merchantIndex) % 5];
  const campaignShare =
    campaign === "All campaigns"
      ? 1
      : campaign === "Main affiliate link"
        ? 0.44
        : campaign === "Email newsletter"
          ? 0.26
          : 0.16;
  const linkShare = link === "All links" ? 1 : link === "Primary referral link" ? 0.58 : 0.24;
  const statusShare = status === "All statuses" ? 1 : status === "Approved" ? 0.82 : status === "Pending" ? 0.14 : 0.04;
  const rangeScale = { "7D": 0.24, "30D": 1, "3M": 2.86, "1Y": 11.2 }[range];
  const countryBreakdownScale = rangeScale * deviceShare * merchantShare * campaignShare * linkShare * statusShare;
  const scopeScale = countryShare * deviceShare * merchantShare * campaignShare * linkShare * statusShare;
  const metricScale = rangeScale * scopeScale;
  const clicks = Math.round(48742 * metricScale);
  const conversions = Math.round(1248 * metricScale);
  const revenue = 96842.34 * metricScale;
  const commission = 18420 * metricScale;
  const rows = createPartnerReportRows(tab)
    .map((row) => ({
      ...row,
      clicks: Math.round(row.clicks * scopeScale),
      conversions: Math.round(row.conversions * scopeScale),
      revenue: row.revenue * scopeScale,
      commission: row.commission * scopeScale
    }))
    .sort((first, second) => {
      const a = first[sortKey];
      const b = second[sortKey];
      const comparison = typeof a === "string" && typeof b === "string" ? a.localeCompare(b) : Number(a) - Number(b);
      return ascending ? comparison : -comparison;
    });
  const firstColumn =
    tab === "Performance" ? "Date" : tab === "Merchants" ? "Merchant" : tab === "Links" ? "Link" : "Source";
  const countryTooltipData = countryTooltip ? partnerCountryDataByCode.get(countryTooltip.code) : undefined;

  function scaledCountryClicks(item: (typeof partnerCountryData)[number]) {
    return Math.round(item.clicks * countryBreakdownScale);
  }

  function positionCountryTooltip(
    target: SVGPathElement,
    code: string,
    name: string,
    clientX: number,
    clientY: number
  ) {
    const mapShell = target.closest(".partner-world-map-shell");
    if (!(mapShell instanceof HTMLElement)) return;
    const bounds = mapShell.getBoundingClientRect();
    setCountryTooltip({
      code,
      name,
      x: Math.max(76, Math.min(bounds.width - 76, clientX - bounds.left)),
      y: Math.max(54, clientY - bounds.top)
    });
  }

  function showCountryTooltip(event: ReactPointerEvent<SVGPathElement>, code: string, name: string) {
    positionCountryTooltip(event.currentTarget, code, name, event.clientX, event.clientY);
  }

  function focusCountryTooltip(event: ReactFocusEvent<SVGPathElement>, code: string, name: string) {
    const bounds = event.currentTarget.getBoundingClientRect();
    positionCountryTooltip(
      event.currentTarget,
      code,
      name,
      bounds.left + bounds.width / 2,
      bounds.top + bounds.height / 2
    );
  }

  function selectMapCountry(code: string) {
    const selectedCountry = partnerCountryDataByCode.get(code);
    if (selectedCountry)
      setCountry((current) => (current === selectedCountry.name ? "All countries" : selectedCountry.name));
  }

  function handleMapCountryKeyDown(event: ReactKeyboardEvent<SVGPathElement>, code: string) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    selectMapCountry(code);
  }

  function clearFilters() {
    setMerchant("All merchants");
    setCampaign("All campaigns");
    setLink("All links");
    setStatus("All statuses");
    setCountry("All countries");
    setDevice("All devices");
  }

  function sortBy(key: keyof PartnerReportRow) {
    if (sortKey === key) setAscending((current) => !current);
    else {
      setSortKey(key);
      setAscending(false);
    }
  }

  function exportReport() {
    const csv = [
      [firstColumn, "Clicks", "Conversions", "Conversion rate", "Revenue", "Commission", "EPC", "AOV"].join(","),
      ...rows.map((row) =>
        [
          `"${row.label}"`,
          row.clicks,
          row.conversions,
          row.clicks ? ((row.conversions / row.clicks) * 100).toFixed(2) : "0.00",
          row.revenue.toFixed(2),
          row.commission.toFixed(2),
          row.clicks ? (row.commission / row.clicks).toFixed(2) : "0.00",
          row.conversions ? (row.revenue / row.conversions).toFixed(2) : "0.00"
        ].join(",")
      )
    ].join("\n");
    const anchor = document.createElement("a");
    anchor.download = `acru-partner-${tab.toLowerCase()}-${range.toLowerCase()}.csv`;
    anchor.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  }

  return (
    <>
      <div className="partner-report-heading-row">
        <nav aria-label="Partner report types" className="partner-report-tabs">
          {(["Performance", "Merchants", "Links", "Referrals"] as PartnerReportTab[]).map((item) => (
            <button
              className={tab === item ? "active" : undefined}
              key={item}
              onClick={() => setTab(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </nav>
        <button onClick={exportReport} type="button">
          Export CSV
        </button>
      </div>

      <section aria-label="Report filters" className="portal-card partner-report-filters partner-report-filter-grid">
        <Select
          aria-label="Date range"
          onChange={(event) => setRange(event.target.value as PartnerReportRange)}
          value={range}
        >
          <option value="7D">Last 7 days</option>
          <option value="30D">Last 30 days</option>
          <option value="3M">Last 3 months</option>
          <option value="1Y">Last 12 months</option>
        </Select>
        <Select aria-label="Merchant" onChange={(event) => setMerchant(event.target.value)} value={merchant}>
          <option>All merchants</option>
          {applicants.map((item) => (
            <option key={item.id}>{item.name}</option>
          ))}
        </Select>
        <Select aria-label="Campaign" onChange={(event) => setCampaign(event.target.value)} value={campaign}>
          <option>All campaigns</option>
          <option>Main affiliate link</option>
          <option>Email newsletter</option>
          <option>Partner directory</option>
        </Select>
        <Select aria-label="Link" onChange={(event) => setLink(event.target.value)} value={link}>
          <option>All links</option>
          <option>Primary referral link</option>
          <option>Campaign links</option>
        </Select>
        <Select aria-label="Status" onChange={(event) => setStatus(event.target.value)} value={status}>
          <option>All statuses</option>
          <option>Approved</option>
          <option>Pending</option>
          <option>Adjusted</option>
        </Select>
        <Select aria-label="Country" onChange={(event) => setCountry(event.target.value)} value={country}>
          <option>All countries</option>
          {partnerCountryData.map((item) => (
            <option key={item.code}>{item.name}</option>
          ))}
        </Select>
        <Select aria-label="Device" onChange={(event) => setDevice(event.target.value)} value={device}>
          <option>All devices</option>
          {partnerDeviceData.map((item) => (
            <option key={item.name}>{item.name}</option>
          ))}
        </Select>
        <button onClick={clearFilters} type="button">
          Clear filters
        </button>
      </section>

      <PartnerMetricStrip
        items={[
          ["Clicks", clicks.toLocaleString(), "+18.6% vs. prior period"],
          ["Conversions", conversions.toLocaleString(), "+22.4% vs. prior period"],
          ["Revenue generated", formatChartCurrency(revenue), "+16.2% vs. prior period"],
          ["Commission earned", formatChartCurrency(commission), "+14.8% vs. prior period"],
          ["Earnings per click", formatChartCurrency(clicks ? commission / clicks : 0), "+12.7% vs. prior period"]
        ]}
      />

      <section className="partner-report-insights">
        <article className="portal-card partner-report-chart">
          <header>
            <div>
              <h2>Performance over time</h2>
              <p>Clicks, conversions, and approved commission for the selected scope.</p>
            </div>
          </header>
          <PartnerReportChart onRangeChange={setRange} range={range} scale={scopeScale} />
        </article>

        <article className="portal-card partner-country-card">
          <header>
            <div>
              <h2>Performance by country</h2>
              <p>Attributed clicks by customer location.</p>
            </div>
          </header>
          <div className="partner-world-map-shell">
            <svg
              aria-label="Attributed clicks by country. Select a highlighted country to filter the report."
              className="partner-world-map"
              role="group"
              viewBox={worldMap.viewBox}
            >
              {(worldMap.locations as SvgMapLocation[]).map((location) => {
                const code = location.id.toLowerCase();
                const countryData = partnerCountryDataByCode.get(code);
                const isSelected = countryData?.name === country;
                return (
                  <path
                    aria-hidden={countryData ? undefined : true}
                    aria-label={
                      countryData
                        ? `${countryData.name}: ${scaledCountryClicks(countryData).toLocaleString()} clicks, ${countryData.share}% of traffic`
                        : undefined
                    }
                    aria-pressed={countryData ? isSelected : undefined}
                    className={`${countryData ? "has-data" : ""}${isSelected ? " selected" : ""}`}
                    d={location.path}
                    data-level={countryData ? partnerCountryIntensityByCode.get(code) : 0}
                    key={code}
                    onBlur={countryData ? () => setCountryTooltip(null) : undefined}
                    onClick={countryData ? () => selectMapCountry(code) : undefined}
                    onFocus={countryData ? (event) => focusCountryTooltip(event, code, location.name) : undefined}
                    onKeyDown={countryData ? (event) => handleMapCountryKeyDown(event, code) : undefined}
                    onPointerLeave={() => setCountryTooltip(null)}
                    onPointerMove={(event) => showCountryTooltip(event, code, location.name)}
                    role={countryData ? "button" : undefined}
                    tabIndex={countryData ? 0 : undefined}
                  >
                    <title>
                      {countryData
                        ? `${countryData.name}: ${scaledCountryClicks(countryData).toLocaleString()} clicks (${countryData.share}% of traffic)`
                        : `${location.name}: no attributed activity`}
                    </title>
                  </path>
                );
              })}
            </svg>
            {countryTooltip ? (
              <div
                aria-live="polite"
                className="partner-world-map-tooltip"
                style={{ left: countryTooltip.x, top: countryTooltip.y }}
              >
                <strong>{countryTooltip.name}</strong>
                {countryTooltipData ? (
                  <>
                    <span>{scaledCountryClicks(countryTooltipData).toLocaleString()} clicks</span>
                    <small>{countryTooltipData.share}% of attributed traffic</small>
                  </>
                ) : (
                  <small>No attributed activity</small>
                )}
              </div>
            ) : null}
            <div aria-label="Map intensity legend" className="partner-world-map-legend">
              <span>Lower clicks</span>
              <i />
              <i />
              <i />
              <i />
              <i />
              <span>Higher clicks</span>
            </div>
          </div>
          <div className="partner-country-list">
            {partnerCountryData.map((item) => (
              <button
                className={country === item.name ? "active" : undefined}
                key={item.code}
                onClick={() => setCountry(item.name)}
                type="button"
              >
                <i>{item.code}</i>
                <span>{item.name}</span>
                <b>{scaledCountryClicks(item).toLocaleString()}</b>
                <small>{item.share}%</small>
              </button>
            ))}
          </div>
        </article>

        <article className="portal-card partner-device-card">
          <header>
            <div>
              <h2>Performance by device</h2>
              <p>Click mix for the selected scope.</p>
            </div>
          </header>
          <div className="partner-device-chart">
            <div>
              <strong>{clicks.toLocaleString()}</strong>
              <span>Total clicks</span>
            </div>
          </div>
          <nav aria-label="Device performance">
            {partnerDeviceData.map((item) => (
              <button
                className={device === item.name ? "active" : undefined}
                key={item.name}
                onClick={() => setDevice(item.name)}
                type="button"
              >
                <i style={{ background: item.color }} />
                <span>
                  <b>{item.name}</b>
                  <small>{item.clicks.toLocaleString()}</small>
                </span>
                <strong>{item.share}%</strong>
              </button>
            ))}
          </nav>
        </article>
      </section>

      <section className="portal-card partner-data-table partner-report-table">
        <header>
          <div>
            <h2>{tab} breakdown</h2>
            <p>Revenue and commission efficiency for the selected reporting scope.</p>
          </div>
          <span>{rows.length} rows</span>
        </header>
        <div className="portal-table-wrap">
          <table>
            <thead>
              <tr>
                {[
                  [firstColumn, "label"],
                  ["Clicks", "clicks"],
                  ["Conversions", "conversions"],
                  ["Conversion rate", "conversions"],
                  ["Revenue", "revenue"],
                  ["Commission", "commission"],
                  ["EPC", "commission"],
                  ["AOV", "revenue"]
                ].map(([label, key]) => (
                  <th key={label}>
                    <button onClick={() => sortBy(key as keyof PartnerReportRow)} type="button">
                      {label} <span>{sortKey === key ? (ascending ? "↑" : "↓") : "↕"}</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <td>
                    <b>{row.label}</b>
                  </td>
                  <td>{row.clicks.toLocaleString()}</td>
                  <td>{row.conversions.toLocaleString()}</td>
                  <td>{row.clicks ? `${((row.conversions / row.clicks) * 100).toFixed(2)}%` : "0.00%"}</td>
                  <td>{formatChartCurrency(row.revenue)}</td>
                  <td>
                    <b>{formatChartCurrency(row.commission)}</b>
                  </td>
                  <td>{formatChartCurrency(row.clicks ? row.commission / row.clicks : 0)}</td>
                  <td>{formatChartCurrency(row.conversions ? row.revenue / row.conversions : 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <footer>
          Showing 1–{rows.length} of {rows.length}
          <span>
            <button className="active" type="button">
              1
            </button>
          </span>
        </footer>
      </section>
    </>
  );
}

export function PartnerResourcesView() {
  const [query, setQuery] = useState("");
  const resources = [
    ["Acru partner onboarding checklist", "Getting started", "Checklist", "Aug 25"],
    ["Referral attribution guide", "Guides", "Guide", "Aug 22"],
    ["Payout methods and timing", "Payments", "Article", "Aug 20"],
    ["Sub-ID tracking reference", "Technical", "Reference", "Aug 18"],
    ["Merchant application requirements", "Compliance", "Guide", "Aug 16"],
    ["Partner reporting field dictionary", "Technical", "Reference", "Aug 14"],
    ["Commission and adjustment policy", "Payments", "Policy", "Aug 11"]
  ];
  const filtered = resources.filter((item) => item.join(" ").toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <label className="partner-resource-search">
        <SearchIcon />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search guides, policies, and technical references"
        />
      </label>
      <section className="partner-resource-grid">
        {[
          ["Getting started", "4 resources", TeamIcon],
          ["Guides & best practices", "6 resources", ChartVerticalIcon],
          ["Payments", "4 resources", BankIcon],
          ["API & integration", "7 resources", CodeIcon],
          ["Compliance", "5 resources", CheckCircleIcon],
          ["Campaign copy", "8 resources", EmailIcon]
        ].map(([label, count, ResourceIcon]) => {
          const Component = ResourceIcon as typeof TeamIcon;
          return (
            <article className="portal-card" key={label as string}>
              <Component />
              <h3>{label as string}</h3>
              <p>Operational reference material for Acru partners.</p>
              <button>{count as string}</button>
            </article>
          );
        })}
      </section>
      <section className="portal-card partner-data-table">
        <header>
          <div>
            <h2>All resources</h2>
            <p>Documentation for referrals, reporting, payments, and compliance.</p>
          </div>
        </header>
        <div className="portal-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row[0]}>
                  <td>
                    <b>{row[0]}</b>
                  </td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td>{row[3]}</td>
                  <td>
                    <button>Open</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
