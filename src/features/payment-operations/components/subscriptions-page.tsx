"use client";

import { ExportIcon, OrderRepeatIcon, PauseCircleIcon, PlayCircleIcon, PlusIcon, XIcon } from "@shopify/polaris-icons";
import { useMemo, useState } from "react";

import type { ListAdapter } from "@/components/data/adapter";
import { createMoney, formatMoney, minorUnitsFromDecimal } from "@/components/data/money";
import { useListCollection } from "@/components/data/use-list-collection";
import { Button } from "@/components/ui/button";
import { CollectionPageState } from "@/components/ui/collection-state";
import { ConfirmationDialog, Dialog } from "@/components/ui/dialog";
import { Drawer } from "@/components/ui/drawer";
import { Field, Input, SearchInput, Select } from "@/components/ui/field";
import { StatusBadge } from "@/components/ui/status-badge";
import { TablePagination } from "@/components/ui/table-pagination";
import { useToast } from "@/components/ui/toast";
import {
  calculateSubscriptionMetrics,
  filterSubscriptions,
  subscriptionAdapter,
  type BillingInterval,
  type Subscription,
  type SubscriptionStatus
} from "@/features/payment-operations/data/subscriptions";

const statuses: Array<"All" | SubscriptionStatus> = ["All", "Active", "Trialing", "Past due", "Paused", "Canceled"];

function statusTone(status: SubscriptionStatus) {
  if (status === "Active") return "success" as const;
  if (status === "Trialing") return "info" as const;
  if (status === "Past due") return "danger" as const;
  if (status === "Paused") return "warning" as const;
  return "neutral" as const;
}

