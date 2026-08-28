"use client";

import {
  AdjustIcon,
  AlertCircleIcon,
  AlertDiamondIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  AutomationIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  DuplicateIcon,
  EmailIcon,
  ExportIcon,
  LockIcon,
  PageAttachmentIcon,
  PersonIcon,
  PlusIcon,
  ReceiptDollarIcon,
  SearchIcon,
  SettingsIcon,
  UploadIcon,
  WandIcon,
  XIcon
} from "@shopify/polaris-icons";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { ListAdapter } from "@/components/data/adapter";
import { matchesDatePreset } from "@/components/data/date-filter";
import { createMoney, decimalAmount, formatMoney } from "@/components/data/money";
import { useListCollection } from "@/components/data/use-list-collection";
import { CollectionPageState } from "@/components/ui/collection-state";
import { TablePagination } from "@/components/ui/table-pagination";
import { useDismissOnEscape } from "@/components/ui/use-dismiss-on-escape";
import {
  disputeAdapter,
  type AutomationSettings,
  type Dispute,
  type DisputeReason,
  type DisputeStatus,
  type EvidenceState
} from "@/features/disputes/data/disputes";

const statusTabs: Array<"All" | DisputeStatus> = ["All", "Needs response", "Under review", "Won", "Lost"];

function money(value: number) {
  return formatMoney(createMoney(value));
}

function copy(value: string) {
  return navigator.clipboard?.writeText(value);
}

function DisputeStatusPill({ status }: { status: DisputeStatus }) {
  const Icon =
    status === "Won"
      ? CheckCircleIcon
      : status === "Under review"
        ? ClockIcon
        : status === "Lost"
          ? XIcon
          : AlertCircleIcon;
  return (
    <span className="dispute-status" data-status={status.toLowerCase().replaceAll(" ", "-")}>
      <Icon />
      {status}
    </span>
  );
}

function EvidencePill({ state }: { state: EvidenceState }) {
  const Icon =
    state === "Ready" || state === "Submitted"
      ? CheckCircleIcon
      : state === "AI gathering"
        ? AutomationIcon
        : PageAttachmentIcon;
  return (
    <span className="dispute-evidence" data-state={state.toLowerCase().replaceAll(" ", "-")}>
      <Icon />
      {state}
    </span>
  );
}

