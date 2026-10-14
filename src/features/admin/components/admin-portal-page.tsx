"use client";

import {
  AlertTriangleIcon,
  BankIcon,
  ChartVerticalIcon,
  ClockIcon,
  ExitIcon,
  HomeIcon,
  NotificationIcon,
  OrderIcon,
  PayoutIcon,
  PersonIcon,
  PriceListIcon,
  SearchIcon,
  SelectIcon,
  SettingsIcon,
  ShieldPersonIcon,
  StoreIcon,
  TeamIcon
} from "@shopify/polaris-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import { useMemo, useState } from "react";

import { ACRU_SESSION_KEY } from "@/lib/auth/client";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;
type AdminTab =
  | "Overview"
  | "Merchants"
  | "Merchant applications"
  | "Partners"
  | "Risk & chargebacks"
  | "Pricing"
  | "Payouts"
  | "Reports"
  | "Team"
  | "Settings";

type Merchant = {
  id: string;
  name: string;
  vertical: string;
  status: "Active" | "Pending" | "At risk" | "Suspended";
  processor: string;
  volume: string;
  approval: string;
  chargebacks: string;
  revenue: string;
  margin: string;
  reserve: string;
  activity: string;
  owner: string;
};

const adminNavigation: Array<{ label: AdminTab; icon: Icon }> = [
  { label: "Overview", icon: HomeIcon },
  { label: "Merchants", icon: StoreIcon },
  { label: "Merchant applications", icon: OrderIcon },
  { label: "Partners", icon: TeamIcon },
  { label: "Risk & chargebacks", icon: ShieldPersonIcon },
  { label: "Pricing", icon: PriceListIcon },
  { label: "Payouts", icon: PayoutIcon },
  { label: "Reports", icon: ChartVerticalIcon },
  { label: "Team", icon: PersonIcon },
  { label: "Settings", icon: SettingsIcon }
];

const merchants: Merchant[] = [
  {
    id: "MID-100001",
    name: "Bitunix",
    vertical: "Crypto exchange",
    status: "Active",
    processor: "AcruPay",
    volume: "$9.56M",
    approval: "89.2%",
    chargebacks: "0.32%",
    revenue: "$172,560",
    margin: "1.01%",
    reserve: "5.0%",
    activity: "2m ago",
    owner: "Ethan Carter"
  },
  {
    id: "MID-100002",
    name: "Lumen Digital",
    vertical: "Digital marketing",
    status: "Active",
    processor: "AcruPay",
    volume: "$2.41M",
    approval: "87.1%",
    chargebacks: "0.48%",
    revenue: "$52,240",
    margin: "1.31%",
    reserve: "5.0%",
    activity: "6m ago",
    owner: "Jane Cooper"
  },
  {
    id: "MID-100003",
    name: "Crescent Retail",
    vertical: "Retail",
    status: "Active",
    processor: "Stripe",
    volume: "$1.72M",
    approval: "90.3%",
    chargebacks: "0.67%",
    revenue: "$39,680",
    margin: "1.31%",
    reserve: "7.5%",
    activity: "18m ago",
    owner: "Michael Chen"
  },
  {
    id: "MID-100004",
    name: "Northwind Coffee Co.",
    vertical: "Food & beverage",
    status: "Active",
    processor: "Adyen",
    volume: "$1.46M",
    approval: "92.4%",
    chargebacks: "0.36%",
    revenue: "$29,640",
    margin: "1.23%",
    reserve: "5.0%",
    activity: "25m ago",
    owner: "Sarah Nguyen"
  },
  {
    id: "MID-100005",
    name: "Vertex Games",
    vertical: "Gaming",
    status: "At risk",
    processor: "AcruPay",
    volume: "$1.32M",
    approval: "86.5%",
    chargebacks: "1.28%",
    revenue: "$27,400",
    margin: "1.18%",
    reserve: "10.0%",
    activity: "42m ago",
    owner: "David Morales"
  },
  {
    id: "MID-100006",
    name: "Greenline Wellness",
    vertical: "Health & beauty",
    status: "Pending",
    processor: "Stripe",
    volume: "$812.4K",
    approval: "83.7%",
    chargebacks: "0.59%",
    revenue: "$16,240",
    margin: "1.10%",
    reserve: "7.5%",
    activity: "1h ago",
    owner: "Jessica Lee"
  },
  {
    id: "MID-100007",
    name: "Bluepeak SaaS",
    vertical: "Software",
    status: "At risk",
    processor: "Adyen",
    volume: "$521.6K",
    approval: "78.9%",
    chargebacks: "1.64%",
    revenue: "$10,960",
    margin: "1.00%",
    reserve: "15.0%",
    activity: "2h ago",
    owner: "David Morales"
  },
  {
    id: "MID-100008",
    name: "Urban Apparel",
    vertical: "Apparel",
    status: "Suspended",
    processor: "Stripe",
    volume: "$312.7K",
    approval: "75.2%",
    chargebacks: "2.32%",
    revenue: "$6,240",
    margin: "0.70%",
    reserve: "20.0%",
    activity: "5h ago",
    owner: "Michael Chen"
  }
];

const applications = [
  [
    "APP-20616-123",
    "Lumen Digital LLC",
    "Digital goods",
    "Underwriting",
    "72",
    "3 / 7",
    "$850K / mo",
    "Sarah Lin",
    "Review"
  ],
  [
    "APP-20616-122",
    "Crescent Retail Inc.",
    "E-commerce",
    "Compliance review",
    "48",
    "5 / 6",
    "$420K / mo",
    "Marcus Reed",
    "Review"
  ],
  [
    "APP-20615-118",
    "Northwind Coffee Co.",
    "Subscriptions",
    "Submitted",
    "31",
    "6 / 6",
    "$120K / mo",
    "Aisha Khan",
    "Assign"
  ],
  ["APP-20615-116", "Vertex Games Ltd.", "Gaming", "Underwriting", "81", "4 / 8", "$2.1M / mo", "Sarah Lin", "Review"],
  [
    "APP-20615-109",
    "Bitunix Technologies",
    "Crypto",
    "Pricing review",
    "65",
    "7 / 7",
    "$1.6M / mo",
    "Marcus Reed",
    "Review"
  ]
];

