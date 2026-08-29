"use client";

import {
  AlertTriangleIcon,
  ArrowRightIcon,
  BankIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  ContractIcon,
  CreditCardIcon,
  InfoIcon,
  LightbulbIcon,
  LinkIcon,
  MenuHorizontalIcon,
  NoteIcon,
  PersonAddIcon,
  PlusIcon,
  ProductAddIcon,
  ReceiptDollarIcon,
  ShieldCheckMarkIcon
} from "@shopify/polaris-icons";
import Image from "next/image";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useListCollection } from "@/components/data/use-list-collection";
import { CollectionPageState } from "@/components/ui/collection-state";
import { Select } from "@/components/ui/select";
import { SalesOverviewChart } from "@/features/dashboard/components/sales-overview-chart";
import {
  activities,
  dashboardSnapshotAdapter,
  healthRows,
  notices,
  type HealthIcon
} from "@/features/dashboard/data/dashboard";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;
type DashboardPeriod = {
  gross: string;
  net: string;
  payments: string;
  total: string;
  change: string;
  days: number;
  startDate: string;
  endDate: string;
};

export type DateRange = { start: string; end: string };
type CreateAction = {
  id: string;
  label: string;
  description: string;
  icon: IconType;
  fields: Array<{ name: string; label: string; type: "text" | "email" | "number" | "date"; placeholder?: string }>;
};

const TODAY = new Date("2026-08-10T12:00:00");

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftDate(date: Date, amount: number) {
  const shifted = new Date(date);
  shifted.setDate(shifted.getDate() + amount);
  return shifted;
}

function readableDate(key: string) {
  return new Date(`${key}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const createActions: CreateAction[] = [
  {
    id: "invoice",
    label: "Invoice",
    description: "Bill a specific customer",
    icon: ReceiptDollarIcon,
    fields: [
      { name: "customerEmail", label: "Customer email", type: "email", placeholder: "customer@company.com" },
      { name: "amount", label: "Amount (USD)", type: "number", placeholder: "0.00" },
      { name: "dueDate", label: "Due date", type: "date" }
    ]
  },
  {
    id: "customer",
    label: "Customer",
    description: "Add a person or business",
    icon: PersonAddIcon,
    fields: [
      { name: "name", label: "Name", type: "text", placeholder: "Customer or company name" },
      { name: "email", label: "Email", type: "email", placeholder: "customer@company.com" }
    ]
  },
  {
    id: "payment-link",
    label: "Payment link",
    description: "Share a hosted checkout page",
    icon: LinkIcon,
    fields: [
      { name: "title", label: "Title", type: "text", placeholder: "What are you selling?" },
      { name: "amount", label: "Amount (USD)", type: "number", placeholder: "0.00" }
    ]
  },
  {
    id: "subscription",
    label: "Subscription",
    description: "Start recurring billing",
    icon: CreditCardIcon,
    fields: [
      { name: "customerEmail", label: "Customer email", type: "email", placeholder: "customer@company.com" },
      { name: "plan", label: "Product or plan", type: "text", placeholder: "Professional plan" },
      { name: "amount", label: "Monthly amount (USD)", type: "number", placeholder: "0.00" }
    ]
  },
  {
    id: "product",
    label: "Product & price",
    description: "Add something you sell",
    icon: ProductAddIcon,
    fields: [
      { name: "name", label: "Product name", type: "text", placeholder: "Product name" },
      { name: "amount", label: "Price (USD)", type: "number", placeholder: "0.00" }
    ]
  },
  {
    id: "quote",
    label: "Quote",
    description: "Send an estimate before invoicing",
    icon: ContractIcon,
    fields: [
      { name: "customerEmail", label: "Customer email", type: "email", placeholder: "customer@company.com" },
      { name: "amount", label: "Quote total (USD)", type: "number", placeholder: "0.00" },
      { name: "validUntil", label: "Valid until", type: "date" }
    ]
  }
];

function Sparkline({ variant = 0 }: { variant?: number }) {
  const paths = [
    "M2 55 C28 50 40 16 62 20 C84 24 89 44 125 48 C165 53 177 43 209 47 C241 51 261 58 299 52 C320 49 330 38 348 42",
    "M2 55 C28 51 36 17 61 20 C86 23 91 45 126 49 C160 53 179 44 211 48 C246 53 270 58 302 53 C324 49 333 37 348 42",
    "M2 55 C27 51 39 16 63 20 C87 24 91 45 126 49 C160 53 179 44 210 48 C243 53 270 58 303 53 C326 49 334 37 348 42"
  ];
  return (
    <svg className="metric-sparkline" viewBox="0 0 350 66" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`spark-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#49a7dd" stopOpacity=".28" />
          <stop offset="100%" stopColor="#49a7dd" stopOpacity=".06" />
        </linearGradient>
      </defs>
      <path d={`${paths[variant]} L348 64 L2 64 Z`} fill={`url(#spark-${variant})`} />
      <path d={paths[variant]} fill="none" stroke="#43a6df" strokeWidth="2" />
    </svg>
  );
}

function ThreeDSIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M4 9V8a8 8 0 0 1 16 0v1h-2V8A6 6 0 0 0 6 8v1H4Z" />
      <path d="M7 9V8a5 5 0 0 1 10 0v1h-2V8a3 3 0 0 0-6 0v1H7Z" />
      <path fillRule="evenodd" d="M3 9h18v12H3V9Zm2.5 2.5v7h4v-7h-4Zm6.5 0v7h6.5v-7H12Z" clipRule="evenodd" />
    </svg>
  );
}

function MetricCard({
  label,
  value,
  variant,
  formula,
  change
}: {
  label: string;
  value: string;
  variant: number;
  formula: string;
  change: string;
}) {
  return (
    <section className="dashboard-card metric-card">
      <div className="metric-label">
        {label}
        <span className="metric-info">
          <button type="button" aria-label={`${label} calculation: ${formula}`}>
            <InfoIcon />
          </button>
          <span className="metric-formula-tooltip" role="tooltip">
            <small>Calculation</small>
            <strong>{formula}</strong>
          </span>
        </span>
      </div>
      <div className="metric-row">
        <strong>{value}</strong>
        <span className="positive">↗&nbsp; {change}</span>
      </div>
      <Sparkline variant={variant} />
    </section>
  );
}

function BalanceCard() {
  return (
    <section className="dashboard-card balance-summary">
      <div className="balance-summary-head">
        <span>Available balance</span>
        <Link href="/payments/payouts">Payouts</Link>
      </div>
      <strong>$624,347.32</strong>
      <div className="balance-settlement">
        <span>
          <small>Next settlement</small>Tomorrow, 2 PM
        </span>
        <b>$98,443.12</b>
      </div>
    </section>
  );
}

export function WalletCard({
  onWithdraw,
  showActions = true
}: {
  onWithdraw?: () => void;
  showActions?: boolean;
} = {}) {
  return (
    <section className="dashboard-card wallet-panel">
      <div className="panel-heading">
        <span>
          Wallet <b className="active-pill">Active</b>
        </span>
        <button className="icon-button" type="button" aria-label="Wallet options">
          <MenuHorizontalIcon />
        </button>
      </div>
      <div className="wallet-content">
        <div className="wallet-balance">
          <strong>$624,347.32</strong>
          <span>Total balance</span>
          <div className="wallet-breakdown">
            <div>
              <small>Available</small>
              <b className="blue-value">$598,214.41</b>
            </div>
            <div>
              <small>Pending</small>
              <b className="yellow-value">$23,615.23</b>
            </div>
            <div>
              <small>Reserve</small>
              <b>$2,517.73</b>
            </div>
          </div>
        </div>
        <div className="wallet-card-visual">
          <Image src="/acru-logo.png" width={42} height={36} alt="" />
          <div className="card-number">•••• &nbsp;•••• &nbsp;•••• 2249</div>
          <strong>River Lynn LLC</strong>
          <div className="card-meta">
            <span>**** 2249</span>
            <span>
              Exp <b>06/28</b>
            </span>
            <span>CVV&nbsp; ***</span>
          </div>
        </div>
      </div>
      {showActions ? (
        <div className="wallet-actions">
          <Link href="/reports/wallet">View wallet</Link>
          <Link href="/payments/transactions">Transactions</Link>
          <button className="primary-action" onClick={onWithdraw} type="button">
            Withdraw <ArrowRightIcon />
          </button>
        </div>
      ) : null}
    </section>
  );
}

