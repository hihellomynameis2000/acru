"use client";

import Image from "next/image";
import { ArrowDownIcon, ArrowUpIcon, CheckCircleIcon, ExportIcon, SearchIcon } from "@shopify/polaris-icons";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";

import { useListCollection } from "@/components/data/use-list-collection";
import { CollectionPageState } from "@/components/ui/collection-state";
import { TablePagination } from "@/components/ui/table-pagination";
import { DateRangePopover, type DateRange } from "@/features/dashboard/components/dashboard-overview";
import {
  acceptanceSeries,
  acceptanceSeriesOptions,
  acceptanceSnapshotAdapter,
  declineRows,
  railRows,
  type AcceptanceScope,
  type AcceptanceSeriesKey,
  type DeclineRow,
  type Measure,
  type Period
} from "@/features/reports/data/acceptance";

function AcceptanceDateFilter({ value, onChange }: { value: Period; onChange: (value: Period) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [customDates, setCustomDates] = useState<DateRange>({ start: "2026-07-26", end: "2026-08-25" });

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setCustomOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="acceptance-date-filter" ref={ref}>
      <div className="range-control" aria-label="Acceptance reporting period">
        {(["7D", "30D", "3M", "1Y", "Custom"] as Period[]).map((period) => (
          <button
            className={value === period ? "selected" : undefined}
            key={period}
            onClick={() => {
              onChange(period);
              setCustomOpen(period === "Custom" ? !customOpen : false);
            }}
            type="button"
          >
            {period}
          </button>
        ))}
      </div>
      {customOpen ? (
        <DateRangePopover
          enabled
          initialRange={customDates}
          onApply={(range) => {
            setCustomDates(range);
            onChange("Custom");
            setCustomOpen(false);
          }}
          onCancel={() => setCustomOpen(false)}
          onClear={() => {
            onChange("30D");
            setCustomOpen(false);
          }}
          presetEndOffset={0}
          subtitle="Choose the authorization window"
          title="Custom range"
        />
      ) : null}
    </div>
  );
}