const partners = [
  ["PART-1001", "Bitunix", "Active", "128", "96", "$5.62M", "$392,145.80", "78.7%", "1.28%", "Spring Growth"],
  ["PART-1002", "Crescent Retail", "Active", "94", "71", "$3.18M", "$221,476.20", "81.1%", "0.59%", "Q2 Acquisition"],
  ["PART-1003", "Lumen Digital", "Active", "87", "62", "$2.75M", "$181,342.50", "77.4%", "0.67%", "Always On"],
  [
    "PART-1004",
    "Northwind Coffee Co.",
    "Active",
    "76",
    "58",
    "$1.89M",
    "$129,887.40",
    "71.9%",
    "1.12%",
    "Coffee Lovers"
  ],
  ["PART-1005", "Vertex Games", "Active", "65", "42", "$1.32M", "$98,742.30", "66.7%", "0.36%", "Summer Promo"],
  ["PART-1006", "Affiliant Flow", "Pending", "22", "8", "$412.6K", "$22,713.60", "75.0%", "—", "Beta Push"]
];

const teamMembers = [
  ["Ethan Carter", "Owner", "Executive", "ethan.carter@acru.com", "All access", "2m ago", "Enabled"],
  ["Sarah Johnson", "Admin", "Operations", "sarah.johnson@acru.com", "Full access", "12m ago", "Enabled"],
  ["Michael Lee", "Ops", "Operations", "michael.lee@acru.com", "Ops access", "35m ago", "Enabled"],
  ["Priya Patel", "Risk", "Risk", "priya.patel@acru.com", "Risk access", "1h ago", "Enabled"],
  ["Daniel Kim", "Finance", "Finance", "daniel.kim@acru.com", "Finance access", "2h ago", "Enabled"],
  ["Jessica Moore", "Support", "Support", "jessica.moore@acru.com", "Support access", "4h ago", "Enabled"],
  ["Alex Nguyen", "Analyst", "Risk", "alex.nguyen@acru.com", "Analyst access", "1d ago", "Enabled"]
];

const payoutRows = [
  ["Bitunix", "$98,420.00", "$1,024,380.00", "$19,684.00", "Aug 28, 2026", "ACH", "Upcoming", "TXN-98123-ABCD"],
  ["Crescent Retail", "$48,752.30", "$512,130.00", "$10,242.60", "Aug 28, 2026", "Wire", "Upcoming", "TXN-98124-EFGH"],
  [
    "Northwind Coffee Co.",
    "$35,120.75",
    "$389,118.00",
    "$7,782.36",
    "Aug 28, 2026",
    "ACH",
    "Upcoming",
    "TXN-98125-IJKL"
  ],
  ["Lumen Digital", "$76,342.90", "$821,110.00", "$16,422.20", "Aug 29, 2026", "ACH", "In review", "TXN-98126-MNOP"],
  ["Vertex Games", "$112,843.60", "$1,238,420.00", "$24,768.40", "Aug 29, 2026", "Wire", "In review", "TXN-98127-QRST"],
  ["Atlas Fitness", "$29,560.40", "$286,004.00", "$5,720.08", "Aug 30, 2026", "ACH", "Approved", "TXN-98128-UVWX"]
];

const adminMetrics: Record<AdminTab, Array<[string, string, string]>> = {
  Overview: [
    ["Total processing volume", "$18.42M", "+14.8%"],
    ["Net revenue", "$1.24M", "+12.1%"],
    ["Active merchants", "538", "+3.6%"],
    ["Active partners", "42", "+5.0%"],
    ["Portfolio chargeback ratio", "0.62%", "−0.18pp"],
    ["Average approval rate", "87.6%", "+2.4pp"]
  ],
  Merchants: [
    ["Total merchants", "538", "+5.0%"],
    ["Active merchants", "421", "+3.4%"],
    ["Processing volume", "$18.42M", "+14.8%"],
    ["Net revenue", "$1.24M", "+12.1%"],
    ["Chargeback ratio", "0.62%", "−0.11pp"],
    ["Average approval rate", "87.6%", "+2.4pp"]
  ],
  "Merchant applications": [
    ["New applications", "28", "+21%"],
    ["Under review", "46", "+8%"],
    ["Approved", "132", "+15%"],
    ["Rejected", "19", "−12%"],
    ["Awaiting documents", "37", "+5%"]
  ],
  Partners: [
    ["Total partners", "538", "+6.3%"],
    ["Active partners", "428", "+5.7%"],
    ["Pending partners", "42", "−4.5%"],
    ["Partner-driven volume", "$18.42M", "+14.8%"],
    ["Partner commission", "$1.24M", "+12.1%"],
    ["Average conversion", "2.18%", "+0.26pp"]
  ],
  "Risk & chargebacks": [
    ["Portfolio chargeback ratio", "0.62%", "−0.18pp"],
    ["Open disputes", "1,284", "+14.2%"],
    ["High-risk merchants", "23", "+8"],
    ["Loss exposure", "$742.3K", "+9.6%"],
    ["Fraud alerts", "167", "+21.3%"],
    ["Reserve held", "$3.47M", "+6.8%"]
  ],
  Pricing: [
    ["Average take rate", "1.28%", "−0.08pp"],
    ["Net revenue margin", "0.64%", "+0.06pp"],
    ["Merchants on custom rates", "87", "18.9% of total"],
    ["Pending pricing review", "14", "Needs attention"],
    ["Estimated monthly profit", "$2.31M", "+8.2%"]
  ],
  Payouts: [
    ["Upcoming settlements", "$2.94M", "32 scheduled"],
    ["Settled this month", "$18.42M", "+14.8%"],
    ["Pending partner commissions", "$1.24M", "28 pending approval"],
    ["Failed payouts", "$21.6K", "6 failed"],
    ["Funds held in reserve", "$3.47M", "Across all merchants"]
  ],
  Reports: [
    ["Total volume", "$18.42M", "+14.8%"],
    ["Gross revenue", "$1.24M", "+12.1%"],
    ["Net revenue", "$672.5K", "+11.2%"],
    ["Average margin", "3.65%", "+0.32pp"],
    ["Chargeback losses", "$78.6K", "−6.2%"],
    ["Average approval rate", "87.6%", "+2.4pp"]
  ],
  Team: [
    ["Team members", "42", "+5"],
    ["Admins", "8", "19.0% of team"],
    ["Analysts", "21", "50.0% of team"],
    ["Pending invites", "5", "Expires in 7 days"],
    ["Actions logged today", "134", "+18%"]
  ],
  Settings: []
};

