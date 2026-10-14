"use client";

import Link from "next/link";
import {
  AlertTriangleIcon as AlertTriangle,
  ArrowRightIcon as ArrowRight,
  CheckCircleIcon as CheckCircle,
  CheckIcon as Check,
  ChevronDownIcon as ChevronDown,
  ChevronRightIcon as ChevronRight,
  ClipboardIcon as Copy,
  ClockIcon as Clock,
  CodeIcon as Code,
  ExportIcon as Export,
  FilterIcon as Filter,
  RefreshIcon as Refresh,
  SearchIcon as Search,
  XCircleIcon as XCircle
} from "@shopify/polaris-icons";
import { useEffect, useMemo, useState } from "react";

import { TablePagination } from "@/components/ui/table-pagination";

type Environment = "test" | "live";
type LogStatus = "success" | "error" | "pending";
type Method = "GET" | "POST" | "PATCH" | "DELETE";

type RequestLog = {
  id: string;
  method: Method;
  path: string;
  status: number;
  state: LogStatus;
  created: string;
  latency: string;
  version: string;
  key: string;
  request: string;
  response: string;
};

const logs: Record<Environment, RequestLog[]> = {
  test: [
    {
      id: "req_test_8Qm4aL2p",
      method: "POST",
      path: "/v1/payments",
      status: 200,
      state: "success",
      created: "Aug 25, 2:18:42 PM",
      latency: "184 ms",
      version: "2026-08-21",
      key: "sk_test_…D6nK4vT",
      request: `{
  "amount": 12500,
  "currency": "usd",
  "payment_method": "pm_card_visa",
  "capture": true
}`,
      response: `{
  "id": "pay_8T2zK9m1",
  "object": "payment",
  "amount": 12500,
  "currency": "usd",
  "status": "succeeded"
}`
    },
    {
      id: "req_test_3Kt7vB9x",
      method: "GET",
      path: "/v1/payments/pay_8T2zK9m1",
      status: 200,
      state: "success",
      created: "Aug 25, 2:18:40 PM",
      latency: "91 ms",
      version: "2026-08-21",
      key: "sk_test_…D6nK4vT",
      request: "No request body",
      response: `{
  "id": "pay_8T2zK9m1",
  "status": "succeeded",
  "amount": 12500
}`
    },
    {
      id: "req_test_7Hs2pN4c",
      method: "POST",
      path: "/v1/refunds",
      status: 400,
      state: "error",
      created: "Aug 25, 2:14:09 PM",
      latency: "126 ms",
      version: "2026-08-21",
      key: "rk_test_…7bc1",
      request: `{
  "payment": "pay_missing",
  "amount": 2500
}`,
      response: `{
  "error": {
    "type": "invalid_request_error",
    "code": "resource_missing",
    "message": "No payment found for pay_missing."
  }
}`
    },
    {
      id: "req_test_5Ld9xC6m",
      method: "POST",
      path: "/v1/checkout/sessions",
      status: 201,
      state: "success",
      created: "Aug 25, 2:09:31 PM",
      latency: "212 ms",
      version: "2026-08-21",
      key: "rk_test_…7bc1",
      request: `{
  "line_items": [{ "price": "price_demo", "quantity": 1 }],
  "success_url": "https://example.com/success"
}`,
      response: `{
  "id": "cs_test_5Ld9xC6m",
  "status": "open",
  "url": "https://checkout.acru.com/cs_test_5Ld9xC6m"
}`
    },
    {
      id: "req_test_2Pw6rF8j",
      method: "GET",
      path: "/v1/balance",
      status: 200,
      state: "success",
      created: "Aug 25, 1:58:22 PM",
      latency: "76 ms",
      version: "2026-08-21",
      key: "sk_test_…D6nK4vT",
      request: "No request body",
      response: `{
  "available": [{ "amount": 59821441, "currency": "usd" }],
  "pending": [{ "amount": 2361523, "currency": "usd" }]
}`
    }
  ],
  live: [
    {
      id: "req_live_9Ar4mT1v",
      method: "POST",
      path: "/v1/payments",
      status: 200,
      state: "success",
      created: "Aug 25, 2:12:08 PM",
      latency: "168 ms",
      version: "2026-08-21",
      key: "sk_live_…P2sK5cJ",
      request: `{
  "amount": 8499,
  "currency": "usd",
  "payment_method": "pm_4Bx1qS"
}`,
      response: `{
  "id": "pay_live_9Ar4mT1v",
  "status": "succeeded"
}`
    },
    {
      id: "req_live_4Bx1qS7h",
      method: "POST",
      path: "/v1/payouts",
      status: 202,
      state: "pending",
      created: "Aug 25, 1:46:19 PM",
      latency: "143 ms",
      version: "2026-08-21",
      key: "sk_live_…P2sK5cJ",
      request: `{
  "amount": 4200000,
  "currency": "usd",
  "destination": "ba_4242"
}`,
      response: `{
  "id": "po_live_4Bx1qS7h",
  "status": "pending"
}`
    }
  ]
};

