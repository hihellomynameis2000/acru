"use client";

import Link from "next/link";
import {
  AlertTriangleIcon as AlertTriangle,
  ArrowRightIcon as ArrowRight,
  BookOpenIcon as BookOpen,
  CheckCircleIcon as CheckCircle,
  CheckIcon as Check,
  ChevronDownIcon as ChevronDown,
  ClipboardIcon as Copy,
  ClockIcon as Clock,
  CodeIcon as Code,
  ConnectIcon as Webhook,
  FilterIcon as Filter,
  HideIcon as EyeOff,
  LockIcon as Lock,
  PlusIcon as Plus,
  RefreshIcon as Refresh,
  ReplayIcon as Replay,
  SearchIcon as Search,
  SendIcon as Send,
  ViewIcon as Eye,
  XCircleIcon as XCircle,
  XIcon as X
} from "@shopify/polaris-icons";
import { useEffect, useMemo, useState } from "react";

type Environment = "test" | "live";
type DeliveryStatus = "delivered" | "failed" | "pending";
type Tab = "destinations" | "deliveries";
type Modal = "add" | "test" | null;

type Endpoint = {
  id: string;
  url: string;
  description: string;
  enabled: boolean;
  events: string[];
  apiVersion: string;
  successRate: string;
  lastDelivery: string;
};

type Delivery = {
  id: string;
  endpointId: string;
  event: string;
  objectId: string;
  created: string;
  status: DeliveryStatus;
  response: string;
  duration: string;
  attempts: number;
  payload: string;
};

const availableEvents = [
  "payment.succeeded",
  "payment.failed",
  "payment.refunded",
  "checkout.completed",
  "dispute.created",
  "payout.paid",
  "payout.failed",
  "subscription.created",
  "subscription.updated",
  "subscription.canceled"
];

const initialEndpoints: Record<Environment, Endpoint[]> = {
  test: [
    {
      id: "we_test_checkout",
      url: "https://sandbox.northstar.studio/api/acru/webhooks",
      description: "Checkout and payment lifecycle",
      enabled: true,
      events: ["payment.succeeded", "payment.failed", "payment.refunded", "checkout.completed"],
      apiVersion: "2026-08-21",
      successRate: "99.7%",
      lastDelivery: "4 minutes ago"
    },
    {
      id: "we_test_payouts",
      url: "https://sandbox.northstar.studio/api/acru/payouts",
      description: "Settlement and payout updates",
      enabled: true,
      events: ["payout.paid", "payout.failed"],
      apiVersion: "2026-08-21",
      successRate: "100%",
      lastDelivery: "38 minutes ago"
    }
  ],
  live: [
    {
      id: "we_live_primary",
      url: "https://northstar.studio/api/acru/webhooks",
      description: "Production event destination",
      enabled: true,
      events: [
        "payment.succeeded",
        "payment.failed",
        "payment.refunded",
        "checkout.completed",
        "dispute.created",
        "payout.paid",
        "payout.failed"
      ],
      apiVersion: "2026-08-21",
      successRate: "98.9%",
      lastDelivery: "11 minutes ago"
    }
  ]
};

