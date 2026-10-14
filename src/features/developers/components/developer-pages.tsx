"use client";

import Link from "next/link";
import {
  AlertTriangleIcon as AlertTriangle,
  ArrowRightIcon as ArrowRight,
  BookOpenIcon as BookOpen,
  ChartLineIcon as Activity,
  CheckIcon as Check,
  ChevronDownIcon as ChevronDown,
  ClipboardIcon as Copy,
  CodeIcon as Code2,
  CodeIcon as Terminal,
  ConnectIcon as Webhook,
  DeleteIcon as Trash2,
  HideIcon as EyeOff,
  KeyIcon as KeyRound,
  LockIcon as LockKeyhole,
  PlusIcon as Plus,
  RefreshIcon as RotateCcw,
  ShieldCheckMarkIcon as ShieldCheck,
  ViewIcon as Eye,
  XIcon as X
} from "@shopify/polaris-icons";
import { useEffect, useMemo, useState } from "react";

type Environment = "test" | "live";
type Permission = "None" | "Read" | "Write";
type Modal = "create" | "rotate" | "revoke" | "reveal" | null;

type RestrictedKey = {
  id: string;
  name: string;
  token: string;
  lastUsed: string;
  created: string;
  permissions: number;
};

const resources = [
  ["Payments", "Create, capture, retrieve, and refund payments."],
  ["Checkout sessions", "Build hosted and embedded checkout flows."],
  ["Customers", "Manage customer profiles and payment methods."],
  ["Subscriptions & invoices", "Manage recurring billing and invoices."],
  ["Payouts & settlements", "Read or initiate fiat and USDC settlements."],
  ["Balance", "Read available, pending, and reserved balances."],
  ["Platform credits", "Issue and retrieve USDC-denominated credits."],
  ["Disputes", "Read disputes and submit evidence."],
  ["Files", "Upload verification and dispute documents."],
  ["Events & webhooks", "Read events and manage webhook endpoints."],
  ["Statements & exports", "Generate and retrieve reconciliation files."]
] as const;

const integrationCode = {
  Node: `import Acru from "@acru/node";\n\nconst acru = new Acru(process.env.ACRU_SECRET_KEY);\n\nconst payment = await acru.payments.create({\n  amount: 12500,\n  currency: "usd",\n  idempotencyKey: "order_1048"\n});`,
  Python: `from acru import Acru\nimport os\n\nacru = Acru(os.environ["ACRU_SECRET_KEY"])\n\npayment = acru.payments.create(\n    amount=12500,\n    currency="usd",\n    idempotency_key="order_1048"\n)`,
  cURL: `curl https://api.acru.com/v1/payments \\\n  -u "$ACRU_SECRET_KEY:" \\\n  -H "Idempotency-Key: order_1048" \\\n  -H "Acru-Version: 2026-08-21" \\\n  -d amount=12500 \\\n  -d currency=usd`
};

const standardKeys = {
  test: {
    publishable: "pk_test_acru_7Qc4fN2pJ1eK8xMh",
    secret: "sk_test_acru_51Rw9jX3mPL8cD6nK4vT"
  },
  live: {
    publishable: "pk_live_acru_8Hp2qL6vM4tN1zKr",
    secret: "sk_live_acru_63Vx7dB4nQm9wP2sK5cJ"
  }
};

const verificationChecks = [
  {
    title: "Credential format",
    description: "The secret key matches the selected environment.",
    icon: KeyRound
  },
  {
    title: "Authentication",
    description: "Acru accepted the key and identified your account.",
    icon: LockKeyhole
  },
  {
    title: "API availability",
    description: "The API responded within the expected latency range.",
    icon: Activity
  },
  {
    title: "Account access",
    description: "The key can read account and balance metadata.",
    icon: ShieldCheck
  }
] as const;

type VerificationState = "idle" | "running" | "success" | "error";

