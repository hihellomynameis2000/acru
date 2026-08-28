"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDiagonalIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  BankIcon,
  ChartLineIcon,
  CheckCircleIcon,
  CheckIcon,
  CheckSmallIcon,
  ChevronDownIcon,
  ClockIcon,
  CreditCardIcon,
  ExportIcon,
  FileIcon,
  FilterIcon,
  GlobeIcon,
  LightbulbIcon,
  MoneyIcon,
  MinusIcon,
  PaymentCaptureIcon,
  PersonIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
  ShieldCheckMarkIcon,
  WalletIcon,
  XIcon
} from "@shopify/polaris-icons";
import { useEffect, useMemo, useRef, useState } from "react";

import { minorUnitsFromDecimal } from "@/components/data/money";
import { useListCollection } from "@/components/data/use-list-collection";
import { CollectionPageState } from "@/components/ui/collection-state";
import { useToast } from "@/components/ui/toast";
import { useDismissOnEscape } from "@/components/ui/use-dismiss-on-escape";
import { DateRangePopover, WalletCard, type DateRange } from "@/features/dashboard/components/dashboard-overview";
import {
  analyticsKpis,
  chartSeries,
  initialExports,
  methods,
  paymentFlowStages,
  regions,
  reportSnapshotAdapter,
  statementRows,
  withdrawals,
  type AssetKind,
  type ExportFormat,
  type Period,
  type Status
} from "@/features/reports/data/reports";

const paymentFlowIcons = {
  authorized: ShieldCheckMarkIcon,
  balance: WalletIcon,
  captured: PaymentCaptureIcon,
  customer: PersonIcon,
  settled: BankIcon
};

function downloadMock(name: string, content: string) {
  const href = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = href;
  link.download = name;
  link.click();
  URL.revokeObjectURL(href);
}

function ScopeIcon({ scope }: { scope: AssetKind | "All balances" }) {
  if (scope === "Fiat") return <BankIcon />;
  if (scope === "Crypto") return <WalletIcon />;
  if (scope === "Platform credits") return <CreditCardIcon />;
  return <MoneyIcon />;
}

function ReportHeader({ title, subtitle, children }: { title: string; subtitle: string; children?: React.ReactNode }) {
  return (
    <header className="report-header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children ? <div className="report-header-actions">{children}</div> : null}
    </header>
  );
}

function Button({
  children,
  primary,
  onClick
}: {
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
}) {
  return (
    <button className="report-button" data-primary={primary ? "true" : undefined} onClick={onClick} type="button">
      {children}
    </button>
  );
}

function StatusPill({ status }: { status: Status }) {
  const complete = status === "Available" || status === "Completed";
  const Icon = complete ? CheckSmallIcon : ClockIcon;
  return (
    <span className="report-status" data-status={status.toLowerCase()}>
      <span className="report-status-icon">
        <Icon />
      </span>
      {status}
    </span>
  );
}

function ExportFormatIcon({ format }: { format: ExportFormat }) {
  return (
    <span className="export-format-icon" data-format={format.toLowerCase()} aria-label={`${format} file`}>
      <Image src={`/file-formats/${format.toLowerCase()}.png`} alt="" aria-hidden="true" width={40} height={40} />
    </span>
  );
}

function EmptyTable({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <div className="report-empty">
      <span>
        <FileIcon />
      </span>
      <h3>No exports found</h3>
      <p>
        {query ? `Nothing matches “${query}”. Try a different search.` : "Your generated exports will appear here."}
      </p>
      <button onClick={onReset} type="button">
        Clear filters
      </button>
    </div>
  );
}

