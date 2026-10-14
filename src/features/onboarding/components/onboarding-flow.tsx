"use client";

import {
  CheckCircleIcon as CheckCircle2,
  CheckIcon as Check,
  ClipboardCheckIcon as ClipboardCheck,
  FileFilledIcon as FileCheck2,
  MagicIcon as Sparkles,
  PersonIcon as UserRoundCheck,
  PlusIcon as Plus,
  ShieldCheckMarkIcon as ShieldCheck,
  ShieldNoneIcon as Shield,
  UploadIcon as CloudUpload,
  XIcon as X
} from "@shopify/polaris-icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from "react";

import { ACRU_ONBOARDING_KEY, readOnboarding, saveOnboarding } from "@/lib/auth/client";

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["application/pdf", "image/png", "image/jpeg"];
// Keep the reference flow freely navigable until backend-backed validation is wired in.
const ONBOARDING_VALIDATION_ENABLED = false;
const PREVIEW_STEPS = [
  { label: "Business information", slug: "business" },
  { label: "Ownership & control", slug: "ownership" },
  { label: "Settlement & payouts", slug: "settlement" },
  { label: "Business documents", slug: "documents" },
  { label: "Verify identity", slug: "identity" },
  { label: "Connect payout method", slug: "connection" },
  { label: "Submitted", slug: "submitted" }
] as const;

type SettlementMethod = "bank" | "usdc" | "credits";
type DocumentKey = "formation" | "bankStatement" | "voidedCheck" | "processingStatement";

type BusinessData = {
  legalName: string;
  dba: string;
  taxId: string;
  yearsInBusiness: string;
  address: string;
  locationTenure: string;
  website: string;
};

type Owner = {
  id: number;
  name: string;
  address: string;
  residenceYears: string;
  identifier: string;
  dateOfBirth: string;
  ownership: string;
  idFile: string;
};

type IdentityData = {
  fullName: string;
  dateOfBirth: string;
  address: string;
  ssn: string;
  front: string;
  back: string;
};

type ConnectionData = {
  bankConnected: boolean;
  routingNumber: string;
  accountNumber: string;
  walletProvider: string;
  walletAddress: string;
};

const emptyBusiness: BusinessData = {
  legalName: "",
  dba: "",
  taxId: "",
  yearsInBusiness: "",
  address: "",
  locationTenure: "",
  website: ""
};

const emptyIdentity: IdentityData = {
  fullName: "",
  dateOfBirth: "",
  address: "",
  ssn: "",
  front: "",
  back: ""
};

const emptyConnection: ConnectionData = {
  bankConnected: false,
  routingNumber: "",
  accountNumber: "",
  walletProvider: "",
  walletAddress: ""
};

function createOwner(): Owner {
  return {
    id: Date.now() + Math.random(),
    name: "",
    address: "",
    residenceYears: "",
    identifier: "",
    dateOfBirth: "",
    ownership: "",
    idFile: ""
  };
}