const healthIcons: Record<HealthIcon, IconType> = {
  approval: PersonAddIcon,
  chargeback: ClockIcon,
  fraud: ShieldCheckMarkIcon,
  "3ds": ThreeDSIcon,
  settlement: LightbulbIcon
};

function MerchantHealth() {
  return (
    <section className="dashboard-card health-panel">
      <div className="panel-heading">
        <span>Merchant Health</span>
        <Link className="outline-button" href="/reports/acceptance">
          View all
        </Link>
      </div>
      <div className="health-list">
        {healthRows.map(({ icon, tone, name, value, change }) => {
          const Icon = healthIcons[icon];
          return (
            <div className="health-row" key={name}>
              <span className={`health-icon ${tone}`}>
                <Icon />
              </span>
              <span>{name}</span>
              <b>{value}</b>
              <em className={change === "−" ? "neutral" : "positive"}>{change}</em>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SalesOverview({ total, change, days, startDate, endDate, compare }: DashboardPeriod & { compare: boolean }) {
  const [granularity, setGranularity] = useState("Daily");

  return (
    <section className="dashboard-card sales-panel">
      <div className="panel-heading sales-heading">
        <div>
          <span>Sales overview</span>
          <strong>
            {total} <em>↗ {change}</em>
          </strong>
          <small>Total volume</small>
        </div>
        <label className="sales-granularity">
          <span className="sr-only">Chart granularity</span>
          <Select value={granularity} onChange={(event) => setGranularity(event.target.value)}>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </Select>
        </label>
      </div>
      <SalesOverviewChart days={days} startDate={startDate} endDate={endDate} compare={compare} />
    </section>
  );
}

function RecentActivity() {
  return (
    <section className="dashboard-card activity-panel">
      <div className="panel-heading">
        <span>Recent activity</span>
        <Link className="outline-button" href="/payments/transactions">
          View all
        </Link>
      </div>
      <div className="activity-list">
        {activities.map((activity) => (
          <div className="activity-row" key={activity.detail}>
            <span className={`activity-logo ${activity.tone}`}>
              {activity.icon === "bank" ? (
                <BankIcon />
              ) : activity.icon === "visa" ? (
                <svg className="visa-mark" viewBox="0 0 24 24" aria-label="Visa">
                  <path d="M9.112 8.262 5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 0 1 .894.764l.817 4.338 2.018-5.102h2.037Zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 0 1 1.913.336l.34-1.59a5.207 5.207 0 0 0-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564Zm5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 0 0-.826.55l-2.909 6.946h2.036l.405-1.12h2.488l.233 1.12Zm-2.163-2.656 1.02-2.815.588 2.815Zm-8.16-4.84-1.603 7.496H8.34l1.605-7.496h1.938Z" />
                </svg>
              ) : (
                <Image
                  src={activity.icon === "ethereum" ? "/ethereum.svg" : "/usdc.svg"}
                  width={42}
                  height={42}
                  alt=""
                />
              )}
            </span>
            <span className="activity-copy">
              <b>Payment</b>
              <small>{activity.detail}</small>
            </span>
            <span className={`activity-status ${activity.statusTone}`}>{activity.status}</span>
            <strong>{activity.amount}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

const noticeIcons = { dispute: AlertTriangleIcon, payout: BankIcon, request: NoteIcon };

function NoticeStrip() {
  return (
    <section className="notice-grid">
      {notices.map(({ icon, tone, title, subtitle, href, amount }) => {
        const Icon = noticeIcons[icon];
        return (
          <Link className="dashboard-card notice-card" href={href} key={title}>
            <span className={`notice-icon ${tone}`}>
              <Icon />
            </span>
            <span>
              <b>{title}</b>
              <small>{subtitle}</small>
            </span>
            {amount ? <strong>{amount}</strong> : <ArrowRightIcon className="notice-arrow" />}
          </Link>
        );
      })}
    </section>
  );
}

const comparePresets = [
  { label: "1 day", days: 1 },
  { label: "1 week", days: 7 },
  { label: "1 month", days: 30 },
  { label: "1 year", days: 365 }
];

export function DateRangePopover({
  initialRange,
  enabled,
  title = "Compare date",
  subtitle = "Select a period to compare",
  presetEndOffset = -1,
  onApply,
  onCancel,
  onClear
}: {
  initialRange: DateRange;
  enabled: boolean;
  title?: string;
  subtitle?: string;
  presetEndOffset?: number;
  onApply: (range: DateRange) => void;
  onCancel: () => void;
  onClear: () => void;
}) {
  const [draft, setDraft] = useState<DateRange>(initialRange);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [visibleMonth, setVisibleMonth] = useState(new Date(`${initialRange.end}T12:00:00`));
  const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1, 12);
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
  const calendarCells = Array.from({ length: 42 }, (_, index) => {
    const day = index - monthStart.getDay() + 1;
    return day >= 1 && day <= daysInMonth ? day : null;
  });

  function chooseDate(key: string) {
    setActivePreset(null);
    if (!draft.start || draft.end) {
      setDraft({ start: key, end: "" });
      return;
    }
    setDraft(key < draft.start ? { start: key, end: draft.start } : { start: draft.start, end: key });
  }

  return (
    <div className="compare-date-popover" role="dialog" aria-label={title}>
      <div className="compare-popover-title">
        <span>
          <CalendarIcon /> {title}
        </span>
        <small>{subtitle}</small>
      </div>
      <div className="compare-presets" aria-label="Comparison presets">
        {comparePresets.map((preset) => (
          <button
            className={activePreset === preset.label ? "selected" : undefined}
            type="button"
            key={preset.label}
            onClick={() => {
              const end = shiftDate(TODAY, presetEndOffset);
              const start = shiftDate(end, -(preset.days - 1));
              const nextRange = { start: toDateKey(start), end: toDateKey(end) };
              setDraft(nextRange);
              setVisibleMonth(end);
              setActivePreset(preset.label);
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="compare-range-readout">
        <span>{draft.start ? readableDate(draft.start) : "Start date"}</span>
        <ArrowRightIcon />
        <span>{draft.end ? readableDate(draft.end) : "End date"}</span>
      </div>
      <div className="calendar-heading">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1, 12))}
        >
          <ChevronLeftIcon />
        </button>
        <strong>{visibleMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</strong>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1, 12))}
        >
          <ChevronRightIcon />
        </button>
      </div>
      <div className="calendar-weekdays" aria-hidden="true">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {calendarCells.map((day, index) => {
          if (!day) return <span key={`empty-${index}`} />;
          const key = toDateKey(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day, 12));
          const isBoundary = key === draft.start || key === draft.end;
          const inRange = Boolean(draft.start && draft.end && key > draft.start && key < draft.end);
          return (
            <button
              className={`${isBoundary ? "boundary " : ""}${inRange ? "in-range" : ""}`.trim()}
              type="button"
              key={key}
              aria-pressed={isBoundary || inRange}
              onClick={() => chooseDate(key)}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div className="compare-popover-actions">
        {enabled ? (
          <button className="clear-comparison" type="button" onClick={onClear}>
            Clear
          </button>
        ) : (
          <span />
        )}
        <div>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="apply-comparison"
            type="button"
            disabled={!draft.start || !draft.end}
            onClick={() => onApply(draft)}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateResourceDialog({
  action,
  onClose,
  onCreated
}: {
  action: CreateAction;
  onClose: () => void;
  onCreated: (message: string) => void;
}) {
  const ActionIcon = action.icon;

  return (
    <div
      className="create-dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        className="create-dialog"
        onSubmit={(event) => {
          event.preventDefault();
          const values = Object.fromEntries(new FormData(event.currentTarget));
          const stored = window.localStorage.getItem("acru-created-drafts");
          let drafts: unknown[] = [];
          try {
            const parsed: unknown = stored ? JSON.parse(stored) : [];
            drafts = Array.isArray(parsed) ? parsed : [];
          } catch {
            drafts = [];
          }
          drafts.push({ id: window.crypto.randomUUID(), type: action.id, values, createdAt: new Date().toISOString() });
          window.localStorage.setItem("acru-created-drafts", JSON.stringify(drafts));
          onCreated(`${action.label} created`);
        }}
      >
        <header className="create-dialog-heading">
          <span className="create-dialog-icon">
            <ActionIcon />
          </span>
          <span>
            <strong>Create {action.label.toLowerCase()}</strong>
            <small>{action.description}</small>
          </span>
          <button type="button" aria-label="Close create dialog" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="create-dialog-fields">
          {action.fields.map((field, index) => (
            <label key={field.name}>
              <span>{field.label}</span>
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                min={field.type === "number" ? "0" : undefined}
                step={field.type === "number" ? "0.01" : undefined}
                autoFocus={index === 0}
                required
              />
            </label>
          ))}
        </div>
        <footer className="create-dialog-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="create-dialog-submit" type="submit">
            Create {action.label.toLowerCase()}
          </button>
        </footer>
      </form>
    </div>
  );
}

export function DashboardOverview() {
  const dashboardResource = useListCollection(dashboardSnapshotAdapter);
  const dashboardFiltersRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState<"7d" | "1m" | "custom">("7d");
  const [customOpen, setCustomOpen] = useState(false);
  const [compare, setCompare] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareDates, setCompareDates] = useState<DateRange>({ start: "2026-07-28", end: "2026-08-03" });
  const [customDates, setCustomDates] = useState({ start: "2026-07-11", end: "2026-08-10" });
  const [createOpen, setCreateOpen] = useState(false);
  const [createAction, setCreateAction] = useState<CreateAction | null>(null);
  const [creationNotice, setCreationNotice] = useState("");

  useEffect(() => {
    if (!creationNotice) return;
    const timeout = window.setTimeout(() => setCreationNotice(""), 2800);
    return () => window.clearTimeout(timeout);
  }, [creationNotice]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (createAction) setCreateAction(null);
      else if (createOpen) setCreateOpen(false);
      else if (compareOpen) setCompareOpen(false);
      else if (customOpen) setCustomOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [compareOpen, createAction, createOpen, customOpen]);

  useEffect(() => {
    function closeCalendarsOnOutsideClick(event: MouseEvent) {
      if (dashboardFiltersRef.current?.contains(event.target as Node)) return;
      setCustomOpen(false);
      setCompareOpen(false);
    }
    document.addEventListener("mousedown", closeCalendarsOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeCalendarsOnOutsideClick);
  }, []);

  const period = useMemo<DashboardPeriod>(() => {
    if (range === "7d") {
      return {
        gross: "$8.42M",
        net: "$6.21M",
        payments: "24,491",
        total: "$8.43M",
        change: "18.6%",
        days: 7,
        startDate: "2026-08-04",
        endDate: "2026-08-10"
      };
    }
    if (range === "1m") {
      return {
        gross: "$31.84M",
        net: "$23.48M",
        payments: "93,217",
        total: "$31.86M",
        change: "14.2%",
        days: 30,
        startDate: "2026-07-12",
        endDate: "2026-08-10"
      };
    }

    const start = new Date(`${customDates.start}T12:00:00`);
    const end = new Date(`${customDates.end}T12:00:00`);
    const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1);
    const factor = days / 7;
    return {
      gross: `$${(8.42 * factor).toFixed(2)}M`,
      net: `$${(6.21 * factor).toFixed(2)}M`,
      payments: Math.round(24_491 * factor).toLocaleString("en-US"),
      total: `$${(8.43 * factor).toFixed(2)}M`,
      change: "11.8%",
      days,
      startDate: customDates.start,
      endDate: customDates.end
    };
  }, [customDates, range]);

  if (dashboardResource.status !== "ready") {
    return (
      <CollectionPageState
        description="A live view of your payment volume, balance, health, and recent activity."
        error={dashboardResource.error}
        onRetry={dashboardResource.retry}
        status={dashboardResource.status}
        title="Overview"
      />
    );
  }

  return (
    <div className="dashboard-overview">
      <header className="dashboard-heading">
        <div>
          <h1>Good morning, Christian</h1>
          <p>Here&apos;s what&apos;s happening with your business today.</p>
        </div>
        <div className="dashboard-filters" ref={dashboardFiltersRef}>
          <div className="date-filter-wrap">
            <div className="range-control" aria-label="Dashboard date range">
              <button
                className={range === "7d" ? "selected" : undefined}
                type="button"
                aria-pressed={range === "7d"}
                onClick={() => {
                  setRange("7d");
                  setCustomOpen(false);
                }}
              >
                7D
              </button>
              <button
                className={range === "1m" ? "selected" : undefined}
                type="button"
                aria-pressed={range === "1m"}
                onClick={() => {
                  setRange("1m");
                  setCustomOpen(false);
                }}
              >
                1M
              </button>
              <button
                className={range === "custom" ? "selected" : undefined}
                type="button"
                aria-pressed={range === "custom"}
                onClick={() => {
                  setCompareOpen(false);
                  setCustomOpen((open) => !open);
                }}
              >
                Custom
              </button>
            </div>
            {customOpen ? (
              <DateRangePopover
                initialRange={customDates}
                enabled={false}
                title="Custom date range"
                subtitle="Select the period to display"
                presetEndOffset={0}
                onCancel={() => setCustomOpen(false)}
                onClear={() => undefined}
                onApply={(nextRange) => {
                  setCustomDates(nextRange);
                  setRange("custom");
                  setCustomOpen(false);
                }}
              />
            ) : null}
          </div>
          <div className="compare-filter-wrap">
            <button
              className={`compare-button${compare ? " active" : ""}`}
              type="button"
              aria-expanded={compareOpen}
              aria-pressed={compare}
              onClick={() => {
                setCustomOpen(false);
                setCompareOpen((open) => !open);
              }}
            >
              Compare date <ChevronDownIcon />
            </button>
            {compareOpen ? (
              <DateRangePopover
                initialRange={compareDates}
                enabled={compare}
                onCancel={() => setCompareOpen(false)}
                onClear={() => {
                  setCompare(false);
                  setCompareOpen(false);
                }}
                onApply={(nextRange) => {
                  setCompareDates(nextRange);
                  setCompare(true);
                  setCompareOpen(false);
                }}
              />
            ) : null}
          </div>
          <div className="create-filter-wrap">
            <button
              className="create-button"
              type="button"
              aria-expanded={createOpen}
              onClick={() => {
                setCustomOpen(false);
                setCompareOpen(false);
                setCreateOpen((open) => !open);
              }}
            >
              Create <PlusIcon />
            </button>
            {createOpen ? (
              <>
                <div className="create-menu-scrim" role="presentation" onMouseDown={() => setCreateOpen(false)} />
                <div className="create-menu" role="menu">
                  <div className="create-menu-heading">
                    <strong>Create new</strong>
                    <small>Start a payment workflow</small>
                  </div>
                  <div className="create-menu-grid">
                    {createActions.map((action) => {
                      const ActionIcon = action.icon;
                      return (
                        <button
                          type="button"
                          role="menuitem"
                          key={action.id}
                          onClick={() => {
                            setCreateOpen(false);
                            setCreateAction(action);
                          }}
                        >
                          <span className={`create-action-icon ${action.id}`}>
                            <ActionIcon />
                          </span>
                          <span>
                            <strong>{action.label}</strong>
                            <small>{action.description}</small>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </header>
      {createAction ? (
        <CreateResourceDialog
          action={createAction}
          onClose={() => setCreateAction(null)}
          onCreated={(message) => {
            setCreateAction(null);
            setCreationNotice(message);
          }}
        />
      ) : null}
      {creationNotice ? (
        <div className="creation-toast" role="status">
          <span>✓</span> {creationNotice}
        </div>
      ) : null}
      <section className="metrics-grid">
        <MetricCard
          label="Gross volume"
          value={period.gross}
          variant={0}
          formula="Sum of all successfully processed payment amounts"
          change={period.change}
        />
        <MetricCard
          label="Net revenue"
          value={period.net}
          variant={1}
          formula="Gross volume − refunds − disputes − processing fees"
          change={period.change}
        />
        <MetricCard
          label="Successful payments"
          value={period.payments}
          variant={2}
          formula="Count of payment attempts with a succeeded status"
          change={period.change}
        />
        <BalanceCard />
      </section>
      <section className="primary-grid">
        <WalletCard />
        <MerchantHealth />
      </section>
      <section className="secondary-grid">
        <SalesOverview {...period} compare={compare} />
        <RecentActivity />
      </section>
      <NoticeStrip />
    </div>
  );
}