function ReportDateFilter({ value, onChange }: { value: Period; onChange: (period: Period) => void }) {
  const filterRef = useRef<HTMLDivElement>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [customDates, setCustomDates] = useState<DateRange>({ start: "2026-07-11", end: "2026-08-10" });

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!filterRef.current?.contains(event.target as Node)) setCustomOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="date-filter-wrap report-date-filter" ref={filterRef}>
      <div className="range-control" aria-label="Reporting period">
        {(["7D", "30D", "3M", "1Y", "Custom"] as Period[]).map((item) => (
          <button
            className={value === item ? "selected" : undefined}
            key={item}
            onClick={() => {
              onChange(item);
              if (item === "Custom") setCustomOpen((open) => !open);
              else setCustomOpen(false);
            }}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
      {customOpen ? (
        <DateRangePopover
          enabled={value === "Custom"}
          initialRange={customDates}
          onApply={(nextRange) => {
            setCustomDates(nextRange);
            onChange("Custom");
            setCustomOpen(false);
          }}
          onCancel={() => setCustomOpen(false)}
          onClear={() => {
            onChange("30D");
            setCustomOpen(false);
          }}
          presetEndOffset={0}
          subtitle="Select a reporting period"
          title="Custom range"
        />
      ) : null}
    </div>
  );
}

function Chart({ period, compare, metric }: { period: Period; compare: boolean; metric: string }) {
  const values = chartSeries[period];
  const plotRef = useRef<HTMLDivElement>(null);
  const activePointerRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number; index: number } | null>(null);
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 640},${170 - value * 1.55}`).join(" ");
  const area = `M 0 180 L ${points.replaceAll(" ", " L ")} L 640 180 Z`;
  const line = `M ${points.replaceAll(" ", " L ")}`;
  const compareValues = values.map((value, index) => Math.max(15, value - 9 + (index % 3) * 3));
  const comparePoints = compareValues
    .map((value, index) => `${(index / (compareValues.length - 1)) * 640},${170 - value * 1.55}`)
    .join(" ");

  const labels = [
    "Jul 23",
    "Jul 25",
    "Jul 28",
    "Jul 30",
    "Aug 2",
    "Aug 4",
    "Aug 6",
    "Aug 9",
    "Aug 11",
    "Aug 13",
    "Aug 15",
    "Aug 18",
    "Aug 20"
  ];

  const showPoint = (index: number) => {
    const nextIndex = Math.max(0, Math.min(values.length - 1, index));
    const value = values[nextIndex];
    setTooltip({
      x: (nextIndex / (values.length - 1)) * 640,
      y: 170 - value * 1.55,
      value,
      index: nextIndex
    });
  };

  const updateTooltip = (clientX: number) => {
    const bounds = plotRef.current?.getBoundingClientRect();
    if (!bounds || bounds.width === 0) return;

    const ratio = Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width));
    const position = ratio * (values.length - 1);
    const lowerIndex = Math.floor(position);
    const upperIndex = Math.ceil(position);
    const interpolation = position - lowerIndex;
    const value = values[lowerIndex] + (values[upperIndex] - values[lowerIndex]) * interpolation;
    const nextTooltip = {
      x: ratio * 640,
      y: 170 - value * 1.55,
      value,
      index: Math.round(position)
    };

    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => setTooltip(nextTooltip));
  };

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    },
    []
  );

  const formattedValue =
    metric === "Payments"
      ? `${Math.round((tooltip?.value ?? 0) * 285).toLocaleString()} payments`
      : `$${Math.round((tooltip?.value ?? 0) * 8.4).toLocaleString()}K`;

  return (
    <div className="report-chart" aria-label={`${metric} performance chart`}>
      <div className="report-chart-y">
        <span>$800K</span>
        <span>$600K</span>
        <span>$400K</span>
        <span>$200K</span>
        <span>$0</span>
      </div>
      <div className="report-chart-plot" ref={plotRef}>
        <svg
          aria-label={`Interactive ${metric} chart. Drag or move across the chart to inspect values.`}
          onBlur={() => setTooltip(null)}
          onFocus={() => showPoint(tooltip?.index ?? values.length - 1)}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              showPoint((tooltip?.index ?? values.length - 1) + (event.key === "ArrowLeft" ? -1 : 1));
            } else if (event.key === "Home") {
              event.preventDefault();
              showPoint(0);
            } else if (event.key === "End") {
              event.preventDefault();
              showPoint(values.length - 1);
            } else if (event.key === "Escape") {
              setTooltip(null);
            }
          }}
          onPointerCancel={(event) => {
            if (activePointerRef.current === event.pointerId) activePointerRef.current = null;
          }}
          onPointerDown={(event) => {
            activePointerRef.current = event.pointerId;
            event.currentTarget.setPointerCapture(event.pointerId);
            updateTooltip(event.clientX);
          }}
          onPointerLeave={() => {
            if (activePointerRef.current === null) setTooltip(null);
          }}
          onPointerMove={(event) => updateTooltip(event.clientX)}
          onPointerUp={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId))
              event.currentTarget.releasePointerCapture(event.pointerId);
            activePointerRef.current = null;
          }}
          role="img"
          tabIndex={0}
          viewBox="0 0 640 180"
        >
          <defs>
            <linearGradient id="analyticsArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#4aa6da" stopOpacity="0.34" />
              <stop offset="1" stopColor="#4aa6da" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[18, 56, 94, 132, 170].map((y) => (
            <line key={y} x1="0" x2="640" y1={y} y2={y} className="report-chart-grid" />
          ))}
          {compare ? <path d={`M ${comparePoints.replaceAll(" ", " L ")}`} className="report-chart-compare" /> : null}
          <path d={area} fill="url(#analyticsArea)" />
          <path d={line} className="report-chart-line" />
          {values.map((value, index) => (
            <circle
              key={`${period}-${index}`}
              cx={(index / (values.length - 1)) * 640}
              cy={170 - value * 1.55}
              r="3"
              className="report-chart-point"
            />
          ))}
          {tooltip ? <line className="report-chart-guide" x1={tooltip.x} x2={tooltip.x} y1="12" y2="176" /> : null}
          {tooltip ? <circle className="report-chart-active-point" cx={tooltip.x} cy={tooltip.y} r="5" /> : null}
        </svg>
        {tooltip ? (
          <div
            aria-live="polite"
            className="report-chart-tooltip"
            style={{
              left: `${Math.max(7, Math.min(93, (tooltip.x / 640) * 100))}%`,
              top: `${(tooltip.y / 180) * 100}%`
            }}
          >
            <strong>{formattedValue}</strong>
            <span>{labels[Math.round((tooltip.index / Math.max(1, values.length - 1)) * (labels.length - 1))]}</span>
          </div>
        ) : null}
      </div>
      <div className="report-chart-x">
        <span>Jul 23</span>
        <span>Jul 30</span>
        <span>Aug 6</span>
        <span>Aug 13</span>
        <span>Aug 20</span>
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  const reportResource = useListCollection(reportSnapshotAdapter);
  const [period, setPeriod] = useState<Period>("30D");
  const [compare, setCompare] = useState(false);
  const [metric, setMetric] = useState("Gross volume");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [rail, setRail] = useState("All payments");
  const filteredMethods = methods.filter(
    (item) =>
      rail === "All payments" ||
      (rail === "Cards" && ["Visa", "Mastercard", "Apple Pay"].includes(item.name)) ||
      (rail === "Bank" && item.name === "ACH") ||
      (rail === "USDC" && item.name === "USDC")
  );
  if (reportResource.status !== "ready") {
    return (
      <CollectionPageState
        description="Understand your payment performance, customers, and money movement."
        error={reportResource.error}
        onRetry={reportResource.retry}
        status={reportResource.status}
        title="Analytics"
      />
    );
  }
  return (
    <section className="report-workspace">
      <ReportHeader title="Analytics" subtitle="Understand your payment performance, customers, and money movement.">
        <ReportDateFilter onChange={setPeriod} value={period} />
        <Button onClick={() => setCompare((value) => !value)}>
          <RefreshIcon /> {compare ? "Comparing" : "Compare"}
        </Button>
        <div className="report-filter-wrap">
          <Button onClick={() => setFiltersOpen((value) => !value)}>
            <FilterIcon /> Filters
          </Button>
          {filtersOpen ? (
            <div className="report-popover">
              <small>Payment rails</small>
              {["All payments", "Cards", "Bank", "USDC"].map((item) => (
                <button
                  aria-pressed={rail === item}
                  key={item}
                  type="button"
                  onClick={() => {
                    setRail(item);
                    setFiltersOpen(false);
                  }}
                >
                  {rail === item ? <CheckIcon /> : <span />} {item}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <Button
          onClick={() => downloadMock("acru-analytics.csv", "metric,value\nGross volume,8420000\nNet revenue,6210000")}
        >
          <ExportIcon /> Export
        </Button>
      </ReportHeader>
      <div className="report-kpis">
        {analyticsKpis.map(([label, value, change, detail]) => (
          <article key={label}>
            <div>
              <span>{label}</span>
              <ChartLineIcon />
            </div>
            <strong>{value}</strong>
            <footer>
              <b>
                <ArrowDiagonalIcon /> {change}
              </b>
              <small>{detail}</small>
            </footer>
          </article>
        ))}
      </div>
      <div className="report-analytics-grid">
        <article className="report-panel report-performance">
          <header className="report-panel-head">
            <div>
              <h2>Payment performance</h2>
              <p>Processed volume and successful payments over time.</p>
            </div>
            <label>
              <select onChange={(event) => setMetric(event.target.value)} value={metric}>
                <option>Gross volume</option>
                <option>Net revenue</option>
                <option>Payments</option>
              </select>
              <ChevronDownIcon />
            </label>
          </header>
          <div className="report-chart-total">
            <strong>$8,420,588</strong>
            <span>
              <ArrowUpIcon /> 18.6%
            </span>
            <small>vs. prior period</small>
          </div>
          <Chart compare={compare} metric={metric} period={period} />
        </article>
        <article className="report-panel report-approval">
          <header className="report-panel-head">
            <div>
              <h2>Approval performance</h2>
              <p>Authorization outcomes</p>
            </div>
            <span className="report-health">
              <span /> Healthy
            </span>
          </header>
          <div className="report-ring" style={{ "--value": "98.7" } as React.CSSProperties}>
            <div>
              <strong>98.7%</strong>
              <span>approved</span>
            </div>
          </div>
          <div className="report-mini-stats">
            <div>
              <span>Approved</span>
              <strong>24,491</strong>
            </div>
            <div>
              <span>Declined</span>
              <strong>286</strong>
            </div>
            <div>
              <span>Authentication</span>
              <strong>91</strong>
            </div>
            <div>
              <span>Errors</span>
              <strong>43</strong>
            </div>
          </div>
          <div className="report-reasons">
            <h3>Top decline reasons</h3>
            <div>
              <span>Insufficient funds · 120</span>
              <b>
                42%
                <span className="report-decline-trend is-good">
                  <ArrowDownIcon /> 3%
                </span>
              </b>
            </div>
            <div>
              <span>Do not honor · 89</span>
              <b>
                31%
                <span className="report-decline-trend is-bad">
                  <ArrowUpIcon /> 1%
                </span>
              </b>
            </div>
            <div>
              <span>Authentication required · 49</span>
              <b>
                17%
                <span className="report-decline-trend is-good">
                  <ArrowDownIcon /> 2%
                </span>
              </b>
            </div>
            <div>
              <span>Invalid details · 17</span>
              <b>
                6%
                <span className="report-decline-trend is-steady" aria-label="No change">
                  <MinusIcon />
                </span>
              </b>
            </div>
            <div>
              <span>Processor declined · 11</span>
              <b>
                4%
                <span className="report-decline-trend is-good">
                  <ArrowDownIcon /> 1%
                </span>
              </b>
            </div>
          </div>
          <Link className="report-panel-link" href="/reports/acceptance">
            View payment performance <ArrowDiagonalIcon />
          </Link>
        </article>
      </div>
      <div className="report-three-grid">
        <article className="report-panel report-ranked">
          <header className="report-panel-head">
            <div>
              <h2>Payment methods</h2>
              <p>Volume and approval by payment rail</p>
            </div>
          </header>
          {filteredMethods.map((item) => (
            <div className="report-ranked-row report-payment-row" key={item.name}>
              <span className={`payment-rail-logo is-${item.logoClass}`}>
                <Image src={item.logo} alt={`${item.name} logo`} width={48} height={30} />
              </span>
              <span className="report-ranked-copy report-payment-copy">
                <strong>{item.name}</strong>
                <small>
                  {item.share}% of volume · {item.approval}
                </small>
              </span>
              <div className="report-ranked-value">
                <b>{item.amount}</b>
                <em style={{ width: `${item.share * 1.7}%`, background: item.tone }} />
              </div>
            </div>
          ))}
        </article>
        <article className="report-panel report-ranked">
          <header className="report-panel-head">
            <div>
              <h2>Where customers are paying</h2>
              <p>Payment volume by customer location</p>
            </div>
            <GlobeIcon />
          </header>
          {regions.map((item, index) => (
            <div className="report-ranked-row" key={item.name}>
              <i className="report-rank-number">{index + 1}</i>
              <span className="report-ranked-copy">
                <strong>{item.name}</strong>
                <small>{item.share}% of total</small>
              </span>
              <b>{item.amount}</b>
            </div>
          ))}
        </article>
        <article className="report-panel report-risk">
          <header className="report-panel-head">
            <div>
              <h2>Risk & losses</h2>
              <p>Refund and dispute exposure</p>
            </div>
            <ShieldCheckMarkIcon />
          </header>
          <div className="report-risk-hero">
            <span>Loss rate</span>
            <strong>0.31%</strong>
            <small>
              <ArrowDownIcon /> 0.08 pts
            </small>
          </div>
          <div className="report-risk-split">
            <div>
              <span>Refunds · 421</span>
              <strong>$84,230</strong>
              <small>1.00% · avg. $200.07</small>
              <Link className="report-panel-link" href="/payments/refunds">
                View refunds <ArrowDiagonalIcon />
              </Link>
            </div>
            <div>
              <span>Disputes · 12 open</span>
              <strong>$18,420</strong>
              <small>0.14% · 3 require action</small>
              <Link className="report-panel-link" href="/payments/disputes">
                View disputes <ArrowDiagonalIcon />
              </Link>
            </div>
          </div>
          <div className="report-risk-note">
            <CheckCircleIcon />
            <span>
              <b>Within target</b>Losses remain below your 0.5% threshold.
            </span>
          </div>
        </article>
      </div>
      <div className="report-bottom-grid">
        <article className="report-panel report-payment-flow report-payment-flow-bottom">
          <header className="report-panel-head">
            <div>
              <h2>Payment flow</h2>
              <p>How customer payments move into your available balance.</p>
            </div>
            <label>
              <select
                aria-label="Payment flow period"
                onChange={(event) => setPeriod(event.target.value as Period)}
                value={period}
              >
                <option value="7D">Last 7 days</option>
                <option value="30D">This month</option>
                <option value="3M">Last 3 months</option>
                <option value="1Y">Last year</option>
                <option value="Custom">Custom</option>
              </select>
              <ChevronDownIcon />
            </label>
          </header>
          <div className="report-flow-scroll">
            <div className="report-flow-track">
              {paymentFlowStages.map((stage) => {
                const FlowIcon = paymentFlowIcons[stage.icon];
                return (
                  <div className="report-flow-stage" key={stage.label}>
                    <span className="report-flow-node">
                      <FlowIcon />
                    </span>
                    <span className="report-flow-label">{stage.label}</span>
                    <strong>{stage.value}</strong>
                    <small>{stage.detail}</small>
                  </div>
                );
              })}
            </div>
          </div>
          <Link className="report-flow-action" href="/payments/transactions">
            View all transactions <ArrowDiagonalIcon />
          </Link>
        </article>
        <article className="report-panel report-insights">
          <header className="report-panel-head">
            <div>
              <h2>Acru insights</h2>
              <p>Signals worth acting on</p>
            </div>
            <LightbulbIcon />
          </header>
          <div>
            <span>
              <ArrowUpIcon />
            </span>
            <p>
              <b>Performance is improving</b>Approval increased 1.2 points while payment volume grew 18.6%.
            </p>
          </div>
          <div>
            <span>
              <ChartLineIcon />
            </span>
            <p>
              <b>Apple Pay is outperforming cards</b>Its 99.3% approval rate is 0.6 points above your overall average.
            </p>
          </div>
          <div>
            <span>
              <ShieldCheckMarkIcon />
            </span>
            <p>
              <b>Dispute activity remains healthy</b>Your dispute rate is 0.14%, down 0.03 points from the previous
              period.
            </p>
          </div>
          <div>
            <span>
              <LightbulbIcon />
            </span>
            <p>
              <b>Recoverable opportunity</b>About $32,400 in attempted volume was lost to authentication declines.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

export function StatementsPage() {
  const reportResource = useListCollection(reportSnapshotAdapter);
  const [scope, setScope] = useState<"All" | AssetKind>("All");
  const [period, setPeriod] = useState<Period>("30D");
  const rows = scope === "All" ? statementRows : statementRows.filter((row) => row.scope === scope);
  if (reportResource.status !== "ready") {
    return (
      <CollectionPageState
        description="Monthly account records across fiat, onchain USDC, and platform credits."
        error={reportResource.error}
        onRetry={reportResource.retry}
        status={reportResource.status}
        title="Statements"
      />
    );
  }
  return (
    <section className="report-workspace">
      <ReportHeader
        title="Statements"
        subtitle="Monthly account records across fiat, onchain USDC, and platform credits."
      >
        <ReportDateFilter onChange={setPeriod} value={period} />
        <Button onClick={() => downloadMock("acru-statement-july-2026.txt", "Acru account statement — July 2026")}>
          <ExportIcon /> Download latest
        </Button>
      </ReportHeader>
      <div className="statement-summary">
        <article>
          <span>
            <BankIcon /> Fiat balance
          </span>
          <strong>$118,048.66</strong>
          <small>USD · Wells Fargo •••• 4242</small>
        </article>
        <article>
          <span>
            <WalletIcon /> Crypto balance
          </span>
          <strong>42,866.31 USDC</strong>
          <small>USDC · Base network</small>
        </article>
        <article>
          <span>
            <CreditCardIcon /> Platform credits
          </span>
          <strong>18,400.00 USDC</strong>
          <small>USDC-denominated · Acru ledger</small>
        </article>
      </div>
      <div className="report-table-card">
        <div className="report-table-toolbar">
          <div className="report-tabs">
            {(["All", "Fiat", "Crypto", "Platform credits"] as const).map((item) => (
              <button
                className={scope === item ? "active" : ""}
                key={item}
                onClick={() => setScope(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="report-table-scroll">
          <table className="report-table statement-table">
            <thead>
              <tr>
                <th>Statement period</th>
                <th>Balance scope</th>
                <th>Gross activity</th>
                <th>Fees & refunds</th>
                <th>Settled</th>
                <th>Closing balance</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.period}-${row.scope}`}>
                  <td>
                    <b>{row.period}</b>
                    <small>Monthly statement</small>
                  </td>
                  <td>
                    <span className="report-scope">
                      <ScopeIcon scope={row.scope} />
                      {row.scope}
                    </span>
                  </td>
                  <td>{row.gross}</td>
                  <td>{row.adjustments}</td>
                  <td>{row.settled}</td>
                  <td>
                    <b>{row.closing}</b>
                  </td>
                  <td>
                    <StatusPill status="Available" />
                  </td>
                  <td>
                    <button
                      className="report-icon-button"
                      onClick={() =>
                        downloadMock(
                          `${row.period.toLowerCase().replaceAll(" ", "-")}.txt`,
                          `${row.period} — ${row.scope}`
                        )
                      }
                      title="Download statement"
                      type="button"
                    >
                      <ExportIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function WalletPage() {
  const notify = useToast();
  const reportResource = useListCollection(reportSnapshotAdapter);
  const [asset, setAsset] = useState<"All" | "USD" | "USDC" | "Platform credits">("All");
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("30D");
  const [withdrawAmount, setWithdrawAmount] = useState("25000.00");
  useDismissOnEscape(withdrawOpen, () => setWithdrawOpen(false));
  const rows = asset === "All" ? withdrawals : withdrawals.filter((row) => row.asset === asset);
  function exportWithdrawals() {
    downloadMock(
      "acru-wallet-withdrawals.csv",
      [
        "Created,Amount,Asset,Destination,Rail,Status,Fee,Arrival",
        ...rows.map((row) =>
          [row.created, row.amount, row.asset, row.destination, row.rail, row.status, row.fee, row.arrival]
            .map((value) => `"${value.replaceAll('"', '""')}"`)
            .join(",")
        )
      ].join("\n")
    );
  }
  function reviewWithdrawal() {
    try {
      const amountMinor = minorUnitsFromDecimal(withdrawAmount.replaceAll(",", ""));
      if (amountMinor <= 0 || amountMinor > 11_804_866) throw new RangeError("Enter an amount within the USD balance.");
      setWithdrawOpen(false);
      notify({ title: "Withdrawal ready for review", description: `$${withdrawAmount}`, tone: "success" });
    } catch (error) {
      notify({
        title: "Withdrawal amount is invalid",
        description: error instanceof Error ? error.message : "Check the amount.",
        tone: "danger"
      });
    }
  }
  if (reportResource.status !== "ready") {
    return (
      <CollectionPageState
        description="Manage available funds and settlement destinations across fiat and USDC."
        error={reportResource.error}
        onRetry={reportResource.retry}
        status={reportResource.status}
        title="Wallet"
      />
    );
  }
  return (
    <section className="report-workspace">
      <ReportHeader title="Wallet" subtitle="Manage available funds and settlement destinations across fiat and USDC.">
        <Link className="report-button" href="/settings/banking-payouts">
          Manage destinations
        </Link>
        <Button primary onClick={() => setWithdrawOpen(true)}>
          <ArrowDiagonalIcon /> Withdraw
        </Button>
      </ReportHeader>
      <div className="wallet-feature-card">
        <WalletCard showActions={false} />
      </div>
      <div className="wallet-assets">
        <article>
          <header>
            <span className="wallet-asset-icon">
              <BankIcon />
            </span>
            <div>
              <b>USD</b>
              <small>Fiat balance</small>
            </div>
            <StatusPill status="Available" />
          </header>
          <strong>$118,048.66</strong>
          <div>
            <span>
              Pending <b>$54,802.11</b>
            </span>
            <span>
              Destination <b>Bank •••• 4242</b>
            </span>
          </div>
        </article>
        <article>
          <header>
            <span className="wallet-asset-icon">
              <WalletIcon />
            </span>
            <div>
              <b>USDC</b>
              <small>Base network</small>
            </div>
            <StatusPill status="Available" />
          </header>
          <strong>42,866.31 USDC</strong>
          <div>
            <span>
              Pending <b>17,644.09 USDC</b>
            </span>
            <span>
              Destination <b>0x71F2…8A4C</b>
            </span>
          </div>
        </article>
        <article>
          <header>
            <span className="wallet-asset-icon">
              <CreditCardIcon />
            </span>
            <div>
              <b>Platform credits</b>
              <small>USDC-denominated</small>
            </div>
            <StatusPill status="Available" />
          </header>
          <strong>18,400.00 USDC</strong>
          <div>
            <span>
              Pending <b>0.00 USDC</b>
            </span>
            <span>
              Destination <b>Acru workspace</b>
            </span>
          </div>
        </article>
      </div>
      <div className="report-table-card wallet-history">
        <div className="report-table-title">
          <div>
            <h2>Withdrawal history</h2>
            <p>Previous bank, wallet, and internal balance movements.</p>
          </div>
          <Button onClick={exportWithdrawals}>
            <ExportIcon /> Export
          </Button>
        </div>
        <div className="report-table-toolbar">
          <div className="report-tabs">
            {(["All", "USD", "USDC", "Platform credits"] as const).map((item) => (
              <button
                className={asset === item ? "active" : ""}
                key={item}
                onClick={() => setAsset(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
          <div className="report-toolbar-actions">
            <ReportDateFilter onChange={setPeriod} value={period} />
          </div>
        </div>
        <div className="report-table-scroll">
          <table className="report-table wallet-table">
            <thead>
              <tr>
                <th>Created</th>
                <th>Amount</th>
                <th>Asset</th>
                <th>Destination</th>
                <th>Rail / network</th>
                <th>Status</th>
                <th>Fee</th>
                <th>Arrival</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.created}-${row.asset}`}>
                  <td>{row.created}</td>
                  <td>
                    <b>{row.amount}</b>
                  </td>
                  <td>
                    <span className="report-scope">
                      <ScopeIcon
                        scope={row.asset === "USD" ? "Fiat" : row.asset === "USDC" ? "Crypto" : "Platform credits"}
                      />
                      {row.asset}
                    </span>
                  </td>
                  <td>{row.destination}</td>
                  <td>{row.rail}</td>
                  <td>
                    <StatusPill status={row.status} />
                  </td>
                  <td>{row.fee}</td>
                  <td>{row.arrival}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {withdrawOpen ? (
        <div className="report-dialog-scrim" role="presentation">
          <div className="report-dialog" role="dialog" aria-modal="true" aria-labelledby="withdraw-title">
            <header>
              <div>
                <h2 id="withdraw-title">Withdraw funds</h2>
                <p>Choose the balance and destination. Backend processing will be connected next.</p>
              </div>
              <button onClick={() => setWithdrawOpen(false)} type="button">
                <XIcon />
              </button>
            </header>
            <label>
              From balance
              <select>
                <option>USD · $118,048.66 available</option>
                <option>USDC · 42,866.31 available</option>
                <option>Platform credits · 18,400.00 available</option>
              </select>
              <ChevronDownIcon />
            </label>
            <label>
              Amount
              <div className="report-amount-input">
                <span>$</span>
                <input
                  inputMode="decimal"
                  onChange={(event) => setWithdrawAmount(event.target.value)}
                  value={withdrawAmount}
                />
                <button type="button" onClick={() => setWithdrawAmount("118048.66")}>
                  Max
                </button>
              </div>
            </label>
            <label>
              Destination
              <select>
                <option>Wells Fargo •••• 4242 · ACH</option>
                <option>0x71F2…8A4C · Base</option>
                <option>Acru workspace · Internal</option>
              </select>
              <ChevronDownIcon />
            </label>
            <div className="report-dialog-note">
              <ShieldCheckMarkIcon />
              Destination details are confirmed before submission.
            </div>
            <footer>
              <Button onClick={() => setWithdrawOpen(false)}>Cancel</Button>
              <Button primary onClick={reviewWithdrawal}>
                Review withdrawal
              </Button>
            </footer>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function ExportsPage() {
  const reportResource = useListCollection(reportSnapshotAdapter);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All");
  const [createOpen, setCreateOpen] = useState(false);
  const [exports, setExports] = useState(initialExports);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("CSV");
  const [period, setPeriod] = useState<Period>("30D");
  useDismissOnEscape(createOpen, () => setCreateOpen(false));
  const filtered = useMemo(
    () =>
      exports.filter(
        (item) =>
          (tab === "All" || item.data === tab) &&
          `${item.name} ${item.data} ${item.format}`.toLowerCase().includes(query.toLowerCase())
      ),
    [exports, query, tab]
  );
  function createExport() {
    setExports((items) => [
      {
        name: "Custom payment export",
        data: "Payments",
        format: exportFormat,
        range: "Aug 1–21, 2026",
        owner: "Nik Vorobyev",
        created: "Just now",
        status: "Processing"
      },
      ...items
    ]);
    setCreateOpen(false);
  }
  if (reportResource.status !== "ready") {
    return (
      <CollectionPageState
        description="Generate and retrieve finance-ready files across every ACRU balance."
        error={reportResource.error}
        onRetry={reportResource.retry}
        status={reportResource.status}
        title="Exports"
      />
    );
  }
  return (
    <section className="report-workspace">
      <ReportHeader title="Exports" subtitle="Generate and retrieve finance-ready files across every Acru balance.">
        <ReportDateFilter onChange={setPeriod} value={period} />
        <Button primary onClick={() => setCreateOpen(true)}>
          <PlusIcon /> Create export
        </Button>
      </ReportHeader>
      <div className="exports-callout">
        <span>
          <FileIcon />
        </span>
        <div>
          <h2>Build a custom export</h2>
          <p>
            Select payments, statements, balance activity, crypto settlements, or platform-credit usage and choose the
            exact date range.
          </p>
        </div>
        <button onClick={() => setCreateOpen(true)} type="button">
          Configure export <ArrowDiagonalIcon />
        </button>
      </div>
      <div className="report-table-card exports-table-card">
        <div className="report-table-toolbar">
          <div className="report-tabs">
            {["All", "Payments", "Statements", "Crypto settlements", "Platform credits"].map((item) => (
              <button className={tab === item ? "active" : ""} key={item} onClick={() => setTab(item)} type="button">
                {item}
              </button>
            ))}
          </div>
          <div className="report-toolbar-actions">
            <label className="report-search">
              <SearchIcon />
              <input
                aria-label="Search exports"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search exports"
                value={query}
              />
            </label>
          </div>
        </div>
        {filtered.length === 0 ? (
          <EmptyTable
            query={query}
            onReset={() => {
              setQuery("");
              setTab("All");
            }}
          />
        ) : (
          <div className="report-table-scroll">
            <table className="report-table exports-table">
              <thead>
                <tr>
                  <th>Export</th>
                  <th>Data</th>
                  <th>Format</th>
                  <th>Date range</th>
                  <th>Created by</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={`${row.name}-${row.created}`}>
                    <td>
                      <span className="export-file">
                        <ExportFormatIcon format={row.format} />
                        <span>
                          <b>{row.name}</b>
                          <small>ex_{row.name.toLowerCase().replaceAll(" ", "_").slice(0, 18)}</small>
                        </span>
                      </span>
                    </td>
                    <td>{row.data}</td>
                    <td>
                      <span className="format-pill" data-format={row.format.toLowerCase()}>
                        {row.format}
                      </span>
                    </td>
                    <td>{row.range}</td>
                    <td>{row.owner}</td>
                    <td>{row.created}</td>
                    <td>
                      {row.status === "Processing" ? (
                        <span className="report-status" data-status="processing">
                          <span className="report-status-icon">
                            <RefreshIcon className="spin" />
                          </span>
                          Processing
                        </span>
                      ) : (
                        <StatusPill status="Available" />
                      )}
                    </td>
                    <td>
                      <button
                        className="report-icon-button"
                        disabled={row.status === "Processing"}
                        onClick={() => downloadMock(`${row.name}.${row.format.toLowerCase()}`, "Acru export")}
                        title={`Download ${row.format} export`}
                        type="button"
                      >
                        <ExportIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {createOpen ? (
        <div className="report-dialog-scrim" role="presentation">
          <div className="report-dialog" role="dialog" aria-modal="true" aria-labelledby="export-title">
            <header>
              <div>
                <h2 id="export-title">Create export</h2>
                <p>Build a reusable, finance-ready data file.</p>
              </div>
              <button onClick={() => setCreateOpen(false)} type="button">
                <XIcon />
              </button>
            </header>
            <label>
              Data to export
              <select>
                <option>Payments</option>
                <option>Balance transactions</option>
                <option>Statements</option>
                <option>Crypto settlements</option>
                <option>Platform credits</option>
              </select>
              <ChevronDownIcon />
            </label>
            <div className="report-dialog-grid">
              <label>
                Date range
                <select>
                  <option>Aug 1–21, 2026</option>
                  <option>Last 30 days</option>
                  <option>Last quarter</option>
                </select>
                <ChevronDownIcon />
              </label>
              <label>
                Format
                <select onChange={(event) => setExportFormat(event.target.value as ExportFormat)} value={exportFormat}>
                  <option>CSV</option>
                  <option>PDF</option>
                  <option>JSON</option>
                  <option>ZIP</option>
                </select>
                <ChevronDownIcon />
              </label>
            </div>
            <div className="report-dialog-note">
              <ExportFormatIcon format={exportFormat} />
              The export will remain available here after it finishes generating.
            </div>
            <footer>
              <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button primary onClick={createExport}>
                Create export
              </Button>
            </footer>
          </div>
        </div>
      ) : null}
    </section>
  );
}
