"use client";

import {
  AdjustIcon,
  AutomationIcon,
  ChevronDownIcon,
  ClockIcon,
  DuplicateIcon,
  EmailIcon,
  IdentityCardIcon,
  LocationIcon,
  MenuHorizontalIcon,
  MobileIcon,
  PersonIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
  ShieldCheckMarkIcon,
  StatusActiveIcon,
  XIcon
} from "@shopify/polaris-icons";
import { useMemo, useState, type SVGProps } from "react";

import type { ListAdapter } from "@/components/data/adapter";
import { useListCollection } from "@/components/data/use-list-collection";
import { CollectionPageState } from "@/components/ui/collection-state";
import { TablePagination } from "@/components/ui/table-pagination";
import { useDismissOnEscape } from "@/components/ui/use-dismiss-on-escape";
import { customerAdapter, type Customer } from "@/features/customers/data/customers";

const detailTabs = ["Overview", "Payments", "Risk", "Identity", "Activity", "Notes"];

function TrustPill({ verification }: { verification: Customer["verification"] }) {
  return (
    <span className="customer-verified-pill" data-status={verification === "Verified" ? "verified" : "review"}>
      {verification === "Verified" ? <ShieldCheckMarkIcon /> : <ClockIcon />}
      {verification}
    </span>
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

function MiniMap() {
  return (
    <div className="customer-mini-map" aria-label="Latest customer location near Boynton Beach, Florida">
      <span className="map-water" />
      <span className="map-road road-one" />
      <span className="map-road road-two" />
      <span className="map-road road-three" />
      <span className="map-radius" />
      <span className="map-pin" />
    </div>
  );
}

function CustomerOverview({ customer, notify }: { customer: Customer; notify: (message: string) => void }) {
  return (
    <div className="customer-detail-overview">
      <section className="customer-metric-grid">
        <article>
          <small>Lifetime value</small>
          <strong>{customer.amount}</strong>
          <span>1 payment</span>
        </article>
        <article>
          <small>Orders</small>
          <strong>1</strong>
          <span>All time</span>
        </article>
        <article>
          <small>Refunded</small>
          <strong>$0.00</strong>
          <span>0 payments</span>
        </article>
        <article>
          <small>Last payment</small>
          <strong>{customer.amount}</strong>
          <span>1 payment</span>
        </article>
      </section>

      <section className="customer-detail-card customer-risk-card">
        <h3>Risk &amp; trust</h3>
        <div className="customer-risk-layout">
          <div className="trust-score-card">
            <small>Trust Score</small>
            <strong>
              98 <span>/100</span>
            </strong>
            <small>Low Risk</small>
            <span className="trust-score-track">
              <span />
            </span>
          </div>
          <div className="trust-signal-list">
            <span>
              <i className="blue">
                <ShieldCheckMarkIcon />
              </i>
              <span>
                <small>Authentication</small>
                <b>Adaptive</b>
              </span>
            </span>
            <span>
              <i className="blue">
                <ThreeDSIcon />
              </i>
              <span>
                <small>3DS Secure</small>
                <b>Automatic</b>
              </span>
            </span>
            <span>
              <i className="blue">
                <RefreshIcon />
              </i>
              <span>
                <small>Retry Policy</small>
                <b>5 Attempts</b>
              </span>
            </span>
          </div>
          <div className="trust-signal-list bordered">
            <span>
              <i className="green">
                <PersonIcon />
              </i>
              <span>
                <small>Access</small>
                <b>Active</b>
              </span>
            </span>
            <span>
              <i className="green">
                <IdentityCardIcon />
              </i>
              <span>
                <small>Identity</small>
                <b>Verified</b>
              </span>
            </span>
            <span>
              <i className="green">
                <ShieldCheckMarkIcon />
              </i>
              <span>
                <small>Trust Status</small>
                <b>Protected</b>
              </span>
            </span>
          </div>
        </div>
      </section>

      <div className="customer-detail-two-column">
        <section className="customer-detail-card customer-contact-card">
          <h3>Contact</h3>
          <p>
            <EmailIcon />
            <span>{customer.email}</span>
            <TrustPill verification={customer.verification} />
          </p>
          <p>
            <MobileIcon />
            <span>{customer.phone}</span>
          </p>
          <p>
            <LocationIcon />
            <span>{customer.location}</span>
          </p>
          <p>
            <ClockIcon />
            <span>Local time 10:27 AM (EDT)</span>
          </p>
        </section>
        <section className="customer-detail-card customer-payment-card">
          <h3>Payment methods</h3>
          <div className="customer-card-method">
            <span className="visa-chip">VISA</span>
            <span>
              <strong>•••• {customer.card}</strong>
              <small>Expires 06/29</small>
            </span>
            <em>Default</em>
          </div>
          <button type="button" onClick={() => notify("Payment method flow opened")}>
            <PlusIcon /> Add payment method
          </button>
        </section>
      </div>

      <div className="customer-detail-two-column bottom">
        <section className="customer-detail-card customer-activity-card">
          <h3>Recent activity</h3>
          <div className="customer-timeline">
            <span>
              <i />
              <span>
                <strong>Payment succeeded</strong>
                <small>July 24, 2026 • 9:53 AM</small>
              </span>
              <b>{customer.amount}</b>
            </span>
            <span>
              <i />
              <span>
                <strong>Customer created</strong>
                <small>July 24, 2026 • 9:53 AM</small>
              </span>
            </span>
          </div>
          <button type="button" onClick={() => notify("Showing all customer activity")}>
            View all activity
          </button>
        </section>
        <section className="customer-detail-card customer-location-card">
          <h3>Latest location</h3>
          <MiniMap />
          <strong>Boynton Beach, Florida, USA</strong>
          <small>July 24, 2026 • 9:52 AM</small>
          <em>IP 142.93.18.25</em>
        </section>
      </div>
    </div>
  );
}

function CustomerTabContent({
  customer,
  tab,
  notify
}: {
  customer: Customer;
  tab: string;
  notify: (message: string) => void;
}) {
  const [note, setNote] = useState("");
  if (tab === "Payments") {
    return (
      <section className="customer-tab-content">
        <h3>Payment history</h3>
        <dl>
          <div>
            <dt>Lifetime value</dt>
            <dd>{customer.amount}</dd>
          </div>
          <div>
            <dt>Default method</dt>
            <dd>Visa •••• {customer.card}</dd>
          </div>
          <div>
            <dt>Last payment</dt>
            <dd>Aug 10, 2026 · Succeeded</dd>
          </div>
        </dl>
      </section>
    );
  }
  if (tab === "Risk") {
    return (
      <section className="customer-tab-content">
        <h3>Risk profile</h3>
        <dl>
          <div>
            <dt>Trust status</dt>
            <dd>{customer.verification}</dd>
          </div>
          <div>
            <dt>Chargebacks</dt>
            <dd>0</dd>
          </div>
          <div>
            <dt>Device history</dt>
            <dd>Recognized</dd>
          </div>
        </dl>
      </section>
    );
  }
  if (tab === "Identity") {
    return (
      <section className="customer-tab-content">
        <h3>Identity checks</h3>
        <dl>
          <div>
            <dt>Email</dt>
            <dd>{customer.email}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{customer.phone}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{customer.location}</dd>
          </div>
        </dl>
      </section>
    );
  }
  if (tab === "Activity") {
    return (
      <section className="customer-tab-content">
        <h3>Recent activity</h3>
        <ol>
          <li>
            <strong>Customer profile reviewed</strong>
            <small>Aug 28, 2026</small>
          </li>
          <li>
            <strong>Payment method verified</strong>
            <small>Aug 10, 2026</small>
          </li>
          <li>
            <strong>Customer created</strong>
            <small>{customer.since}</small>
          </li>
        </ol>
      </section>
    );
  }
  return (
    <section className="customer-tab-content">
      <h3>Internal notes</h3>
      <label>
        Add a note visible only to your team
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Add context for this customer"
        />
      </label>
      <button
        type="button"
        disabled={!note.trim()}
        onClick={() => {
          notify("Customer note saved");
          setNote("");
        }}
      >
        Save note
      </button>
    </section>
  );
}

function CustomerDetail({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [actionsOpen, setActionsOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [closing, setClosing] = useState(false);

  function closeDrawer() {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, 260);
  }
  useDismissOnEscape(true, closeDrawer);

  return (
    <aside className="customer-detail-panel" data-closing={closing} aria-label={`${customer.name} customer details`}>
      <button className="customer-detail-close" type="button" aria-label="Close customer details" onClick={closeDrawer}>
        <XIcon />
      </button>
      <header className="customer-detail-header">
        <span className="customer-detail-avatar">{customer.initials}</span>
        <span>
          <h2>{customer.name}</h2>
          <small>
            {customer.id} &nbsp;•&nbsp; {customer.since}
          </small>
        </span>
        <div className="customer-action-wrap">
          <button type="button" aria-expanded={actionsOpen} onClick={() => setActionsOpen((open) => !open)}>
            Actions <ChevronDownIcon />
          </button>
          {actionsOpen ? (
            <div className="customer-actions-menu" role="menu">
              {["Create invoice", "Issue refund", "Disable access"].map((action) => (
                <button
                  type="button"
                  role="menuitem"
                  key={action}
                  onClick={() => {
                    setNotice(`${action} selected`);
                    setActionsOpen(false);
                  }}
                >
                  {action}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <button
          className="customer-more-button"
          type="button"
          aria-label="More customer actions"
          onClick={() => setNotice("Additional customer actions opened")}
        >
          <MenuHorizontalIcon />
        </button>
      </header>
      <nav className="customer-detail-tabs" aria-label="Customer detail sections">
        {detailTabs.map((tab) => (
          <button
            type="button"
            className={activeTab === tab ? "active" : undefined}
            key={tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
      <div className="customer-detail-scroll">
        {activeTab === "Overview" ? (
          <CustomerOverview customer={customer} notify={setNotice} />
        ) : (
          <CustomerTabContent customer={customer} notify={setNotice} tab={activeTab} />
        )}
      </div>
      {notice ? (
        <button className="customer-detail-toast" type="button" onClick={() => setNotice("")}>
          ✓ {notice}
        </button>
      ) : null}
    </aside>
  );
}

function CreateCustomerDialog({ onClose, onCreate }: { onClose: () => void; onCreate: (customer: Customer) => void }) {
  useDismissOnEscape(true, onClose);
  return (
    <div
      className="customer-create-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        className="customer-create-dialog"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const name = String(form.get("name"));
          const email = String(form.get("email"));
          onCreate({
            id: `cus_${window.crypto.randomUUID().replaceAll("-", "").slice(0, 11)}`,
            name,
            initials: name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase(),
            email,
            phone: String(form.get("phone")),
            location: "Location not added",
            createdAt: "August 10, 2026",
            since: "Since August 2026",
            amount: "$0.00",
            card: "—",
            verification: "Verified"
          });
        }}
      >
        <header>
          <span>
            <PersonIcon />
          </span>
          <div>
            <strong>Create customer</strong>
            <small>Add a customer to ACRU</small>
          </div>
          <button type="button" aria-label="Close create customer" onClick={onClose}>
            <XIcon />
          </button>
        </header>
        <div>
          <label>
            <span>Name</span>
            <input name="name" type="text" placeholder="Customer or business name" autoFocus required />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" placeholder="customer@company.com" required />
          </label>
          <label>
            <span>Phone</span>
            <input name="phone" type="tel" placeholder="+1 (555) 000-0000" required />
          </label>
        </div>
        <footer>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary" type="submit">
            Create customer
          </button>
        </footer>
      </form>
    </div>
  );
}

export function CustomersPage({ adapter = customerAdapter }: { adapter?: ListAdapter<Customer> }) {
  const {
    error,
    items: customerRows,
    retry,
    setItems: setCustomerRows,
    status: resourceStatus
  } = useListCollection(adapter);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All customers");
  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const filteredCustomers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = customerRows.filter((customer) =>
      `${customer.name} ${customer.email} ${customer.id}`.toLowerCase().includes(normalized)
    );
    if (filter === "All customers") return filtered;
    return filtered.filter((customer) => customer.verification === filter);
  }, [customerRows, filter, query]);
  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
  }

  if (resourceStatus !== "ready") {
    return (
      <CollectionPageState
        description="Search customers, review payment history, and manage account details."
        error={error}
        onRetry={retry}
        status={resourceStatus}
        title="Customers"
      />
    );
  }

  return (
    <div className="customers-workspace" data-detail-open={Boolean(selectedCustomer)}>
      <section className="customers-list-pane">
        <header className="customers-page-heading">
          <h1>Customers</h1>
          <div className="customers-page-tools">
            <label className="customers-page-search">
              <SearchIcon />
              <input
                type="search"
                placeholder="Search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            </label>
            <div className="customers-filter-wrap">
              <button
                className="customers-filter-button"
                type="button"
                aria-label="Filter customers"
                aria-expanded={filterOpen}
                onClick={() => setFilterOpen((open) => !open)}
              >
                <AdjustIcon />
              </button>
              {filterOpen ? (
                <>
                  <div
                    className="customers-filter-scrim"
                    role="presentation"
                    onMouseDown={() => setFilterOpen(false)}
                  />
                  <div className="customers-filter-menu" role="menu">
                    {["All customers", "Verified", "Needs review"].map((option) => (
                      <button
                        type="button"
                        role="menuitem"
                        className={filter === option ? "active" : undefined}
                        key={option}
                        onClick={() => {
                          setFilter(option);
                          setFilterOpen(false);
                          setPage(1);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
            <button className="customers-create-button" type="button" onClick={() => setCreateOpen(true)}>
              Create <PlusIcon />
            </button>
          </div>
        </header>
        <div className="customers-table-wrap">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Created at</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Trust status</th>
                <th>Authentication</th>
                <th>3DS Secure</th>
                <th>Attempt Limit</th>
                <th>Verification</th>
              </tr>
            </thead>
            <tbody>
              {!visibleCustomers.length ? (
                <tr className="customers-empty-row">
                  <td colSpan={8}>No customers match this search or filter.</td>
                </tr>
              ) : null}
              {visibleCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  data-selected={selectedCustomer?.id === customer.id}
                  tabIndex={0}
                  onClick={() => setSelectedCustomer(customer)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") setSelectedCustomer(customer);
                  }}
                >
                  <td>{customer.createdAt}</td>
                  <td>
                    <span>
                      {customer.id.slice(0, 4)}...{customer.id.slice(-4)}
                    </span>
                    <button
                      type="button"
                      aria-label="Copy customer ID"
                      onClick={(event) => {
                        event.stopPropagation();
                        void copy(customer.id);
                      }}
                    >
                      <DuplicateIcon />
                    </button>
                  </td>
                  <td>
                    <span>{customer.email}</span>
                    <button
                      type="button"
                      aria-label="Copy customer email"
                      onClick={(event) => {
                        event.stopPropagation();
                        void copy(customer.email);
                      }}
                    >
                      <DuplicateIcon />
                    </button>
                  </td>
                  <td>
                    <TrustPill verification={customer.verification} />
                  </td>
                  <td>
                    <span className="customer-auth-pill">
                      <AutomationIcon /> Adaptive
                    </span>
                  </td>
                  <td>
                    <span className="customer-3ds-pill">
                      <ThreeDSIcon /> Automatic
                    </span>
                  </td>
                  <td>5</td>
                  <td>
                    <span className="customer-verification-pill">
                      <StatusActiveIcon /> Enforced
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          className="customers-pagination"
          page={currentPage}
          pageSize={pageSize}
          totalItems={filteredCustomers.length}
          onPageChange={setPage}
        />
      </section>
      {selectedCustomer ? (
        <CustomerDetail customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      ) : null}
      {createOpen ? (
        <CreateCustomerDialog
          onClose={() => setCreateOpen(false)}
          onCreate={(customer) => {
            setCustomerRows((current) => [customer, ...current]);
            setCreateOpen(false);
            setQuery("");
            setPage(1);
            setSelectedCustomer(customer);
          }}
        />
      ) : null}
    </div>
  );
}