function DisputeDrawer({
  dispute,
  onClose,
  onSubmit
}: {
  dispute: Dispute;
  onClose: () => void;
  onSubmit: (id: string) => void;
}) {
  const [tab, setTab] = useState("Overview");
  const [closing, setClosing] = useState(false);
  const [aiState, setAiState] = useState<"idle" | "gathering" | "ready">(
    dispute.evidence === "Ready" ? "ready" : "idle"
  );
  const [uploaded, setUploaded] = useState(false);
  const [notice, setNotice] = useState("");

  function closeDrawer() {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, 260);
  }
  useDismissOnEscape(true, closeDrawer);

  function generateResponse() {
    setAiState("gathering");
    window.setTimeout(() => {
      setAiState("ready");
      setNotice("AI response packet is ready for review");
    }, 900);
  }

  return (
    <aside className="dispute-drawer" data-closing={closing} aria-label={`Dispute ${dispute.id}`}>
      <header className="dispute-drawer-header">
        <button className="dispute-drawer-close" type="button" onClick={closeDrawer} aria-label="Close dispute">
          <XIcon />
        </button>
        <span className="dispute-header-icon">
          <AlertDiamondIcon />
        </span>
        <div className="dispute-drawer-title">
          <h2>{money(dispute.amountMinor)}</h2>
          <span>
            {dispute.reason} · {dispute.id}
          </span>
        </div>
        <DisputeStatusPill status={dispute.status} />
      </header>

      <nav className="dispute-drawer-tabs" aria-label="Dispute case sections">
        {["Overview", "Evidence", "AI response", "Timeline", "Metadata"].map((item) => (
          <button key={item} className={tab === item ? "active" : ""} type="button" onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </nav>

      <div className="dispute-drawer-body">
        {tab === "Overview" ? (
          <>
            {dispute.status === "Needs response" ? (
              <section className="dispute-deadline-card" data-urgent={dispute.dueDays <= 2}>
                <span>
                  <ClockIcon />
                </span>
                <div>
                  <small>Response deadline</small>
                  <strong>{dispute.due}</strong>
                  <p>{dispute.dueDays} days remaining · Submit before 11:59 PM UTC</p>
                </div>
                <button type="button" onClick={() => setTab("AI response")}>
                  Prepare response <ArrowRightIcon />
                </button>
              </section>
            ) : null}
            <section className="dispute-summary-grid">
              <div>
                <span>Disputed amount</span>
                <strong>{money(dispute.amountMinor)}</strong>
              </div>
              <div>
                <span>Dispute fee</span>
                <strong>{money(dispute.feeMinor)}</strong>
              </div>
              <div>
                <span>Total exposure</span>
                <strong>{money(dispute.amountMinor + dispute.feeMinor)}</strong>
              </div>
            </section>
            <section className="dispute-detail-card">
              <h3>Dispute details</h3>
              <dl>
                <div>
                  <dt>Reason</dt>
                  <dd>
                    <AlertTriangleIcon />
                    {dispute.reason}
                  </dd>
                </div>
                <div>
                  <dt>Network reason code</dt>
                  <dd>{dispute.reason === "Fraudulent" ? "10.4 — Other fraud" : "13.1 — Merchandise not received"}</dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd>{dispute.created}</dd>
                </div>
                <div>
                  <dt>Order</dt>
                  <dd>{dispute.order}</dd>
                </div>
                <div>
                  <dt>Dispute ID</dt>
                  <dd>
                    <code>{dispute.id}</code>
                    <button type="button" onClick={() => void copy(dispute.id)} aria-label="Copy dispute ID">
                      <DuplicateIcon />
                    </button>
                  </dd>
                </div>
              </dl>
            </section>
            <section className="dispute-detail-two-column">
              <article className="dispute-detail-card">
                <h3>Customer</h3>
                <div className="dispute-customer">
                  <span>
                    {dispute.customer
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <div>
                    <strong>{dispute.customer}</strong>
                    <small>{dispute.email}</small>
                  </div>
                </div>
                <dl>
                  <div>
                    <dt>Payment method</dt>
                    <dd>
                      {dispute.network} •••• {dispute.card}
                    </dd>
                  </div>
                  <div>
                    <dt>Previous disputes</dt>
                    <dd>0</dd>
                  </div>
                  <div>
                    <dt>Customer since</dt>
                    <dd>July 2017</dd>
                  </div>
                </dl>
                <Link className="dispute-inline-link" href="/payments/customers">
                  View customer <ArrowRightIcon />
                </Link>
              </article>
              <article className="dispute-detail-card">
                <h3>Original payment</h3>
                <strong className="dispute-payment-amount">{money(dispute.amountMinor)}</strong>
                <small>{dispute.description}</small>
                <dl>
                  <div>
                    <dt>Status</dt>
                    <dd>Successful</dd>
                  </div>
                  <div>
                    <dt>Authentication</dt>
                    <dd>3DS automatic</dd>
                  </div>
                  <div>
                    <dt>Risk score</dt>
                    <dd>12 — Low</dd>
                  </div>
                </dl>
                <Link className="dispute-inline-link" href="/payments/transactions">
                  View payment <ArrowRightIcon />
                </Link>
              </article>
            </section>
            <section className="dispute-ai-preview">
              <span>
                <WandIcon />
              </span>
              <div>
                <small>ACRU AI case strength</small>
                <strong>
                  {dispute.evidenceScore}% · {dispute.evidenceScore >= 85 ? "Strong" : "Needs evidence"}
                </strong>
                <p>
                  Based on payment authentication, customer history, order records, and available fulfillment evidence.
                </p>
              </div>
              <button type="button" onClick={() => setTab("AI response")}>
                Open analysis
              </button>
            </section>
          </>
        ) : null}

        {tab === "Evidence" ? (
          <>
            <section className="dispute-evidence-score">
              <div>
                <span>Evidence completeness</span>
                <strong>{uploaded ? "100%" : `${dispute.evidenceScore}%`}</strong>
              </div>
              <span>
                <i style={{ width: uploaded ? "100%" : `${dispute.evidenceScore}%` }} />
              </span>
              <small>
                {uploaded ? "All recommended evidence is attached." : "Add the missing items before submitting."}
              </small>
            </section>
            <section className="dispute-detail-card">
              <h3>Evidence checklist</h3>
              <div className="dispute-checklist">
                {[
                  { label: "Payment authorization", source: "ACRU payments", ready: true },
                  {
                    label: "Customer communication",
                    source: "Email integration",
                    ready: uploaded || dispute.evidenceScore >= 90
                  },
                  { label: "Terms accepted", source: "Checkout session", ready: true },
                  {
                    label: "Service usage logs",
                    source: "Launchpad telemetry",
                    ready: uploaded || dispute.reason !== "Product not received"
                  },
                  { label: "Invoice or receipt", source: dispute.order, ready: true }
                ].map((item) => (
                  <div key={item.label} data-ready={item.ready}>
                    <span>{item.ready ? <CheckCircleIcon /> : <AlertCircleIcon />}</span>
                    <div>
                      <strong>{item.label}</strong>
                      <small>{item.source}</small>
                    </div>
                    <b>{item.ready ? "Attached" : "Missing"}</b>
                  </div>
                ))}
              </div>
            </section>
            <section className="dispute-upload-card">
              <span>
                <UploadIcon />
              </span>
              <div>
                <strong>Add supporting evidence</strong>
                <small>PDF, PNG, JPG, CSV, or TXT · Maximum 10 MB</small>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUploaded(true);
                  setNotice("Supporting evidence attached");
                }}
              >
                {uploaded ? "Attached" : "Upload files"}
              </button>
            </section>
          </>
        ) : null}

        {tab === "AI response" ? (
          <>
            <section className="dispute-ai-hero">
              <span>
                <WandIcon />
              </span>
              <div>
                <h3>
                  {aiState === "ready"
                    ? "Response packet ready"
                    : aiState === "gathering"
                      ? "Gathering evidence…"
                      : "Build a stronger response"}
                </h3>
                <p>
                  AI reviews payment records, identity signals, communications, checkout acceptance, invoices, and
                  Launchpad usage telemetry to prepare network-compliant evidence.
                </p>
              </div>
            </section>
            <section className="dispute-ai-sources">
              <h3>Connected evidence sources</h3>
              {[
                {
                  icon: ReceiptDollarIcon,
                  name: "Payments & invoices",
                  detail: "Payment, receipt, invoice and card authentication"
                },
                {
                  icon: LockIcon,
                  name: "Launchpad security",
                  detail: "Session, device, IP and 3DS authentication signals"
                },
                {
                  icon: PersonIcon,
                  name: "Customer records",
                  detail: "Account history, prior payments and access events"
                },
                { icon: EmailIcon, name: "Communications", detail: "Relevant merchant and customer correspondence" }
              ].map((source) => (
                <div key={source.name}>
                  <span>
                    <source.icon />
                  </span>
                  <div>
                    <strong>{source.name}</strong>
                    <small>{source.detail}</small>
                  </div>
                  <CheckCircleIcon />
                </div>
              ))}
            </section>
            {aiState === "ready" ? (
              <section className="dispute-ai-draft">
                <header>
                  <div>
                    <span>AI response summary</span>
                    <strong>High-confidence evidence packet</strong>
                  </div>
                  <b>94% confidence</b>
                </header>
                <p>
                  The customer authenticated the payment using a recognized device and accessed the purchased service
                  from the same IP region on 14 separate occasions. Checkout records show explicit acceptance of the
                  service and cancellation terms.
                </p>
                <div>
                  <span>8 evidence items</span>
                  <span>12 pages</span>
                  <span>Network formatted</span>
                </div>
              </section>
            ) : null}
            <section className="dispute-ai-disclosure">
              <AlertCircleIcon />
              <p>
                AI may make mistakes. Review all evidence before submission. A configured response fee applies only when
                ACRU submits a case on your behalf.
              </p>
            </section>
            <div className="dispute-response-actions">
              {aiState !== "ready" ? (
                <button className="primary" type="button" disabled={aiState === "gathering"} onClick={generateResponse}>
                  <WandIcon />
                  {aiState === "gathering" ? "Analyzing case…" : "Generate AI response"}
                </button>
              ) : (
                <>
                  <button type="button" onClick={() => setTab("Evidence")}>
                    Review evidence
                  </button>
                  <button
                    className="primary"
                    type="button"
                    onClick={() => {
                      onSubmit(dispute.id);
                      setNotice("Response submitted to the card network");
                    }}
                  >
                    Submit response <ArrowRightIcon />
                  </button>
                </>
              )}
            </div>
          </>
        ) : null}

        {tab === "Timeline" ? (
          <section className="dispute-detail-card">
            <h3>Case timeline</h3>
            <ol className="dispute-timeline">
              <li>
                <span />
                <div>
                  <strong>Dispute opened</strong>
                  <small>
                    {dispute.created} · Cardholder filed {dispute.reason.toLowerCase()} claim
                  </small>
                </div>
              </li>
              <li>
                <span />
                <div>
                  <strong>ACRU AI assessment completed</strong>
                  <small>Evidence strength scored at {dispute.evidenceScore}%</small>
                </div>
              </li>
              <li>
                <span />
                <div>
                  <strong>Response deadline</strong>
                  <small>{dispute.due}</small>
                </div>
              </li>
            </ol>
          </section>
        ) : null}
        {tab === "Metadata" ? (
          <section className="dispute-detail-card">
            <h3>Metadata</h3>
            <dl>
              <div>
                <dt>order_id</dt>
                <dd>{dispute.order}</dd>
              </div>
              <div>
                <dt>payment_id</dt>
                <dd>{dispute.paymentId}</dd>
              </div>
              <div>
                <dt>source</dt>
                <dd>card_network</dd>
              </div>
              <div>
                <dt>environment</dt>
                <dd>production</dd>
              </div>
            </dl>
            <button className="dispute-inline-link" type="button" onClick={() => setNotice("Metadata editor opened")}>
              <PlusIcon />
              Add metadata
            </button>
          </section>
        ) : null}
      </div>
      {notice ? (
        <button className="dispute-toast" type="button" onClick={() => setNotice("")}>
          <CheckCircleIcon />
          {notice}
        </button>
      ) : null}
    </aside>
  );
}

function AutomationDialog({
  settings,
  onSave,
  onClose
}: {
  settings: AutomationSettings;
  onSave: (settings: AutomationSettings) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(settings);
  useDismissOnEscape(true, onClose);
  return (
    <div
      className="dispute-settings-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="dispute-settings-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="AI dispute response settings"
      >
        <header>
          <span>
            <AutomationIcon />
          </span>
          <div>
            <h2>AI dispute responses</h2>
            <p>Control when ACRU gathers evidence and responds on your behalf.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close settings">
            <XIcon />
          </button>
        </header>
        <div className="dispute-settings-body">
          <section className="dispute-setting-toggle">
            <div>
              <strong>Auto-response</strong>
              <small>Continuously monitor new disputes and prepare responses.</small>
            </div>
            <button
              className="acru-toggle"
              data-enabled={draft.enabled}
              type="button"
              role="switch"
              aria-checked={draft.enabled}
              onClick={() => setDraft((value) => ({ ...value, enabled: !value.enabled }))}
            >
              <span />
            </button>
          </section>
          <section className="dispute-setting-group">
            <h3>Submission control</h3>
            <p>Choose whether a human reviews the packet before ACRU submits it.</p>
            {(["Review before submit", "Submit automatically"] as const).map((option) => (
              <button
                key={option}
                className={draft.approval === option ? "active" : ""}
                type="button"
                onClick={() => setDraft((value) => ({ ...value, approval: option }))}
              >
                <span>
                  <strong>{option}</strong>
                  <small>
                    {option === "Review before submit"
                      ? "AI prepares the case; your team approves submission."
                      : "Eligible high-confidence cases submit before the deadline."}
                  </small>
                </span>
                {draft.approval === option ? <CheckCircleIcon /> : null}
              </button>
            ))}
          </section>
          <div className="dispute-setting-columns">
            <section className="dispute-setting-group compact">
              <h3>Maximum dispute amount</h3>
              {(["$500", "$2,500", "No limit"] as const).map((option) => (
                <button
                  key={option}
                  className={draft.maxAmount === option ? "active" : ""}
                  type="button"
                  onClick={() => setDraft((value) => ({ ...value, maxAmount: option }))}
                >
                  {option}
                  {draft.maxAmount === option ? <CheckCircleIcon /> : null}
                </button>
              ))}
            </section>
            <section className="dispute-setting-group compact">
              <h3>Minimum AI confidence</h3>
              {(["80%", "90%", "95%"] as const).map((option) => (
                <button
                  key={option}
                  className={draft.minimumConfidence === option ? "active" : ""}
                  type="button"
                  onClick={() => setDraft((value) => ({ ...value, minimumConfidence: option }))}
                >
                  {option}
                  {draft.minimumConfidence === option ? <CheckCircleIcon /> : null}
                </button>
              ))}
            </section>
          </div>
          <section className="dispute-source-access">
            <h3>Evidence access</h3>
            <div>
              <CheckCircleIcon />
              <span>
                <strong>Payments and invoices</strong>
                <small>Transaction, receipt, invoice, and refund history</small>
              </span>
            </div>
            <div>
              <CheckCircleIcon />
              <span>
                <strong>Launchpad telemetry</strong>
                <small>Sessions, usage, authentication, device, and IP signals</small>
              </span>
            </div>
            <div>
              <CheckCircleIcon />
              <span>
                <strong>Customer communications</strong>
                <small>Only relevant messages from connected merchant channels</small>
              </span>
            </div>
          </section>
          <section className="dispute-fee-consent">
            <div>
              <strong>AI response fee</strong>
              <b>$15.00 per submitted response</b>
            </div>
            <p>
              No charge for evidence gathering, drafts, cases you submit manually, or disputes ACRU determines should be
              accepted.
            </p>
            <label>
              <input
                type="checkbox"
                checked={draft.feeAccepted}
                onChange={(event) => setDraft((value) => ({ ...value, feeAccepted: event.target.checked }))}
              />
              I authorize the response fee when ACRU submits on our behalf.
            </label>
          </section>
        </div>
        <footer>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" disabled={!draft.feeAccepted} onClick={() => onSave(draft)}>
            Save automation settings
          </button>
        </footer>
      </section>
    </div>
  );
}

export function DisputesPage({ adapter = disputeAdapter }: { adapter?: ListAdapter<Dispute> }) {
  const { error, items: disputes, retry, setItems: setDisputes, status: resourceStatus } = useListCollection(adapter);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statusTabs)[number]>("All");
  const [reason, setReason] = useState<"All reasons" | DisputeReason>("All reasons");
  const [dateRange, setDateRange] = useState("Last 90 days");
  const [dateOpen, setDateOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState<Dispute | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [automation, setAutomation] = useState<AutomationSettings>({
    enabled: true,
    approval: "Review before submit",
    maxAmount: "$2,500",
    minimumConfidence: "90%",
    feeAccepted: true
  });

  const filteredDisputes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return disputes.filter(
      (dispute) =>
        (!normalized ||
          [dispute.id, dispute.paymentId, dispute.customer, dispute.email, dispute.order, dispute.reason]
            .join(" ")
            .toLowerCase()
            .includes(normalized)) &&
        (status === "All" || dispute.status === status) &&
        (reason === "All reasons" || dispute.reason === reason) &&
        matchesDatePreset(dispute.created, dateRange)
    );
  }, [dateRange, disputes, query, reason, status]);
  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(filteredDisputes.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filteredDisputes.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const needsResponse = disputes.filter((dispute) => dispute.status === "Needs response");
  const exposure = needsResponse.reduce((sum, dispute) => sum + dispute.amountMinor + dispute.feeMinor, 0);
  const won = disputes.filter((dispute) => dispute.status === "Won");
  const lost = disputes.filter((dispute) => dispute.status === "Lost");
  const winRate = Math.round((won.length / Math.max(1, won.length + lost.length)) * 100);
  const recovered = won.reduce((sum, dispute) => sum + dispute.amountMinor, 0);

  function submitResponse(id: string) {
    setDisputes((items) =>
      items.map((item) =>
        item.id === id ? { ...item, status: "Under review", evidence: "Submitted", evidenceScore: 100 } : item
      )
    );
    setSelected((item) =>
      item?.id === id ? { ...item, status: "Under review", evidence: "Submitted", evidenceScore: 100 } : item
    );
  }

  function exportCsv() {
    const rows = [
      [
        "Dispute ID",
        "Payment ID",
        "Created",
        "Due",
        "Amount",
        "Fee",
        "Status",
        "Reason",
        "Evidence",
        "Customer",
        "Order"
      ],
      ...filteredDisputes.map((dispute) => [
        dispute.id,
        dispute.paymentId,
        dispute.created,
        dispute.due,
        decimalAmount(dispute.amountMinor),
        decimalAmount(dispute.feeMinor),
        dispute.status,
        dispute.reason,
        dispute.evidence,
        dispute.customer,
        dispute.order
      ])
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "acru-disputes.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (resourceStatus !== "ready") {
    return (
      <CollectionPageState
        description="Respond to disputes, prepare evidence, and monitor outcomes."
        error={error}
        onRetry={retry}
        status={resourceStatus}
        title="Disputes"
      />
    );
  }

  return (
    <div className="disputes-workspace">
      <section className="disputes-list-pane">
        <header className="disputes-page-heading">
          <div>
            <h1>Disputes</h1>
            <p>Protect revenue, gather evidence, and manage card network responses.</p>
          </div>
          <div className="disputes-page-actions">
            <button
              className="disputes-automation-button"
              data-enabled={automation.enabled}
              type="button"
              onClick={() => setSettingsOpen(true)}
            >
              <AutomationIcon />
              <span>
                <small>AI auto-response</small>
                <strong>{automation.enabled ? "On · Review required" : "Off"}</strong>
              </span>
              <SettingsIcon />
            </button>
            <button className="disputes-secondary-button" type="button" onClick={exportCsv}>
              <ExportIcon />
              Export
            </button>
          </div>
        </header>
        <section className="disputes-metrics">
          <div>
            <span>Needs response</span>
            <strong>{needsResponse.length}</strong>
            <small>{needsResponse.filter((item) => item.dueDays <= 3).length} due within 3 days</small>
          </div>
          <div>
            <span>Open exposure</span>
            <strong>{money(exposure)}</strong>
            <small>Amount plus dispute fees</small>
          </div>
          <div>
            <span>Win rate</span>
            <strong>{winRate}%</strong>
            <small>Last 90 days · ↑ 8.4%</small>
          </div>
          <div>
            <span>Recovered</span>
            <strong>{money(recovered)}</strong>
            <small>Won dispute revenue</small>
          </div>
        </section>
        <div className="disputes-toolbar">
          <div className="disputes-status-tabs">
            {statusTabs.map((option) => (
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
          <div className="disputes-tools">
            <label className="disputes-search">
              <SearchIcon />
              <input
                type="search"
                placeholder="Search disputes"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div className="dispute-date-wrap">
              <button
                className="dispute-date-button"
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
                    className="dispute-popup-scrim"
                    type="button"
                    aria-label="Close date range"
                    onClick={() => setDateOpen(false)}
                  />
                  <div className="dispute-date-menu">
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
            <div className="dispute-filter-wrap">
              <button
                className="dispute-filter-button"
                type="button"
                aria-label="Filter disputes"
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
                    className="dispute-popup-scrim"
                    type="button"
                    aria-label="Close filters"
                    onClick={() => setFilterOpen(false)}
                  />
                  <div className="dispute-filter-menu">
                    <span>Dispute reason</span>
                    {(
                      [
                        "All reasons",
                        "Fraudulent",
                        "Product not received",
                        "Duplicate",
                        "Subscription canceled",
                        "Unrecognized"
                      ] as const
                    ).map((option) => (
                      <button
                        key={option}
                        className={reason === option ? "active" : ""}
                        type="button"
                        onClick={() => {
                          setReason(option);
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
        <div className="disputes-table-wrap">
          <table className="disputes-table">
            <thead>
              <tr>
                <th>Created</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Customer</th>
                <th>Evidence</th>
                <th>AI readiness</th>
                <th>Response due</th>
                <th>Dispute ID</th>
              </tr>
            </thead>
            <tbody>
              {!visible.length ? (
                <tr className="disputes-empty-row">
                  <td colSpan={9}>No disputes match these filters.</td>
                </tr>
              ) : null}
              {visible.map((dispute) => (
                <tr
                  key={dispute.id}
                  tabIndex={0}
                  data-selected={selected?.id === dispute.id}
                  onClick={() => setSelected(dispute)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") setSelected(dispute);
                  }}
                >
                  <td>
                    <strong>{dispute.created}</strong>
                    <small>{dispute.order}</small>
                  </td>
                  <td>
                    <strong>{money(dispute.amountMinor)}</strong>
                    <small>Fee {money(dispute.feeMinor)}</small>
                  </td>
                  <td>
                    <DisputeStatusPill status={dispute.status} />
                  </td>
                  <td>
                    <span className="dispute-reason">
                      <AlertTriangleIcon />
                      {dispute.reason}
                    </span>
                  </td>
                  <td>
                    <strong>{dispute.customer}</strong>
                    <small>{dispute.email}</small>
                  </td>
                  <td>
                    <EvidencePill state={dispute.evidence} />
                  </td>
                  <td>
                    <span className="dispute-ai-score" data-score={dispute.evidenceScore >= 85 ? "high" : "medium"}>
                      <WandIcon />
                      <strong>{dispute.evidenceScore}%</strong>
                      <small>{dispute.aiEligible ? "Eligible" : "Manual"}</small>
                    </span>
                  </td>
                  <td>
                    <span className="dispute-due" data-urgent={dispute.dueDays > 0 && dispute.dueDays <= 2}>
                      <strong>{dispute.due}</strong>
                      <small>{dispute.dueDays ? `${dispute.dueDays} days left` : ""}</small>
                    </span>
                  </td>
                  <td>
                    <code>{dispute.id}</code>
                    <button
                      type="button"
                      aria-label="Copy dispute ID"
                      onClick={(event) => {
                        event.stopPropagation();
                        void copy(dispute.id);
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
          className="disputes-pagination"
          onPageChange={setPage}
          page={currentPage}
          pageSize={pageSize}
          totalItems={filteredDisputes.length}
        />
      </section>
      {selected ? (
        <DisputeDrawer dispute={selected} onClose={() => setSelected(null)} onSubmit={submitResponse} />
      ) : null}
      {settingsOpen ? (
        <AutomationDialog
          settings={automation}
          onClose={() => setSettingsOpen(false)}
          onSave={(value) => {
            setAutomation(value);
            setSettingsOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
