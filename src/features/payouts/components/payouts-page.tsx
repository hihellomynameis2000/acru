"use client";

import {
  AdjustIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  BankIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  DuplicateIcon,
  ExportIcon,
  PlusIcon,
  ReceiptDollarIcon,
  SearchIcon,
  SettingsIcon,
  XIcon
} from "@shopify/polaris-icons";
import Link from "next/link";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import type { ListAdapter } from "@/components/data/adapter";
import { matchesDatePreset } from "@/components/data/date-filter";
import { createMoney, decimalAmount, formatMoney, minorUnitsFromDecimal } from "@/components/data/money";
import { useListCollection } from "@/components/data/use-list-collection";
import { CollectionPageState } from "@/components/ui/collection-state";
import { TablePagination } from "@/components/ui/table-pagination";
import { useToast } from "@/components/ui/toast";
import { useDismissOnEscape } from "@/components/ui/use-dismiss-on-escape";
import { payoutAdapter, type Payout, type PayoutStatus, type PayoutType } from "@/features/payouts/data/payouts";

const statuses: Array<"All" | PayoutStatus> = ["All", "In transit", "Paid", "Pending", "Failed", "Canceled"];

function money(value: number) {
  return formatMoney(createMoney(value));
}

function copy(value: string) {
  return navigator.clipboard?.writeText(value);
}

function downloadText(filename: string, contents: string, type = "text/plain;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function PayoutStatusPill({ status }: { status: PayoutStatus }) {
  const Icon =
    status === "Paid" ? CheckCircleIcon : status === "In transit" || status === "Pending" ? ClockIcon : AlertCircleIcon;
  return (
    <span className="payout-status" data-status={status.toLowerCase().replace(" ", "-")}>
      <Icon />
      {status}
    </span>
  );
}