const initialDeliveries: Record<Environment, Delivery[]> = {
  test: [
    {
      id: "evt_test_9mD2K7",
      endpointId: "we_test_checkout",
      event: "payment.succeeded",
      objectId: "pay_8T2zK9m1",
      created: "Aug 25, 1:42 PM",
      status: "delivered",
      response: "200 OK",
      duration: "184 ms",
      attempts: 1,
      payload: `{
  "id": "evt_test_9mD2K7",
  "type": "payment.succeeded",
  "created": 1787683362,
  "data": {
    "object": {
      "id": "pay_8T2zK9m1",
      "amount": 12500,
      "currency": "usd",
      "status": "succeeded"
    }
  }
}`
    },
    {
      id: "evt_test_4qH8W3",
      endpointId: "we_test_checkout",
      event: "payment.failed",
      objectId: "pay_3P7vM2x8",
      created: "Aug 25, 1:31 PM",
      status: "failed",
      response: "500 ERR",
      duration: "2.8 s",
      attempts: 3,
      payload: `{
  "id": "evt_test_4qH8W3",
  "type": "payment.failed",
  "data": {
    "object": {
      "id": "pay_3P7vM2x8",
      "status": "failed",
      "failure_code": "processor_declined"
    }
  }
}`
    },
    {
      id: "evt_test_7cN1R5",
      endpointId: "we_test_payouts",
      event: "payout.paid",
      objectId: "po_7F2mL9d4",
      created: "Aug 25, 12:54 PM",
      status: "delivered",
      response: "204 OK",
      duration: "219 ms",
      attempts: 1,
      payload: `{
  "id": "evt_test_7cN1R5",
  "type": "payout.paid",
  "data": {
    "object": {
      "id": "po_7F2mL9d4",
      "amount": 4250000,
      "currency": "usd"
    }
  }
}`
    },
    {
      id: "evt_test_2aB6J0",
      endpointId: "we_test_checkout",
      event: "checkout.completed",
      objectId: "cs_1V8kQ4p2",
      created: "Aug 25, 12:46 PM",
      status: "pending",
      response: "Awaiting response",
      duration: "—",
      attempts: 1,
      payload: `{
  "id": "evt_test_2aB6J0",
  "type": "checkout.completed",
  "data": {
    "object": {
      "id": "cs_1V8kQ4p2",
      "payment_status": "paid"
    }
  }
}`
    }
  ],
  live: [
    {
      id: "evt_live_6sP1E8",
      endpointId: "we_live_primary",
      event: "payment.succeeded",
      objectId: "pay_2M4wT8d7",
      created: "Aug 25, 1:35 PM",
      status: "delivered",
      response: "200 OK",
      duration: "162 ms",
      attempts: 1,
      payload: `{
  "id": "evt_live_6sP1E8",
  "type": "payment.succeeded",
  "livemode": true,
  "data": { "object": { "id": "pay_2M4wT8d7" } }
}`
    },
    {
      id: "evt_live_1xR5C9",
      endpointId: "we_live_primary",
      event: "dispute.created",
      objectId: "dp_8K1nH5s3",
      created: "Aug 25, 12:58 PM",
      status: "delivered",
      response: "200 OK",
      duration: "203 ms",
      attempts: 1,
      payload: `{
  "id": "evt_live_1xR5C9",
  "type": "dispute.created",
  "livemode": true,
  "data": { "object": { "id": "dp_8K1nH5s3" } }
}`
    }
  ]
};

function StatusIcon({ status }: { status: DeliveryStatus }) {
  if (status === "delivered") return <CheckCircle />;
  if (status === "failed") return <XCircle />;
  return <Clock />;
}

