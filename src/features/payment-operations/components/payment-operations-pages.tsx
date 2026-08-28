"use client";

import {
  AdjustIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  DuplicateIcon,
  EmailIcon,
  ExportIcon,
  LinkIcon,
  PlusIcon,
  ReceiptDollarIcon,
  ReceiptRefundIcon,
  SearchIcon,
  SettingsIcon,
  XIcon
} from "@shopify/polaris-icons";
import { useMemo, useState } from "react";

import { useListCollection } from "@/components/data/use-list-collection";
import { matchesDatePreset } from "@/components/data/date-filter";
import { createMoney, decimalAmount, formatMoney, minorUnitsFromDecimal } from "@/components/data/money";
import { CollectionPageState } from "@/components/ui/collection-state";
import { TablePagination } from "@/components/ui/table-pagination";
import { useDismissOnEscape } from "@/components/ui/use-dismiss-on-escape";
import {
  operationAdapters,
  operationConfigs,
  type OperationKind,
  type OperationPageConfig,
  type OperationRecord
} from "@/features/payment-operations/data/operations";

function money(value: number) {
  return formatMoney(createMoney(value));
}

function copy(value: string) {
  return navigator.clipboard?.writeText(value);
}

function statusTone(status: string) {
  if (["Succeeded", "Paid", "Active"].includes(status)) return "success";
  if (["Pending", "Open"].includes(status)) return "info";
  if (["Failed", "Past due"].includes(status)) return "danger";
  if (["Canceled", "Void", "Inactive", "Expired"].includes(status)) return "neutral";
  return "neutral";
}

function StatusPill({ status }: { status: string }) {
  const tone = statusTone(status);
  const Icon =
    tone === "success" ? CheckCircleIcon : tone === "info" ? ClockIcon : tone === "danger" ? AlertCircleIcon : XIcon;
  return (
    <span className="ops-status" data-tone={tone}>
      <Icon />
      {status}
    </span>
  );
}

function KindIcon({ kind }: { kind: OperationKind }) {
  if (kind === "refunds") return <ReceiptRefundIcon />;
  if (kind === "payment-links") return <LinkIcon />;
  return <ReceiptDollarIcon />;
}