function AdminMetricGrid({ metrics }: { metrics: Array<[string, string, string]> }) {
  return (
    <section className="admin-metric-grid">
      {metrics.map(([label, value, change], index) => (
        <article key={label}>
          <span className="admin-metric-icon">{index % 2 ? <ChartVerticalIcon /> : <BankIcon />}</span>
          <p>{label}</p>
          <strong>{value}</strong>
          <small className={change.startsWith("−") ? "positive" : change.startsWith("+") ? "positive" : "neutral"}>
            {change}
          </small>
        </article>
      ))}
    </section>
  );
}

function AdminTrendChart({ title = "Processing volume & net revenue" }: { title?: string }) {
  const labels = ["Jul 27", "Aug 2", "Aug 8", "Aug 14", "Aug 20", "Aug 25"];
  return (
    <article className="admin-card admin-trend-card">
      <header>
        <div>
          <h2>{title}</h2>
          <p>
            <i className="blue" /> Processing volume <i className="green" /> Net revenue
          </p>
        </div>
        <div className="admin-range">
          <button>7D</button>
          <button className="active">30D</button>
          <button>3M</button>
          <button>1Y</button>
        </div>
      </header>
      <svg viewBox="0 0 760 220" role="img" aria-label={`${title} chart`}>
        {[42, 88, 134, 180].map((y) => (
          <line key={y} x1="28" x2="736" y1={y} y2={y} />
        ))}
        <path
          className="admin-area blue"
          d="M28 164 L78 130 L128 142 L178 112 L228 124 L278 92 L328 118 L378 98 L428 106 L478 66 L528 122 L578 84 L628 102 L678 80 L736 58 L736 180 L28 180 Z"
        />
        <path
          className="admin-line blue"
          d="M28 164 L78 130 L128 142 L178 112 L228 124 L278 92 L328 118 L378 98 L428 106 L478 66 L528 122 L578 84 L628 102 L678 80 L736 58"
        />
        <path
          className="admin-line green"
          d="M28 178 L78 154 L128 164 L178 142 L228 156 L278 128 L328 150 L378 140 L428 146 L478 112 L528 154 L578 126 L628 145 L678 132 L736 116"
        />
        {[28, 178, 328, 478, 628, 736].map((x, index) => (
          <text key={x} x={x} y="210" textAnchor={index === 0 ? "start" : index === 5 ? "end" : "middle"}>
            {labels[index]}
          </text>
        ))}
      </svg>
    </article>
  );
}

function Status({ children }: { children: string }) {
  return <span className={`admin-status ${children.toLowerCase().replaceAll(" ", "-")}`}>{children}</span>;
}