function Field({
  label,
  error,
  wide,
  children
}: {
  label: string;
  error?: boolean;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={`onboard-field${wide ? " is-wide" : ""}${error ? " has-error" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function UploadField({
  label,
  value,
  onFile,
  large = false,
  compact = false,
  error = false
}: {
  label: string;
  value: string;
  onFile: (name: string) => void;
  large?: boolean;
  compact?: boolean;
  error?: boolean;
}) {
  const [fileError, setFileError] = useState("");

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setFileError("Use a PDF, PNG, or JPG file.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError("File must be 25 MB or smaller.");
      return;
    }
    setFileError("");
    onFile(file.name);
  };

  return (
    <label
      className={`onboard-upload${large ? " is-large" : ""}${compact ? " is-compact" : ""}${error || fileError ? " has-error" : ""}`}
    >
      <input type="file" accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" onChange={onChange} />
      {large ? (
        <>
          {value ? <FileCheck2 aria-hidden="true" /> : <CloudUpload aria-hidden="true" />}
          <strong>{value || label}</strong>
          <small>{fileError || "PNG, JPEG, or PDF · Up to 25 MB"}</small>
        </>
      ) : compact ? (
        <>
          {value ? <CheckCircle2 aria-hidden="true" /> : <CloudUpload aria-hidden="true" />}
          <span>{value || "Upload"}</span>
        </>
      ) : (
        <>
          <span className="upload-filename">
            {value || "PDF, PNG, JPG · Up to 25 MB per file"}
            {fileError && <small>{fileError}</small>}
          </span>
          <strong>{value ? "Replace" : "Upload"}</strong>
        </>
      )}
    </label>
  );
}

function ErrorSummary({ errors }: { errors: string[] }) {
  if (!errors.length) return null;
  return (
    <div className="onboard-error-summary" role="alert">
      <ShieldCheck aria-hidden="true" />
      <span>
        <strong>Complete this step to continue.</strong>
        {errors.join(" ")}
      </span>
    </div>
  );
}

function StepHeading({
  title,
  description,
  align = "center"
}: {
  title: string;
  description: string;
  align?: "center" | "left";
}) {
  return (
    <header className={`onboard-step-heading is-${align}`}>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}

function BusinessStep({
  data,
  setData,
  errors
}: {
  data: BusinessData;
  setData: (data: BusinessData) => void;
  errors: string[];
}) {
  const update = (key: keyof BusinessData, value: string) => setData({ ...data, [key]: value });
  return (
    <section>
      <StepHeading title="Business information" description="Tell us about your business" />
      <ErrorSummary errors={errors} />
      <div className="onboard-form-grid">
        <Field label="Legal business name" error={errors.length > 0 && !data.legalName}>
          <input
            value={data.legalName}
            onChange={(event) => update("legalName", event.target.value)}
            placeholder="Acme Inc"
            autoComplete="organization"
          />
        </Field>
        <Field label="DBA (If different)">
          <input value={data.dba} onChange={(event) => update("dba", event.target.value)} placeholder="Acme" />
        </Field>
        <Field label="Tax ID / EIN" error={errors.length > 0 && !/^\d{2}-?\d{7}$/.test(data.taxId)}>
          <input
            value={data.taxId}
            onChange={(event) => update("taxId", event.target.value.replace(/[^\d-]/g, "").slice(0, 10))}
            placeholder="12-3456789"
            inputMode="numeric"
            autoComplete="off"
          />
        </Field>
        <Field label="Years in business" error={errors.length > 0 && !data.yearsInBusiness}>
          <select value={data.yearsInBusiness} onChange={(event) => update("yearsInBusiness", event.target.value)}>
            <option value="">Select years</option>
            <option value="less-than-1">Less than 1 year</option>
            <option value="1-2">1–2 years</option>
            <option value="3-5">3–5 years</option>
            <option value="6-10">6–10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </Field>
        <Field label="Legal business address" error={errors.length > 0 && !data.address}>
          <input
            value={data.address}
            onChange={(event) => update("address", event.target.value)}
            placeholder="Enter your business address"
            autoComplete="street-address"
          />
        </Field>
        <Field label="Years/months at current location" error={errors.length > 0 && !data.locationTenure}>
          <select value={data.locationTenure} onChange={(event) => update("locationTenure", event.target.value)}>
            <option value="">Select tenure</option>
            <option value="less-than-1">Less than 1 year</option>
            <option value="1-2">1–2 years</option>
            <option value="3-5">3–5 years</option>
            <option value="6+">6+ years</option>
          </select>
        </Field>
        <Field label="Website domain" error={errors.length > 0 && !data.website}>
          <input
            value={data.website}
            onChange={(event) => update("website", event.target.value)}
            placeholder="acme.com"
            inputMode="url"
          />
        </Field>
      </div>
    </section>
  );
}

function OwnershipStep({
  owners,
  setOwners,
  errors
}: {
  owners: Owner[];
  setOwners: (owners: Owner[]) => void;
  errors: string[];
}) {
  const update = (id: number, key: keyof Owner, value: string) =>
    setOwners(owners.map((owner) => (owner.id === id ? { ...owner, [key]: value } : owner)));
  const total = owners.reduce((sum, owner) => sum + (Number(owner.ownership) || 0), 0);

  return (
    <section className="ownership-step">
      <StepHeading
        title="Ownership & control"
        description="Ownership information is required for compliance and identity verification."
        align="left"
      />
      <ErrorSummary errors={errors} />
      <div className="owner-section-label">
        <span>Beneficial owners</span>
        <strong className={total === 100 ? "is-complete" : ""}>{total}% total</strong>
      </div>
      <div className="owner-table-scroll">
        <div className="owner-table">
          <div className="owner-row owner-header" aria-hidden="true">
            <span>Name</span>
            <span>Street address</span>
            <span>Current years at residence</span>
            <span>SSN/Passport</span>
            <span>Date of birth</span>
            <span>Ownership %</span>
            <span>ID upload</span>
            <span />
          </div>
          {owners.map((owner) => (
            <div className="owner-row" key={owner.id}>
              <input
                aria-label="Owner name"
                value={owner.name}
                onChange={(event) => update(owner.id, "name", event.target.value)}
                placeholder="Full name"
              />
              <input
                aria-label="Owner street address"
                value={owner.address}
                onChange={(event) => update(owner.id, "address", event.target.value)}
                placeholder="Street address"
              />
              <select
                aria-label="Current years at residence"
                value={owner.residenceYears}
                onChange={(event) => update(owner.id, "residenceYears", event.target.value)}
              >
                <option value="">Select</option>
                <option value="less-than-1">&lt; 1 year</option>
                <option value="1-2">1–2 years</option>
                <option value="3-5">3–5 years</option>
                <option value="6+">6+ years</option>
              </select>
              <input
                aria-label="SSN or passport"
                value={owner.identifier}
                onChange={(event) => update(owner.id, "identifier", event.target.value)}
                placeholder="SSN / Passport"
                type="password"
                autoComplete="off"
              />
              <input
                aria-label="Owner date of birth"
                type="date"
                value={owner.dateOfBirth}
                onChange={(event) => update(owner.id, "dateOfBirth", event.target.value)}
              />
              <div className="owner-percent">
                <input
                  aria-label="Ownership percentage"
                  value={owner.ownership}
                  onChange={(event) => update(owner.id, "ownership", event.target.value.replace(/\D/g, "").slice(0, 3))}
                  inputMode="numeric"
                  placeholder="0"
                />
                <span>%</span>
              </div>
              <UploadField
                label="ID upload"
                value={owner.idFile}
                onFile={(name) => update(owner.id, "idFile", name)}
                compact
              />
              <button
                className="owner-remove"
                type="button"
                aria-label="Remove owner"
                disabled={owners.length === 1}
                onClick={() => setOwners(owners.filter((item) => item.id !== owner.id))}
              >
                <X aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <button className="owner-add" type="button" onClick={() => setOwners([...owners, createOwner()])}>
        <Plus aria-hidden="true" /> Add beneficial owner
      </button>
    </section>
  );
}

const settlementOptions: {
  id: SettlementMethod;
  title: string;
  description: string;
  bestFor: string[];
}[] = [
  {
    id: "bank",
    title: "USD bank deposits",
    description: "Receive payouts directly to your business bank account.",
    bestFor: ["SaaS", "Ecommerce", "Agencies"]
  },
  {
    id: "usdc",
    title: "USDC",
    description: "Receive payouts directly to your supported crypto wallet.",
    bestFor: ["Global businesses", "Web3", "Fast international settlement"]
  },
  {
    id: "credits",
    title: "Platform credits",
    description: "Keep funds in your Acru balance for instant transfers within your workspace.",
    bestFor: ["Internal transfers", "Rewards", "Marketplace balances"]
  }
];

function SettlementStep({
  settlement,
  setSettlement,
  errors
}: {
  settlement: SettlementMethod | "";
  setSettlement: (method: SettlementMethod) => void;
  errors: string[];
}) {
  return (
    <section>
      <StepHeading
        title="Settlement & payouts"
        description="Choose how you’d like to receive funds from successful payments. Your selection can be changed at any time from your settlement settings."
      />
      <ErrorSummary errors={errors} />
      <div className="settlement-grid">
        {settlementOptions.map((option) => {
          const selected = settlement === option.id;
          return (
            <button
              key={option.id}
              type="button"
              className={`settlement-card${selected ? " is-selected" : ""}`}
              aria-pressed={selected}
              onClick={() => setSettlement(option.id)}
            >
              <span className="settlement-choice">{selected && <Check aria-hidden="true" />}</span>
              <h2>{option.title}</h2>
              <p>{option.description}</p>
              <strong>Best for</strong>
              <ul>
                {option.bestFor.map((item) => (
                  <li key={item}>
                    <Check aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function DocumentsStep({
  documents,
  setDocuments,
  errors
}: {
  documents: Record<DocumentKey, string>;
  setDocuments: (documents: Record<DocumentKey, string>) => void;
  errors: string[];
}) {
  const update = (key: DocumentKey, value: string) => setDocuments({ ...documents, [key]: value });
  return (
    <section>
      <StepHeading
        title="Business documents"
        description="To verify your business, we’ll need documentation that confirms your company’s legal formation and ownership structure."
      />
      <ErrorSummary errors={errors} />
      <div className="document-list">
        <div className="document-item">
          <h2>Please upload one or more of the following documents:</h2>
          <p>
            Articles of Organization, Operating Agreement, EIN Confirmation Letter, Certificate of Formation, or another
            official business formation document.
          </p>
          <UploadField
            label="Business formation document"
            value={documents.formation}
            onFile={(name) => update("formation", name)}
            error={errors.length > 0 && !documents.formation}
          />
        </div>
        <div className="document-item">
          <h2>Bank statements (past 3 months)</h2>
          <UploadField
            label="Bank statements"
            value={documents.bankStatement}
            onFile={(name) => update("bankStatement", name)}
          />
        </div>
        <div className="document-item">
          <h2>Voided check</h2>
          <UploadField
            label="Voided check"
            value={documents.voidedCheck}
            onFile={(name) => update("voidedCheck", name)}
          />
        </div>
        <div className="document-item">
          <h2>Previous processing statements (if applicable, past 3 months)</h2>
          <UploadField
            label="Previous processing statements"
            value={documents.processingStatement}
            onFile={(name) => update("processingStatement", name)}
          />
        </div>
      </div>
    </section>
  );
}

function SecureNote() {
  return (
    <p className="secure-note">
      <ShieldCheck aria-hidden="true" /> Your information is encrypted and secure
    </p>
  );
}

function IdentityStep({
  data,
  setData,
  errors
}: {
  data: IdentityData;
  setData: (data: IdentityData) => void;
  errors: string[];
}) {
  const update = (key: keyof IdentityData, value: string) => setData({ ...data, [key]: value });
  return (
    <section>
      <StepHeading
        title="Verify your identity"
        description="To activate your account, we’ll need to verify the identity of the primary account owner."
      />
      <ErrorSummary errors={errors} />
      <div className="onboard-form-grid identity-grid">
        <Field label="Full legal name" error={errors.length > 0 && !data.fullName}>
          <input
            value={data.fullName}
            onChange={(event) => update("fullName", event.target.value)}
            placeholder="John Doe"
            autoComplete="name"
          />
        </Field>
        <Field label="Date of Birth" error={errors.length > 0 && !data.dateOfBirth}>
          <input type="date" value={data.dateOfBirth} onChange={(event) => update("dateOfBirth", event.target.value)} />
        </Field>
        <Field label="Residential Address" error={errors.length > 0 && !data.address}>
          <input
            value={data.address}
            onChange={(event) => update("address", event.target.value)}
            placeholder="1234 Wilshire Ln, New York, NY 10001"
            autoComplete="street-address"
          />
        </Field>
        <Field label="SSN" error={errors.length > 0 && data.ssn.replace(/\D/g, "").length !== 9}>
          <input
            type="password"
            value={data.ssn}
            onChange={(event) => update("ssn", event.target.value.replace(/\D/g, "").slice(0, 9))}
            placeholder="•••-••-••••"
            inputMode="numeric"
            autoComplete="off"
          />
        </Field>
      </div>
      <div className="identity-documents">
        <h2>Government ID</h2>
        <p>Upload a clear, unedited copy of your government-issued ID.</p>
        <div className="identity-upload-grid">
          <div>
            <h3>Front of ID</h3>
            <UploadField
              label="Upload front"
              value={data.front}
              onFile={(name) => update("front", name)}
              error={errors.length > 0 && !data.front}
              large
            />
          </div>
          <div>
            <h3>Back of ID</h3>
            <UploadField
              label="Upload back"
              value={data.back}
              onFile={(name) => update("back", name)}
              error={errors.length > 0 && !data.back}
              large
            />
          </div>
        </div>
      </div>
      <SecureNote />
    </section>
  );
}

function Divider() {
  return (
    <div className="connection-divider">
      <span /> OR <span />
    </div>
  );
}

function BankConnection({ data, setData }: { data: ConnectionData; setData: (data: ConnectionData) => void }) {
  return (
    <div className="connection-panel">
      <StepHeading
        title="Connect your bank account"
        description="Securely connect your bank account to receive settlements"
      />
      <h2>Connect your bank securely</h2>
      <button
        className={`connection-primary${data.bankConnected ? " is-connected" : ""}`}
        type="button"
        onClick={() => setData({ ...data, bankConnected: !data.bankConnected })}
      >
        {data.bankConnected ? <CheckCircle2 aria-hidden="true" /> : null}
        {data.bankConnected ? "Bank connected" : "Link bank"}
      </button>
      <Divider />
      <div className="onboard-form-grid connection-fields">
        <Field label="Routing number">
          <input
            type="password"
            value={data.routingNumber}
            onChange={(event) => setData({ ...data, routingNumber: event.target.value.replace(/\D/g, "").slice(0, 9) })}
            placeholder="•••• •••• •"
            inputMode="numeric"
            autoComplete="off"
          />
        </Field>
        <Field label="Account number">
          <input
            type="password"
            value={data.accountNumber}
            onChange={(event) =>
              setData({ ...data, accountNumber: event.target.value.replace(/\D/g, "").slice(0, 17) })
            }
            placeholder="•••• •••• ••••"
            inputMode="numeric"
            autoComplete="off"
          />
        </Field>
      </div>
      <SecureNote />
    </div>
  );
}

const walletProviders = ["MetaMask", "Coinbase", "Rainbow", "Trust Wallet", "WalletConnect"] as const;

type WalletProvider = (typeof walletProviders)[number];

type EthereumProvider = {
  request: (request: { method: string; params?: unknown[] | Record<string, unknown> }) => Promise<unknown>;
};

type InjectedEthereumProvider = EthereumProvider & {
  isCoinbaseWallet?: boolean;
  isMetaMask?: boolean;
  isRainbow?: boolean;
  isTrust?: boolean;
  isTrustWallet?: boolean;
  isWalletConnect?: boolean;
  providers?: InjectedEthereumProvider[];
};

type AnnouncedWalletProvider = {
  info: {
    name: string;
    rdns: string;
    uuid: string;
  };
  provider: EthereumProvider;
};

const walletProviderUrls: Record<WalletProvider, string> = {
  MetaMask: "https://metamask.io/download/",
  Coinbase: "https://www.coinbase.com/wallet/downloads",
  Rainbow: "https://rainbow.me/download",
  "Trust Wallet": "https://trustwallet.com/browser-extension",
  WalletConnect: "https://walletguide.walletconnect.network/"
};

function matchesAnnouncedProvider(provider: WalletProvider, announced: AnnouncedWalletProvider) {
  const descriptor = `${announced.info.name} ${announced.info.rdns}`.toLowerCase();
  const identifiers: Record<WalletProvider, string[]> = {
    MetaMask: ["metamask"],
    Coinbase: ["coinbase"],
    Rainbow: ["rainbow"],
    "Trust Wallet": ["trust"],
    WalletConnect: ["walletconnect"]
  };
  return identifiers[provider].some((identifier) => descriptor.includes(identifier));
}

function matchesInjectedProvider(provider: WalletProvider, injected: InjectedEthereumProvider) {
  if (provider === "MetaMask") return Boolean(injected.isMetaMask && !injected.isCoinbaseWallet);
  if (provider === "Coinbase") return Boolean(injected.isCoinbaseWallet);
  if (provider === "Rainbow") return Boolean(injected.isRainbow);
  if (provider === "Trust Wallet") return Boolean(injected.isTrust || injected.isTrustWallet);
  return Boolean(injected.isWalletConnect);
}

function findInjectedWallet(provider: WalletProvider, announced: AnnouncedWalletProvider[]) {
  const announcedMatch = announced.find((candidate) => matchesAnnouncedProvider(provider, candidate));
  if (announcedMatch) return announcedMatch.provider;

  const injected = (window as typeof window & { ethereum?: InjectedEthereumProvider }).ethereum;
  if (!injected) return undefined;
  const candidates = injected.providers?.length ? injected.providers : [injected];
  return candidates.find((candidate) => matchesInjectedProvider(provider, candidate));
}

function getWalletErrorCode(error: unknown) {
  if (!error || typeof error !== "object" || !("code" in error)) return undefined;
  const code = Number((error as { code?: unknown }).code);
  return Number.isFinite(code) ? code : undefined;
}

async function switchWalletToBase(provider: EthereumProvider) {
  try {
    await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x2105" }] });
  } catch (error) {
    if (getWalletErrorCode(error) !== 4902) throw error;
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x2105",
          chainName: "Base",
          nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
          rpcUrls: ["https://mainnet.base.org"],
          blockExplorerUrls: ["https://basescan.org"]
        }
      ]
    });
  }
}

function openWalletProviderWindow(provider: WalletProvider) {
  const width = 520;
  const height = 720;
  const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
  const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);
  const popup = window.open(
    walletProviderUrls[provider],
    `${provider.toLowerCase().replace(/\s+/g, "-")}-wallet`,
    `popup=yes,width=${width},height=${height},left=${left},top=${top}`
  );
  if (popup) popup.opener = null;
  return popup;
}

function validateWalletAddress(value: string) {
  const address = value.trim();
  if (!address) return { valid: false, message: "" };
  if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return { valid: true, message: "Address format looks valid for USDC on Base." };
  }
  return {
    valid: false,
    message: "Enter a valid USDC address on Base (0x followed by 40 hexadecimal characters)."
  };
}

function WalletMark({ provider }: { provider: WalletProvider }) {
  if (provider === "MetaMask") {
    return (
      <svg className="wallet-mark is-metamask" viewBox="0 0 64 64" aria-hidden="true">
        <path fill="#e2761b" d="m8 10 18 13-7 15-9-4-2-24Zm48 0L38 23l7 15 9-4 2-24Z" />
        <path fill="#f6851b" d="m26 23 6 5 6-5 7 15-6 13H25l-6-13 7-15Z" />
        <path fill="#763d16" d="m19 38 9 4-3 9-6-13Zm26 0-9 4 3 9 6-13Z" />
        <path fill="#fff" d="m22 36 7 2-5 3-2-5Zm20 0-7 2 5 3 2-5Z" />
        <path fill="#2f241f" d="m27 49 5 3 5-3-2 6h-6l-2-6Z" />
      </svg>
    );
  }

  if (provider === "Coinbase") {
    return (
      <span className="wallet-mark is-coinbase" aria-hidden="true">
        C
      </span>
    );
  }

  if (provider === "Rainbow") {
    return (
      <svg className="wallet-mark is-rainbow" viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="15" fill="#1744b4" />
        <path d="M10 50a22 22 0 0 1 44 0" fill="none" stroke="#ff4d72" strokeWidth="8" />
        <path d="M17 50a15 15 0 0 1 30 0" fill="none" stroke="#ffd83d" strokeWidth="7" />
        <path d="M24 50a8 8 0 0 1 16 0" fill="none" stroke="#5ee090" strokeWidth="7" />
      </svg>
    );
  }

  if (provider === "Trust Wallet") {
    return (
      <span className="wallet-mark is-trust" aria-hidden="true">
        <Shield />
      </span>
    );
  }

  return (
    <svg className="wallet-mark is-walletconnect" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.913 7.519c3.915-3.831 10.26-3.831 14.174 0l.471.461a.483.483 0 0 1 0 .694l-1.611 1.577a.252.252 0 0 1-.354 0l-.649-.634c-2.73-2.673-7.157-2.673-9.887 0l-.694.68a.255.255 0 0 1-.355 0L4.397 8.719a.482.482 0 0 1 0-.693l.516-.507Zm17.506 3.263 1.434 1.404a.483.483 0 0 1 0 .694l-6.466 6.331a.508.508 0 0 1-.709 0l-4.588-4.493a.126.126 0 0 0-.178 0l-4.589 4.493a.508.508 0 0 1-.709 0L.147 12.88a.483.483 0 0 1 0-.694l1.434-1.404a.508.508 0 0 1 .709 0l4.589 4.493c.05.048.129.048.178 0l4.589-4.493a.508.508 0 0 1 .709 0l4.589 4.493c.05.048.128.048.178 0l4.589-4.493a.507.507 0 0 1 .708 0Z" />
    </svg>
  );
}

function WalletConnection({ data, setData }: { data: ConnectionData; setData: (data: ConnectionData) => void }) {
  const addressValidation = validateWalletAddress(data.walletAddress);
  const [announcedProviders, setAnnouncedProviders] = useState<AnnouncedWalletProvider[]>([]);
  const [connectingProvider, setConnectingProvider] = useState<WalletProvider | "">("");
  const [connectionFeedback, setConnectionFeedback] = useState<{ tone: "valid" | "invalid"; message: string }>();

  useEffect(() => {
    const handleAnnouncement = (event: Event) => {
      const detail = (event as CustomEvent<AnnouncedWalletProvider>).detail;
      if (!detail?.info?.uuid || !detail.provider) return;
      setAnnouncedProviders((current) =>
        current.some((candidate) => candidate.info.uuid === detail.info.uuid) ? current : [...current, detail]
      );
    };

    window.addEventListener("eip6963:announceProvider", handleAnnouncement);
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    return () => window.removeEventListener("eip6963:announceProvider", handleAnnouncement);
  }, []);

  const connectWallet = async (providerName: WalletProvider) => {
    setConnectingProvider(providerName);
    setConnectionFeedback(undefined);
    const provider = findInjectedWallet(providerName, announcedProviders);

    if (!provider) {
      const popup = openWalletProviderWindow(providerName);
      setConnectingProvider("");
      setConnectionFeedback({
        tone: popup ? "valid" : "invalid",
        message:
          providerName === "WalletConnect"
            ? popup
              ? "WalletConnect opened in a new window. Its QR modal will be enabled when the project ID is configured."
              : "Allow popups to open WalletConnect."
            : popup
              ? `${providerName} opened in a new window. Install or unlock it, then try connecting again.`
              : `Allow popups to open ${providerName}.`
      });
      return;
    }

    try {
      const result = await provider.request({ method: "eth_requestAccounts" });
      const address = Array.isArray(result) && typeof result[0] === "string" ? result[0] : "";
      if (!validateWalletAddress(address).valid) throw new Error("Wallet did not return a valid address.");
      await switchWalletToBase(provider);
      setData({ ...data, walletProvider: providerName, walletAddress: address });
      setConnectionFeedback({ tone: "valid", message: `${providerName} connected on Base.` });
    } catch (error) {
      const cancelled = getWalletErrorCode(error) === 4001;
      setConnectionFeedback({
        tone: "invalid",
        message: cancelled
          ? `${providerName} connection was cancelled.`
          : `${providerName} could not connect on Base. Try again or enter the address manually.`
      });
    } finally {
      setConnectingProvider("");
    }
  };

  return (
    <div className="connection-panel">
      <StepHeading
        title="Connect a wallet"
        description="Choose a supported wallet for instant connection, or enter a USDC address on Base manually."
      />
      <h2>Quick connect</h2>
      <div className="wallet-grid">
        {walletProviders.map((provider) => {
          const selected = data.walletProvider === provider;
          return (
            <button
              key={provider}
              type="button"
              className={selected ? "is-selected" : ""}
              onClick={() => void connectWallet(provider)}
              disabled={Boolean(connectingProvider)}
              aria-busy={connectingProvider === provider}
              aria-pressed={selected}
            >
              <WalletMark provider={provider} />
              <span className="wallet-provider-name">{connectingProvider === provider ? "Opening…" : provider}</span>
              {selected && <CheckCircle2 className="wallet-provider-check" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      {connectionFeedback && (
        <small className={`wallet-connection-feedback is-${connectionFeedback.tone}`} role="status">
          {connectionFeedback.message}
        </small>
      )}
      <Divider />
      <Field label="USDC address on Base" error={Boolean(data.walletAddress) && !addressValidation.valid} wide>
        <input
          value={data.walletAddress}
          onChange={(event) => setData({ ...data, walletAddress: event.target.value.trim() })}
          placeholder="0x…"
          autoComplete="off"
          aria-invalid={Boolean(data.walletAddress) && !addressValidation.valid}
          aria-describedby={data.walletAddress ? "wallet-address-help wallet-address-feedback" : "wallet-address-help"}
        />
        <small id="wallet-address-help" className="wallet-address-help">
          Enter the receiving address for USDC on Base. Make sure the wallet supports USDC on Base before continuing.
        </small>
        {data.walletAddress && (
          <small
            id="wallet-address-feedback"
            className={`wallet-validation ${addressValidation.valid ? "is-valid" : "is-invalid"}`}
          >
            {addressValidation.message}
          </small>
        )}
      </Field>
      <SecureNote />
    </div>
  );
}

function ConnectionStep({
  settlement,
  data,
  setData,
  errors
}: {
  settlement: SettlementMethod;
  data: ConnectionData;
  setData: (data: ConnectionData) => void;
  errors: string[];
}) {
  return (
    <section>
      <ErrorSummary errors={errors} />
      {settlement === "bank" && <BankConnection data={data} setData={setData} />}
      {settlement === "usdc" && <WalletConnection data={data} setData={setData} />}
      {settlement === "credits" && <PlatformCreditsConnection />}
    </section>
  );
}

function PlatformCreditsConnection() {
  return (
    <div className="connection-shell credits-connection">
      <StepHeading
        title="Use platform credits"
        description="Keep settlements in your Acru balance for instant transfers within your workspace."
      />
      <div className="credits-connection-card">
        <CheckCircle2 aria-hidden="true" />
        <div>
          <strong>No external account required</strong>
          <p>
            Your available funds will remain in Acru as platform credits. You can add a bank account or USDC wallet
            later from settlement settings.
          </p>
        </div>
      </div>
    </div>
  );
}

function SubmittedStep({ onBack, onDashboard }: { onBack: () => void; onDashboard: () => void }) {
  return (
    <section className="submitted-step">
      <StepHeading
        title="You’re all set"
        description="Your application has been submitted. We’re reviewing your information now. Most applications are approved within minutes."
      />
      <div className="submitted-grid">
        <article className="submitted-card">
          <h2>What happens next?</h2>
          <div>
            <UserRoundCheck aria-hidden="true" />
            <span>
              <strong>Identity Verification</strong>
              <small>Usually completes within 2–5 minutes</small>
            </span>
          </div>
          <div>
            <ClipboardCheck aria-hidden="true" />
            <span>
              <strong>Business Review</strong>
              <small>May take up to 1 business day</small>
            </span>
          </div>
          <div>
            <Sparkles aria-hidden="true" />
            <span>
              <strong>Account Activation</strong>
              <small>You’ll receive an email once approved</small>
            </span>
          </div>
        </article>
        <article className="submitted-card status-card">
          <h2>Verification status</h2>
          {[
            { label: "Business information", complete: true },
            { label: "Settlements & payouts", complete: true },
            { label: "Workspace setup", complete: true },
            { label: "Identity verification", complete: false },
            { label: "Account activation", complete: false }
          ].map((item) => (
            <div className={`status-item ${item.complete ? "is-complete" : "is-pending"}`} key={item.label}>
              <span className="status-marker" aria-hidden="true">
                {item.complete && <Check />}
              </span>
              <span>
                <strong>{item.label}</strong>
                <small>{item.complete ? "Completed" : "Pending"}</small>
              </span>
            </div>
          ))}
        </article>
      </div>
      <div className="submitted-actions">
        <button className="submitted-back-button" type="button" onClick={onBack}>
          Back
        </button>
        <button className="dashboard-button" type="button" onClick={onDashboard}>
          Go to dashboard
        </button>
      </div>
      <Link className="documentation-link" href="/developers/documentation">
        View documentation
      </Link>
    </section>
  );
}

function validateStep(
  step: number,
  business: BusinessData,
  owners: Owner[],
  settlement: SettlementMethod | "",
  documents: Record<DocumentKey, string>,
  identity: IdentityData,
  connection: ConnectionData
) {
  const errors: string[] = [];
  if (step === 0) {
    if (!business.legalName.trim()) errors.push("Enter the legal business name.");
    if (!/^\d{2}-?\d{7}$/.test(business.taxId)) errors.push("Enter a valid 9-digit EIN.");
    if (!business.yearsInBusiness) errors.push("Select years in business.");
    if (!business.address.trim()) errors.push("Enter the business address.");
    if (!business.locationTenure) errors.push("Select the location tenure.");
    if (!business.website.trim()) errors.push("Enter the website domain.");
  }
  if (step === 1) {
    if (
      owners.some(
        (owner) =>
          !owner.name ||
          !owner.address ||
          !owner.residenceYears ||
          !owner.identifier ||
          !owner.dateOfBirth ||
          !owner.ownership ||
          !owner.idFile
      )
    ) {
      errors.push("Complete every beneficial owner field and upload each owner’s ID.");
    }
    const total = owners.reduce((sum, owner) => sum + (Number(owner.ownership) || 0), 0);
    if (total !== 100) errors.push("Ownership percentages must total 100%.");
  }
  if (step === 2 && !settlement) errors.push("Choose a settlement method.");
  if (step === 3 && !documents.formation) errors.push("Upload a business formation document.");
  if (step === 4) {
    if (!identity.fullName || !identity.dateOfBirth || !identity.address) errors.push("Complete the identity fields.");
    if (identity.ssn.replace(/\D/g, "").length !== 9) errors.push("Enter a valid 9-digit SSN.");
    if (!identity.front || !identity.back) errors.push("Upload the front and back of the government ID.");
  }
  if (step === 5 && settlement === "bank") {
    if (!connection.bankConnected && (connection.routingNumber.length !== 9 || connection.accountNumber.length < 4)) {
      errors.push("Link your bank or enter valid bank account details.");
    }
  }
  if (step === 5 && settlement === "usdc") {
    if (!connection.walletProvider && !validateWalletAddress(connection.walletAddress).valid) {
      errors.push("Connect a wallet or enter a valid wallet address.");
    }
  }
  return errors;
}

export function OnboardingFlow() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isEnteringDashboard, setIsEnteringDashboard] = useState(false);
  const [step, setStep] = useState(0);
  const [business, setBusiness] = useState<BusinessData>(emptyBusiness);
  const [owners, setOwners] = useState<Owner[]>([createOwner()]);
  const [settlement, setSettlement] = useState<SettlementMethod | "">("");
  const [documents, setDocuments] = useState<Record<DocumentKey, string>>({
    formation: "",
    bankStatement: "",
    voidedCheck: "",
    processingStatement: ""
  });
  const [identity, setIdentity] = useState<IdentityData>(emptyIdentity);
  const [connection, setConnection] = useState<ConnectionData>(emptyConnection);
  const [errors, setErrors] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = readOnboarding();
      const params = new URLSearchParams(window.location.search);
      const requestedStep = PREVIEW_STEPS.findIndex(({ slug }) => slug === params.get("step"));
      const requestedSettlement = params.get("settlement");
      const isPreview = params.get("preview") === "1";
      const nextStep = requestedStep >= 0 ? requestedStep : saved.submitted ? 6 : Math.min(saved.step || 0, 6);
      const savedSettlement = (saved as { settlement?: string }).settlement;

      setPreviewMode(isPreview);
      setStep(nextStep);
      setBusiness((current) => ({
        ...current,
        legalName: saved.businessName || "",
        dba: saved.dba || ""
      }));
      if (requestedSettlement === "bank" || requestedSettlement === "usdc" || requestedSettlement === "credits") {
        setSettlement(requestedSettlement);
      } else if (savedSettlement === "bank" || savedSettlement === "usdc" || savedSettlement === "credits") {
        setSettlement(savedSettlement);
      } else if (nextStep === 5) {
        setSettlement("bank");
      }
      setReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isEnteringDashboard) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => router.push("/dashboard"), reduceMotion ? 180 : 1800);

    return () => window.clearTimeout(timer);
  }, [isEnteringDashboard, router]);

  const completedSegments = useMemo(() => {
    if (step === 6) return 5;
    return [1, 3, 3, 4, 4, 4][step] || 1;
  }, [step]);

  const persist = (nextStep: number, submitted = false, settlementOverride = settlement) => {
    saveOnboarding({
      step: nextStep,
      submitted,
      businessName: business.legalName,
      dba: business.dba,
      settlement: settlementOverride || undefined
    });
  };

  const next = () => {
    const nextErrors = ONBOARDING_VALIDATION_ENABLED
      ? validateStep(step, business, owners, settlement, documents, identity, connection)
      : [];
    if (nextErrors.length) {
      setErrors(nextErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setErrors([]);
    if (step === 5) {
      setStep(6);
      persist(6, true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const nextStep = step + 1;
    const nextSettlement = nextStep === 5 && !settlement ? "bank" : settlement;
    if (nextSettlement !== settlement) setSettlement(nextSettlement);
    setStep(nextStep);
    persist(nextStep, false, nextSettlement);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    if (step === 0) {
      router.push("/sign-in");
      return;
    }
    const nextStep = step - 1;
    setErrors([]);
    setStep(nextStep);
    persist(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const previewStep = (nextStep: number) => {
    setErrors([]);
    setStep(nextStep);
    if (nextStep === 5 && !settlement) setSettlement("bank");

    const url = new URL(window.location.href);
    url.searchParams.set("step", PREVIEW_STEPS[nextStep].slug);
    window.history.replaceState({}, "", url.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const previewSettlement = (method: SettlementMethod) => {
    setErrors([]);
    setSettlement(method);

    const url = new URL(window.location.href);
    url.searchParams.set("settlement", method);
    window.history.replaceState({}, "", url.toString());
  };

  const resetPreview = () => {
    window.localStorage.removeItem(ACRU_ONBOARDING_KEY);
    setBusiness(emptyBusiness);
    setOwners([createOwner()]);
    setSettlement("");
    setDocuments({ formation: "", bankStatement: "", voidedCheck: "", processingStatement: "" });
    setIdentity(emptyIdentity);
    setConnection(emptyConnection);
    previewStep(0);
  };

  if (!ready) return <div className="onboarding-loading">Loading onboarding…</div>;

  return (
    <main
      className={`onboarding-page${step === 6 ? " is-submitted" : ""}${isEnteringDashboard ? " is-entering-dashboard" : ""}`}
      aria-busy={isEnteringDashboard}
    >
      {isEnteringDashboard && (
        <section className="dashboard-entry" role="status" aria-live="polite">
          <Image className="dashboard-entry-logo" src="/acru-logo.png" alt="" width={44} height={37} priority />
          <div className="dashboard-entry-copy">
            <h1>Welcome to Acru</h1>
            <p>Preparing your dashboard</p>
          </div>
          <div className="dashboard-entry-loader" aria-hidden="true">
            <span />
          </div>
        </section>
      )}
      {previewMode && (
        <aside className="onboarding-preview-tools" aria-label="Development onboarding preview">
          <strong>Development preview</strong>
          <select
            aria-label="Preview onboarding screen"
            value={step}
            onChange={(event) => previewStep(Number(event.target.value))}
          >
            {PREVIEW_STEPS.map(({ label }, index) => (
              <option key={label} value={index}>
                {label}
              </option>
            ))}
          </select>
          {step === 5 && (
            <select
              aria-label="Preview settlement connection"
              value={settlement || "bank"}
              onChange={(event) => previewSettlement(event.target.value as SettlementMethod)}
            >
              <option value="bank">Bank connection</option>
              <option value="usdc">Wallet connection</option>
              <option value="credits">Platform credits</option>
            </select>
          )}
          <button type="button" onClick={resetPreview}>
            Reset progress
          </button>
        </aside>
      )}
      <header className="onboarding-header">
        <Image src="/acru-logo.png" alt="Acru" width={38} height={32} priority />
        <div className="onboarding-progress" aria-label={`Onboarding progress: ${completedSegments} of 5`}>
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={index < completedSegments ? "is-complete" : ""} />
          ))}
        </div>
      </header>

      <div className="onboarding-content">
        {step === 0 && <BusinessStep data={business} setData={setBusiness} errors={errors} />}
        {step === 1 && <OwnershipStep owners={owners} setOwners={setOwners} errors={errors} />}
        {step === 2 && <SettlementStep settlement={settlement} setSettlement={setSettlement} errors={errors} />}
        {step === 3 && <DocumentsStep documents={documents} setDocuments={setDocuments} errors={errors} />}
        {step === 4 && <IdentityStep data={identity} setData={setIdentity} errors={errors} />}
        {step === 5 && settlement && (
          <ConnectionStep settlement={settlement} data={connection} setData={setConnection} errors={errors} />
        )}
        {step === 6 && <SubmittedStep onBack={back} onDashboard={() => setIsEnteringDashboard(true)} />}
      </div>

      {step < 6 && (
        <footer className="onboarding-footer">
          <button className="onboard-back" type="button" onClick={back}>
            Back
          </button>
          <button className="onboard-next" type="button" onClick={next}>
            {step === 5 ? "Submit for review" : "Continue"}
          </button>
        </footer>
      )}
    </main>
  );
}