function mask(value: string) {
  return `${value.slice(0, 11)}${"•".repeat(16)}${value.slice(-4)}`;
}

function SecretValue({ value, visible }: { value: string; visible: boolean }) {
  return <code>{visible ? value : mask(value)}</code>;
}

function StatusDot({ live }: { live?: boolean }) {
  return <span className="developer-status-dot" data-live={live ? "true" : undefined} />;
}

export function ApiKeysPage() {
  const [environment, setEnvironment] = useState<Environment>("test");
  const [secretVisible, setSecretVisible] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [selectedRestrictedKeyId, setSelectedRestrictedKeyId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [sdk, setSdk] = useState<keyof typeof integrationCode>("Node");
  const [keyName, setKeyName] = useState("Backend payments service");
  const [permissionValues, setPermissionValues] = useState<Record<string, Permission>>(() =>
    Object.fromEntries(
      resources.map(([name]) => [
        name,
        name === "Payments" || name === "Customers" ? "Write" : name === "Balance" ? "Read" : "None"
      ])
    )
  );
  const [restrictedKeys, setRestrictedKeys] = useState<Record<Environment, RestrictedKey[]>>({
    test: [
      {
        id: "rk_test_1",
        name: "Checkout service",
        token: "rk_test_acru_82fd••••••••7bc1",
        lastUsed: "18 minutes ago",
        created: "Aug 12, 2026",
        permissions: 4
      }
    ],
    live: []
  });

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const activeKeys = standardKeys[environment];
  const activeRestrictedKeys = restrictedKeys[environment];
  const enabledPermissions = useMemo(
    () => Object.values(permissionValues).filter((value) => value !== "None").length,
    [permissionValues]
  );

  async function copy(value: string, label = "Copied to clipboard") {
    try {
      await navigator.clipboard.writeText(value);
      setToast(label);
    } catch {
      setToast("Copy is unavailable in this browser");
    }
  }

  function changeEnvironment(next: Environment) {
    setEnvironment(next);
    setSecretVisible(false);
    setToast(next === "live" ? "Live mode enabled" : "Test mode enabled");
  }

  function createRestrictedKey() {
    const prefix = environment === "test" ? "rk_test" : "rk_live";
    const item: RestrictedKey = {
      id: `${prefix}_${Date.now()}`,
      name: keyName.trim() || "Restricted key",
      token: `${prefix}_acru_${Math.random().toString(36).slice(2, 10)}••••••••${Math.random().toString(36).slice(2, 6)}`,
      lastUsed: "Never",
      created: "Just now",
      permissions: enabledPermissions
    };
    setRestrictedKeys((current) => ({ ...current, [environment]: [item, ...current[environment]] }));
    setModal(null);
    setToast("Restricted key created");
  }

  function revokeRestrictedKey(id: string) {
    setRestrictedKeys((current) => ({
      ...current,
      [environment]: current[environment].filter((item) => item.id !== id)
    }));
    setToast("Restricted key revoked");
  }

  return (
    <section className="developer-workspace">
      <header className="developer-header">
        <div>
          <span className="developer-eyebrow">
            <Code2 /> Developers
          </span>
          <h1>API keys</h1>
          <p>Authenticate requests and configure a secure Acru integration.</p>
        </div>
        <div className="developer-header-actions">
          <div className="developer-mode-switch" aria-label="API environment">
            {(["test", "live"] as Environment[]).map((mode) => (
              <button
                className={environment === mode ? "active" : ""}
                key={mode}
                onClick={() => changeEnvironment(mode)}
                type="button"
              >
                <StatusDot live={mode === "live"} /> {mode === "test" ? "Test mode" : "Live mode"}
              </button>
            ))}
          </div>
          <Link className="developer-docs-link" href="/developers/verify-connection">
            <ShieldCheck /> Verify connection
          </Link>
          <Link className="developer-docs-link" href="/developers/documentation">
            <BookOpen /> API docs <ArrowRight />
          </Link>
        </div>
      </header>

      <main className="developer-content">
        <div className="developer-primary-column">
          <div className="developer-mode-banner" data-live={environment === "live" ? "true" : undefined}>
            <div>
              <StatusDot live={environment === "live"} />
              <span>
                <b>{environment === "test" ? "Test environment" : "Live environment"}</b>
                <small>
                  {environment === "test"
                    ? "Use test keys with simulated payment data. Nothing here moves real money."
                    : "Requests can create real payments and move funds. Handle these keys with care."}
                </small>
              </span>
            </div>
            <span>{environment === "test" ? "Safe for development" : "Production access"}</span>
          </div>

          <section className="developer-panel api-standard-keys">
            <header className="developer-panel-header">
              <div>
                <h2>Standard keys</h2>
                <p>Use the publishable key in your client and the secret key only on your server.</p>
              </div>
              <button className="developer-secondary-button" onClick={() => setModal("rotate")} type="button">
                <RotateCcw /> Rotate secret key
              </button>
            </header>
            <div className="api-key-table-wrap">
              <table className="api-key-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Token</th>
                    <th>Last used</th>
                    <th>Created</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className="api-key-name">
                        <span>
                          <KeyRound />
                        </span>
                        <span>
                          <b>Publishable key</b>
                          <small>Browser and mobile apps</small>
                        </span>
                      </span>
                    </td>
                    <td>
                      <SecretValue value={activeKeys.publishable} visible />
                    </td>
                    <td>4 minutes ago</td>
                    <td>Aug 1, 2026</td>
                    <td>
                      <button
                        className="developer-icon-button"
                        onClick={() => copy(activeKeys.publishable, "Publishable key copied")}
                        title="Copy publishable key"
                        type="button"
                      >
                        <Copy />
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="api-key-name">
                        <span>
                          <LockKeyhole />
                        </span>
                        <span>
                          <b>Secret key</b>
                          <small>Server-side requests only</small>
                        </span>
                      </span>
                    </td>
                    <td>
                      <SecretValue value={activeKeys.secret} visible={secretVisible} />
                    </td>
                    <td>12 minutes ago</td>
                    <td>Aug 1, 2026</td>
                    <td>
                      <div className="api-key-actions">
                        <button
                          className="developer-icon-button"
                          onClick={() => (secretVisible ? setSecretVisible(false) : setModal("reveal"))}
                          title={secretVisible ? "Hide secret key" : "Reveal secret key"}
                          type="button"
                        >
                          {secretVisible ? <EyeOff /> : <Eye />}
                        </button>
                        <button
                          className="developer-icon-button"
                          onClick={() =>
                            secretVisible ? copy(activeKeys.secret, "Secret key copied") : setModal("reveal")
                          }
                          title={secretVisible ? "Copy secret key" : "Reveal before copying"}
                          type="button"
                        >
                          <Copy />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="developer-panel">
            <header className="developer-panel-header">
              <div>
                <h2>Restricted keys</h2>
                <p>Grant each service only the resources and actions it needs.</p>
              </div>
              <button className="developer-primary-button" onClick={() => setModal("create")} type="button">
                <Plus /> Create restricted key
              </button>
            </header>
            {activeRestrictedKeys.length ? (
              <div className="api-key-table-wrap">
                <table className="api-key-table restricted-key-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Token</th>
                      <th>Permissions</th>
                      <th>Last used</th>
                      <th>Created</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {activeRestrictedKeys.map((key) => (
                      <tr key={key.id}>
                        <td>
                          <span className="api-key-name">
                            <span>
                              <ShieldCheck />
                            </span>
                            <span>
                              <b>{key.name}</b>
                              <small>Restricted access</small>
                            </span>
                          </span>
                        </td>
                        <td>
                          <code>{key.token}</code>
                        </td>
                        <td>
                          <span className="permission-count">{key.permissions} resources</span>
                        </td>
                        <td>{key.lastUsed}</td>
                        <td>{key.created}</td>
                        <td>
                          <div className="api-key-actions">
                            <button
                              className="developer-icon-button"
                              onClick={() => copy(key.token, "Restricted key copied")}
                              title="Copy restricted key"
                              type="button"
                            >
                              <Copy />
                            </button>
                            <button
                              className="developer-icon-button danger"
                              onClick={() => {
                                setSelectedRestrictedKeyId(key.id);
                                setModal("revoke");
                              }}
                              title="Revoke restricted key"
                              type="button"
                            >
                              <Trash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="developer-empty-state">
                <span>
                  <KeyRound />
                </span>
                <div>
                  <h3>No {environment} restricted keys</h3>
                  <p>Create one for a worker, plugin, or backend service without exposing your full secret key.</p>
                </div>
                <button onClick={() => setModal("create")} type="button">
                  Create key <ArrowRight />
                </button>
              </div>
            )}
          </section>

          <section className="developer-panel developer-quickstart">
            <header className="developer-panel-header">
              <div>
                <h2>Make your first request</h2>
                <p>Your selected {environment} key works with every official Acru SDK and the REST API.</p>
              </div>
              <span className="api-version-pill">API version&nbsp; 2026-08-21</span>
            </header>
            <div className="developer-code-shell">
              <div className="developer-code-tabs">
                {(Object.keys(integrationCode) as Array<keyof typeof integrationCode>).map((item) => (
                  <button
                    className={sdk === item ? "active" : ""}
                    key={item}
                    onClick={() => setSdk(item)}
                    type="button"
                  >
                    {item}
                  </button>
                ))}
                <button
                  className="developer-code-copy"
                  onClick={() => copy(integrationCode[sdk], "Code copied")}
                  title="Copy code"
                  type="button"
                >
                  <Copy /> Copy
                </button>
              </div>
              <pre>
                <code>{integrationCode[sdk]}</code>
              </pre>
            </div>
            <div className="developer-request-details">
              <div>
                <span>Base URL</span>
                <code>https://api.acru.com/v1</code>
                <button onClick={() => copy("https://api.acru.com/v1", "Base URL copied")} type="button">
                  <Copy />
                </button>
              </div>
              <div>
                <span>Authorization</span>
                <code>Bearer {environment === "test" ? "sk_test_…" : "sk_live_…"}</code>
                <button
                  onClick={() =>
                    secretVisible
                      ? copy(`Bearer ${activeKeys.secret}`, "Authorization header copied")
                      : setModal("reveal")
                  }
                  title={secretVisible ? "Copy authorization header" : "Reveal secret key before copying"}
                  type="button"
                >
                  <Copy />
                </button>
              </div>
              <div>
                <span>Idempotency</span>
                <code>Idempotency-Key: &lt;unique-value&gt;</code>
                <button onClick={() => copy("Idempotency-Key: order_1048", "Idempotency header copied")} type="button">
                  <Copy />
                </button>
              </div>
            </div>
          </section>
        </div>

        <aside className="developer-side-column">
          <section className="developer-panel developer-security-card">
            <header>
              <span>
                <ShieldCheck />
              </span>
              <div>
                <h2>Key security</h2>
                <p>Keep privileged credentials out of client code and source control.</p>
              </div>
            </header>
            <ul>
              <li>
                <Check />
                <span>
                  <b>Secret and restricted keys</b>Use only from a trusted server or secret manager.
                </span>
              </li>
              <li>
                <Check />
                <span>
                  <b>Publishable keys</b>Safe for Acru.js, mobile SDKs, and checkout.
                </span>
              </li>
              <li>
                <Check />
                <span>
                  <b>Zero-downtime rotation</b>Create a replacement before expiring the old key.
                </span>
              </li>
              <li>
                <Check />
                <span>
                  <b>Audit every request</b>Inspect request IDs, errors, and key activity in Logs.
                </span>
              </li>
            </ul>
            <Link href="/developers/logs">
              <Activity /> View API request logs <ArrowRight />
            </Link>
          </section>

          <section className="developer-panel developer-webhook-card">
            <div className="developer-card-icon">
              <Webhook />
            </div>
            <h2>Webhook signing</h2>
            <p>
              Verify the <code>Acru-Signature</code> header before acting on asynchronous payment, dispute, payout, and
              subscription events.
            </p>
            <div>
              <span>Signing secret</span>
              <code>whsec_{environment}_••••••••4e91</code>
              <button
                onClick={() => copy(`whsec_${environment}_acru_demo_4e91`, "Signing secret copied")}
                type="button"
              >
                <Copy />
              </button>
            </div>
            <Link href="/developers/webhooks">
              Configure webhooks <ArrowRight />
            </Link>
          </section>

          <section className="developer-panel developer-integration-card">
            <header>
              <div className="developer-card-icon">
                <Terminal />
              </div>
              <span>
                <b>Integration checklist</b>
                <small>3 of 5 ready</small>
              </span>
            </header>
            <ol>
              <li className="done">
                <span>
                  <Check />
                </span>
                <div>
                  <b>Choose an environment</b>
                  <small>{environment === "test" ? "Test mode selected" : "Live mode selected"}</small>
                </div>
              </li>
              <li className="done">
                <span>
                  <Check />
                </span>
                <div>
                  <b>Store your server key</b>
                  <small>Use an encrypted secret manager</small>
                </div>
              </li>
              <li className="done">
                <span>
                  <Check />
                </span>
                <div>
                  <b>Send an idempotent request</b>
                  <small>Prevent duplicate money movement</small>
                </div>
              </li>
              <li>
                <span>4</span>
                <div>
                  <b>Listen for events</b>
                  <small>Add and verify a webhook endpoint</small>
                </div>
              </li>
              <li>
                <span>5</span>
                <div>
                  <b>Go live</b>
                  <small>Swap in your live credentials</small>
                </div>
              </li>
            </ol>
          </section>
        </aside>
      </main>

      {toast ? (
        <div className="developer-toast" role="status">
          <Check /> {toast}
        </div>
      ) : null}

      {modal ? (
        <div className="developer-modal-scrim" role="presentation">
          <div
            className={`developer-modal ${modal === "create" ? "wide" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="developer-modal-title"
          >
            {modal === "create" ? (
              <>
                <header>
                  <div>
                    <span className="developer-modal-icon">
                      <KeyRound />
                    </span>
                    <div>
                      <h2 id="developer-modal-title">Create restricted key</h2>
                      <p>Choose exactly what this service can access in {environment} mode.</p>
                    </div>
                  </div>
                  <button onClick={() => setModal(null)} type="button">
                    <X />
                  </button>
                </header>
                <div className="developer-modal-body">
                  <label className="developer-field">
                    Key name
                    <input
                      onChange={(event) => setKeyName(event.target.value)}
                      placeholder="e.g. Backend payments service"
                      value={keyName}
                    />
                  </label>
                  <div className="developer-permission-head">
                    <div>
                      <b>Resource permissions</b>
                      <small>
                        {enabledPermissions} of {resources.length} resources enabled
                      </small>
                    </div>
                    <span>Permission</span>
                  </div>
                  <div className="developer-permissions">
                    {resources.map(([name, description]) => (
                      <div key={name}>
                        <span>
                          <b>{name}</b>
                          <small>{description}</small>
                        </span>
                        <label>
                          <select
                            aria-label={`${name} permission`}
                            onChange={(event) =>
                              setPermissionValues((current) => ({
                                ...current,
                                [name]: event.target.value as Permission
                              }))
                            }
                            value={permissionValues[name]}
                          >
                            <option>None</option>
                            <option>Read</option>
                            <option>Write</option>
                          </select>
                          <ChevronDown />
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="developer-modal-note">
                    <ShieldCheck />
                    <span>
                      <b>Least privilege is safer.</b> You can replace this key with different permissions at any time.
                    </span>
                  </div>
                </div>
                <footer>
                  <button onClick={() => setModal(null)} type="button">
                    Cancel
                  </button>
                  <button
                    className="primary"
                    disabled={!enabledPermissions}
                    onClick={createRestrictedKey}
                    type="button"
                  >
                    Create key
                  </button>
                </footer>
              </>
            ) : modal === "reveal" ? (
              <>
                <header>
                  <div>
                    <span className="developer-modal-icon">
                      <Eye />
                    </span>
                    <div>
                      <h2 id="developer-modal-title">Reveal secret key?</h2>
                      <p>Anyone with this key can make authenticated {environment} API requests.</p>
                    </div>
                  </div>
                  <button onClick={() => setModal(null)} type="button">
                    <X />
                  </button>
                </header>
                <div className="developer-modal-body">
                  <div className="developer-warning">
                    <AlertTriangle />
                    <span>
                      <b>Keep this key confidential.</b> Never paste it into client-side code, support chats, or public
                      repositories.
                    </span>
                  </div>
                </div>
                <footer>
                  <button onClick={() => setModal(null)} type="button">
                    Cancel
                  </button>
                  <button
                    className="primary"
                    onClick={() => {
                      setSecretVisible(true);
                      setModal(null);
                    }}
                    type="button"
                  >
                    Reveal key
                  </button>
                </footer>
              </>
            ) : modal === "rotate" ? (
              <>
                <header>
                  <div>
                    <span className="developer-modal-icon">
                      <RotateCcw />
                    </span>
                    <div>
                      <h2 id="developer-modal-title">Rotate secret key</h2>
                      <p>Create a replacement before the current key expires.</p>
                    </div>
                  </div>
                  <button onClick={() => setModal(null)} type="button">
                    <X />
                  </button>
                </header>
                <div className="developer-modal-body">
                  <div className="developer-warning neutral">
                    <ShieldCheck />
                    <span>
                      <b>No interruption required.</b> Both keys can remain valid during a 24-hour migration window.
                    </span>
                  </div>
                  <label className="developer-field">
                    Expire current key
                    <select defaultValue="24 hours">
                      <option>Immediately</option>
                      <option>1 hour</option>
                      <option>24 hours</option>
                      <option>7 days</option>
                    </select>
                    <ChevronDown />
                  </label>
                </div>
                <footer>
                  <button onClick={() => setModal(null)} type="button">
                    Cancel
                  </button>
                  <button
                    className="primary"
                    onClick={() => {
                      setModal(null);
                      setToast("Replacement key generated");
                    }}
                    type="button"
                  >
                    Rotate key
                  </button>
                </footer>
              </>
            ) : (
              <>
                <header>
                  <div>
                    <span className="developer-modal-icon">
                      <Trash2 />
                    </span>
                    <div>
                      <h2 id="developer-modal-title">Revoke key?</h2>
                      <p>Requests using this key will fail immediately.</p>
                    </div>
                  </div>
                  <button onClick={() => setModal(null)} type="button">
                    <X />
                  </button>
                </header>
                <footer>
                  <button onClick={() => setModal(null)} type="button">
                    Cancel
                  </button>
                  <button
                    className="danger"
                    onClick={() => {
                      if (selectedRestrictedKeyId) revokeRestrictedKey(selectedRestrictedKeyId);
                      setSelectedRestrictedKeyId(null);
                      setModal(null);
                    }}
                    type="button"
                  >
                    Revoke key
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

export function VerifyConnectionPage() {
  const [environment, setEnvironment] = useState<Environment>("test");
  const [verificationState, setVerificationState] = useState<VerificationState>("idle");
  const [activeCheck, setActiveCheck] = useState(0);
  const [lastChecked, setLastChecked] = useState("");
  const [requestId, setRequestId] = useState("—");
  const [latency, setLatency] = useState("—");
  const [verificationError, setVerificationError] = useState("");
  const [toast, setToast] = useState("");
  const activeKeys = standardKeys[environment];
  const verifyCode = `curl https://sandbox-merchant.acrudevelopment.com/api/sandbox/preflight \\
  -H "Authorization: Bearer ${environment === "test" ? activeKeys.secret : "sk_live_…"}" \\
  -H "Acru-Version: 2026-08-21"`;

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function changeEnvironment(next: Environment) {
    setEnvironment(next);
    setVerificationState("idle");
    setActiveCheck(0);
    setLastChecked("");
    setRequestId("—");
    setLatency("—");
    setVerificationError("");
  }

  async function runVerification() {
    if (environment === "live") {
      setVerificationState("error");
      setVerificationError("Live verification becomes available after production credentials are activated.");
      return;
    }
    setActiveCheck(0);
    setVerificationState("running");
    setVerificationError("");
    const start = performance.now();
    try {
      const response = await fetch("/api/sandbox/preflight", {
        headers: { Authorization: `Bearer ${activeKeys.secret}`, "Acru-Version": "2026-08-21" },
        cache: "no-store"
      });
      const data = (await response.json()) as { request_id?: string; error?: { message?: string } };
      const elapsed = Math.max(1, Math.round(performance.now() - start));
      setRequestId(data.request_id ?? response.headers.get("X-Acru-Request-Id") ?? "—");
      setLatency(`${elapsed} ms`);
      setLastChecked(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
      setActiveCheck(response.ok ? verificationChecks.length : 0);
      setVerificationState(response.ok ? "success" : "error");
      if (!response.ok) setVerificationError(data.error?.message ?? "The test request was rejected.");
    } catch {
      setVerificationState("error");
      setVerificationError("The Acru sandbox could not be reached. Try again.");
    }
  }

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(verifyCode);
      setToast("Test request copied");
    } catch {
      setToast("Copy unavailable");
    }
  }

  const isSuccess = verificationState === "success";
  const title = isSuccess
    ? "Connection verified"
    : verificationState === "running"
      ? "Checking your setup"
      : verificationState === "error"
        ? "Connection needs attention"
        : "Verify your API connection";
  const stateLabel = isSuccess
    ? "Connected"
    : verificationState === "running"
      ? "Running"
      : verificationState === "error"
        ? "Not connected"
        : "Ready to test";

  return (
    <section className="developer-workspace">
      <header className="developer-header">
        <div>
          <span className="developer-eyebrow">
            <Code2 /> Developers
          </span>
          <h1>Verify connection</h1>
          <p>Send a real, read-only request to confirm your API credentials before going live.</p>
        </div>
        <div className="developer-header-actions">
          <div className="developer-mode-switch" aria-label="API environment">
            {(["test", "live"] as Environment[]).map((mode) => (
              <button
                className={environment === mode ? "active" : ""}
                key={mode}
                onClick={() => changeEnvironment(mode)}
                type="button"
              >
                <StatusDot live={mode === "live"} /> {mode === "test" ? "Test mode" : "Live mode"}
              </button>
            ))}
          </div>
          <Link className="developer-docs-link" href="/developers/api-keys">
            <KeyRound /> API keys
          </Link>
          <Link className="developer-docs-link" href="/developers/documentation">
            <BookOpen /> API docs <ArrowRight />
          </Link>
        </div>
      </header>

      <main className="developer-verify-content">
        <section className="developer-panel developer-verify-main">
          <div className="developer-verify-intro">
            <span className="developer-verify-icon">
              <ShieldCheck />
            </span>
            <div>
              <h2>{title}</h2>
              <p>
                Run a read-only account request against the Acru sandbox and confirm every integration prerequisite.
              </p>
            </div>
            <span className="developer-verify-state" data-state={verificationState} aria-live="polite">
              {stateLabel}
            </span>
          </div>

          <div className="developer-request-card">
            <header>
              <span>Read-only request</span>
              <span>GET</span>
            </header>
            <div>
              <code>/v1/account</code>
              <small>Authorization: Bearer {mask(activeKeys.secret)}</small>
              <small className="developer-request-note">Test mode only. This request cannot move funds.</small>
            </div>
          </div>

          <div className="developer-verification-timeline">
            {verificationChecks.map((check, index) => {
              const StepIcon = check.icon;
              const isComplete = isSuccess || (verificationState === "running" && index < activeCheck);
              const isCurrent = verificationState === "running" && index === activeCheck;
              const status = isComplete ? "Ready" : isCurrent ? "Checking…" : "Waiting";

              return (
                <article
                  className="developer-verification-step"
                  data-complete={isComplete ? "true" : undefined}
                  data-current={isCurrent ? "true" : undefined}
                  key={check.title}
                >
                  <span className="developer-verification-marker">{isComplete ? <Check /> : index + 1}</span>
                  <div className="developer-verification-copy">
                    <div>
                      <StepIcon />
                      <h3>{check.title}</h3>
                    </div>
                    <p>{check.description}</p>
                  </div>
                  <span className="developer-verification-status">{status}</span>
                </article>
              );
            })}
          </div>

          {isSuccess || verificationState === "error" ? (
            <div className="developer-verification-result" data-state={verificationState}>
              <header>
                {isSuccess ? <Check /> : <AlertTriangle />}{" "}
                {isSuccess ? "Sandbox connection ready" : "Verification failed"}
              </header>
              <div className="developer-result-grid">
                <div>
                  <span>Response</span>
                  <b>{isSuccess ? "200 OK" : "Connection error"}</b>
                </div>
                <div>
                  <span>Request ID</span>
                  <b>{requestId}</b>
                </div>
                <div>
                  <span>Latency</span>
                  <b>{latency}</b>
                </div>
                <div>
                  <span>Checked</span>
                  <b>{lastChecked}</b>
                </div>
              </div>
              <small>
                {isSuccess ? "Your test key authenticated successfully. No funds were moved." : verificationError}
              </small>
            </div>
          ) : null}

          <div className="developer-verify-actions">
            <button
              className="developer-primary-button"
              disabled={verificationState === "running"}
              onClick={runVerification}
              type="button"
            >
              <RotateCcw />
              {verificationState === "running" ? "Checking…" : isSuccess ? "Test again" : "Test connection"}
            </button>
            <Link className="developer-secondary-button" href="/developers/api-keys">
              Review API keys
            </Link>
          </div>
        </section>

        <aside className="developer-verify-aside">
          <section className="developer-panel developer-verify-info">
            <h2>What this checks</h2>
            <p>A read-only request confirms the basics before you build payment flows.</p>
            <div className="developer-verify-info-list">
              <div>
                <KeyRound /> Environment and key format
              </div>
              <div>
                <LockKeyhole /> Authentication headers
              </div>
              <div>
                <Activity /> API availability
              </div>
              <div>
                <ShieldCheck /> Account read access
              </div>
            </div>
          </section>

          <section className="developer-panel developer-verify-code">
            <header>
              <div>
                <Terminal />
                <h2>Run it locally</h2>
              </div>
              <button aria-label="Copy cURL request" onClick={copyCommand} type="button">
                <Copy />
              </button>
            </header>
            <pre>
              <code>{verifyCode}</code>
            </pre>
          </section>

          <section className="developer-panel developer-verify-help">
            <h2>If verification fails</h2>
            <p>Check the request before rotating credentials.</p>
            <ul>
              <li>Use a {environment} secret key.</li>
              <li>Send the key only from your server.</li>
              <li>Confirm the version header is present.</li>
            </ul>
          </section>
        </aside>
      </main>

      {toast ? (
        <div className="developer-toast">
          <Check /> {toast}
        </div>
      ) : null}
    </section>
  );
}