function PayoutDrawer({ payout, onClose }: { payout: Payout; onClose: () => void }) {
  const notify = useToast();
  const [tab, setTab] = useState("Overview");
  const [actionsOpen, setActionsOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  function closeDrawer() {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, 260);
  }
  useDismissOnEscape(true, closeDrawer);

  return (
    <aside className="payout-drawer" data-closing={closing} aria-label={`Payout ${payout.id}`}>
      <header className="payout-drawer-header">
        <button className="payout-drawer-close" type="button" onClick={closeDrawer} aria-label="Close payout">
          <XIcon />
        </button>
        <span className="payout-bank-icon">
          <BankIcon />
        </span>
        <div className="payout-drawer-title">
          <h2>{money(payout.amountMinor)}</h2>
          <span>
            {payout.type} payout · {payout.id}
          </span>
        </div>
        <div className="payout-drawer-actions">
          <PayoutStatusPill status={payout.status} />
          <div className="payout-actions-wrap">
            <button type="button" onClick={() => setActionsOpen((open) => !open)}>
              Actions <ChevronDownIcon />
            </button>
            {actionsOpen ? (
              <>
                <button
                  className="payout-menu-scrim"
                  type="button"
                  aria-label="Close actions"
                  onClick={() => setActionsOpen(false)}
                />
                <div className="payout-actions-menu">
                  <button type="button" onClick={() => void copy(payout.id)}>
                    <DuplicateIcon />
                    Copy payout ID
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      downloadText(
                        `acru-payout-${payout.id}.txt`,
                        `Payout ${payout.id}\nAmount: ${money(payout.amountMinor)}\nStatus: ${payout.status}`
                      )
                    }
                  >
                    <ReceiptDollarIcon />
                    Download confirmation
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      downloadText(
                        `acru-payout-${payout.id}.csv`,
                        `"Payout ID","Amount","Status"\n"${payout.id}","${decimalAmount(payout.amountMinor)}","${payout.status}"`,
                        "text/csv;charset=utf-8"
                      )
                    }
                  >
                    <ExportIcon />
                    Export payout details
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <nav className="payout-drawer-tabs" aria-label="Payout detail sections">
        {["Overview", "Timeline", "Transactions", "Metadata"].map((item) => (
          <button key={item} className={tab === item ? "active" : ""} type="button" onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </nav>

      <div className="payout-drawer-body">
        {tab === "Overview" ? (
          <>
            <section className="payout-arrival-card">
              <span className="payout-arrival-icon">
                <BankIcon />
              </span>
              <div>
                <span>{payout.status === "Paid" ? "Arrived" : "Expected arrival"}</span>
                <strong>{payout.arrival === "—" ? "Not scheduled" : `${payout.arrival}, 2026`}</strong>
                <small>
                  {payout.status === "In transit"
                    ? "Your bank may take additional time to post the funds."
                    : "Wells Fargo checking •••• 4242"}
                </small>
              </div>
              <PayoutStatusPill status={payout.status} />
            </section>

            <section className="payout-detail-card">
              <h3>Payout summary</h3>
              <dl>
                <div>
                  <dt>Gross payout</dt>
                  <dd>{money(payout.amountMinor + payout.feeMinor)}</dd>
                </div>
                <div>
                  <dt>Instant payout fee</dt>
                  <dd>{payout.feeMinor ? `−${money(payout.feeMinor)}` : money(0)}</dd>
                </div>
                <div className="payout-detail-total">
                  <dt>Sent to bank</dt>
                  <dd>{money(payout.amountMinor)}</dd>
                </div>
              </dl>
            </section>

            <section className="payout-detail-two-column">
              <article className="payout-detail-card">
                <h3>Destination</h3>
                <div className="payout-destination">
                  <span>
                    <BankIcon />
                  </span>
                  <div>
                    <strong>{payout.destination}</strong>
                    <small>Business checking •••• {payout.last4}</small>
                  </div>
                </div>
                <dl>
                  <div>
                    <dt>Account holder</dt>
                    <dd>Northstar Studio LLC</dd>
                  </div>
                  <div>
                    <dt>Currency</dt>
                    <dd>USD</dd>
                  </div>
                  <div>
                    <dt>Bank country</dt>
                    <dd>United States</dd>
                  </div>
                </dl>
              </article>
              <article className="payout-detail-card">
                <h3>Reconciliation</h3>
                <dl>
                  <div>
                    <dt>Transactions</dt>
                    <dd>{payout.transactions}</dd>
                  </div>
                  <div>
                    <dt>Bank trace ID</dt>
                    <dd>
                      <code>{payout.trace}</code>
                      <button type="button" onClick={() => void copy(payout.trace)} aria-label="Copy trace ID">
                        <DuplicateIcon />
                      </button>
                    </dd>
                  </div>
                  <div>
                    <dt>Statement descriptor</dt>
                    <dd>ACRU PAYOUT</dd>
                  </div>
                </dl>
                <Link className="payout-inline-link" href="/reports/wallet">
                  View balance transactions <ArrowRightIcon />
                </Link>
              </article>
            </section>

            <section className="payout-detail-card">
              <h3>Payout details</h3>
              <dl>
                <div>
                  <dt>Created</dt>
                  <dd>
                    {payout.created} at {payout.time} EDT
                  </dd>
                </div>
                <div>
                  <dt>Method</dt>
                  <dd>ACH credit</dd>
                </div>
                <div>
                  <dt>Type</dt>
                  <dd>{payout.type}</dd>
                </div>
                <div>
                  <dt>Payout ID</dt>
                  <dd>
                    <code>{payout.id}</code>
                    <button type="button" onClick={() => void copy(payout.id)} aria-label="Copy payout ID">
                      <DuplicateIcon />
                    </button>
                  </dd>
                </div>
              </dl>
            </section>
          </>
        ) : null}

        {tab === "Timeline" ? (
          <section className="payout-detail-card">
            <h3>Payout timeline</h3>
            <ol className="payout-timeline">
              <li>
                <span />
                <div>
                  <strong>{payout.status === "Paid" ? "Payout arrived" : "Payout in transit"}</strong>
                  <small>{payout.arrival === "—" ? "Canceled before submission" : `${payout.arrival}, 2026`}</small>
                </div>
              </li>
              <li>
                <span />
                <div>
                  <strong>Submitted to banking network</strong>
                  <small>
                    {payout.created} · {payout.time}
                  </small>
                </div>
              </li>
              <li>
                <span />
                <div>
                  <strong>Payout created</strong>
                  <small>{payout.transactions} balance transactions included</small>
                </div>
              </li>
            </ol>
          </section>
        ) : null}

        {tab === "Transactions" ? (
          <section className="payout-detail-card">
            <h3>Included balance activity</h3>
            <div className="payout-activity-summary">
              <div>
                <span>Payments</span>
                <strong>{payout.transactions}</strong>
                <small>{money(payout.amountMinor + payout.feeMinor + 143_218)}</small>
              </div>
              <div>
                <span>Refunds</span>
                <strong>12</strong>
                <small>−{money(119_842)}</small>
              </div>
              <div>
                <span>Fees</span>
                <strong>—</strong>
                <small>−{money(23_376)}</small>
              </div>
            </div>
            <Link className="payout-wide-button" href="/reports/wallet">
              Open balance report <ArrowRightIcon />
            </Link>
          </section>
        ) : null}

        {tab === "Metadata" ? (
          <section className="payout-detail-card">
            <h3>Metadata</h3>
            <dl>
              <div>
                <dt>batch_id</dt>
                <dd>batch_{payout.id.slice(-6)}</dd>
              </div>
              <div>
                <dt>source</dt>
                <dd>launchpad_payouts</dd>
              </div>
              <div>
                <dt>environment</dt>
                <dd>production</dd>
              </div>
            </dl>
            <button
              className="payout-inline-link"
              type="button"
              onClick={() => notify({ title: "Metadata editor opened", description: payout.id })}
            >
              <PlusIcon /> Add metadata
            </button>
          </section>
        ) : null}
      </div>
    </aside>
  );
}

export function PayoutsPage({ adapter = payoutAdapter }: { adapter?: ListAdapter<Payout> }) {
  const notify = useToast();
  const { error, items: payouts, retry, setItems: setPayouts, status: resourceStatus } = useListCollection(adapter);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [type, setType] = useState<"All types" | PayoutType>("All types");
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [dateOpen, setDateOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [schedule, setSchedule] = useState("Every 2 days");
  const [selected, setSelected] = useState<Payout | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [destination, setDestination] = useState("Wells Fargo •••• 4242");
  const [speed, setSpeed] = useState<PayoutType>("Manual");
  const [page, setPage] = useState(1);
  useDismissOnEscape(createOpen || scheduleOpen || dateOpen || filterOpen, () => {
    setCreateOpen(false);
    setScheduleOpen(false);
    setDateOpen(false);
    setFilterOpen(false);
  });

  const filteredPayouts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return payouts.filter((payout) => {
      const matchesQuery =
        !normalized ||
        [payout.id, payout.destination, payout.last4, payout.trace].join(" ").toLowerCase().includes(normalized);
      return (
        matchesQuery &&
        (status === "All" || payout.status === status) &&
        (type === "All types" || payout.type === type) &&
        matchesDatePreset(payout.created, dateRange)
      );
    });
  }, [dateRange, payouts, query, status, type]);
  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(filteredPayouts.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filteredPayouts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const paidMonth = payouts
    .filter((payout) => payout.status === "Paid" && payout.created.includes("Aug"))
    .reduce((sum, payout) => sum + payout.amountMinor, 0);

  function exportCsv() {
    const rows = [
      [
        "Payout ID",
        "Created",
        "Arrival",
        "Amount",
        "Status",
        "Type",
        "Destination",
        "Last 4",
        "Fee",
        "Transactions",
        "Trace ID"
      ],
      ...filteredPayouts.map((payout) => [
        payout.id,
        `${payout.created} ${payout.time}`,
        payout.arrival,
        decimalAmount(payout.amountMinor),
        payout.status,
        payout.type,
        payout.destination,
        payout.last4,
        decimalAmount(payout.feeMinor),
        payout.transactions,
        payout.trace
      ])
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "acru-payouts.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function createPayout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      const amountMinor = minorUnitsFromDecimal(String(data.get("amount") ?? ""));
      if (amountMinor <= 0 || amountMinor > 59_821_441) {
        throw new RangeError("Enter an amount within the available balance.");
      }
      const payout: Payout = {
        amountMinor,
        arrival: speed === "Instant" ? "Aug 28" : "Sep 1",
        created: "Aug 28, 2026",
        destination: destination.replace(/ ••••.*/, ""),
        feeMinor: speed === "Instant" ? Math.round(amountMinor * 0.015) : 0,
        id: `po_${Date.now().toString(36)}`,
        last4: destination.slice(-4),
        status: speed === "Instant" ? "In transit" : "Pending",
        time: "Now",
        trace: "Pending",
        transactions: 0,
        type: speed
      };
      setPayouts((items) => [payout, ...items]);
      setCreateOpen(false);
      setSelected(payout);
      notify({ title: "Payout created", description: money(amountMinor), tone: "success" });
    } catch (error) {
      notify({
        title: "Payout could not be created",
        description: error instanceof Error ? error.message : "Check the entered amount.",
        tone: "danger"
      });
    }
  }

  if (resourceStatus !== "ready") {
    return (
      <CollectionPageState
        description="Track settlement timing, destinations, fees, and payout status."
        error={error}
        onRetry={retry}
        status={resourceStatus}
        title="Payouts"
      />
    );
  }

  return (
    <div className="payouts-workspace" data-detail-open={Boolean(selected)}>
      <section className="payouts-list-pane">
        <header className="payouts-page-heading">
          <div>
            <h1>Payouts</h1>
            <p>Move available funds to your connected bank accounts.</p>
          </div>
          <div className="payouts-page-actions">
            <div className="payout-schedule-wrap">
              <button
                className="payouts-secondary-button"
                type="button"
                onClick={() => setScheduleOpen((open) => !open)}
              >
                <SettingsIcon />
                Schedule
              </button>
              {scheduleOpen ? (
                <>
                  <button
                    className="payout-popup-scrim"
                    type="button"
                    aria-label="Close schedule"
                    onClick={() => setScheduleOpen(false)}
                  />
                  <div className="payout-schedule-menu">
                    <header>
                      <span>Payout schedule</span>
                      <strong>{schedule === "Manual" ? "Manual" : `Automatic · ${schedule}`}</strong>
                    </header>
                    <button
                      className={schedule === "Every 2 days" ? "active" : undefined}
                      type="button"
                      onClick={() => {
                        setSchedule("Every 2 days");
                        setScheduleOpen(false);
                        notify({ title: "Payout schedule updated", description: "Every 2 days", tone: "success" });
                      }}
                    >
                      <span>
                        <b>Every 2 days</b>
                        <small>Funds arrive on a rolling basis</small>
                      </span>
                      <CheckCircleIcon />
                    </button>
                    <button
                      className={schedule === "Weekly" ? "active" : undefined}
                      type="button"
                      onClick={() => {
                        setSchedule("Weekly");
                        setScheduleOpen(false);
                        notify({ title: "Payout schedule updated", description: "Weekly", tone: "success" });
                      }}
                    >
                      <span>
                        <b>Weekly</b>
                        <small>Choose a weekday</small>
                      </span>
                    </button>
                    <button
                      className={schedule === "Manual" ? "active" : undefined}
                      type="button"
                      onClick={() => {
                        setSchedule("Manual");
                        setScheduleOpen(false);
                        notify({ title: "Payout schedule updated", description: "Manual", tone: "success" });
                      }}
                    >
                      <span>
                        <b>Manual</b>
                        <small>You initiate each payout</small>
                      </span>
                    </button>
                    <footer>
                      Minimum balance <strong>$2,500.00</strong>
                    </footer>
                  </div>
                </>
              ) : null}
            </div>
            <button className="payouts-secondary-button" type="button" onClick={exportCsv}>
              <ExportIcon />
              Export
            </button>
            <button className="payouts-create-button" type="button" onClick={() => setCreateOpen(true)}>
              Create payout <PlusIcon />
            </button>
          </div>
        </header>

        <section className="payouts-metrics" aria-label="Payout summary">
          <div>
            <span>Available to pay out</span>
            <strong>{money(59_821_441)}</strong>
            <small>USD balance</small>
          </div>
          <div>
            <span>Next automatic payout</span>
            <strong>{money(9_844_312)}</strong>
            <small>Tomorrow at 2:00 PM</small>
          </div>
          <div>
            <span>Currently in transit</span>
            <strong>{money(9_844_312)}</strong>
            <small>1 payout</small>
          </div>
          <div>
            <span>Paid this month</span>
            <strong>{money(paidMonth)}</strong>
            <small>5 completed payouts</small>
          </div>
        </section>

        <div className="payouts-toolbar">
          <div className="payouts-status-tabs" role="tablist" aria-label="Payout status">
            {statuses.map((option) => (
              <button
                key={option}
                className={status === option ? "active" : ""}
                type="button"
                onClick={() => setStatus(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="payouts-tools">
            <label className="payouts-search">
              <SearchIcon />
              <input
                type="search"
                placeholder="Search payouts"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div className="payout-date-wrap">
              <button
                className="payout-date-button"
                type="button"
                aria-expanded={dateOpen}
                onClick={() => {
                  setFilterOpen(false);
                  setDateOpen((open) => !open);
                }}
              >
                <CalendarIcon />
                {dateRange}
                <ChevronDownIcon />
              </button>
              {dateOpen ? (
                <>
                  <button
                    className="payout-popup-scrim"
                    type="button"
                    aria-label="Close date range"
                    onClick={() => setDateOpen(false)}
                  />
                  <div className="payout-date-menu">
                    <span>Date range</span>
                    {["Today", "Last 7 days", "Last 30 days", "Last 90 days", "All time"].map((option) => (
                      <button
                        key={option}
                        className={dateRange === option ? "active" : ""}
                        type="button"
                        onClick={() => {
                          setDateRange(option);
                          setDateOpen(false);
                        }}
                      >
                        {option}
                        {dateRange === option ? <CheckCircleIcon /> : null}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
            <div className="payout-filter-wrap">
              <button
                className="payout-filter-button"
                type="button"
                aria-label="Filter payouts"
                onClick={() => {
                  setDateOpen(false);
                  setFilterOpen((open) => !open);
                }}
              >
                <AdjustIcon />
              </button>
              {filterOpen ? (
                <>
                  <button
                    className="payout-popup-scrim"
                    type="button"
                    aria-label="Close filters"
                    onClick={() => setFilterOpen(false)}
                  />
                  <div className="payout-filter-menu">
                    <span>Payout type</span>
                    {(["All types", "Automatic", "Manual", "Instant"] as const).map((option) => (
                      <button
                        key={option}
                        className={type === option ? "active" : ""}
                        type="button"
                        onClick={() => {
                          setType(option);
                          setFilterOpen(false);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="payouts-table-wrap">
          <table className="payouts-table">
            <thead>
              <tr>
                <th>Created</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Expected arrival</th>
                <th>Destination</th>
                <th>Type</th>
                <th>Transactions</th>
                <th>Fee</th>
                <th>Payout ID</th>
              </tr>
            </thead>
            <tbody>
              {!visible.length ? (
                <tr className="payouts-empty-row">
                  <td colSpan={9}>No payouts match these filters.</td>
                </tr>
              ) : null}
              {visible.map((payout) => (
                <tr
                  key={payout.id}
                  tabIndex={0}
                  data-selected={selected?.id === payout.id}
                  onClick={() => setSelected(payout)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") setSelected(payout);
                  }}
                >
                  <td>
                    <strong>{payout.created}</strong>
                    <small>{payout.time}</small>
                  </td>
                  <td>
                    <strong>{money(payout.amountMinor)}</strong>
                    <small>USD</small>
                  </td>
                  <td>
                    <PayoutStatusPill status={payout.status} />
                  </td>
                  <td>{payout.arrival}</td>
                  <td>
                    <span className="payout-destination-pill">
                      <BankIcon />
                      <span>
                        {payout.destination}
                        <small>•••• {payout.last4}</small>
                      </span>
                    </span>
                  </td>
                  <td>
                    <span className="payout-type-pill">{payout.type}</span>
                  </td>
                  <td>{payout.transactions}</td>
                  <td>{payout.feeMinor ? `−${money(payout.feeMinor)}` : "—"}</td>
                  <td>
                    <code>{payout.id}</code>
                    <button
                      type="button"
                      aria-label="Copy payout ID"
                      onClick={(event) => {
                        event.stopPropagation();
                        void copy(payout.id);
                      }}
                    >
                      <DuplicateIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          className="payouts-pagination"
          onPageChange={setPage}
          page={currentPage}
          pageSize={pageSize}
          totalItems={filteredPayouts.length}
        />
      </section>

      {selected ? <PayoutDrawer payout={selected} onClose={() => setSelected(null)} /> : null}

      {createOpen ? (
        <div
          className="payout-create-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCreateOpen(false);
          }}
        >
          <form
            className="payout-create-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Create payout"
            onSubmit={createPayout}
          >
            <header>
              <div>
                <h2>Create payout</h2>
                <p>Send available funds to your bank account.</p>
              </div>
              <button type="button" onClick={() => setCreateOpen(false)} aria-label="Close">
                <XIcon />
              </button>
            </header>
            <div className="payout-create-balance">
              <span>Available balance</span>
              <strong>{money(59_821_441)}</strong>
            </div>
            <div className="payout-create-form">
              <label>
                Amount
                <div className="payout-amount-input">
                  <span>$</span>
                  <input
                    inputMode="decimal"
                    name="amount"
                    defaultValue="10000.00"
                    pattern="[0-9]+(?:\.[0-9]{1,2})?"
                    required
                  />
                </div>
              </label>
              <label>
                Destination
                <div className="payout-native-select">
                  <button
                    type="button"
                    aria-expanded={destinationOpen}
                    onClick={() => setDestinationOpen((open) => !open)}
                  >
                    <span>
                      <BankIcon />
                      {destination}
                    </span>
                    <ChevronDownIcon />
                  </button>
                  {destinationOpen ? (
                    <>
                      <button
                        className="payout-native-select-scrim"
                        type="button"
                        aria-label="Close destinations"
                        onClick={() => setDestinationOpen(false)}
                      />
                      <div className="payout-native-select-menu">
                        {["Wells Fargo •••• 4242", "Chase •••• 8814"].map((option) => (
                          <button
                            key={option}
                            className={destination === option ? "active" : ""}
                            type="button"
                            onClick={() => {
                              setDestination(option);
                              setDestinationOpen(false);
                            }}
                          >
                            {option}
                            {destination === option ? <CheckCircleIcon /> : null}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              </label>
              <fieldset>
                <legend>Payout speed</legend>
                {(["Manual", "Instant"] as const).map((option) => (
                  <button
                    key={option}
                    className={speed === option ? "active" : ""}
                    type="button"
                    onClick={() => setSpeed(option)}
                  >
                    <span>
                      <strong>{option === "Manual" ? "Standard" : "Instant"}</strong>
                      <small>
                        {option === "Manual" ? "Arrives in 1–2 business days · Free" : "Arrives in minutes · 1.5% fee"}
                      </small>
                    </span>
                    {speed === option ? <CheckCircleIcon /> : null}
                  </button>
                ))}
              </fieldset>
              <label className="payout-create-checkbox">
                <input type="checkbox" defaultChecked /> Email payout confirmation to finance@northstar.studio
              </label>
            </div>
            <footer>
              <button type="button" onClick={() => setCreateOpen(false)}>
                Cancel
              </button>
              <button type="submit">Review payout</button>
            </footer>
          </form>
        </div>
      ) : null}
    </div>
  );
}