function csvCell(value: unknown) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export function SubscriptionsPage({ adapter = subscriptionAdapter }: { adapter?: ListAdapter<Subscription> }) {
  const notify = useToast();
  const {
    error,
    items: subscriptions,
    retry,
    setItems: setSubscriptions,
    status: resourceStatus
  } = useListCollection(adapter);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Subscription | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<Subscription | null>(null);
  const [formError, setFormError] = useState("");

  const filtered = useMemo(() => {
    return filterSubscriptions(subscriptions, query, status);
  }, [query, status, subscriptions]);
  const pageSize = 5;
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / pageSize)));
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const active = subscriptions.filter((subscription) => subscription.status === "Active");
  const { atRiskMinor, mrrMinor } = calculateSubscriptionMetrics(subscriptions);

  function updateStatus(subscription: Subscription, nextStatus: SubscriptionStatus) {
    setSubscriptions((items) =>
      items.map((item) => (item.id === subscription.id ? { ...item, status: nextStatus } : item))
    );
    setSelected((current) => (current?.id === subscription.id ? { ...current, status: nextStatus } : current));
    notify({
      title: `Subscription ${nextStatus.toLowerCase()}`,
      tone: nextStatus === "Canceled" ? "info" : "success"
    });
  }

  function exportCsv() {
    const rows = [
      [
        "Subscription ID",
        "Customer",
        "Email",
        "Plan",
        "Amount minor",
        "Currency",
        "Interval",
        "Status",
        "Next billing"
      ],
      ...filtered.map((subscription) => [
        subscription.id,
        subscription.customer,
        subscription.email,
        subscription.plan,
        subscription.amountMinor,
        subscription.currency,
        subscription.interval,
        subscription.status,
        subscription.nextBilling
      ])
    ];
    const contents = rows.map((row) => row.map(csvCell).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([contents], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "acru-subscriptions.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function createSubscription(form: HTMLFormElement) {
    const data = new FormData(form);
    try {
      const customer = String(data.get("customer") ?? "").trim();
      const email = String(data.get("email") ?? "").trim();
      const plan = String(data.get("plan") ?? "").trim();
      const amountMinor = minorUnitsFromDecimal(String(data.get("amount") ?? ""));
      const interval = String(data.get("interval")) as BillingInterval;
      if (!customer || !email || !plan || amountMinor <= 0)
        throw new Error("Complete every field with a positive amount.");
      const subscription: Subscription = {
        amountMinor,
        created: "Aug 28, 2026",
        currency: "USD",
        customer,
        email,
        id: `sub_${Date.now().toString(36)}`,
        interval,
        nextBilling: interval === "Annual" ? "Aug 28, 2027" : "Sep 28, 2026",
        paymentMethod: "Payment method pending",
        plan,
        status: "Active"
      };
      setSubscriptions((items) => [subscription, ...items]);
      setCreateOpen(false);
      setSelected(subscription);
      setFormError("");
      notify({ title: "Subscription created", description: `${plan} for ${customer}`, tone: "success" });
    } catch (reason) {
      setFormError(reason instanceof Error ? reason.message : "Check the subscription details.");
    }
  }

  if (resourceStatus !== "ready") {
    return (
      <CollectionPageState
        description="Manage recurring billing and customer subscription activity."
        error={error}
        onRetry={retry}
        status={resourceStatus}
        title="Subscriptions"
      />
    );
  }

  return (
    <div className="ops-workspace subscriptions-workspace">
      <section className="ops-list-pane">
        <header className="ops-page-heading">
          <div>
            <h1>Subscriptions</h1>
            <p>Manage recurring billing and customer subscription activity.</p>
          </div>
          <div className="ops-page-actions">
            <button className="ops-secondary-button" onClick={exportCsv} type="button">
              <ExportIcon /> Export
            </button>
            <button className="ops-create-button" onClick={() => setCreateOpen(true)} type="button">
              Create subscription <PlusIcon />
            </button>
          </div>
        </header>

        <section aria-label="Subscription summary" className="ops-metrics">
          <div>
            <span>Active subscriptions</span>
            <strong>{active.length}</strong>
            <small>{subscriptions.filter((item) => item.status === "Trialing").length} trialing</small>
          </div>
          <div>
            <span>Monthly recurring revenue</span>
            <strong>{formatMoney(createMoney(mrrMinor))}</strong>
            <small>Normalized monthly value</small>
          </div>
          <div>
            <span>Past due</span>
            <strong>{formatMoney(createMoney(atRiskMinor))}</strong>
            <small>Requires payment recovery</small>
          </div>
          <div>
            <span>Churn</span>
            <strong>1.8%</strong>
            <small>Last 30 days</small>
          </div>
        </section>

        <div className="ops-toolbar subscriptions-toolbar">
          <div aria-label="Subscription status" className="ops-status-tabs" role="tablist">
            {statuses.map((option) => (
              <button
                aria-selected={status === option}
                className={status === option ? "active" : undefined}
                key={option}
                onClick={() => {
                  setStatus(option);
                  setPage(1);
                }}
                role="tab"
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
          <SearchInput
            label="Search subscriptions"
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            onClear={() => setQuery("")}
            placeholder="Search subscriptions"
            value={query}
          />
        </div>

        {visible.length ? (
          <div className="ops-table-wrap">
            <table className="ops-table subscriptions-table">
              <caption className="ui-sr-only">Subscriptions</caption>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Next billing</th>
                  <th>Payment method</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((subscription) => (
                  <tr
                    key={subscription.id}
                    onClick={() => setSelected(subscription)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") setSelected(subscription);
                    }}
                    tabIndex={0}
                  >
                    <td>
                      <strong>{subscription.customer}</strong>
                      <small>{subscription.email}</small>
                    </td>
                    <td>
                      <strong>{subscription.plan}</strong>
                      <small>{subscription.interval}</small>
                    </td>
                    <td>
                      <strong>{formatMoney(createMoney(subscription.amountMinor, subscription.currency))}</strong>
                      <small>per {subscription.interval === "Annual" ? "year" : "month"}</small>
                    </td>
                    <td>
                      <StatusBadge tone={statusTone(subscription.status)}>{subscription.status}</StatusBadge>
                    </td>
                    <td>
                      <strong>{subscription.nextBilling}</strong>
                      <small>{subscription.created}</small>
                    </td>
                    <td>
                      <strong>{subscription.paymentMethod}</strong>
                    </td>
                    <td>
                      <code>{subscription.id}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="subscriptions-empty-state">
            <span aria-hidden="true">
              <OrderRepeatIcon />
            </span>
            <h2>No subscriptions found</h2>
            <p>
              {query || status !== "All"
                ? "Clear your search or status filter to see more subscriptions."
                : "Create a subscription to start recurring billing."}
            </p>
            <Button
              onClick={() => {
                setQuery("");
                setStatus("All");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
        <TablePagination
          className="ops-pagination"
          onPageChange={setPage}
          page={currentPage}
          pageSize={pageSize}
          totalItems={filtered.length}
        />
      </section>

      <Drawer
        description={selected ? `${selected.customer} · ${selected.id}` : undefined}
        footer={
          selected ? (
            <>
              {selected.status === "Active" ? (
                <Button onClick={() => updateStatus(selected, "Paused")}>
                  <PauseCircleIcon /> Pause
                </Button>
              ) : null}
              {selected.status === "Paused" ? (
                <Button onClick={() => updateStatus(selected, "Active")}>
                  <PlayCircleIcon /> Resume
                </Button>
              ) : null}
              {selected.status !== "Canceled" ? (
                <Button onClick={() => setCancelTarget(selected)} variant="danger">
                  <XIcon /> Cancel subscription
                </Button>
              ) : null}
            </>
          ) : null
        }
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        open={Boolean(selected)}
        title={selected?.plan ?? "Subscription"}
      >
        {selected ? (
          <div className="subscription-detail-grid">
            <section>
              <span>Status</span>
              <StatusBadge tone={statusTone(selected.status)}>{selected.status}</StatusBadge>
            </section>
            <section>
              <span>Recurring amount</span>
              <strong>
                {formatMoney(createMoney(selected.amountMinor))} / {selected.interval === "Annual" ? "year" : "month"}
              </strong>
            </section>
            <section>
              <span>Customer</span>
              <strong>{selected.customer}</strong>
              <small>{selected.email}</small>
            </section>
            <section>
              <span>Next billing</span>
              <strong>{selected.nextBilling}</strong>
            </section>
            <section>
              <span>Payment method</span>
              <strong>{selected.paymentMethod}</strong>
            </section>
            <section>
              <span>Created</span>
              <strong>{selected.created}</strong>
            </section>
          </div>
        ) : null}
      </Drawer>

      <Dialog
        description="Start recurring billing for a customer and plan."
        footer={
          <>
            <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button form="create-subscription-form" type="submit" variant="primary">
              Create subscription
            </Button>
          </>
        }
        onOpenChange={setCreateOpen}
        open={createOpen}
        title="Create subscription"
      >
        <form
          className="subscription-create-form"
          id="create-subscription-form"
          onSubmit={(event) => {
            event.preventDefault();
            createSubscription(event.currentTarget);
          }}
        >
          <Field label="Customer name">
            <Input autoFocus data-autofocus name="customer" placeholder="Customer or company" required />
          </Field>
          <Field label="Email">
            <Input name="email" placeholder="billing@company.com" required type="email" />
          </Field>
          <Field label="Plan">
            <Input name="plan" placeholder="Pro plan" required />
          </Field>
          <div>
            <Field label="Amount">
              <Input inputMode="decimal" name="amount" placeholder="0.00" required />
            </Field>
            <Field label="Billing interval">
              <Select defaultValue="Monthly" name="interval">
                <option>Monthly</option>
                <option>Annual</option>
              </Select>
            </Field>
          </div>
          {formError ? (
            <p className="subscription-form-error" role="alert">
              {formError}
            </p>
          ) : null}
        </form>
      </Dialog>

      <ConfirmationDialog
        confirmLabel="Cancel subscription"
        description="The customer will not be charged again. This action takes effect immediately."
        onConfirm={() => {
          if (cancelTarget) updateStatus(cancelTarget, "Canceled");
          setCancelTarget(null);
        }}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null);
        }}
        open={Boolean(cancelTarget)}
        title="Cancel this subscription?"
        tone="danger"
      />
    </div>
  );
}