export function WebhooksPage() {
  const [environment, setEnvironment] = useState<Environment>("test");
  const [tab, setTab] = useState<Tab>("destinations");
  const [modal, setModal] = useState<Modal>(null);
  const [endpoints, setEndpoints] = useState(initialEndpoints);
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [selectedEndpointId, setSelectedEndpointId] = useState(initialEndpoints.test[0].id);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(initialDeliveries.test[0].id);
  const [deliveryStatus, setDeliveryStatus] = useState<"all" | DeliveryStatus>("all");
  const [query, setQuery] = useState("");
  const [secretVisible, setSecretVisible] = useState(false);
  const [toast, setToast] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["payment.succeeded", "payment.failed"]);
  const [testEvent, setTestEvent] = useState("payment.succeeded");

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const activeEndpoints = endpoints[environment];
  const activeDeliveries = deliveries[environment];
  const selectedEndpoint = activeEndpoints.find((endpoint) => endpoint.id === selectedEndpointId) ?? activeEndpoints[0];
  const selectedDelivery = activeDeliveries.find((delivery) => delivery.id === selectedDeliveryId);
  const filteredDeliveries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return activeDeliveries.filter((delivery) => {
      const matchesStatus = deliveryStatus === "all" || delivery.status === deliveryStatus;
      const matchesQuery =
        !normalizedQuery ||
        delivery.event.toLowerCase().includes(normalizedQuery) ||
        delivery.id.toLowerCase().includes(normalizedQuery) ||
        delivery.objectId.toLowerCase().includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [activeDeliveries, deliveryStatus, query]);

  const deliveredCount = activeDeliveries.filter((delivery) => delivery.status === "delivered").length;
  const failedCount = activeDeliveries.filter((delivery) => delivery.status === "failed").length;
  const attemptedCount = deliveredCount + failedCount;
  const deliveryRate = attemptedCount ? `${((deliveredCount / attemptedCount) * 100).toFixed(1)}%` : "—";
  const signingSecret = `whsec_${environment}_acru_7Qc4fN2pJ1eK8xMh`;

  function changeEnvironment(next: Environment) {
    setEnvironment(next);
    setSelectedEndpointId(initialEndpoints[next][0]?.id ?? "");
    setSelectedDeliveryId(initialDeliveries[next][0]?.id ?? "");
    setDeliveryStatus("all");
    setQuery("");
    setSecretVisible(false);
  }

  async function copy(value: string, message: string) {
    try {
      await navigator.clipboard.writeText(value);
      setToast(message);
    } catch {
      setToast("Copy is unavailable in this browser");
    }
  }

  function toggleEndpoint() {
    if (!selectedEndpoint) return;
    setEndpoints((current) => ({
      ...current,
      [environment]: current[environment].map((endpoint) =>
        endpoint.id === selectedEndpoint.id ? { ...endpoint, enabled: !endpoint.enabled } : endpoint
      )
    }));
    setToast(selectedEndpoint.enabled ? "Destination disabled" : "Destination enabled");
  }

  function retryDelivery() {
    if (!selectedDelivery) return;
    setDeliveries((current) => ({
      ...current,
      [environment]: current[environment].map((delivery) =>
        delivery.id === selectedDelivery.id
          ? {
              ...delivery,
              status: "delivered",
              response: "200 OK",
              duration: "196 ms",
              attempts: delivery.attempts + 1
            }
          : delivery
      )
    }));
    setToast("Event delivered successfully");
  }

  function createEndpoint() {
    if (!newUrl.trim() || !selectedEvents.length) return;
    const endpoint: Endpoint = {
      id: `we_${environment}_${Date.now()}`,
      url: newUrl.trim(),
      description: newDescription.trim() || "Webhook event destination",
      enabled: true,
      events: selectedEvents,
      apiVersion: "2026-08-21",
      successRate: "No deliveries",
      lastDelivery: "Never"
    };
    setEndpoints((current) => ({ ...current, [environment]: [endpoint, ...current[environment]] }));
    setSelectedEndpointId(endpoint.id);
    setNewUrl("");
    setNewDescription("");
    setModal(null);
    setTab("destinations");
    setToast("Event destination created");
  }

  function sendTestEvent() {
    if (!selectedEndpoint) return;
    const delivery: Delivery = {
      id: `evt_${environment}_${Math.random().toString(36).slice(2, 8)}`,
      endpointId: selectedEndpoint.id,
      event: testEvent,
      objectId: `obj_${Math.random().toString(36).slice(2, 10)}`,
      created: "Just now",
      status: "delivered",
      response: "200 OK",
      duration: "191 ms",
      attempts: 1,
      payload: `{
  "id": "evt_${environment}_sample",
  "type": "${testEvent}",
  "livemode": ${environment === "live"},
  "data": { "object": { "id": "obj_sample" } }
}`
    };
    setDeliveries((current) => ({ ...current, [environment]: [delivery, ...current[environment]] }));
    setSelectedDeliveryId(delivery.id);
    setModal(null);
    setTab("deliveries");
    setToast("Test event delivered");
  }

  return (
    <section className="developer-workspace webhook-workspace">
      <header className="developer-header webhook-header">
        <div>
          <span className="developer-eyebrow">
            <Code /> Developers
          </span>
          <h1>Webhooks</h1>
          <p>Monitor event destinations, inspect delivery attempts, and resolve failures.</p>
        </div>
        <div className="developer-header-actions">
          <div className="developer-mode-switch" aria-label="Webhook environment">
            {(["test", "live"] as Environment[]).map((mode) => (
              <button
                className={environment === mode ? "active" : ""}
                key={mode}
                onClick={() => changeEnvironment(mode)}
                type="button"
              >
                <span className="developer-status-dot" data-live={mode === "live" ? "true" : undefined} />
                {mode === "test" ? "Test mode" : "Live mode"}
              </button>
            ))}
          </div>
          <button className="developer-secondary-button" onClick={() => setModal("test")} type="button">
            <Send /> Send test event
          </button>
          <button className="developer-primary-button" onClick={() => setModal("add")} type="button">
            <Plus /> Add destination
          </button>
        </div>
      </header>

      <main className="webhook-content">
        <section className="webhook-summary" aria-label="Webhook summary">
          <div>
            <span>Active destinations</span>
            <strong>{activeEndpoints.filter((endpoint) => endpoint.enabled).length}</strong>
            <small>{environment === "test" ? "Sandbox" : "Production"}</small>
          </div>
          <div>
            <span>Delivery rate</span>
            <strong>{deliveryRate}</strong>
            <small>Current activity</small>
          </div>
          <div>
            <span>Delivered</span>
            <strong>{deliveredCount}</strong>
            <small>Last 24 hours</small>
          </div>
          <div data-alert={failedCount ? "true" : undefined}>
            <span>Failed</span>
            <strong>{failedCount}</strong>
            <small>{failedCount ? "Needs attention" : "No failures"}</small>
          </div>
        </section>

        <div className="webhook-tabs" role="tablist" aria-label="Webhook workspace">
          <button
            className={tab === "destinations" ? "active" : ""}
            onClick={() => setTab("destinations")}
            type="button"
          >
            Event destinations <span>{activeEndpoints.length}</span>
          </button>
          <button className={tab === "deliveries" ? "active" : ""} onClick={() => setTab("deliveries")} type="button">
            Event deliveries <span>{activeDeliveries.length}</span>
          </button>
        </div>

        {tab === "destinations" ? (
          <section className="webhook-workbench">
            <aside className="webhook-destinations">
              <header>
                <div>
                  <h2>Destinations</h2>
                  <p>HTTPS endpoints receiving Acru events.</p>
                </div>
                <button aria-label="Add destination" onClick={() => setModal("add")} type="button">
                  <Plus />
                </button>
              </header>
              <div className="webhook-endpoint-list">
                {activeEndpoints.map((endpoint) => (
                  <button
                    className={selectedEndpoint?.id === endpoint.id ? "active" : ""}
                    key={endpoint.id}
                    onClick={() => setSelectedEndpointId(endpoint.id)}
                    type="button"
                  >
                    <span className="webhook-endpoint-icon">
                      <Webhook />
                    </span>
                    <span>
                      <b>{endpoint.description}</b>
                      <small>{endpoint.url.replace(/^https?:\/\//, "")}</small>
                      <em data-enabled={endpoint.enabled ? "true" : undefined}>
                        <span /> {endpoint.enabled ? "Enabled" : "Disabled"}
                      </em>
                    </span>
                    <ArrowRight />
                  </button>
                ))}
              </div>
            </aside>

            {selectedEndpoint ? (
              <article className="webhook-destination-detail">
                <header>
                  <div>
                    <span className="webhook-detail-icon">
                      <Webhook />
                    </span>
                    <div>
                      <h2>{selectedEndpoint.description}</h2>
                      <p>{selectedEndpoint.url}</p>
                    </div>
                  </div>
                  <div>
                    <span className="webhook-health" data-enabled={selectedEndpoint.enabled ? "true" : undefined}>
                      <span /> {selectedEndpoint.enabled ? "Healthy" : "Disabled"}
                    </span>
                  </div>
                </header>

                <div className="webhook-detail-metrics">
                  <div>
                    <span>Delivery success</span>
                    <b>{selectedEndpoint.successRate}</b>
                  </div>
                  <div>
                    <span>Subscribed events</span>
                    <b>{selectedEndpoint.events.length}</b>
                  </div>
                  <div>
                    <span>Last delivery</span>
                    <b>{selectedEndpoint.lastDelivery}</b>
                  </div>
                  <div>
                    <span>API version</span>
                    <b>{selectedEndpoint.apiVersion}</b>
                  </div>
                </div>

                <section className="webhook-setting-block">
                  <header>
                    <div>
                      <h3>Endpoint URL</h3>
                      <p>Acru sends signed HTTPS POST requests to this address.</p>
                    </div>
                    <button onClick={() => copy(selectedEndpoint.url, "Endpoint URL copied")} type="button">
                      <Copy /> Copy
                    </button>
                  </header>
                  <code>{selectedEndpoint.url}</code>
                </section>

                <section className="webhook-setting-block">
                  <header>
                    <div>
                      <h3>Signing secret</h3>
                      <p>Verify the Acru-Signature header before processing an event.</p>
                    </div>
                    <button onClick={() => setSecretVisible((current) => !current)} type="button">
                      {secretVisible ? <EyeOff /> : <Eye />} {secretVisible ? "Hide" : "Reveal"}
                    </button>
                  </header>
                  <div className="webhook-secret-row">
                    <code>{secretVisible ? signingSecret : "whsec_••••••••••••••••••••••••"}</code>
                    <button
                      aria-label="Copy signing secret"
                      disabled={!secretVisible}
                      onClick={() => copy(signingSecret, "Signing secret copied")}
                      type="button"
                    >
                      <Copy />
                    </button>
                  </div>
                </section>

                <section className="webhook-event-subscriptions">
                  <header>
                    <div>
                      <h3>Listening to</h3>
                      <p>{selectedEndpoint.events.length} event types are routed to this destination.</p>
                    </div>
                  </header>
                  <div>
                    {selectedEndpoint.events.map((event) => (
                      <code key={event}>{event}</code>
                    ))}
                  </div>
                </section>

                <footer>
                  <button onClick={toggleEndpoint} type="button">
                    {selectedEndpoint.enabled ? "Disable destination" : "Enable destination"}
                  </button>
                  <button onClick={() => setModal("test")} type="button">
                    <Send /> Send test event
                  </button>
                </footer>
              </article>
            ) : (
              <div className="webhook-empty-state">
                <Webhook />
                <h2>No destinations yet</h2>
                <p>Add an HTTPS endpoint to start receiving events from Acru.</p>
                <button onClick={() => setModal("add")} type="button">
                  <Plus /> Add destination
                </button>
              </div>
            )}
          </section>
        ) : (
          <section className="webhook-deliveries-panel">
            <header>
              <div>
                <h2>Event deliveries</h2>
                <p>Inspect every attempt Acru made to reach your endpoints.</p>
              </div>
              <button onClick={() => setToast("Deliveries refreshed")} type="button">
                <Refresh /> Refresh
              </button>
            </header>
            <div className="webhook-delivery-toolbar">
              <label>
                <Search />
                <input
                  aria-label="Search event deliveries"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search event type, event ID, or object ID"
                  value={query}
                />
              </label>
              <label>
                <Filter />
                <select
                  aria-label="Delivery status"
                  onChange={(event) => setDeliveryStatus(event.target.value as "all" | DeliveryStatus)}
                  value={deliveryStatus}
                >
                  <option value="all">All statuses</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                  <option value="pending">Pending</option>
                </select>
                <ChevronDown />
              </label>
            </div>

            <div className="webhook-delivery-layout">
              <div className="webhook-delivery-table-wrap">
                <table className="webhook-delivery-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Event</th>
                      <th>Response</th>
                      <th>Attempts</th>
                      <th>Created</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeliveries.map((delivery) => (
                      <tr
                        className={selectedDelivery?.id === delivery.id ? "active" : ""}
                        key={delivery.id}
                        onClick={() => setSelectedDeliveryId(delivery.id)}
                      >
                        <td>
                          <span className="webhook-delivery-status" data-status={delivery.status}>
                            <StatusIcon status={delivery.status} /> {delivery.status}
                          </span>
                        </td>
                        <td>
                          <b>{delivery.event}</b>
                          <code>{delivery.id}</code>
                        </td>
                        <td>
                          <code data-status={delivery.status}>{delivery.response}</code>
                        </td>
                        <td>{delivery.attempts}</td>
                        <td>{delivery.created}</td>
                        <td>
                          <ArrowRight />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!filteredDeliveries.length ? (
                  <div className="webhook-no-results">
                    <Search />
                    <h3>No matching deliveries</h3>
                    <p>Try another event ID, type, object, or delivery status.</p>
                    <button
                      onClick={() => {
                        setQuery("");
                        setDeliveryStatus("all");
                      }}
                      type="button"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : null}
              </div>

              {selectedDelivery ? (
                <aside className="webhook-attempt-detail">
                  <header>
                    <div>
                      <span className="webhook-delivery-status" data-status={selectedDelivery.status}>
                        <StatusIcon status={selectedDelivery.status} /> {selectedDelivery.status}
                      </span>
                      <h2>{selectedDelivery.event}</h2>
                      <code>{selectedDelivery.id}</code>
                    </div>
                    <button aria-label="Close delivery detail" onClick={() => setSelectedDeliveryId("")} type="button">
                      <X />
                    </button>
                  </header>
                  <dl>
                    <div>
                      <dt>HTTP response</dt>
                      <dd data-status={selectedDelivery.status}>{selectedDelivery.response}</dd>
                    </div>
                    <div>
                      <dt>Response time</dt>
                      <dd>{selectedDelivery.duration}</dd>
                    </div>
                    <div>
                      <dt>Attempts</dt>
                      <dd>{selectedDelivery.attempts}</dd>
                    </div>
                    <div>
                      <dt>Object</dt>
                      <dd>{selectedDelivery.objectId}</dd>
                    </div>
                  </dl>
                  <section className="webhook-attempt-timeline">
                    <h3>Delivery attempts</h3>
                    <div>
                      <span data-status={selectedDelivery.status}>
                        <StatusIcon status={selectedDelivery.status} />
                      </span>
                      <p>
                        <b>{selectedDelivery.response}</b>
                        <small>
                          {selectedDelivery.created} · {selectedDelivery.duration}
                        </small>
                      </p>
                    </div>
                  </section>
                  <section className="webhook-payload">
                    <header>
                      <h3>Request payload</h3>
                      <button onClick={() => copy(selectedDelivery.payload, "Payload copied")} type="button">
                        <Copy /> Copy
                      </button>
                    </header>
                    <pre>
                      <code>{selectedDelivery.payload}</code>
                    </pre>
                  </section>
                  <footer>
                    <button onClick={retryDelivery} type="button">
                      <Replay /> Retry delivery
                    </button>
                  </footer>
                </aside>
              ) : null}
            </div>
          </section>
        )}

        <section className="webhook-guidance">
          <Lock />
          <div>
            <h2>Verify every event before processing it</h2>
            <p>Use the raw request body, the Acru-Signature header, and this endpoint’s signing secret.</p>
          </div>
          <Link href="/developers/documentation">
            Webhook guide <BookOpen />
          </Link>
        </section>
      </main>

      {toast ? (
        <div className="developer-toast" role="status">
          <Check /> {toast}
        </div>
      ) : null}

      {modal ? (
        <div className="developer-modal-scrim" role="presentation">
          <div className={`developer-modal ${modal === "add" ? "wide" : ""}`} role="dialog" aria-modal="true">
            <header>
              <div>
                <span className="developer-modal-icon">{modal === "add" ? <Webhook /> : <Send />}</span>
                <div>
                  <h2>{modal === "add" ? "Add event destination" : "Send a test event"}</h2>
                  <p>
                    {modal === "add"
                      ? `Configure an HTTPS endpoint in ${environment} mode.`
                      : `Send a simulated event to ${selectedEndpoint?.description ?? "your endpoint"}.`}
                  </p>
                </div>
              </div>
              <button onClick={() => setModal(null)} type="button">
                <X />
              </button>
            </header>
            {modal === "add" ? (
              <>
                <div className="developer-modal-body">
                  <label className="developer-field">
                    Endpoint URL
                    <input
                      onChange={(event) => setNewUrl(event.target.value)}
                      placeholder="https://example.com/api/acru/webhooks"
                      value={newUrl}
                    />
                  </label>
                  <label className="developer-field">
                    Description
                    <input
                      onChange={(event) => setNewDescription(event.target.value)}
                      placeholder="e.g. Production payments service"
                      value={newDescription}
                    />
                  </label>
                  <div className="webhook-event-picker">
                    <header>
                      <div>
                        <b>Events to send</b>
                        <small>{selectedEvents.length} selected</small>
                      </div>
                      <button
                        onClick={() =>
                          setSelectedEvents(
                            selectedEvents.length === availableEvents.length ? [] : [...availableEvents]
                          )
                        }
                        type="button"
                      >
                        {selectedEvents.length === availableEvents.length ? "Clear all" : "Select all"}
                      </button>
                    </header>
                    <div>
                      {availableEvents.map((event) => (
                        <label key={event}>
                          <input
                            checked={selectedEvents.includes(event)}
                            onChange={(inputEvent) =>
                              setSelectedEvents((current) =>
                                inputEvent.target.checked
                                  ? [...current, event]
                                  : current.filter((item) => item !== event)
                              )
                            }
                            type="checkbox"
                          />
                          <code>{event}</code>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="developer-modal-note">
                    <Lock />
                    <span>
                      <b>Secure delivery</b> Acru signs every request with an endpoint-specific secret.
                    </span>
                  </div>
                </div>
                <footer>
                  <button onClick={() => setModal(null)} type="button">
                    Cancel
                  </button>
                  <button
                    className="primary"
                    disabled={!newUrl.trim() || !selectedEvents.length}
                    onClick={createEndpoint}
                    type="button"
                  >
                    Add destination
                  </button>
                </footer>
              </>
            ) : (
              <>
                <div className="developer-modal-body">
                  {!selectedEndpoint ? (
                    <div className="developer-warning">
                      <AlertTriangle />
                      <span>
                        <b>No destination selected.</b> Add or select a destination first.
                      </span>
                    </div>
                  ) : (
                    <>
                      <label className="developer-field">
                        Event type
                        <select onChange={(event) => setTestEvent(event.target.value)} value={testEvent}>
                          {availableEvents.map((event) => (
                            <option key={event}>{event}</option>
                          ))}
                        </select>
                        <ChevronDown />
                      </label>
                      <div className="webhook-test-destination">
                        <span>Destination</span>
                        <b>{selectedEndpoint.url}</b>
                      </div>
                      <div className="developer-modal-note">
                        <Webhook />
                        <span>
                          <b>Sandbox fixture</b> This creates a realistic signed event without moving funds.
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <footer>
                  <button onClick={() => setModal(null)} type="button">
                    Cancel
                  </button>
                  <button className="primary" disabled={!selectedEndpoint} onClick={sendTestEvent} type="button">
                    Send test event
                  </button>
                </footer>
              </>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