function NativeMenu({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <label className="ops-form-label">
      {label}
      <div className="ops-native-select">
        <button type="button" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
          <span>{value}</span>
          <ChevronDownIcon />
        </button>
        {open ? (
          <>
            <button
              className="ops-native-scrim"
              type="button"
              aria-label={`Close ${label}`}
              onClick={() => setOpen(false)}
            />
            <div className="ops-native-menu">
              {options.map((option) => (
                <button
                  key={option}
                  className={value === option ? "active" : ""}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                >
                  {option}
                  {value === option ? <CheckCircleIcon /> : null}
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </label>
  );
}

function OperationsDrawer({
  kind,
  record,
  onClose,
  onUpdate
}: {
  kind: OperationKind;
  record: OperationRecord;
  onClose: () => void;
  onUpdate: (id: string, status: string) => void;
}) {
  const [tab, setTab] = useState("Overview");
  const [closing, setClosing] = useState(false);
  const [notice, setNotice] = useState("");
  const [checkoutSettings, setCheckoutSettings] = useState<Record<string, boolean>>({});
  const closeDrawer = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, 260);
  };
  useDismissOnEscape(true, closeDrawer);
  const tabs =
    kind === "payment-links"
      ? ["Overview", "Performance", "Checkout", "Activity", "Metadata"]
      : ["Overview", "Timeline", "Related activity", "Metadata"];

  const primaryAction =
    kind === "refunds"
      ? "Send confirmation"
      : kind === "payment-links"
        ? "Copy payment link"
        : record.status === "Draft"
          ? "Send invoice"
          : "Send reminder";
  function runPrimaryAction() {
    if (kind === "payment-links") void copy(record.subtitle);
    if (kind === "invoices" && record.status === "Draft") onUpdate(record.id, "Open");
    setNotice(`${primaryAction} completed`);
  }

  return (
    <aside className="ops-drawer" data-closing={closing} data-kind={kind} aria-label={`${record.id} details`}>
      <header className="ops-drawer-header">
        <button className="ops-drawer-close" type="button" onClick={closeDrawer} aria-label="Close details">
          <XIcon />
        </button>
        <span className="ops-drawer-icon">
          <KindIcon kind={kind} />
        </span>
        <div className="ops-drawer-title">
          <h2>{kind === "payment-links" ? record.title : money(record.amountMinor)}</h2>
          <span>
            {record.context} · {record.id}
          </span>
        </div>
        <StatusPill status={record.status} />
      </header>
      <nav className="ops-drawer-tabs">
        {tabs.map((item) => (
          <button key={item} className={tab === item ? "active" : ""} type="button" onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </nav>
      <div className="ops-drawer-body">
        {tab === "Overview" ? (
          <>
            <section className="ops-summary-grid">
              <div>
                <span>{kind === "payment-links" ? "Unit price" : "Amount"}</span>
                <strong>{money(record.amountMinor)}</strong>
              </div>
              <div>
                <span>
                  {kind === "refunds" ? "Original payment" : kind === "payment-links" ? "Completed" : "Balance due"}
                </span>
                <strong>
                  {kind === "refunds"
                    ? record.performanceDetail.replace("Original payment ", "")
                    : kind === "payment-links"
                      ? record.context.split(" ")[0]
                      : record.status === "Paid"
                        ? "$0.00"
                        : money(record.amountMinor)}
                </strong>
              </div>
              <div>
                <span>Status</span>
                <StatusPill status={record.status} />
              </div>
            </section>
            <section className="ops-detail-card">
              <h3>
                {kind === "refunds"
                  ? "Refund details"
                  : kind === "payment-links"
                    ? "Payment link details"
                    : "Invoice details"}
              </h3>
              <dl>
                <div>
                  <dt>Created</dt>
                  <dd>
                    {record.created} at {record.time}
                  </dd>
                </div>
                <div>
                  <dt>{kind === "refunds" ? "Reason" : kind === "payment-links" ? "Link" : "Invoice number"}</dt>
                  <dd>
                    {kind === "refunds" ? (
                      record.context
                    ) : kind === "payment-links" ? (
                      <>
                        <code>{record.subtitle}</code>
                        <button type="button" onClick={() => void copy(record.subtitle)}>
                          <DuplicateIcon />
                        </button>
                      </>
                    ) : (
                      record.performance
                    )}
                  </dd>
                </div>
                <div>
                  <dt>{kind === "payment-links" ? "Checkout status" : "Description"}</dt>
                  <dd>{record.contextDetail}</dd>
                </div>
                <div>
                  <dt>Record ID</dt>
                  <dd>
                    <code>{record.id}</code>
                    <button type="button" onClick={() => void copy(record.id)}>
                      <DuplicateIcon />
                    </button>
                  </dd>
                </div>
              </dl>
            </section>
            <section className="ops-detail-two-column">
              <article className="ops-detail-card">
                <h3>{kind === "payment-links" ? "Checkout configuration" : "Customer"}</h3>
                {kind !== "payment-links" ? (
                  <div className="ops-customer">
                    <span>
                      {record.title
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                    <div>
                      <strong>{record.title}</strong>
                      <small>{record.subtitle}</small>
                    </div>
                  </div>
                ) : null}
                <dl>
                  {kind === "payment-links" ? (
                    <>
                      <div>
                        <dt>Collect email</dt>
                        <dd>Required</dd>
                      </div>
                      <div>
                        <dt>Billing address</dt>
                        <dd>Automatic</dd>
                      </div>
                      <div>
                        <dt>Promotion codes</dt>
                        <dd>Enabled</dd>
                      </div>
                      <div>
                        <dt>Quantity</dt>
                        <dd>Adjustable</dd>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <dt>Email</dt>
                        <dd>{record.subtitle}</dd>
                      </div>
                      <div>
                        <dt>Account status</dt>
                        <dd>Active</dd>
                      </div>
                      <div>
                        <dt>Customer since</dt>
                        <dd>July 2024</dd>
                      </div>
                    </>
                  )}
                </dl>
              </article>
              <article className="ops-detail-card">
                <h3>
                  {kind === "refunds" ? "Original payment" : kind === "payment-links" ? "Performance" : "Delivery"}
                </h3>
                <strong className="ops-feature-value">{record.performance}</strong>
                <small>{record.performanceDetail}</small>
                <dl>
                  <div>
                    <dt>{kind === "invoices" ? "Sent" : "Currency"}</dt>
                    <dd>{kind === "invoices" ? record.created : "USD"}</dd>
                  </div>
                  <div>
                    <dt>
                      {kind === "refunds"
                        ? "Return method"
                        : kind === "payment-links"
                          ? "Payment methods"
                          : "Reminders"}
                    </dt>
                    <dd>
                      {kind === "refunds"
                        ? "Original method"
                        : kind === "payment-links"
                          ? "Card, ACH, USDC"
                          : "Automatic"}
                    </dd>
                  </div>
                </dl>
              </article>
            </section>
            <div className="ops-primary-actions">
              <button type="button" onClick={runPrimaryAction}>
                {kind === "payment-links" ? <LinkIcon /> : <EmailIcon />}
                {primaryAction}
              </button>
              <button type="button" onClick={() => setTab(kind === "payment-links" ? "Checkout" : "Timeline")}>
                View activity <ArrowRightIcon />
              </button>
            </div>
          </>
        ) : null}
        {tab === "Timeline" || tab === "Activity" ? (
          <section className="ops-detail-card">
            <h3>Activity timeline</h3>
            <ol className="ops-timeline">
              <li>
                <span />
                <div>
                  <strong>
                    {record.status === "Paid"
                      ? "Payment received"
                      : `${operationConfigs[kind].title.slice(0, -1)} ${record.status.toLowerCase()}`}
                  </strong>
                  <small>
                    {record.created} · {record.time}
                  </small>
                </div>
              </li>
              <li>
                <span />
                <div>
                  <strong>
                    {kind === "refunds"
                      ? "Refund initiated"
                      : kind === "payment-links"
                        ? "Checkout completed"
                        : "Invoice viewed"}
                  </strong>
                  <small>Automated system event</small>
                </div>
              </li>
              <li>
                <span />
                <div>
                  <strong>Record created</strong>
                  <small>{record.created}</small>
                </div>
              </li>
            </ol>
          </section>
        ) : null}
        {tab === "Performance" ? (
          <>
            <section className="ops-performance-grid">
              <div>
                <span>Checkout sessions</span>
                <strong>{record.contextDetail.split(" ")[0]}</strong>
              </div>
              <div>
                <span>Completed</span>
                <strong>{record.context.split(" ")[0]}</strong>
              </div>
              <div>
                <span>Conversion</span>
                <strong>{record.performance.split(" ")[0]}</strong>
              </div>
            </section>
            <section className="ops-detail-card">
              <h3>Conversion funnel</h3>
              <div className="ops-funnel">
                <div>
                  <span>Link opened</span>
                  <i style={{ width: "100%" }} />
                  <strong>742</strong>
                </div>
                <div>
                  <span>Checkout started</span>
                  <i style={{ width: "73%" }} />
                  <strong>542</strong>
                </div>
                <div>
                  <span>Payment completed</span>
                  <i style={{ width: "52%" }} />
                  <strong>387</strong>
                </div>
              </div>
            </section>
          </>
        ) : null}
        {tab === "Checkout" ? (
          <section className="ops-detail-card">
            <h3>Checkout controls</h3>
            <div className="ops-setting-rows">
              {[
                "Collect customer email",
                "Require billing address",
                "Allow promotion codes",
                "Let customers adjust quantity"
              ].map((setting) => (
                <div key={setting}>
                  <span>{setting}</span>
                  <button
                    aria-label={`${checkoutSettings[setting] === false ? "Enable" : "Disable"} ${setting}`}
                    aria-pressed={checkoutSettings[setting] !== false}
                    className="acru-toggle"
                    data-enabled={checkoutSettings[setting] !== false}
                    type="button"
                    onClick={() =>
                      setCheckoutSettings((current) => ({ ...current, [setting]: current[setting] === false }))
                    }
                  >
                    <span />
                  </button>
                </div>
              ))}
            </div>
            <button className="ops-wide-button" type="button" onClick={() => setNotice("Checkout editor opened")}>
              <SettingsIcon />
              Open checkout editor
            </button>
          </section>
        ) : null}
        {tab === "Related activity" ? (
          <section className="ops-detail-card">
            <h3>{kind === "refunds" ? "Balance impact" : "Invoice payments"}</h3>
            <div className="ops-related-row">
              <span>
                <ReceiptRefundIcon />
              </span>
              <div>
                <strong>{kind === "refunds" ? `−${money(record.amountMinor)}` : money(record.amountMinor)}</strong>
                <small>{record.performanceDetail}</small>
              </div>
              <StatusPill status={record.status} />
            </div>
          </section>
        ) : null}
        {tab === "Metadata" ? (
          <section className="ops-detail-card">
            <h3>Metadata</h3>
            <dl>
              <div>
                <dt>record_id</dt>
                <dd>{record.id}</dd>
              </div>
              <div>
                <dt>source</dt>
                <dd>acru_dashboard</dd>
              </div>
              <div>
                <dt>environment</dt>
                <dd>production</dd>
              </div>
            </dl>
            <button className="ops-wide-button" type="button" onClick={() => setNotice("Metadata editor opened")}>
              <PlusIcon />
              Add metadata
            </button>
          </section>
        ) : null}
      </div>
      {notice ? (
        <button className="ops-toast" type="button" onClick={() => setNotice("")}>
          <CheckCircleIcon />
          {notice}
        </button>
      ) : null}
    </aside>
  );
}

function CreateOperationDialog({
  kind,
  onClose,
  onCreate
}: {
  kind: OperationKind;
  onClose: () => void;
  onCreate: (record: OperationRecord) => void;
}) {
  useDismissOnEscape(true, onClose);
  const [selection, setSelection] = useState(
    kind === "refunds" ? "Full refund" : kind === "payment-links" ? "One-time payment" : "Net 14"
  );
  const [secondary, setSecondary] = useState(
    kind === "refunds"
      ? "Requested by customer"
      : kind === "payment-links"
        ? "Card, ACH, and USDC"
        : "Automatic reminders"
  );
  const [amount, setAmount] = useState(kind === "refunds" ? "100.00" : kind === "payment-links" ? "149.00" : "1490.00");
  const [customer, setCustomer] = useState("Nathan Bariac");
  const [titleInput, setTitleInput] = useState("Pro plan");
  const [quantity, setQuantity] = useState(1);
  const [lineItems, setLineItems] = useState(1);
  const [error, setError] = useState("");
  const title = operationConfigs[kind].createLabel;
  const icon = <KindIcon kind={kind} />;
  function create() {
    let amountMinor: number;
    try {
      amountMinor = minorUnitsFromDecimal(amount.replaceAll(",", "")) * Math.max(1, quantity) * lineItems;
      if (amountMinor <= 0) throw new RangeError("Enter an amount greater than zero.");
      if ((kind === "invoices" || kind === "refunds") && !customer.trim()) throw new RangeError("Choose a customer.");
      if (kind === "payment-links" && !titleInput.trim()) throw new RangeError("Enter a payment link title.");
      setError("");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Check the entered details.");
      return;
    }
    const now = Date.now().toString(36);
    const record: OperationRecord =
      kind === "refunds"
        ? {
            id: `re_${now}`,
            created: "Aug 11, 2026",
            time: "Now",
            amountMinor,
            status: "Pending",
            title: customer,
            subtitle: "nathan.bariac@gmail.com",
            context: secondary,
            contextDetail: "Manual dashboard refund",
            performance: "Visa •••• 3830",
            performanceDetail: selection
          }
        : kind === "payment-links"
          ? {
              id: `plink_${now}`,
              created: "Aug 11, 2026",
              time: "Now",
              amountMinor,
              status: "Active",
              title: titleInput,
              subtitle: `acru.co/pay/${now}`,
              context: "0 completed",
              contextDetail: "0 checkout sessions",
              performance: "0% conversion",
              performanceDetail: "$0.00 revenue"
            }
          : {
              id: `in_${now}`,
              created: "Aug 11, 2026",
              time: "Now",
              amountMinor,
              status: "Draft",
              title: customer,
              subtitle: "nathan.bariac@gmail.com",
              context: "Not yet sent",
              contextDetail: selection,
              performance: `INV-${now.slice(-4).toUpperCase()}`,
              performanceDetail: "Draft"
            };
    onCreate(record);
  }
  return (
    <div
      className="ops-create-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="ops-create-dialog" role="dialog" aria-modal="true" aria-label={title}>
        <header>
          <span>{icon}</span>
          <div>
            <h2>{title}</h2>
            <p>
              {kind === "refunds"
                ? "Return funds to the original payment method."
                : kind === "payment-links"
                  ? "Build a reusable, hosted checkout experience."
                  : "Bill a customer and automate collection."}
            </p>
          </div>
          <button type="button" onClick={onClose}>
            <XIcon />
          </button>
        </header>
        <div className="ops-create-form">
          {kind === "refunds" ? (
            <>
              <label className="ops-form-label">
                Payment to refund
                <div className="ops-search-field">
                  <SearchIcon />
                  <input
                    placeholder="Search payment ID, email, or last 4"
                    required
                    value={customer}
                    onChange={(event) => setCustomer(event.target.value)}
                  />
                </div>
              </label>
              <label className="ops-form-label">
                Amount
                <div className="ops-amount-field">
                  <span>$</span>
                  <input
                    inputMode="decimal"
                    pattern="[0-9]+(?:\.[0-9]{1,2})?"
                    required
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                  />
                </div>
              </label>
              <NativeMenu
                label="Refund type"
                value={selection}
                options={["Full refund", "Partial refund"]}
                onChange={setSelection}
              />
              <NativeMenu
                label="Reason"
                value={secondary}
                options={[
                  "Requested by customer",
                  "Duplicate charge",
                  "Product issue",
                  "Service canceled",
                  "Fraudulent"
                ]}
                onChange={setSecondary}
              />
            </>
          ) : null}
          {kind === "payment-links" ? (
            <>
              <label className="ops-form-label">
                Title
                <input
                  placeholder="What are you selling?"
                  required
                  value={titleInput}
                  onChange={(event) => setTitleInput(event.target.value)}
                />
              </label>
              <label className="ops-form-label">
                Price
                <div className="ops-amount-field">
                  <span>$</span>
                  <input
                    inputMode="decimal"
                    pattern="[0-9]+(?:\.[0-9]{1,2})?"
                    required
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                  />
                </div>
              </label>
              <NativeMenu
                label="Payment type"
                value={selection}
                options={["One-time payment", "Subscription"]}
                onChange={setSelection}
              />
              <NativeMenu
                label="Payment methods"
                value={secondary}
                options={["Card, ACH, and USDC", "Card only", "ACH only"]}
                onChange={setSecondary}
              />
              <fieldset>
                <legend>Checkout options</legend>
                {[
                  "Collect customer email",
                  "Require billing address",
                  "Allow promotion codes",
                  "Adjustable quantity"
                ].map((item) => (
                  <label key={item}>
                    <input type="checkbox" defaultChecked />
                    {item}
                  </label>
                ))}
              </fieldset>
            </>
          ) : null}
          {kind === "invoices" ? (
            <>
              <label className="ops-form-label">
                Customer
                <div className="ops-search-field">
                  <SearchIcon />
                  <input
                    placeholder="Search customer"
                    required
                    value={customer}
                    onChange={(event) => setCustomer(event.target.value)}
                  />
                </div>
              </label>
              <div className="ops-line-item">
                <div>
                  <label>
                    Description
                    <input defaultValue="Professional services" />
                  </label>
                  <label>
                    Quantity
                    <input
                      min="1"
                      type="number"
                      value={quantity}
                      onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                    />
                  </label>
                  <label>
                    Rate
                    <input
                      inputMode="decimal"
                      pattern="[0-9]+(?:\.[0-9]{1,2})?"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                    />
                  </label>
                </div>
                <button type="button" onClick={() => setLineItems((count) => count + 1)}>
                  <PlusIcon />
                  Add line item{lineItems > 1 ? ` (${lineItems})` : ""}
                </button>
              </div>
              <NativeMenu
                label="Payment terms"
                value={selection}
                options={["Due on receipt", "Net 7", "Net 14", "Net 30"]}
                onChange={setSelection}
              />
              <NativeMenu
                label="Collection"
                value={secondary}
                options={["Automatic reminders", "Autocharge payment method", "Manual collection"]}
                onChange={setSecondary}
              />
              <label className="ops-form-label">
                Memo
                <textarea placeholder="Add a note visible to the customer" />
              </label>
            </>
          ) : null}
          <label className="ops-consent">
            <input type="checkbox" defaultChecked />
            {kind === "refunds"
              ? "Email the customer a refund confirmation"
              : kind === "payment-links"
                ? "Activate this payment link immediately"
                : "Save as draft before sending"}
          </label>
          {error ? <p role="alert">{error}</p> : null}
        </div>
        <footer>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" onClick={create}>
            {kind === "invoices" ? "Create draft" : title}
          </button>
        </footer>
      </section>
    </div>
  );
}

function OperationsPage({
  kind,
  heading
}: {
  kind: OperationKind;
  heading?: Pick<OperationPageConfig, "title" | "subtitle">;
}) {
  const config = heading ? { ...operationConfigs[kind], ...heading } : operationConfigs[kind];
  const {
    error,
    items: records,
    retry,
    setItems: setRecords,
    status: resourceStatus
  } = useListCollection(operationAdapters[kind]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [dateRange, setDateRange] = useState(kind === "payment-links" ? "All time" : "Last 90 days");
  const [dateOpen, setDateOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState<"All" | "High value" | "Created this week" | "Requires attention">(
    "All"
  );
  const [selected, setSelected] = useState<OperationRecord | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return records.filter(
      (record) =>
        (!normalized || Object.values(record).join(" ").toLowerCase().includes(normalized)) &&
        (status === "All" || record.status === status) &&
        matchesDatePreset(record.created, dateRange) &&
        (quickFilter === "All" ||
          (quickFilter === "High value" && record.amountMinor >= 100_000) ||
          (quickFilter === "Created this week" && matchesDatePreset(record.created, "Last 7 days")) ||
          (quickFilter === "Requires attention" && ["Failed", "Past due", "Pending"].includes(record.status)))
    );
  }, [dateRange, query, quickFilter, records, status]);
  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  function exportCsv() {
    const rows = [
      [...config.columns],
      ...filteredRecords.map((record) => [
        record.created,
        decimalAmount(record.amountMinor),
        record.status,
        record.title,
        record.context,
        record.performance,
        record.performanceDetail,
        record.id
      ])
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `acru-${kind}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
  function updateRecord(id: string, nextStatus: string) {
    setRecords((items) => items.map((item) => (item.id === id ? { ...item, status: nextStatus } : item)));
    setSelected((item) => (item?.id === id ? { ...item, status: nextStatus } : item));
  }

  if (resourceStatus !== "ready") {
    return (
      <CollectionPageState
        description={config.subtitle}
        error={error}
        onRetry={retry}
        status={resourceStatus}
        title={config.title}
      />
    );
  }

  return (
    <div className="ops-workspace" data-kind={kind}>
      <section className="ops-list-pane">
        <header className="ops-page-heading">
          <div>
            <h1>{config.title}</h1>
            <p>{config.subtitle}</p>
          </div>
          <div className="ops-page-actions">
            <button className="ops-secondary-button" type="button" onClick={exportCsv}>
              <ExportIcon />
              Export
            </button>
            <button className="ops-create-button" type="button" onClick={() => setCreateOpen(true)}>
              {config.createLabel}
              <PlusIcon />
            </button>
          </div>
        </header>
        <section className="ops-metrics">
          {config.metrics.map((metric) => (
            <div key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.detail}</small>
            </div>
          ))}
        </section>
        <div className="ops-toolbar">
          <div className="ops-status-tabs">
            {config.statuses.map((option) => (
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
          <div className="ops-tools">
            <label className="ops-search">
              <SearchIcon />
              <input
                type="search"
                placeholder={config.searchPlaceholder}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div className="ops-date-wrap">
              <button
                className="ops-date-button"
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
                  <button className="ops-popup-scrim" type="button" onClick={() => setDateOpen(false)} />
                  <div className="ops-date-menu">
                    <span>Date range</span>
                    {["Last 30 days", "Last 90 days", "This year", "All time"].map((option) => (
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
            <div className="ops-filter-wrap">
              <button
                className="ops-filter-button"
                type="button"
                onClick={() => {
                  setDateOpen(false);
                  setFilterOpen((open) => !open);
                }}
              >
                <AdjustIcon />
              </button>
              {filterOpen ? (
                <>
                  <button className="ops-popup-scrim" type="button" onClick={() => setFilterOpen(false)} />
                  <div className="ops-filter-menu">
                    <span>Quick filters</span>
                    {["All", "High value", "Created this week", "Requires attention"].map((option) => (
                      <button
                        className={quickFilter === option ? "active" : undefined}
                        key={option}
                        onClick={() => {
                          setQuickFilter(option as typeof quickFilter);
                          setPage(1);
                          setFilterOpen(false);
                        }}
                        type="button"
                      >
                        {quickFilter === option ? <CheckCircleIcon /> : null}
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
        <div className="ops-table-wrap">
          <table className="ops-table">
            <thead>
              <tr>
                {config.columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!visible.length ? (
                <tr className="ops-empty-row">
                  <td colSpan={8}>No {config.title.toLowerCase()} match these filters.</td>
                </tr>
              ) : null}
              {visible.map((record) => (
                <tr
                  key={record.id}
                  tabIndex={0}
                  data-selected={selected?.id === record.id}
                  onClick={() => setSelected(record)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") setSelected(record);
                  }}
                >
                  <td>
                    <strong>{record.created}</strong>
                    <small>{record.time}</small>
                  </td>
                  <td>
                    <strong>{money(record.amountMinor)}</strong>
                    <small>USD</small>
                  </td>
                  <td>
                    <StatusPill status={record.status} />
                  </td>
                  <td>
                    <strong>{record.title}</strong>
                    <small>{record.subtitle}</small>
                  </td>
                  <td>
                    <strong>{record.context}</strong>
                    <small>{record.contextDetail}</small>
                  </td>
                  <td>
                    <strong>{record.performance}</strong>
                    <small>{record.performanceDetail}</small>
                  </td>
                  <td>
                    <span className="ops-type-pill">
                      {kind === "refunds"
                        ? record.performanceDetail
                        : kind === "payment-links"
                          ? "Hosted checkout"
                          : record.performanceDetail}
                    </span>
                  </td>
                  <td>
                    <code>{record.id}</code>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        void copy(record.id);
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
          className="ops-pagination"
          page={currentPage}
          pageSize={pageSize}
          totalItems={filteredRecords.length}
          onPageChange={setPage}
        />
      </section>
      {selected ? (
        <OperationsDrawer kind={kind} record={selected} onClose={() => setSelected(null)} onUpdate={updateRecord} />
      ) : null}
      {createOpen ? (
        <CreateOperationDialog
          kind={kind}
          onClose={() => setCreateOpen(false)}
          onCreate={(record) => {
            setRecords((items) => [record, ...items]);
            setCreateOpen(false);
            setSelected(record);
          }}
        />
      ) : null}
    </div>
  );
}

export function RefundsPage() {
  return <OperationsPage kind="refunds" />;
}
export function PaymentLinksPage() {
  return <OperationsPage kind="payment-links" />;
}
export function CheckoutPage() {
  return (
    <OperationsPage
      kind="payment-links"
      heading={{
        title: "Checkout",
        subtitle: "Create hosted checkout experiences and monitor payment conversion."
      }}
    />
  );
}
export function InvoicesPage() {
  return <OperationsPage kind="invoices" />;
}