function RequestStatus({ log }: { log: RequestLog }) {
  return (
    <span className="request-log-status" data-status={log.state}>
      {log.state === "success" ? <CheckCircle /> : log.state === "error" ? <XCircle /> : <Clock />}
      {log.status}
    </span>
  );
}

export function LogsPage() {
  const [environment, setEnvironment] = useState<Environment>("test");
  const [selectedId, setSelectedId] = useState(logs.test[0].id);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");
  const [page, setPage] = useState(1);
  const [detailTab, setDetailTab] = useState<"overview" | "request" | "response">("overview");
  const [toast, setToast] = useState("");
  const activeLogs = logs[environment];
  const selected = activeLogs.find((log) => log.id === selectedId) ?? activeLogs[0];
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return activeLogs.filter(
      (log) =>
        (status === "all" || log.state === status) &&
        (method === "all" || log.method === method) &&
        (!normalized || `${log.id} ${log.path}`.toLowerCase().includes(normalized))
    );
  }, [activeLogs, method, query, status]);
  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [currentPage, filtered]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function changeEnvironment(next: Environment) {
    setEnvironment(next);
    setSelectedId(logs[next][0]?.id ?? "");
    setQuery("");
    setStatus("all");
    setMethod("all");
    setPage(1);
  }

  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setToast(label);
    } catch {
      setToast("Copy is unavailable");
    }
  }

  const successes = activeLogs.filter((log) => log.state === "success").length;
  const errors = activeLogs.filter((log) => log.state === "error").length;

  return (
    <section className="developer-workspace request-logs-workspace">
      <header className="developer-header">
        <div>
          <span className="developer-eyebrow">
            <Code /> Developers
          </span>
          <h1>Logs</h1>
          <p>Inspect API requests, response codes, latency, and request IDs.</p>
        </div>
        <div className="developer-header-actions">
          <div className="developer-mode-switch" aria-label="Log environment">
            {(["test", "live"] as Environment[]).map((item) => (
              <button
                className={environment === item ? "active" : ""}
                key={item}
                onClick={() => changeEnvironment(item)}
                type="button"
              >
                <span className="developer-status-dot" data-live={item === "live" ? "true" : undefined} />
                {item === "test" ? "Test mode" : "Live mode"}
              </button>
            ))}
          </div>
          <button
            className="developer-secondary-button"
            onClick={() => setToast("Request logs refreshed")}
            type="button"
          >
            <Refresh /> Refresh
          </button>
          <button className="developer-secondary-button" onClick={() => setToast("CSV export prepared")} type="button">
            <Export /> Export
          </button>
        </div>
      </header>

      <main className="request-logs-content">
        <section className="request-log-summary">
          <div>
            <span>Requests</span>
            <strong>{activeLogs.length}</strong>
            <small>Last 24 hours</small>
          </div>
          <div>
            <span>Successful</span>
            <strong>{successes}</strong>
            <small>{activeLogs.length ? ((successes / activeLogs.length) * 100).toFixed(1) : "0"}% success rate</small>
          </div>
          <div data-alert={errors ? "true" : undefined}>
            <span>Errors</span>
            <strong>{errors}</strong>
            <small>{errors ? "Requires review" : "No errors"}</small>
          </div>
          <div>
            <span>Median latency</span>
            <strong>143 ms</strong>
            <small>Across all endpoints</small>
          </div>
        </section>

        <section className="request-log-panel">
          <div className="request-log-toolbar">
            <label className="request-log-search">
              <Search />
              <input
                aria-label="Search request logs"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Search request ID or endpoint"
                value={query}
              />
            </label>
            <label>
              <Filter />
              <select
                aria-label="Filter by status"
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                }}
                value={status}
              >
                <option value="all">All statuses</option>
                <option value="success">Successful</option>
                <option value="error">Errors</option>
                <option value="pending">Pending</option>
              </select>
              <ChevronDown />
            </label>
            <label>
              <select
                aria-label="Filter by method"
                onChange={(event) => {
                  setMethod(event.target.value);
                  setPage(1);
                }}
                value={method}
              >
                <option value="all">All methods</option>
                <option>GET</option>
                <option>POST</option>
                <option>PATCH</option>
                <option>DELETE</option>
              </select>
              <ChevronDown />
            </label>
            <span>Last 24 hours</span>
          </div>
          <div className="request-log-layout">
            <div className="request-log-table-wrap">
              <table className="request-log-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Method</th>
                    <th>Endpoint</th>
                    <th>Time</th>
                    <th>Latency</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {visibleLogs.map((log) => (
                    <tr
                      className={selected?.id === log.id ? "active" : ""}
                      key={log.id}
                      onClick={() => {
                        setSelectedId(log.id);
                        setDetailTab("overview");
                      }}
                    >
                      <td>
                        <RequestStatus log={log} />
                      </td>
                      <td>
                        <code className="request-method" data-method={log.method}>
                          {log.method}
                        </code>
                      </td>
                      <td>
                        <b>{log.path}</b>
                        <code>{log.id}</code>
                      </td>
                      <td>{log.created.replace("Aug 25, ", "")}</td>
                      <td>{log.latency}</td>
                      <td>
                        <ChevronRight />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filtered.length ? (
                <div className="request-log-empty">
                  <Search />
                  <h3>No matching requests</h3>
                  <p>Change the search or filters to see more activity.</p>
                  <button
                    onClick={() => {
                      setQuery("");
                      setStatus("all");
                      setMethod("all");
                      setPage(1);
                    }}
                    type="button"
                  >
                    Clear filters
                  </button>
                </div>
              ) : null}
              <TablePagination
                className="request-log-pagination"
                onPageChange={setPage}
                page={currentPage}
                pageSize={pageSize}
                totalItems={filtered.length}
              />
            </div>

            {selected ? (
              <aside className="request-detail-panel">
                <header>
                  <div>
                    <RequestStatus log={selected} />
                    <h2>
                      {selected.method} {selected.path}
                    </h2>
                    <code>{selected.id}</code>
                  </div>
                  <button
                    aria-label="Copy request ID"
                    onClick={() => copy(selected.id, "Request ID copied")}
                    type="button"
                  >
                    <Copy />
                  </button>
                </header>
                <div className="request-detail-tabs">
                  {(["overview", "request", "response"] as const).map((item) => (
                    <button
                      className={detailTab === item ? "active" : ""}
                      key={item}
                      onClick={() => setDetailTab(item)}
                      type="button"
                    >
                      {item}
                    </button>
                  ))}
                </div>
                {detailTab === "overview" ? (
                  <div className="request-detail-overview">
                    <dl>
                      <div>
                        <dt>Status</dt>
                        <dd>
                          {selected.status}{" "}
                          {selected.state === "error"
                            ? "Bad Request"
                            : selected.state === "pending"
                              ? "Accepted"
                              : "OK"}
                        </dd>
                      </div>
                      <div>
                        <dt>Method</dt>
                        <dd>{selected.method}</dd>
                      </div>
                      <div>
                        <dt>Created</dt>
                        <dd>{selected.created}</dd>
                      </div>
                      <div>
                        <dt>Latency</dt>
                        <dd>{selected.latency}</dd>
                      </div>
                      <div>
                        <dt>API version</dt>
                        <dd>{selected.version}</dd>
                      </div>
                      <div>
                        <dt>API key</dt>
                        <dd>{selected.key}</dd>
                      </div>
                    </dl>
                    {selected.state === "error" ? (
                      <div className="request-error-note">
                        <AlertTriangle />
                        <span>
                          <b>Request rejected</b>Open the response body for the exact error code and remediation
                          details.
                        </span>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <section className="request-json-panel">
                    <header>
                      <span>{detailTab === "request" ? "Request body" : "Response body"}</span>
                      <button
                        onClick={() =>
                          copy(detailTab === "request" ? selected.request : selected.response, `${detailTab} copied`)
                        }
                        type="button"
                      >
                        <Copy /> Copy
                      </button>
                    </header>
                    <pre>
                      <code>{detailTab === "request" ? selected.request : selected.response}</code>
                    </pre>
                  </section>
                )}
                <footer>
                  <Link href="/developers/documentation">
                    Open API reference <ArrowRight />
                  </Link>
                </footer>
              </aside>
            ) : null}
          </div>
        </section>
      </main>
      {toast ? (
        <div className="developer-toast">
          <Check /> {toast}
        </div>
      ) : null}
    </section>
  );
}