function AcceptanceTrend({
  period,
  scope,
  measure,
  visibleSeries
}: {
  period: Period;
  scope: AcceptanceScope;
  measure: Measure;
  visibleSeries: AcceptanceSeriesKey[];
}) {
  const base = acceptanceSeries[period];
  const scopeOffset = scope === "Pre-auth" ? 0.35 : scope === "Post-auth" ? -0.18 : 0;
  const approvals = base.map((value) => Math.min(99.7, value + scopeOffset));
  const chartSeries: Record<AcceptanceSeriesKey, number[]> = {
    acceptance: approvals,
    chargeback: approvals.map((value, index) => Math.max(96.1, value - 0.44 + (index % 3) * 0.08)),
    bank: approvals.map((value, index) => Math.min(99.8, value + 0.34 - (index % 4) * 0.04)),
    threeDs: approvals.map((value, index) => Math.max(96.1, value - 0.72 + (index % 4) * 0.11))
  };
  const plotRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const activePointerRef = useRef<number | null>(null);
  const [active, setActive] = useState(approvals.length - 1);
  const safeActive = Math.min(active, approvals.length - 1);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const width = 900;
  const height = 250;
  const minRate = 96;
  const maxRate = 100;
  const x = (index: number) => (index / Math.max(1, approvals.length - 1)) * width;
  const y = (value: number) => ((maxRate - value) / (maxRate - minRate)) * height;
  const line = (values: number[]) => values.map((value, index) => `${x(index)},${y(value)}`).join(" ");
  const area = `M 0 ${height} L ${approvals.map((value, index) => `${x(index)} ${y(value)}`).join(" L ")} L ${width} ${height} Z`;
  const dates = [
    "Jul 26",
    "Jul 29",
    "Aug 1",
    "Aug 4",
    "Aug 7",
    "Aug 10",
    "Aug 13",
    "Aug 16",
    "Aug 19",
    "Aug 21",
    "Aug 23",
    "Aug 25"
  ];
  const attempts = measure === "Count" ? 1960 + safeActive * 31 : 612000 + safeActive * 18400;
  const declined = Math.round(attempts * ((100 - approvals[safeActive]) / 100));
  const firstVisibleSeries = chartSeries[visibleSeries[0]];

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    []
  );

  function update(clientX: number) {
    const bounds = plotRef.current?.getBoundingClientRect();
    if (!bounds?.width) return;
    const ratio = Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width));
    const index = Math.round(ratio * (approvals.length - 1));
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      setActive(index);
      setTooltipVisible(true);
    });
  }

  return (
    <div className="acceptance-chart">
      <div className="acceptance-chart-y" aria-hidden="true">
        <span>100%</span>
        <span>99%</span>
        <span>98%</span>
        <span>97%</span>
        <span>96%</span>
      </div>
      <div className="acceptance-chart-plot" ref={plotRef}>
        <svg
          aria-label="Approval rate over time. Drag or move across the chart for daily details."
          onPointerDown={(event) => {
            activePointerRef.current = event.pointerId;
            event.currentTarget.setPointerCapture(event.pointerId);
            update(event.clientX);
          }}
          onPointerLeave={() => {
            if (activePointerRef.current === null) setTooltipVisible(false);
          }}
          onPointerMove={(event) => update(event.clientX)}
          onPointerUp={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId))
              event.currentTarget.releasePointerCapture(event.pointerId);
            activePointerRef.current = null;
          }}
          viewBox={`0 0 ${width} ${height}`}
        >
          <defs>
            <linearGradient id="acceptance-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#4aa6da" stopOpacity="0.3" />
              <stop offset="1" stopColor="#4aa6da" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 62.5, 125, 187.5, 250].map((lineY) => (
            <line className="acceptance-grid-line" key={lineY} x1="0" x2={width} y1={lineY} y2={lineY} />
          ))}
          {visibleSeries.includes("acceptance") ? <path d={area} fill="url(#acceptance-area)" /> : null}
          {acceptanceSeriesOptions.map((series) =>
            visibleSeries.includes(series.key) ? (
              <polyline
                className={`acceptance-line ${series.className}`}
                fill="none"
                key={series.key}
                points={line(chartSeries[series.key])}
              />
            ) : null
          )}
          {tooltipVisible ? (
            <>
              <line className="acceptance-guide" x1={x(safeActive)} x2={x(safeActive)} y1="0" y2={height} />
              {acceptanceSeriesOptions.map((series) =>
                visibleSeries.includes(series.key) ? (
                  <circle
                    className="acceptance-active-dot"
                    cx={x(safeActive)}
                    cy={y(chartSeries[series.key][safeActive])}
                    key={series.key}
                    r="4.5"
                    style={{ stroke: series.color }}
                  />
                ) : null
              )}
            </>
          ) : null}
        </svg>
        {tooltipVisible ? (
          <div
            className="acceptance-tooltip"
            style={{ left: `${Math.max(7, Math.min(91, (x(safeActive) / width) * 100))}%` }}
          >
            <small>{dates[Math.round((safeActive / Math.max(1, approvals.length - 1)) * (dates.length - 1))]}</small>
            <strong>{firstVisibleSeries[safeActive].toFixed(2)}% approved</strong>
            <div className="acceptance-tooltip-series">
              {acceptanceSeriesOptions.map((series) =>
                visibleSeries.includes(series.key) ? (
                  <span key={series.key}>
                    <i style={{ background: series.color }} />
                    {series.label}
                    <b>{chartSeries[series.key][safeActive].toFixed(2)}%</b>
                  </span>
                ) : null
              )}
            </div>
            <span>
              {measure === "Count" ? attempts.toLocaleString() : `$${Math.round(attempts).toLocaleString()}`} attempts ·{" "}
              {declined.toLocaleString()} declined
            </span>
          </div>
        ) : null}
      </div>
      <div className="acceptance-chart-x" aria-hidden="true">
        <span>Jul 26</span>
        <span>Aug 1</span>
        <span>Aug 7</span>
        <span>Aug 13</span>
        <span>Aug 19</span>
        <span>Aug 25</span>
      </div>
    </div>
  );
}

