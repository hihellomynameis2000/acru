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
  CreditCardIcon,
  DuplicateIcon,
  ExportIcon,
  PlusIcon,
  ReceiptDollarIcon,
  RefreshIcon,
  SearchIcon,
  ShieldCheckMarkIcon,
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
import {
  transactionAdapter,
  type PaymentMethod,
  type Transaction,
  type TransactionStatus
} from "@/features/transactions/data/transactions";

const statusOptions: Array<"All" | TransactionStatus> = [
  "All",
  "Succeeded",
  "Processing",
  "Failed",
  "Refunded",
  "Disputed"
];

function money(value: number) {
  return formatMoney(createMoney(value));
}

function copy(value: string) {
  return navigator.clipboard?.writeText(value);
}

function StatusPill({ status }: { status: TransactionStatus }) {
  const Icon =
    status === "Succeeded"
      ? CheckCircleIcon
      : status === "Processing"
        ? ClockIcon
        : status === "Refunded"
          ? RefreshIcon
          : AlertCircleIcon;
  return (
    <span className="transaction-status" data-status={status.toLowerCase()}>
      <Icon /> {status}
    </span>
  );
}

function MethodIcon({ method }: { method: PaymentMethod }) {
  if (method === "ACH") return <BankIcon />;
  if (method === "USDC") return <span className="transaction-usdc">$</span>;
  return <CreditCardIcon />;
}