function MerchantTable({ onSelect }: { onSelect: (merchant: Merchant) => void }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const rows = merchants.filter((merchant) => {
    const matchesQuery = `${merchant.name} ${merchant.id} ${merchant.vertical}`
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesQuery && (status === "All statuses" || merchant.status === status);
  });
  return (
    <section className="admin-card admin-table-card">
      <div className="admin-table-toolbar">
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option>All statuses</option>
          <option>Active</option>
          <option>Pending</option>
          <option>At risk</option>
          <option>Suspended</option>
        </select>
        <select>
          <option>All processors</option>
          <option>AcruPay</option>
          <option>Stripe</option>
          <option>Adyen</option>
        </select>
        <label>
          <SearchIcon />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search merchants" />
        </label>
      </div>
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Merchant</th>
              <th>Status</th>
              <th>Processor</th>
              <th>Volume</th>
              <th>Approval</th>
              <th>Chargebacks</th>
              <th>Net revenue</th>
              <th>Margin</th>
              <th>Reserve</th>
              <th>Last activity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((merchant) => (
              <tr key={merchant.id} onClick={() => onSelect(merchant)}>
                <td>
                  <span className="admin-name">
                    <i>{merchant.name[0]}</i>
                    <span>
                      <b>{merchant.name}</b>
                      <small>
                        {merchant.id} · {merchant.vertical}
                      </small>
                    </span>
                  </span>
                </td>
                <td>
                  <Status>{merchant.status}</Status>
                </td>
                <td>{merchant.processor}</td>
                <td>
                  <b>{merchant.volume}</b>
                </td>
                <td>{merchant.approval}</td>
                <td className={Number(merchant.chargebacks.replace("%", "")) > 1 ? "negative" : "positive"}>
                  {merchant.chargebacks}
                </td>
                <td>{merchant.revenue}</td>
                <td>{merchant.margin}</td>
                <td>{merchant.reserve}</td>
                <td>{merchant.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer>
        Showing 1–{rows.length} of 538 merchants{" "}
        <span>
          <button disabled>‹</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>›</button>
        </span>
      </footer>
    </section>
  );
}

function MerchantDrawer({
  merchant,
  onClose,
  onProfile
}: {
  merchant: Merchant;
  onClose: () => void;
  onProfile: () => void;
}) {
  return (
    <aside className="admin-drawer">
      <header>
        <span className="admin-name">
          <i>{merchant.name[0]}</i>
          <span>
            <b>{merchant.name}</b>
            <small>{merchant.id}</small>
          </span>
        </span>
        <button onClick={onClose}>×</button>
      </header>
      <nav>
        <button className="active">Overview</button>
        <button>Risk</button>
        <button>Financials</button>
        <button>Activity</button>
      </nav>
      <AdminTrendChart title="Volume trend" />
      <section>
        <h3>Key statistics</h3>
        <dl>
          <div>
            <dt>Approval rate</dt>
            <dd>{merchant.approval}</dd>
          </div>
          <div>
            <dt>Gross revenue</dt>
            <dd>{merchant.revenue}</dd>
          </div>
          <div>
            <dt>Chargeback ratio</dt>
            <dd>{merchant.chargebacks}</dd>
          </div>
          <div>
            <dt>Reserve</dt>
            <dd>{merchant.reserve}</dd>
          </div>
        </dl>
      </section>
      <section>
        <h3>Account</h3>
        <dl>
          <div>
            <dt>Processor</dt>
            <dd>{merchant.processor}</dd>
          </div>
          <div>
            <dt>Owner</dt>
            <dd>{merchant.owner}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <Status>{merchant.status}</Status>
            </dd>
          </div>
        </dl>
      </section>
      <footer>
        <button className="admin-primary" onClick={onProfile}>
          View full profile
        </button>
        <button>Adjust rates</button>
      </footer>
    </aside>
  );
}

function AdminOverview({ setTab }: { setTab: (tab: AdminTab) => void }) {
  return (
    <>
      <section className="admin-overview-grid">
        <AdminTrendChart />
        <article className="admin-card admin-ranking">
          <header>
            <div>
              <h2>Chargeback ratio by top merchants</h2>
              <p>Last 30 days</p>
            </div>
          </header>
          {merchants.slice(0, 5).map((merchant) => (
            <div key={merchant.id}>
              <span>{merchant.name}</span>
              <i>
                <b style={{ width: `${Math.min(100, Number(merchant.chargebacks.replace("%", "")) * 58)}%` }} />
              </i>
              <strong className={Number(merchant.chargebacks.replace("%", "")) > 1 ? "negative" : "positive"}>
                {merchant.chargebacks}
              </strong>
            </div>
          ))}
        </article>
      </section>
      <section className="admin-three-grid">
        <article className="admin-card admin-compact-table">
          <header>
            <h2>Top merchants</h2>
            <button onClick={() => setTab("Merchants")}>View all</button>
          </header>
          {merchants.slice(0, 5).map((merchant) => (
            <button key={merchant.id} onClick={() => setTab("Merchants")}>
              <span>{merchant.name}</span>
              <b>{merchant.volume}</b>
              <small>{merchant.approval}</small>
              <Status>{merchant.status}</Status>
            </button>
          ))}
        </article>
        <article className="admin-card admin-feed">
          <header>
            <h2>Recent activity / alerts</h2>
          </header>
          {[
            ["Rate change applied for Bitunix", "Interchange updated to 1.85% + $0.20", "10m"],
            ["Crescent Retail application approved", "Underwritten by Sarah Johnson", "28m"],
            ["High chargeback ratio: Vertex Games", "Exceeded the 1.50% threshold", "1h"],
            ["Payout batch completed", "$2.74M released successfully", "2h"]
          ].map(([title, detail, time]) => (
            <div key={title}>
              <i />
              <span>
                <b>{title}</b>
                <small>{detail}</small>
              </span>
              <time>{time}</time>
            </div>
          ))}
        </article>
        <article className="admin-card admin-queue">
          <header>
            <h2>Action queue</h2>
          </header>
          {[
            ["Review Bitunix application", "High"],
            ["Update reserve for Crescent Retail", "Medium"],
            ["Investigate high chargeback ratio", "High"],
            ["Approve payout batch", "Medium"]
          ].map(([task, priority]) => (
            <label key={task}>
              <input type="checkbox" />
              <span>{task}</span>
              <Status>{priority}</Status>
            </label>
          ))}
        </article>
      </section>
    </>
  );
}

function ApplicationsView() {
  const [selected, setSelected] = useState(0);
  const application = applications[selected];
  return (
    <>
      <section className="admin-card admin-table-card">
        <div className="admin-table-toolbar">
          <label>
            <SearchIcon />
            <input placeholder="Search merchant applications" />
          </label>
          <select>
            <option>All stages</option>
          </select>
          <select>
            <option>All owners</option>
          </select>
          <button>Export</button>
        </div>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Vertical</th>
                <th>Current stage</th>
                <th>Risk score</th>
                <th>Required docs</th>
                <th>Expected volume</th>
                <th>Owner</th>
                <th>Next action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((row, index) => (
                <tr
                  className={selected === index ? "selected" : undefined}
                  key={row[0]}
                  onClick={() => setSelected(index)}
                >
                  <td>
                    <b>{row[1]}</b>
                    <small>{row[0]}</small>
                  </td>
                  <td>{row[2]}</td>
                  <td>
                    <Status>{row[3]}</Status>
                  </td>
                  <td>
                    <b className={Number(row[4]) > 70 ? "negative" : "positive"}>{row[4]}</b>
                  </td>
                  <td>{row[5]}</td>
                  <td>{row[6]}</td>
                  <td>{row[7]}</td>
                  <td>
                    <button>{row[8]}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="admin-card admin-application-detail">
        <header>
          <span className="admin-name">
            <i>{application[1][0]}</i>
            <span>
              <h2>{application[1]}</h2>
              <small>
                {application[0]} · {application[2]}
              </small>
            </span>
          </span>
          <Status>{application[3]}</Status>
        </header>
        <div className="admin-stage-line">
          {["Submitted", "Compliance", "Underwriting", "Pricing", "Approved", "Live"].map((stage, index) => (
            <span className={index < 2 ? "complete" : index === 2 ? "current" : undefined} key={stage}>
              <i>{index < 2 ? "✓" : index + 1}</i>
              <small>{stage}</small>
            </span>
          ))}
        </div>
        <div className="admin-detail-grid">
          <section>
            <h3>Uploaded documents</h3>
            <p>✓ Articles of Incorporation.pdf</p>
            <p>✓ EIN Confirmation.pdf</p>
            <p>✓ Bank Statement (May).pdf</p>
            <p className="negative">Missing: Processor history</p>
          </section>
          <section>
            <h3>Risk flags</h3>
            <p className="negative">High chargeback risk for similar merchants</p>
            <p className="negative">Short business operating history</p>
            <p>
              Risk score <b>{application[4]} / 100</b>
            </p>
          </section>
          <section>
            <h3>Recommended pricing</h3>
            <dl>
              <div>
                <dt>Discount rate</dt>
                <dd>2.45%</dd>
              </div>
              <div>
                <dt>Reserve hold</dt>
                <dd>10%</dd>
              </div>
              <div>
                <dt>Reserve period</dt>
                <dd>120 days</dd>
              </div>
            </dl>
            <footer>
              <button className="admin-primary">Approve with conditions</button>
              <button>Request more info</button>
            </footer>
          </section>
        </div>
      </section>
    </>
  );
}

function PartnersView() {
  const [selected, setSelected] = useState(0);
  const partner = partners[selected];
  return (
    <section className="admin-split-view">
      <article className="admin-card admin-table-card">
        <div className="admin-table-toolbar">
          <label>
            <SearchIcon />
            <input placeholder="Search partners" />
          </label>
          <select>
            <option>All statuses</option>
          </select>
          <select>
            <option>All campaigns</option>
          </select>
          <button>Export</button>
        </div>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Partner</th>
                <th>Status</th>
                <th>Referred</th>
                <th>Active</th>
                <th>Volume</th>
                <th>Commission owed</th>
                <th>Approval</th>
                <th>Chargebacks</th>
                <th>Campaign</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((row, index) => (
                <tr
                  className={index === selected ? "selected" : undefined}
                  key={row[0]}
                  onClick={() => setSelected(index)}
                >
                  <td>
                    <b>{row[1]}</b>
                    <small>{row[0]}</small>
                  </td>
                  <td>
                    <Status>{row[2]}</Status>
                  </td>
                  {row.slice(3).map((cell, cellIndex) => (
                    <td
                      className={cellIndex === 5 && Number(cell.replace("%", "")) > 1 ? "negative" : undefined}
                      key={`${row[0]}-${cellIndex}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
      <aside className="admin-card admin-side-profile">
        <header>
          <span className="admin-name">
            <i>{partner[1][0]}</i>
            <span>
              <h2>{partner[1]}</h2>
              <small>{partner[0]}</small>
            </span>
          </span>
          <Status>{partner[2]}</Status>
        </header>
        <AdminTrendChart title="Partner-driven volume" />
        <section>
          <h3>Commission breakdown</h3>
          <dl>
            <div>
              <dt>Base commission</dt>
              <dd>$152,430.00</dd>
            </div>
            <div>
              <dt>Volume bonus</dt>
              <dd>$24,180.50</dd>
            </div>
            <div>
              <dt>Performance bonus</dt>
              <dd>$8,635.30</dd>
            </div>
            <div>
              <dt>Total owed</dt>
              <dd>$184,145.80</dd>
            </div>
          </dl>
        </section>
        <section>
          <h3>Top referred merchants</h3>
          {merchants.slice(0, 4).map((merchant) => (
            <p key={merchant.id}>
              <span>{merchant.name}</span>
              <b>{merchant.volume}</b>
            </p>
          ))}
        </section>
        <footer>
          <button className="admin-primary">View partner portal</button>
          <button>Adjust terms</button>
        </footer>
      </aside>
    </section>
  );
}

function RiskView() {
  return (
    <>
      <section className="admin-card admin-table-card">
        <header>
          <div>
            <h2>Merchant risk overview</h2>
            <p>Live exposure and recommended action by merchant.</p>
          </div>
        </header>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Volume</th>
                <th>Chargebacks</th>
                <th>Chargeback ratio</th>
                <th>Refund rate</th>
                <th>Fraud score</th>
                <th>Reserve</th>
                <th>Risk tier</th>
                <th>Exposure</th>
                <th>Action needed</th>
              </tr>
            </thead>
            <tbody>
              {merchants.map((merchant, index) => (
                <tr key={merchant.id}>
                  <td>
                    <b>{merchant.name}</b>
                  </td>
                  <td>{merchant.volume}</td>
                  <td>{["$106.3K", "$23.7K", "$11.2K", "$13.6K", "$6.87K", "$8.45K", "$2.11K", "$1.23K"][index]}</td>
                  <td className={Number(merchant.chargebacks.replace("%", "")) > 1 ? "negative" : "positive"}>
                    {merchant.chargebacks}
                  </td>
                  <td>{["2.73%", "1.26%", "0.82%", "1.10%", "0.55%", "1.35%", "0.42%", "0.31%"][index]}</td>
                  <td>{[92, 68, 52, 61, 33, 64, 25, 18][index]}</td>
                  <td>{merchant.reserve}</td>
                  <td>
                    <Status>{index === 0 ? "Critical" : index < 4 ? "High" : "Low"}</Status>
                  </td>
                  <td className="negative">
                    {["$186.2K", "$94.4K", "$45.8K", "$61.7K", "$12.3K", "$34.9K", "$6.1K", "$3.4K"][index]}
                  </td>
                  <td>{index % 3 === 0 ? "Increase reserve" : index < 6 ? "Monitor closely" : "None"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="admin-overview-grid">
        <AdminTrendChart title="Chargeback ratio over time" />
        <article className="admin-card admin-feed">
          <header>
            <h2>Risk & fraud alerts</h2>
          </header>
          {[
            ["Threshold breached: Bitunix", "Chargeback ratio exceeds 1.50%", "Critical"],
            ["Suspicious activity: Crescent Retail", "Unusual cross-border pattern detected", "High"],
            ["Rapid refund spike: Lumen Digital", "Refund rate increased 145%", "High"],
            ["Reserve level increased", "Northwind Coffee Co. moved to 7.5%", "Info"]
          ].map(([title, detail, level]) => (
            <div key={title}>
              <AlertTriangleIcon />
              <span>
                <b>{title}</b>
                <small>{detail}</small>
              </span>
              <Status>{level}</Status>
            </div>
          ))}
        </article>
      </section>
    </>
  );
}

function PricingView() {
  const [volume, setVolume] = useState("10000000");
  const [approval, setApproval] = useState("92");
  const profit = Number(volume || 0) * 0.00644 * (Number(approval || 0) / 92);
  return (
    <>
      <section className="admin-card admin-table-card">
        <header>
          <div>
            <h2>Pricing management</h2>
            <p>Merchant rate plans and unit economics.</p>
          </div>
        </header>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Processor</th>
                <th>Rate plan</th>
                <th>Basis points</th>
                <th>Fixed fee</th>
                <th>Reserve</th>
                <th>Chargeback fee</th>
                <th>Monthly volume</th>
                <th>Monthly profit</th>
              </tr>
            </thead>
            <tbody>
              {merchants.slice(0, 6).map((merchant, index) => (
                <tr key={merchant.id}>
                  <td>
                    <b>{merchant.name}</b>
                  </td>
                  <td>{merchant.processor}</td>
                  <td>{index ? "Standard Plus" : "Custom Pro"}</td>
                  <td>{[125, 150, 175, 199, 110, 140][index]}</td>
                  <td>$0.{[25, 30, 30, 35, 25, 30][index]}</td>
                  <td>{merchant.reserve}</td>
                  <td>$25.00</td>
                  <td>{merchant.volume}</td>
                  <td>{["$62,912", "$16,748", "$8,126", "$4,102", "$25,804", "$6,422"][index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="admin-two-grid">
        <article className="admin-card admin-pricing-form">
          <header>
            <h2>Configure pricing · Bitunix</h2>
            <Status>Active</Status>
          </header>
          <div className="admin-detail-grid">
            <label>
              Markup (bps)
              <input defaultValue="25" />
            </label>
            <label>
              Reserve %<input defaultValue="1.00" />
            </label>
            <label>
              Payout delay
              <input defaultValue="2 days" />
            </label>
            <label>
              Settlement threshold
              <input defaultValue="$5,000" />
            </label>
          </div>
          <table>
            <thead>
              <tr>
                <th>Tier</th>
                <th>Volume range</th>
                <th>Basis points</th>
                <th>Fixed fee</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tier 1</td>
                <td>$0 – $250,000</td>
                <td>135</td>
                <td>$0.30</td>
              </tr>
              <tr>
                <td>Tier 2</td>
                <td>$250,000 – $1,000,000</td>
                <td>125</td>
                <td>$0.25</td>
              </tr>
              <tr>
                <td>Tier 3</td>
                <td>$1,000,000+</td>
                <td>110</td>
                <td>$0.20</td>
              </tr>
            </tbody>
          </table>
          <footer>
            <button>Clone rate plan</button>
            <button className="admin-primary">Save pricing</button>
          </footer>
        </article>
        <article className="admin-card admin-simulation">
          <header>
            <h2>Pricing simulation</h2>
            <p>Estimate economics from expected volume and approval.</p>
          </header>
          <div>
            <label>
              Monthly volume
              <input value={volume} onChange={(event) => setVolume(event.target.value)} />
            </label>
            <label>
              Approval rate
              <input value={approval} onChange={(event) => setApproval(event.target.value)} />
            </label>
          </div>
          <section>
            <span>
              Estimated merchant cost
              <strong>${(profit * 1.75).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
            </span>
            <span>
              Estimated Acru profit<strong>${profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
            </span>
            <span>
              Net margin<strong>0.644%</strong>
            </span>
          </section>
        </article>
      </section>
    </>
  );
}

function PayoutsView() {
  const [partnerMode, setPartnerMode] = useState(false);
  const [approved, setApproved] = useState(false);
  return (
    <section className="admin-payout-layout">
      <article className="admin-card admin-table-card">
        <header>
          <div className="admin-tabs">
            <button className={!partnerMode ? "active" : undefined} onClick={() => setPartnerMode(false)}>
              Merchant settlements
            </button>
            <button className={partnerMode ? "active" : undefined} onClick={() => setPartnerMode(true)}>
              Partner commissions
            </button>
          </div>
        </header>
        <div className="admin-table-toolbar">
          <select>
            <option>All statuses</option>
          </select>
          <label>
            <SearchIcon />
            <input placeholder={partnerMode ? "Search partners" : "Search merchants"} />
          </label>
        </div>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>{partnerMode ? "Partner" : "Merchant"}</th>
                <th>Settlement amount</th>
                <th>Net volume</th>
                <th>Reserve holdback</th>
                <th>Release date</th>
                <th>Method</th>
                <th>Status</th>
                <th>Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {payoutRows.map((row) => (
                <tr key={row[7]}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  {row.map((cell, index) => (
                    <td key={`${row[7]}-${index}`}>
                      {index === 6 ? <Status>{approved ? "Approved" : cell}</Status> : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
      <aside className="admin-card admin-batch">
        <h2>Payout batch summary</h2>
        <dl>
          <div>
            <dt>Batch date</dt>
            <dd>Aug 28, 2026</dd>
          </div>
          <div>
            <dt>Total settlements</dt>
            <dd>$2,943,520.00</dd>
          </div>
          <div>
            <dt>Total commissions</dt>
            <dd>$284,760.00</dd>
          </div>
          <div>
            <dt>Reserve holdback</dt>
            <dd>$645,656.00</dd>
          </div>
          <div>
            <dt>Selected records</dt>
            <dd>32</dd>
          </div>
        </dl>
        <button className="admin-primary" onClick={() => setApproved(true)}>
          {approved ? "Batch approved" : "Approve batch"}
        </button>
        <button>Export CSV</button>
        <button>Release funds</button>
      </aside>
    </section>
  );
}

function ReportsView() {
  return (
    <>
      <div className="admin-report-tabs">
        <button className="active">Volume</button>
        <button>Profitability</button>
        <button>Merchants</button>
        <button>Partners</button>
        <button>Risk</button>
        <span />
        <button>Export CSV</button>
        <button>Export PDF</button>
      </div>
      <section className="admin-overview-grid">
        <AdminTrendChart title="Performance trend" />
        <article className="admin-card admin-ranking">
          <header>
            <h2>Top profit drivers</h2>
          </header>
          {[
            ["Increase in approval rate", "$96.2K"],
            ["Growth in Bitunix volume", "$64.8K"],
            ["Lower chargeback rate", "$41.3K"],
            ["Processor cost optimization", "$28.7K"],
            ["Partner mix improvement", "$19.6K"]
          ].map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong className="positive">↑ {value}</strong>
            </div>
          ))}
        </article>
      </section>
      <section className="admin-card admin-table-card">
        <header>
          <div>
            <h2>Profitability by merchant</h2>
            <p>Revenue, costs, losses, and net margin.</p>
          </div>
        </header>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Volume</th>
                <th>Gross revenue</th>
                <th>Processor cost</th>
                <th>Partner commission</th>
                <th>Chargeback losses</th>
                <th>Net revenue</th>
                <th>Margin</th>
              </tr>
            </thead>
            <tbody>
              {merchants.slice(0, 7).map((merchant, index) => (
                <tr key={merchant.id}>
                  <td>
                    <b>{merchant.name}</b>
                  </td>
                  <td>{merchant.volume}</td>
                  <td>{merchant.revenue}</td>
                  <td>{["$212.7K", "$92.3K", "$64.8K", "$41.9K", "$24.9K", "$18.7K", "$8.4K"][index]}</td>
                  <td>{["$143.7K", "$60.4K", "$42.1K", "$27.6K", "$16.0K", "$12.1K", "$4.2K"][index]}</td>
                  <td>{["$32.4K", "$15.6K", "$11.2K", "$7.3K", "$4.1K", "$3.2K", "$1.8K"][index]}</td>
                  <td>
                    <b>{["$295.5K", "$120.8K", "$77.3K", "$56.6K", "$33.7K", "$24.6K", "$11.2K"][index]}</b>
                  </td>
                  <td>{["3.07%", "2.91%", "2.76%", "2.86%", "3.02%", "2.98%", "2.72%"][index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function TeamView() {
  const [inviteOpen, setInviteOpen] = useState(false);
  return (
    <>
      <section className="admin-team-layout">
        <article className="admin-card admin-table-card">
          <header>
            <div>
              <h2>Team members</h2>
              <p>Roles, permissions, and access status.</p>
            </div>
            <button className="admin-primary" onClick={() => setInviteOpen(true)}>
              Invite user
            </button>
          </header>
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Permissions</th>
                  <th>Last active</th>
                  <th>Two-factor</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((row) => (
                  <tr key={row[3]}>
                    {row.map((cell, index) => (
                      <td key={`${row[3]}-${index}`}>
                        {index === 0 ? (
                          <span className="admin-name">
                            <i>
                              {cell
                                .split(" ")
                                .map((part) => part[0])
                                .join("")}
                            </i>
                            <b>{cell}</b>
                          </span>
                        ) : index === 1 ? (
                          <Status>{cell}</Status>
                        ) : index === 6 ? (
                          <span className="positive">✓ {cell}</span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
        <aside className="admin-card admin-feed">
          <header>
            <h2>Audit log</h2>
          </header>
          {[
            ["Rate change applied", "Bitunix interchange rate updated", "2m"],
            ["Application approved", "Crescent Retail approved", "18m"],
            ["Reserve updated", "Crescent Retail moved to 7.5%", "47m"],
            ["Payout released", "$231,410.28 released", "1h"],
            ["Risk flag cleared", "Vertex Games reviewed", "3h"]
          ].map(([title, detail, time]) => (
            <div key={title}>
              <i />
              <span>
                <b>{title}</b>
                <small>{detail}</small>
              </span>
              <time>{time}</time>
            </div>
          ))}
        </aside>
      </section>
      {inviteOpen ? (
        <div
          className="admin-modal"
          onMouseDown={(event) => event.currentTarget === event.target && setInviteOpen(false)}
        >
          <form
            className="admin-card"
            onSubmit={(event) => {
              event.preventDefault();
              setInviteOpen(false);
            }}
          >
            <header>
              <h2>Invite team member</h2>
              <button type="button" onClick={() => setInviteOpen(false)}>
                ×
              </button>
            </header>
            <label>
              Work email
              <input autoFocus type="email" placeholder="name@acru.com" required />
            </label>
            <label>
              Role
              <select>
                <option>Analyst</option>
                <option>Operations</option>
                <option>Risk</option>
                <option>Finance</option>
                <option>Admin</option>
              </select>
            </label>
            <footer>
              <button type="button" onClick={() => setInviteOpen(false)}>
                Cancel
              </button>
              <button className="admin-primary">Send invitation</button>
            </footer>
          </form>
        </div>
      ) : null}
    </>
  );
}

function SettingsView() {
  return (
    <section className="admin-settings-grid">
      <article className="admin-card">
        <h2>Workspace</h2>
        <p>Global defaults for the Acru operations workspace.</p>
        <label>
          Workspace name
          <input defaultValue="Acru Admin" />
        </label>
        <label>
          Reporting timezone
          <select defaultValue="America/New_York">
            <option>America/New_York</option>
            <option>UTC</option>
          </select>
        </label>
        <button className="admin-primary">Save workspace</button>
      </article>
      <article className="admin-card">
        <h2>Operational alerts</h2>
        <p>Choose which events create an action in the team queue.</p>
        {["High chargeback threshold", "Failed payout", "Application SLA breach", "Reserve exposure change"].map(
          (item) => (
            <label className="admin-toggle-row" key={item}>
              <span>{item}</span>
              <input type="checkbox" defaultChecked />
            </label>
          )
        )}
      </article>
      <article className="admin-card">
        <h2>Approval controls</h2>
        <p>Require a second administrator for sensitive actions.</p>
        {["Pricing overrides", "Reserve reductions", "Payout batches", "Merchant suspension"].map((item, index) => (
          <label className="admin-toggle-row" key={item}>
            <span>{item}</span>
            <input type="checkbox" defaultChecked={index < 3} />
          </label>
        ))}
      </article>
    </section>
  );
}

export function AdminPortalPage() {
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>("Overview");
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [merchantProfile, setMerchantProfile] = useState<Merchant | null>(null);
  const [globalQuery, setGlobalQuery] = useState("");
  const searchResults = useMemo(
    () =>
      globalQuery.trim()
        ? merchants.filter((merchant) => merchant.name.toLowerCase().includes(globalQuery.toLowerCase())).slice(0, 4)
        : [],
    [globalQuery]
  );
  const title = merchantProfile ? "Merchant profile" : tab;
  const descriptions: Record<AdminTab, string> = {
    Overview: "Monitor volume, portfolio health, and the work that needs attention now.",
    Merchants: "Manage every merchant, processor relationship, and account owner.",
    "Merchant applications": "Review underwriting progress, required documents, and risk decisions.",
    Partners: "Monitor referral partners, attributed volume, and commission exposure.",
    "Risk & chargebacks": "Track disputes, fraud signals, reserves, and loss exposure across the portfolio.",
    Pricing: "Configure rate plans and model merchant economics before applying changes.",
    Payouts: "Approve merchant settlements and partner commission batches.",
    Reports: "Analyze volume, profitability, merchant performance, partner mix, and risk.",
    Team: "Manage team roles, permissions, invitations, and the audit trail.",
    Settings: "Configure operational controls for the Acru admin workspace."
  };

  function logout() {
    window.localStorage.removeItem(ACRU_SESSION_KEY);
    router.push("/sign-in?portal=admin");
  }

  function navigate(next: AdminTab) {
    setTab(next);
    setMerchantProfile(null);
    setSelectedMerchant(null);
  }

  return (
    <main className="admin-portal">
      <header className="admin-topbar">
        <div className="admin-topbar-workspace">
          <button className="admin-brand" aria-label="Admin overview" onClick={() => navigate("Overview")}>
            <Image alt="Acru" height={32} priority src="/acru-logo.png" width={38} />
          </button>
          <span className="admin-workspace-divider" />
          <span className="admin-workspace-avatar" aria-hidden="true">
            A
          </span>
          <button className="admin-workspace-picker" type="button" aria-label="Switch workspace">
            <SelectIcon />
          </button>
        </div>
        <div className="admin-account-actions">
          <button className="admin-notifications" aria-label="Notifications">
            <NotificationIcon />
            <i>3</i>
          </button>
          <span className="admin-user">
            <i>EC</i>
            <span>
              <b>Ethan Carter</b>
              <small>Administrator</small>
            </span>
          </span>
        </div>
      </header>
      <aside className="admin-sidebar">
        <div className="admin-global-search">
          <SearchIcon />
          <input
            value={globalQuery}
            onChange={(event) => setGlobalQuery(event.target.value)}
            placeholder="Search"
            type="search"
          />
          <kbd>⌘ k</kbd>
          {searchResults.length ? (
            <div>
              {searchResults.map((merchant) => (
                <button
                  key={merchant.id}
                  onClick={() => {
                    setGlobalQuery("");
                    navigate("Merchants");
                    setSelectedMerchant(merchant);
                  }}
                >
                  <b>{merchant.name}</b>
                  <small>{merchant.id}</small>
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <nav>
          {adminNavigation.map(({ label, icon: NavIcon }) => (
            <button
              aria-current={tab === label && !merchantProfile ? "page" : undefined}
              className={tab === label && !merchantProfile ? "active" : undefined}
              key={label}
              onClick={() => navigate(label)}
              type="button"
            >
              <NavIcon />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-lower">
          <div className="admin-workspace">
            <span className="admin-workspace-avatar" aria-hidden="true">
              A
            </span>
            <span>
              <b>Admin Workspace</b>
              <small>Platform operations</small>
            </span>
            <SelectIcon />
          </div>
          <button className="admin-logout" onClick={logout} type="button">
            <ExitIcon />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
      <section className="admin-main">
        <div className="admin-title-row">
          <div>
            <h1>{title}</h1>
            <p>
              {merchantProfile
                ? `Detailed performance, pricing, risk, and account configuration for ${merchantProfile.name}.`
                : descriptions[tab]}
            </p>
          </div>
          <label className="admin-date">
            <ClockIcon />
            <select>
              <option>Jul 27 – Aug 25, 2026</option>
              <option>Last 7 days</option>
              <option>This quarter</option>
            </select>
          </label>
        </div>
        {merchantProfile ? (
          <>
            <button className="admin-back" onClick={() => setMerchantProfile(null)}>
              ← Back to merchants
            </button>
            <section className="admin-card admin-profile-hero">
              <span className="admin-name">
                <i>{merchantProfile.name[0]}</i>
                <span>
                  <h2>{merchantProfile.name}</h2>
                  <small>
                    {merchantProfile.id} · {merchantProfile.vertical}
                  </small>
                </span>
              </span>
              <dl>
                <div>
                  <dt>Processor</dt>
                  <dd>{merchantProfile.processor}</dd>
                </div>
                <div>
                  <dt>Account manager</dt>
                  <dd>{merchantProfile.owner}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <Status>{merchantProfile.status}</Status>
                  </dd>
                </div>
              </dl>
              <div>
                <button>Adjust rates</button>
                <button>Add note</button>
                <button className="danger">Suspend</button>
              </div>
            </section>
            <AdminMetricGrid
              metrics={[
                ["Volume (30 days)", merchantProfile.volume, "+12.4%"],
                ["Net revenue", merchantProfile.revenue, "+8.7%"],
                ["Approval rate", merchantProfile.approval, "+2.6pp"],
                ["Chargeback ratio", merchantProfile.chargebacks, "−0.10pp"],
                ["Reserve balance", "$132.7K", "12.5% rolling"],
                ["Average ticket", "$124.31", "+6.3%"]
              ]}
            />
            <section className="admin-overview-grid">
              <AdminTrendChart title="Volume & net revenue" />
              <AdminTrendChart title="Chargebacks & disputes" />
            </section>
            <section className="admin-profile-grid">
              {[
                [
                  "Pricing configuration",
                  "Visa / MC / Disc · 80 bps + $0.20\nACH · 25 bps + $0.10\nReserve hold · 12.5% rolling"
                ],
                ["Payout schedule", "Schedule · Daily\nCutoff · 5:00 PM ET\nFunding · Same day"],
                ["Bank accounts", "JPMorgan Chase · •••• 4242\nWells Fargo · •••• 7788"],
                [
                  "Compliance / KYC",
                  "Business verification · Verified\nAML screening · Clear\nSanctions screening · Clear"
                ],
                ["Recent settlements", "Aug 25 · $1,248,935.42\nAug 24 · $1,187,453.18\nAug 23 · $1,102,335.28"]
              ].map(([heading, copy]) => (
                <article className="admin-card" key={heading}>
                  <h3>{heading}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </section>
          </>
        ) : (
          <>
            <AdminMetricGrid metrics={adminMetrics[tab]} />
            {tab === "Overview" ? <AdminOverview setTab={navigate} /> : null}
            {tab === "Merchants" ? <MerchantTable onSelect={setSelectedMerchant} /> : null}
            {tab === "Merchant applications" ? <ApplicationsView /> : null}
            {tab === "Partners" ? <PartnersView /> : null}
            {tab === "Risk & chargebacks" ? <RiskView /> : null}
            {tab === "Pricing" ? <PricingView /> : null}
            {tab === "Payouts" ? <PayoutsView /> : null}
            {tab === "Reports" ? <ReportsView /> : null}
            {tab === "Team" ? <TeamView /> : null}
            {tab === "Settings" ? <SettingsView /> : null}
          </>
        )}
      </section>
      {selectedMerchant ? (
        <MerchantDrawer
          merchant={selectedMerchant}
          onClose={() => setSelectedMerchant(null)}
          onProfile={() => {
            setMerchantProfile(selectedMerchant);
            setSelectedMerchant(null);
          }}
        />
      ) : null}
    </main>
  );
}