function DeclineReasonsPanel({
  scope,
  onScopeChange,
  query,
  onQueryChange,
  rows,
  page,
  pageSize,
  totalItems,
  onPageChange
}: {
  scope: AcceptanceScope;
  onScopeChange: (scope: AcceptanceScope) => void;
  query: string;
  onQueryChange: (query: string) => void;
  rows: DeclineRow[];
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <article className="acceptance-panel acceptance-declines">
      <header>
        <div>
          <h2>Decline reasons</h2>
          <p>Authorization codes that reduce acceptance, ranked by occurrence.</p>
        </div>
        <label>
          <SearchIcon />
          <input
            aria-label="Search decline reasons"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search codes or reasons"
            value={query}
          />
        </label>
      </header>
      <div className="acceptance-decline-tabs">
        {(["Total", "Pre-auth", "Post-auth"] as AcceptanceScope[]).map((item) => (
          <button
            className={scope === item ? "active" : undefined}
            key={item}
            onClick={() => onScopeChange(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="acceptance-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Auth code</th>
              <th>Reason</th>
              <th>Category</th>
              <th>Occurrences</th>
              <th>Declined volume</th>
              <th>% of declines</th>
              <th>Trend</th>
              <th>Recommended action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.code}>
                <td>
                  <code>{row.code}</code>
                </td>
                <td>
                  <strong>{row.title}</strong>
                  <small>{row.stage}</small>
                </td>
                <td>{row.category}</td>
                <td>{row.occurrences.toLocaleString()}</td>
                <td>{row.volume}</td>
                <td>{row.share}</td>
                <td>
                  <span className={row.trend < 0 ? "positive" : row.trend > 0 ? "negative" : "neutral"}>
                    {row.trend < 0 ? <ArrowDownIcon /> : row.trend > 0 ? <ArrowUpIcon /> : null}
                    {row.trend === 0 ? "—" : `${Math.abs(row.trend)}%`}
                  </span>
                </td>
                <td>{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination
        className="acceptance-pagination"
        onPageChange={onPageChange}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
      />
      <footer className="acceptance-recovery-note">
        <CheckCircleIcon />
        <span>
          <strong>$32,404 in attempted volume may be recoverable.</strong> Authentication and customer-input declines
          are the clearest retry opportunities.
        </span>
      </footer>
    </article>
  );
}

export function AcceptanceRatePage() {
  const reportResource = useListCollection(acceptanceSnapshotAdapter);
  const [period, setPeriod] = useState<Period>("30D");
  const [scope, setScope] = useState<AcceptanceScope>("Total");
  const [measure, setMeasure] = useState<Measure>("Count");
  const [visibleSeries, setVisibleSeries] = useState<AcceptanceSeriesKey[]>([
    "acceptance",
    "chargeback",
    "bank",
    "threeDs"
  ]);
  const [declineScope, setDeclineScope] = useState<AcceptanceScope>("Total");
  const [query, setQuery] = useState("");
  const [declinePage, setDeclinePage] = useState(1);
  const [timezone, setTimezone] = useState<"Local" | "UTC">("UTC");
  const filteredDeclines = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return declineRows.filter(
      (row) =>
        (declineScope === "Total" || row.stage === declineScope) &&
        (!normalized || `${row.code} ${row.title} ${row.category} ${row.action}`.toLowerCase().includes(normalized))
    );
  }, [declineScope, query]);
  const declinePageSize = 5;
  const declineTotalPages = Math.max(1, Math.ceil(filteredDeclines.length / declinePageSize));
  const currentDeclinePage = Math.min(declinePage, declineTotalPages);
  const visibleDeclines = useMemo(() => {
    const start = (currentDeclinePage - 1) * declinePageSize;
    return filteredDeclines.slice(start, start + declinePageSize);
  }, [currentDeclinePage, filteredDeclines]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDeclinePage(1), 0);
    return () => window.clearTimeout(timer);
  }, [declineScope, query]);

  function toggleSeries(key: AcceptanceSeriesKey) {
    setVisibleSeries((current) => {
      if (!current.includes(key)) return [...current, key];
      if (current.length === 1) return current;
      return current.filter((item) => item !== key);
    });
  }

  function exportAcceptance() {
    const rows = [
      ["Auth code", "Reason", "Category", "Occurrences", "Declined volume", "Share"],
      ...filteredDeclines.map((row) => [row.code, row.title, row.category, row.occurrences, row.volume, row.share])
    ];
    const content = rows
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const href = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = href;
    link.download = "acru-acceptance-rates.csv";
    link.click();
    URL.revokeObjectURL(href);
  }

  if (reportResource.status !== "ready") {
    return (
      <CollectionPageState
        description="Authorization performance, rejection causes, and recoverable payment volume."
        error={reportResource.error}
        onRetry={reportResource.retry}
        status={reportResource.status}
        title="Acceptance rate"
      />
    );
  }

  return (
    <section className="acceptance-workspace">
      <header className="acceptance-header">
        <div>
          <h1>Acceptance rate</h1>
          <p>Authorization performance, rejection causes, and recoverable payment volume.</p>
        </div>
        <div className="acceptance-actions">
          <AcceptanceDateFilter onChange={setPeriod} value={period} />
          <div className="acceptance-timezone" aria-label="Timezone">
            {(["Local", "UTC"] as const).map((zone) => (
              <button
                className={timezone === zone ? "active" : undefined}
                key={zone}
                onClick={() => setTimezone(zone)}
                type="button"
              >
                {zone}
              </button>
            ))}
          </div>
          <button className="acceptance-export" onClick={exportAcceptance} type="button">
            <ExportIcon /> Export
          </button>
        </div>
      </header>

      <section className="acceptance-summary" aria-label="Authorization summary">
        <div>
          <span>Authorization attempts</span>
          <strong>24,820</strong>
          <small>$8.47M attempted</small>
        </div>
        <div>
          <span>Approved</span>
          <strong>24,491</strong>
          <small className="positive">
            <ArrowUpIcon /> 12.7%
          </small>
        </div>
        <div>
          <span>Declined</span>
          <strong>286</strong>
          <small className="negative">
            <ArrowDownIcon /> 6.1%
          </small>
        </div>
        <div>
          <span>Technical errors</span>
          <strong>43</strong>
          <small>0.17% of attempts</small>
        </div>
        <div className="primary">
          <span>Acceptance rate</span>
          <strong>98.7%</strong>
          <small className="positive">+1.2 pts vs. prior period</small>
        </div>
      </section>

      <article className="acceptance-panel acceptance-trend-panel">
        <header>
          <div>
            <h2>Approvals over time</h2>
            <p>Compare acceptance, protection, bank authorization, and 3DS approval performance.</p>
          </div>
          <div className="acceptance-segmented">
            {(["Count", "Volume"] as Measure[]).map((item) => (
              <button
                className={measure === item ? "active" : undefined}
                key={item}
                onClick={() => setMeasure(item)}
                type="button"
              >
                By {item.toLowerCase()}
              </button>
            ))}
          </div>
        </header>
        <div className="acceptance-chart-controls">
          <div className="acceptance-segmented">
            {(["Total", "Pre-auth", "Post-auth"] as AcceptanceScope[]).map((item) => (
              <button
                className={scope === item ? "active" : undefined}
                key={item}
                onClick={() => setScope(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
          <div className="acceptance-series-filters" aria-label="Chart metrics">
            {acceptanceSeriesOptions.map((series) => {
              const selected = visibleSeries.includes(series.key);
              return (
                <button
                  aria-pressed={selected}
                  className={selected ? "selected" : undefined}
                  key={series.key}
                  onClick={() => toggleSeries(series.key)}
                  style={{ "--series-color": series.color } as CSSProperties}
                  type="button"
                >
                  <span className="acceptance-series-check">{selected ? "✓" : null}</span>
                  {series.label}
                </button>
              );
            })}
          </div>
        </div>
        <AcceptanceTrend measure={measure} period={period} scope={scope} visibleSeries={visibleSeries} />
      </article>

      <DeclineReasonsPanel
        onPageChange={setDeclinePage}
        onQueryChange={setQuery}
        onScopeChange={setDeclineScope}
        page={currentDeclinePage}
        pageSize={declinePageSize}
        query={query}
        rows={visibleDeclines}
        scope={declineScope}
        totalItems={filteredDeclines.length}
      />

      <section className="acceptance-two-column">
        <article className="acceptance-panel acceptance-waterfall">
          <header>
            <div>
              <h2>Authorization waterfall</h2>
              <p>Where attempts leave the approval funnel.</p>
            </div>
          </header>
          {[
            ["Payment attempts", "25,320", "100%"],
            ["Passed pre-auth checks", "24,863", "98.2%"],
            ["Sent to issuer", "24,777", "97.9%"],
            ["Issuer approved", "24,491", "96.7%"],
            ["Captured", "24,102", "95.2%"]
          ].map(([label, value, rate], index) => (
            <div className="acceptance-waterfall-row" key={label}>
              <span>
                <i style={{ width: rate }} />
                <b>{label}</b>
              </span>
              <strong>{value}</strong>
              <small>{rate}</small>
              {index < 4 ? <em>−{[457, 86, 286, 389][index].toLocaleString()}</em> : null}
            </div>
          ))}
        </article>
        <article className="acceptance-panel acceptance-rail-table">
          <header>
            <div>
              <h2>Acceptance by payment rail</h2>
              <p>Attempts and approvals for every enabled rail.</p>
            </div>
          </header>
          <table>
            <thead>
              <tr>
                <th>Rail</th>
                <th>Attempts</th>
                <th>Approved</th>
                <th>Rate</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {railRows.map((row) => (
                <tr key={row.rail}>
                  <td>
                    <span className="acceptance-rail-name">
                      <span className={`payment-rail-logo is-${row.logoClass}`} aria-hidden="true">
                        <Image alt="" height={30} src={row.logo} width={48} />
                      </span>
                      <strong>{row.rail}</strong>
                    </span>
                  </td>
                  <td>{row.attempts}</td>
                  <td>{row.approved}</td>
                  <td>
                    <strong>{row.rate}</strong>
                  </td>
                  <td className={row.change.startsWith("+") ? "positive" : "negative"}>{row.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>
    </section>
  );
}