function TransactionDrawer({
  transaction,
  onClose,
  onRefund
}: {
  transaction: Transaction;
  onClose: () => void;
  onRefund: (id: string) => void;
}) {
  const notify = useToast();
  const [tab, setTab] = useState("Overview");
  const [actionsOpen, setActionsOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const net = transaction.status === "Refunded" ? 0 : transaction.amountMinor - transaction.feeMinor;

  function closeDrawer() {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, 260);
  }
  useDismissOnEscape(true, closeDrawer);

  return (
    <aside className="transaction-drawer" data-closing={closing} aria-label={`Transaction ${transaction.id}`}>
      <header className="transaction-drawer-header">
        <button className="transaction-drawer-close" type="button" onClick={closeDrawer} aria-label="Close transaction">
          <XIcon />
        </button>
        <div className="transaction-drawer-title">
          <span className="transaction-method-large">
            <MethodIcon method={transaction.method} />
          </span>
          <div>
            <h2>{money(transaction.amountMinor)}</h2>
            <span>
              {transaction.description} · {transaction.id}
            </span>
          </div>
        </div>
        <div className="transaction-drawer-actions">
          <StatusPill status={transaction.status} />
          <div className="transaction-actions-wrap">
            <button type="button" onClick={() => setActionsOpen((open) => !open)}>
              Actions <ChevronDownIcon />
            </button>
            {actionsOpen ? (
              <>
                <button
                  className="transaction-menu-scrim"
                  type="button"
                  aria-label="Close actions"
                  onClick={() => setActionsOpen(false)}
                />
                <div className="transaction-actions-menu">
                  <button type="button" onClick={() => void copy(transaction.id)}>
                    <DuplicateIcon /> Copy payment ID
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActionsOpen(false);
                      notify({ title: "Receipt sent", description: transaction.email, tone: "success" });
                    }}
                  >
                    <ReceiptDollarIcon /> Send receipt
                  </button>
                  <button
                    type="button"
                    disabled={transaction.status !== "Succeeded"}
                    onClick={() => {
                      onRefund(transaction.id);
                      setActionsOpen(false);
                    }}
                  >
                    <RefreshIcon /> Refund payment
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <nav className="transaction-drawer-tabs" aria-label="Transaction detail sections">
        {["Overview", "Timeline", "Risk", "Metadata"].map((item) => (
          <button key={item} className={tab === item ? "active" : ""} type="button" onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </nav>

      <div className="transaction-drawer-body">
        {tab === "Overview" ? (
          <>
            <section className="transaction-summary-grid">
              <div>
                <span>Amount</span>
                <strong>{money(transaction.amountMinor)}</strong>
              </div>
              <div>
                <span>ACRU fee</span>
                <strong>−{money(transaction.feeMinor)}</strong>
              </div>
              <div>
                <span>Net</span>
                <strong>{money(net)}</strong>
              </div>
            </section>

            <section className="transaction-detail-card">
              <h3>Payment details</h3>
              <dl>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <StatusPill status={transaction.status} />
                  </dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd>
                    {transaction.createdAt} at {transaction.time} EDT
                  </dd>
                </div>
                <div>
                  <dt>Description</dt>
                  <dd>{transaction.description}</dd>
                </div>
                <div>
                  <dt>Statement descriptor</dt>
                  <dd>ACRU *NORTHSTAR</dd>
                </div>
                <div>
                  <dt>Payment ID</dt>
                  <dd>
                    <code>{transaction.id}</code>
                    <button type="button" onClick={() => void copy(transaction.id)} aria-label="Copy payment ID">
                      <DuplicateIcon />
                    </button>
                  </dd>
                </div>
              </dl>
            </section>

            <section className="transaction-detail-two-column">
              <article className="transaction-detail-card">
                <h3>Payment method</h3>
                <div className="transaction-payment-method">
                  <span>
                    <MethodIcon method={transaction.method} />
                  </span>
                  <div>
                    <strong>
                      {transaction.method} {transaction.method !== "USDC" ? `•••• ${transaction.last4}` : "on Base"}
                    </strong>
                    <small>
                      {transaction.method === "ACH"
                        ? "US bank account"
                        : transaction.method === "USDC"
                          ? "2/6 confirmations"
                          : "Expires 06/29"}
                    </small>
                  </div>
                </div>
                <dl>
                  <div>
                    <dt>Authorization</dt>
                    <dd>Approved</dd>
                  </div>
                  <div>
                    <dt>3DS Secure</dt>
                    <dd>Automatic</dd>
                  </div>
                  <div>
                    <dt>Country</dt>
                    <dd>{transaction.country}</dd>
                  </div>
                </dl>
              </article>

              <article className="transaction-detail-card">
                <h3>Customer</h3>
                <div className="transaction-customer-avatar">
                  {transaction.customer
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
                <strong>{transaction.customer}</strong>
                <small>{transaction.email}</small>
                <Link className="transaction-inline-link" href={`/payments/customers?customer=${transaction.id}`}>
                  View customer <ArrowRightIcon />
                </Link>
              </article>
            </section>

            <section className="transaction-detail-card transaction-risk-card">
              <h3>Risk evaluation</h3>
              <span className="transaction-risk-icon">
                <ShieldCheckMarkIcon />
              </span>
              <div>
                <strong>{transaction.risk} risk</strong>
                <small>ACRU Protect evaluated device, identity, velocity, and payment signals.</small>
              </div>
              <b>
                {transaction.risk === "Elevated" ? "67" : "12"}
                <small>/100</small>
              </b>
            </section>
          </>
        ) : null}

        {tab === "Timeline" ? (
          <section className="transaction-detail-card">
            <h3>Payment timeline</h3>
            <ol className="transaction-timeline">
              <li>
                <span />
                <div>
                  <strong>Payment {transaction.status.toLowerCase()}</strong>
                  <small>
                    {transaction.createdAt} · {transaction.time}
                  </small>
                </div>
                <b>{money(transaction.amountMinor)}</b>
              </li>
              <li>
                <span />
                <div>
                  <strong>Payment authorized</strong>
                  <small>
                    {transaction.createdAt} · {transaction.time}
                  </small>
                </div>
              </li>
              <li>
                <span />
                <div>
                  <strong>Payment initiated</strong>
                  <small>Checkout session completed</small>
                </div>
              </li>
            </ol>
          </section>
        ) : null}

        {tab === "Risk" ? (
          <section className="transaction-detail-card transaction-risk-report">
            <h3>Risk signals</h3>
            <div>
              <span>Risk score</span>
              <strong>{transaction.risk === "Elevated" ? "67 — Elevated" : "12 — Low"}</strong>
            </div>
            <div>
              <span>Authentication</span>
              <strong>Adaptive</strong>
            </div>
            <div>
              <span>3DS Secure</span>
              <strong>Automatic</strong>
            </div>
            <div>
              <span>Device</span>
              <strong>Recognized</strong>
            </div>
            <div>
              <span>IP location</span>
              <strong>Matches billing country</strong>
            </div>
          </section>
        ) : null}

        {tab === "Metadata" ? (
          <section className="transaction-detail-card">
            <h3>Metadata</h3>
            <dl>
              <div>
                <dt>order_id</dt>
                <dd>ord_{transaction.id.slice(-8)}</dd>
              </div>
              <div>
                <dt>source</dt>
                <dd>acru_checkout</dd>
              </div>
              <div>
                <dt>environment</dt>
                <dd>production</dd>
              </div>
            </dl>
            <button
              className="transaction-add-metadata"
              type="button"
              onClick={() => notify({ title: "Metadata editor opened", description: transaction.id })}
            >
              <PlusIcon /> Add metadata
            </button>
          </section>
        ) : null}
      </div>
    </aside>
  );
}

export function TransactionsPage({ adapter = transactionAdapter }: { adapter?: ListAdapter<Transaction> }) {
  const notify = useToast();
  const {
    error,
    items: transactions,
    retry,
    setItems: setTransactions,
    status: resourceStatus
  } = useListCollection(adapter);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("All");
  const [method, setMethod] = useState<"All methods" | PaymentMethod>("All methods");
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [dateOpen, setDateOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createMethod, setCreateMethod] = useState("Card on file");
  const [createMethodOpen, setCreateMethodOpen] = useState(false);
  const [page, setPage] = useState(1);
  useDismissOnEscape(createOpen, () => {
    setCreateMethodOpen(false);
    setCreateOpen(false);
  });

  const filteredTransactions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return transactions.filter((transaction) => {
      const matchesQuery =
        !normalized ||
        [transaction.id, transaction.customer, transaction.email, transaction.description, transaction.last4]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      const matchesStatus = status === "All" || transaction.status === status;
      const matchesMethod = method === "All methods" || transaction.method === method;
      return matchesQuery && matchesStatus && matchesMethod && matchesDatePreset(transaction.createdAt, dateRange);
    });
  }, [dateRange, method, query, status, transactions]);
  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleTransactions = filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const metrics = useMemo(() => {
    const succeeded = transactions.filter((transaction) => transaction.status === "Succeeded");
    const gross = succeeded.reduce((sum, transaction) => sum + transaction.amountMinor, 0);
    const fees = succeeded.reduce((sum, transaction) => sum + transaction.feeMinor, 0);
    const refunded = transactions
      .filter((transaction) => transaction.status === "Refunded")
      .reduce((sum, transaction) => sum + transaction.amountMinor, 0);
    return { gross, fees, net: gross - fees, refunded };
  }, [transactions]);

  function exportCsv() {
    const rows = [
      ["ID", "Created", "Amount", "Currency", "Status", "Customer", "Email", "Method", "Last 4", "Fee", "Net"],
      ...filteredTransactions.map((transaction) => [
        transaction.id,
        `${transaction.createdAt} ${transaction.time}`,
        decimalAmount(transaction.amountMinor),
        transaction.currency,
        transaction.status,
        transaction.customer,
        transaction.email,
        transaction.method,
        transaction.last4,
        decimalAmount(transaction.feeMinor),
        decimalAmount(transaction.amountMinor - transaction.feeMinor)
      ])
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "acru-transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function refundTransaction(id: string) {
    setTransactions((items) => items.map((item) => (item.id === id ? { ...item, status: "Refunded" } : item)));
    setSelected((item) => (item?.id === id ? { ...item, status: "Refunded" } : item));
  }

  function createPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const amountMinor = minorUnitsFromDecimal(String(data.get("amount") ?? ""));
      const customer = String(data.get("customer") ?? "").trim();
      const email = String(data.get("email") ?? "").trim();
      const description = String(data.get("description") ?? "").trim();
      if (amountMinor <= 0 || !customer || !email || !description)
        throw new RangeError("Complete every payment field.");
      const method: PaymentMethod = createMethod === "ACH debit" ? "ACH" : "Visa";
      const transaction: Transaction = {
        amountMinor,
        country: "United States",
        createdAt: "Aug 28, 2026",
        currency: "USD",
        customer,
        description,
        email,
        feeMinor: Math.round(amountMinor * (method === "ACH" ? 0.008 : 0.029)),
        id: `pi_${window.crypto.randomUUID().replaceAll("-", "").slice(0, 14)}`,
        last4: method === "ACH" ? "Bank" : "4242",
        method,
        risk: "Low",
        status: "Succeeded",
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
      };
      setTransactions((items) => [transaction, ...items]);
      setCreateOpen(false);
      notify({ title: "Payment created", description: money(amountMinor), tone: "success" });
    } catch (error) {
      notify({
        title: "Payment could not be created",
        description: error instanceof Error ? error.message : "Check the entered details.",
        tone: "danger"
      });
    }
  }

  if (resourceStatus !== "ready") {
    return (
      <CollectionPageState
        description="Monitor every payment, refund, dispute, and settlement event."
        error={error}
        onRetry={retry}
        status={resourceStatus}
        title="Transactions"
      />
    );
  }

  return (
    <div className="transactions-workspace" data-detail-open={Boolean(selected)}>
      <section className="transactions-list-pane">
        <header className="transactions-page-heading">
          <div>
            <h1>Transactions</h1>
            <p>Monitor every payment, refund, dispute, and settlement event.</p>
          </div>
          <div className="transactions-page-actions">
            <button className="transactions-secondary-button" type="button" onClick={exportCsv}>
              <ExportIcon /> Export
            </button>
            <button className="transactions-create-button" type="button" onClick={() => setCreateOpen(true)}>
              Create payment <PlusIcon />
            </button>
          </div>
        </header>

        <section className="transactions-metrics" aria-label="Transaction summary">
          <div>
            <span>Gross volume</span>
            <strong>{money(metrics.gross)}</strong>
            <small>Successful payments</small>
          </div>
          <div>
            <span>Fees</span>
            <strong>{money(metrics.fees)}</strong>
            <small>Processing and platform</small>
          </div>
          <div>
            <span>Net volume</span>
            <strong>{money(metrics.net)}</strong>
            <small>After fees</small>
          </div>
          <div>
            <span>Refunded</span>
            <strong>{money(metrics.refunded)}</strong>
            <small>1 payment</small>
          </div>
        </section>

        <div className="transactions-toolbar">
          <div className="transactions-status-tabs" role="tablist" aria-label="Transaction status">
            {statusOptions.map((option) => (
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
          <div className="transactions-tools">
            <label className="transactions-search">
              <SearchIcon />
              <input
                type="search"
                placeholder="Search transactions"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div className="transactions-date-wrap">
              <button
                className="transactions-date-button"
                type="button"
                aria-haspopup="menu"
                aria-expanded={dateOpen}
                onClick={() => {
                  setFiltersOpen(false);
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
                    className="transactions-filter-scrim"
                    type="button"
                    aria-label="Close date range"
                    onClick={() => setDateOpen(false)}
                  />
                  <div className="transactions-date-menu" role="menu">
                    <span>Date range</span>
                    {["Today", "Last 7 days", "Last 30 days", "Last 90 days", "All time"].map((option) => (
                      <button
                        key={option}
                        className={dateRange === option ? "active" : ""}
                        type="button"
                        role="menuitem"
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
            <div className="transactions-filter-wrap">
              <button
                className="transactions-filter-button"
                type="button"
                aria-label="Filter transactions"
                onClick={() => {
                  setDateOpen(false);
                  setFiltersOpen((open) => !open);
                }}
              >
                <AdjustIcon />
              </button>
              {filtersOpen ? (
                <>
                  <button
                    className="transactions-filter-scrim"
                    type="button"
                    aria-label="Close filters"
                    onClick={() => setFiltersOpen(false)}
                  />
                  <div className="transactions-filter-menu">
                    <span>Payment method</span>
                    {(["All methods", "Visa", "Mastercard", "Amex", "ACH", "USDC"] as const).map((option) => (
                      <button
                        key={option}
                        className={method === option ? "active" : ""}
                        type="button"
                        onClick={() => {
                          setMethod(option);
                          setFiltersOpen(false);
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

        <div className="transactions-table-wrap">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Created</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Customer</th>
                <th>Description</th>
                <th>Payment method</th>
                <th>Risk</th>
                <th>Fee</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              {!visibleTransactions.length ? (
                <tr className="transactions-empty-row">
                  <td colSpan={9}>No transactions match these filters.</td>
                </tr>
              ) : null}
              {visibleTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  tabIndex={0}
                  data-selected={selected?.id === transaction.id}
                  onClick={() => setSelected(transaction)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") setSelected(transaction);
                  }}
                >
                  <td>
                    <strong>{transaction.createdAt}</strong>
                    <small>{transaction.time}</small>
                  </td>
                  <td>
                    <strong>{money(transaction.amountMinor)}</strong>
                    <small>{transaction.currency}</small>
                  </td>
                  <td>
                    <StatusPill status={transaction.status} />
                  </td>
                  <td>
                    <strong>{transaction.customer}</strong>
                    <small>{transaction.email}</small>
                  </td>
                  <td>
                    <span>{transaction.description}</span>
                    <button
                      type="button"
                      aria-label="Copy payment ID"
                      onClick={(event) => {
                        event.stopPropagation();
                        void copy(transaction.id);
                      }}
                    >
                      <DuplicateIcon />
                    </button>
                  </td>
                  <td>
                    <span className="transaction-method-pill">
                      <MethodIcon method={transaction.method} />
                      {transaction.method} {transaction.method !== "USDC" ? `•••• ${transaction.last4}` : "· Base"}
                    </span>
                  </td>
                  <td>
                    <span className="transaction-risk" data-risk={transaction.risk.toLowerCase()}>
                      {transaction.risk}
                    </span>
                  </td>
                  <td>{transaction.feeMinor ? `−${money(transaction.feeMinor)}` : "—"}</td>
                  <td>
                    <strong>
                      {transaction.status === "Refunded"
                        ? money(0)
                        : money(transaction.amountMinor - transaction.feeMinor)}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TablePagination
          className="transactions-pagination"
          onPageChange={setPage}
          page={currentPage}
          pageSize={pageSize}
          totalItems={filteredTransactions.length}
        />
      </section>

      {selected ? (
        <TransactionDrawer transaction={selected} onClose={() => setSelected(null)} onRefund={refundTransaction} />
      ) : null}

      {createOpen ? (
        <div
          className="transaction-create-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCreateOpen(false);
          }}
        >
          <form
            className="transaction-create-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Create payment"
            onSubmit={createPayment}
          >
            <header>
              <div>
                <h2>Create payment</h2>
                <p>Charge a customer securely through ACRU.</p>
              </div>
              <button type="button" onClick={() => setCreateOpen(false)} aria-label="Close">
                <XIcon />
              </button>
            </header>
            <div className="transaction-create-form">
              <label>
                Amount
                <div>
                  <span>$</span>
                  <input
                    inputMode="decimal"
                    name="amount"
                    pattern="[0-9]+(?:\.[0-9]{1,2})?"
                    placeholder="0.00"
                    required
                  />
                </div>
              </label>
              <label>
                Customer
                <input name="customer" placeholder="Customer name" required />
              </label>
              <label>
                Customer email
                <input name="email" placeholder="customer@example.com" type="email" required />
              </label>
              <label>
                Description
                <input name="description" placeholder="What is this payment for?" required />
              </label>
              <label>
                Payment method
                <div className="transaction-native-select">
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={createMethodOpen}
                    onClick={() => setCreateMethodOpen((open) => !open)}
                  >
                    <span>{createMethod}</span>
                    <ChevronDownIcon />
                  </button>
                  {createMethodOpen ? (
                    <>
                      <button
                        className="transaction-native-select-scrim"
                        type="button"
                        aria-label="Close payment methods"
                        onClick={() => setCreateMethodOpen(false)}
                      />
                      <div className="transaction-native-select-menu" role="menu">
                        {["Card on file", "Send secure payment link", "ACH debit"].map((option) => (
                          <button
                            key={option}
                            className={createMethod === option ? "active" : ""}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setCreateMethod(option);
                              setCreateMethodOpen(false);
                            }}
                          >
                            {option}
                            {createMethod === option ? <CheckCircleIcon /> : null}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              </label>
              <label className="transaction-create-checkbox">
                <input type="checkbox" defaultChecked /> Email the customer a receipt
              </label>
            </div>
            <footer>
              <button type="button" onClick={() => setCreateOpen(false)}>
                Cancel
              </button>
              <button type="submit">Create payment</button>
            </footer>
          </form>
        </div>
      ) : null}
    </div>
  );
}
