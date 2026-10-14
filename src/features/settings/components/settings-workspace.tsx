"use client";

import {
  DataPresentationIcon as Activity,
  AlertTriangleIcon as AlertTriangle,
  ArrowDiagonalIcon as ArrowUpRight,
  CheckCircleIcon as BadgeCheck,
  NotificationIcon as Bell,
  CalendarTimeIcon as CalendarClock,
  CheckIcon as Check,
  CheckCircleIcon as CheckCircle2,
  ChevronLeftIcon as ChevronLeft,
  ChevronRightIcon as ChevronRight,
  ClockIcon as Clock3,
  DuplicateIcon as Copy,
  CreditCardIcon as CreditCard,
  ArrowDownIcon as Download,
  ViewIcon as Eye,
  ClipboardCheckIcon as FileCheck2,
  PasskeyIcon as Fingerprint,
  GlobeIcon as Globe2,
  ImageIcon,
  KeyIcon as KeyRound,
  BankIcon as Landmark,
  LockIcon as LockKeyhole,
  EmailIcon as Mail,
  PinIcon as MapPin,
  ChatIcon as MessageSquareText,
  MenuHorizontalIcon as MoreHorizontal,
  EditIcon as Pencil,
  PhoneIcon as Phone,
  PlusIcon as Plus,
  RefreshIcon as RotateCcw,
  SearchIcon as Search,
  SendIcon as Send,
  SettingsIcon as Settings2,
  ShieldCheckMarkIcon as ShieldCheck,
  ShieldPendingIcon as ShieldEllipsis,
  MobileIcon as Smartphone,
  PayoutIcon,
  UploadIcon as Upload,
  PersonAddIcon as UserPlus,
  TeamIcon as Users,
  WalletIcon as WalletCards,
  ConnectIcon as Webhook,
  XIcon as X
} from "@shopify/polaris-icons";
import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { useListCollection } from "@/components/data/use-list-collection";
import { CollectionPageState } from "@/components/ui/collection-state";
import { Dialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { useDismissOnEscape } from "@/components/ui/use-dismiss-on-escape";
import {
  initialDevices,
  initialNotificationPreferences,
  notificationRows,
  capabilitiesForTeamAccess,
  createTeamPermissionPreset,
  roleCards,
  settingsSnapshotAdapter,
  summarizeTeamAccess,
  teamInviteRoles,
  teamMembers,
  teamPermissionGroups,
  type TeamAccessLevel,
  type TeamInviteRole,
  type Channel
} from "@/features/settings/data/settings";

export const settingsSections = [
  "business",
  "team",
  "banking-payouts",
  "branding",
  "security",
  "notifications"
] as const;

export type SettingsSection = (typeof settingsSections)[number];

function SettingsToggle({
  checked,
  onChange,
  label
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      className="settings-toggle"
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      data-active={checked}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}

function StatusPill({
  children,
  tone = "green"
}: {
  children: ReactNode;
  tone?: "green" | "blue" | "gold" | "red" | "neutral";
}) {
  return <span className={`settings-status ${tone}`}>{children}</span>;
}

function SectionHeading({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <header className="settings-section-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action ? <div className="settings-heading-action">{action}</div> : null}
    </header>
  );
}

function SettingsCard({
  title,
  description,
  children,
  aside
}: {
  title: string;
  description?: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="settings-card">
      <header>
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {aside}
      </header>
      <div className="settings-card-body">{children}</div>
    </section>
  );
}

function SaveBar({ text, onSave }: { text?: string; onSave: () => void }) {
  return (
    <div className="settings-save-bar">
      <span>
        <CheckCircle2 />
        {text ?? "Changes are saved securely and apply across your ACRU workspace."}
      </span>
      <button className="settings-primary-button" type="button" onClick={onSave}>
        Save changes
      </button>
    </div>
  );
}

function BusinessSettings({ notify }: { notify: (message: string) => void }) {
  const [supportMatches, setSupportMatches] = useState(false);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    notify("Business settings saved");
  }

  return (
    <form className="settings-section" onSubmit={save}>
      <SectionHeading
        title="Business"
        description="Keep your legal, operating, and customer-facing business information accurate."
        action={
          <StatusPill>
            <BadgeCheck /> Business verified
          </StatusPill>
        }
      />

      <section className="settings-profile-banner">
        <div className="settings-business-mark">NS</div>
        <div>
          <strong>Northstar Studio LLC</strong>
          <span>Merchant ID · MER-120084</span>
        </div>
        <div className="settings-profile-completion">
          <span>
            <strong>92%</strong> profile complete
          </span>
          <i>
            <b />
          </i>
        </div>
      </section>

      <SettingsCard
        title="Legal business details"
        description="The registered information used for verification, reporting, and tax documents."
      >
        <div className="settings-form-grid two-column">
          <label>
            Legal business name
            <input defaultValue="Northstar Studio LLC" />
          </label>
          <label>
            Doing business as
            <input defaultValue="Northstar Studio" />
          </label>
          <label>
            Business structure
            <Select defaultValue="llc">
              <option value="llc">Limited liability company</option>
              <option>Corporation</option>
              <option>Partnership</option>
              <option>Sole proprietor</option>
            </Select>
          </label>
          <label>
            Employer identification number
            <span className="settings-secure-input">
              <input value="••-•••4821" readOnly />
              <LockKeyhole />
            </span>
          </label>
          <label>
            Industry
            <Select defaultValue="software">
              <option value="software">Software & digital services</option>
              <option>Retail</option>
              <option>Professional services</option>
              <option>Hospitality</option>
            </Select>
          </label>
          <label>
            Estimated annual volume
            <Select defaultValue="10m">
              <option value="10m">$5M – $10M</option>
              <option>$1M – $5M</option>
              <option>$10M – $25M</option>
              <option>$25M+</option>
            </Select>
          </label>
        </div>
        <div className="settings-inline-note">
          <FileCheck2 />
          <span>
            <strong>Verified August 14, 2026</strong>Your legal details match the business registry. Contact support to
            change protected fields.
          </span>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Operating details"
        description="How ACRU and your customers can identify and contact your business."
      >
        <div className="settings-form-grid two-column">
          <label>
            Business website
            <span className="settings-input-prefix">
              <Globe2 />
              <input defaultValue="northstar.studio" />
            </span>
          </label>
          <label>
            Business phone
            <span className="settings-input-prefix">
              <Phone />
              <input defaultValue="+1 (212) 555-0187" />
            </span>
          </label>
          <label className="settings-wide-field">
            Business address
            <input defaultValue="145 West 28th Street, Floor 7" />
          </label>
          <label>
            City
            <input defaultValue="New York" />
          </label>
          <label>
            State / region
            <input defaultValue="New York" />
          </label>
          <label>
            Postal code
            <input defaultValue="10001" />
          </label>
          <label>
            Country
            <Select defaultValue="us">
              <option value="us">United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
            </Select>
          </label>
          <label>
            Time zone
            <Select defaultValue="ny">
              <option value="ny">America/New_York (ET)</option>
              <option>America/Chicago (CT)</option>
              <option>America/Los_Angeles (PT)</option>
            </Select>
          </label>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Customer support"
        description="Displayed on receipts, payment links, and customer correspondence."
      >
        <div className="settings-preference-row compact">
          <div>
            <span className="settings-row-icon">
              <Mail />
            </span>
            <span>
              <strong>Use business contact details</strong>
              <small>Keep support contact information in sync with the operating details above.</small>
            </span>
          </div>
          <SettingsToggle checked={supportMatches} onChange={setSupportMatches} label="Use business contact details" />
        </div>
        {!supportMatches ? (
          <div className="settings-form-grid two-column settings-spaced-grid">
            <label>
              Support email
              <input type="email" defaultValue="support@northstar.studio" />
            </label>
            <label>
              Support phone
              <input defaultValue="+1 (212) 555-0198" />
            </label>
            <label className="settings-wide-field">
              Support website
              <input defaultValue="https://northstar.studio/help" />
            </label>
          </div>
        ) : null}
      </SettingsCard>

      <SaveBar onSave={() => notify("Business settings saved")} />
    </form>
  );
}

type TeamInviteSubmission = {
  name: string;
  email: string;
  role: TeamInviteRole;
  permissions: Record<string, TeamAccessLevel>;
  sessionDuration: string;
  locationAlerts: boolean;
};

const teamAccessLevelLabels: Record<Exclude<TeamAccessLevel, "none">, string> = {
  view: "View only",
  operate: "Operate",
  manage: "Manage"
};

function TeamInviteDialog({
  memberEmails,
  onInvite,
  onOpenChange
}: {
  memberEmails: string[];
  onInvite: (invite: TeamInviteSubmission) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [role, setRole] = useState<TeamInviteRole>("Analyst");
  const [permissions, setPermissions] = useState<Record<string, TeamAccessLevel>>(() =>
    createTeamPermissionPreset("Analyst")
  );
  const [customized, setCustomized] = useState(false);
  const [sessionDuration, setSessionDuration] = useState("12 hours");
  const [locationAlerts, setLocationAlerts] = useState(true);
  const [formError, setFormError] = useState("");
  const rolePreset = useMemo(() => createTeamPermissionPreset(role), [role]);
  const summary = summarizeTeamAccess(permissions);

  function setPermission(pageId: string, level: TeamAccessLevel) {
    setPermissions((current) => ({ ...current, [pageId]: level }));
    setCustomized(true);
    setFormError("");
  }

  function applyRole(nextRole: TeamInviteRole) {
    setRole(nextRole);
    setPermissions(createTeamPermissionPreset(nextRole));
    setCustomized(false);
    setFormError("");
  }

  function setEveryPermission(level: TeamAccessLevel) {
    setPermissions(
      Object.fromEntries(teamPermissionGroups.flatMap((group) => group.pages.map((page) => [page.id, level] as const)))
    );
    setCustomized(true);
    setFormError("");
  }

  function submitInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "")
      .trim()
      .toLowerCase();

    if (memberEmails.some((memberEmail) => memberEmail.toLowerCase() === email)) {
      setFormError("This email already belongs to a member of this workspace.");
      return;
    }
    if (!summary.enabledPages) {
      setFormError("Select at least one page this teammate can access.");
      return;
    }

    onInvite({ email, locationAlerts, name, permissions, role, sessionDuration });
  }

  return (
    <Dialog
      className="settings-invite-dialog"
      description="Grant only the page-level access they need. Security enrollment is required before first access."
      footer={
        <>
          <span className="settings-invite-footer-summary">
            <ShieldCheck /> {summary.enabledPages} pages · 2-step required
          </span>
          <button className="settings-tertiary-button" type="button" onClick={() => onOpenChange(false)}>
            Cancel
          </button>
          <button className="settings-primary-button" type="submit" form="team-invite-form">
            <Send /> Send secure invitation
          </button>
        </>
      }
      onOpenChange={onOpenChange}
      open
      title="Invite a team member"
    >
      <form className="settings-invite-form" id="team-invite-form" onSubmit={submitInvite}>
        <section className="settings-invite-section settings-invite-identity">
          <header>
            <div>
              <h3>Member details</h3>
              <p>Use their individual work address. Shared inboxes should not be granted workspace access.</p>
            </div>
          </header>
          <div className="settings-form-grid settings-invite-identity-grid">
            <label>
              Full name
              <input autoComplete="name" data-autofocus name="name" required placeholder="Jordan Lee" />
            </label>
            <label>
              Work email
              <input autoComplete="email" name="email" type="email" required placeholder="jordan@company.com" />
            </label>
            <label>
              Role template
              <Select
                aria-label="Role template"
                value={role}
                onChange={(event) => applyRole(event.target.value as TeamInviteRole)}
              >
                {teamInviteRoles.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </label>
          </div>
          <p className="settings-role-template-note">
            <Settings2 /> {customized ? `${role} template · customized below` : `${role} permission template applied`}
          </p>
        </section>

        <section className="settings-invite-section settings-invite-permissions">
          <header className="settings-permission-heading">
            <div>
              <h3>Page access & permission level</h3>
              <p>Every page is independently gated. Higher levels include the capabilities shown with checkmarks.</p>
            </div>
            <div className="settings-permission-summary" aria-live="polite">
              <strong>{summary.enabledPages}</strong> pages
              <span>{summary.operatedPages} operate</span>
              <span>{summary.managedPages} manage</span>
            </div>
          </header>
          <div className="settings-permission-actions">
            <button type="button" onClick={() => setEveryPermission("view")}>
              Select all as view only
            </button>
            <button type="button" onClick={() => setEveryPermission("none")}>
              Clear all
            </button>
          </div>

          <div className="settings-permission-groups">
            {teamPermissionGroups.map((group) => {
              const enabledInGroup = group.pages.filter((page) => permissions[page.id] !== "none").length;
              return (
                <section className="settings-permission-group" key={group.id}>
                  <header>
                    <div>
                      <h4>{group.title}</h4>
                      <p>{group.description}</p>
                    </div>
                    <span>
                      {enabledInGroup}/{group.pages.length} pages
                    </span>
                  </header>
                  <div>
                    {group.pages.map((page) => {
                      const level = permissions[page.id] ?? "none";
                      const enabled = level !== "none";
                      const activeCapabilities = new Set(capabilitiesForTeamAccess(page, level));
                      const presetLevel = rolePreset[page.id];
                      return (
                        <article className="settings-permission-row" data-enabled={enabled || undefined} key={page.id}>
                          <label className="settings-page-access-check">
                            <input
                              aria-label={`Allow access to ${page.label}`}
                              checked={enabled}
                              onChange={(event) =>
                                setPermission(
                                  page.id,
                                  event.target.checked ? (presetLevel === "none" ? "view" : presetLevel) : "none"
                                )
                              }
                              type="checkbox"
                            />
                            <span aria-hidden="true">
                              <Check />
                            </span>
                            <span>
                              <strong>
                                {page.label}
                                {page.sensitive ? <em>Sensitive</em> : null}
                              </strong>
                              <small>{page.route}</small>
                              <small>{page.description}</small>
                            </span>
                          </label>

                          <label className="settings-page-level">
                            <span>Access level</span>
                            <Select
                              aria-label={`${page.label} access level`}
                              disabled={!enabled}
                              value={level}
                              onChange={(event) => setPermission(page.id, event.target.value as TeamAccessLevel)}
                            >
                              <option value="none">No access</option>
                              {Object.entries(teamAccessLevelLabels).map(([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ))}
                            </Select>
                          </label>

                          <ul aria-label={`${page.label} capabilities`} className="settings-page-capabilities">
                            {page.capabilities.map((capability) => (
                              <li data-active={activeCapabilities.has(capability) || undefined} key={capability}>
                                <span aria-hidden="true">
                                  <Check />
                                </span>
                                {capability}
                              </li>
                            ))}
                          </ul>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </section>

        <section className="settings-invite-section settings-invite-security">
          <header>
            <div>
              <h3>Mandatory security policy</h3>
              <p>These controls apply to every non-owner team member and cannot be removed from this invitation.</p>
            </div>
            <StatusPill>
              <LockKeyhole /> Enforced
            </StatusPill>
          </header>
          <div className="settings-required-security-list">
            <article>
              <span>
                <Check />
              </span>
              <div>
                <strong>2-step verification before first access</strong>
                <small>The invitation remains locked until the member enrolls an authenticator app or passkey.</small>
              </div>
              <StatusPill>Required</StatusPill>
            </article>
            <article>
              <span>
                <Check />
              </span>
              <div>
                <strong>Step-up authentication for sensitive actions</strong>
                <small>Required for refunds, payouts, bank changes, live keys, exports, and permission changes.</small>
              </div>
              <StatusPill>Required</StatusPill>
            </article>
            <article>
              <span>
                <Check />
              </span>
              <div>
                <strong>Strong authentication method</strong>
                <small>Authenticator apps, passkeys, and hardware security keys are accepted. SMS alone is not.</small>
              </div>
              <StatusPill>Required</StatusPill>
            </article>
          </div>
          <div className="settings-invite-session-policy">
            <label>
              Maximum session duration
              <Select value={sessionDuration} onChange={(event) => setSessionDuration(event.target.value)}>
                <option>4 hours</option>
                <option>8 hours</option>
                <option>12 hours</option>
                <option>24 hours</option>
              </Select>
            </label>
            <label className="settings-security-alert-check">
              <input
                checked={locationAlerts}
                onChange={(event) => setLocationAlerts(event.target.checked)}
                type="checkbox"
              />
              <span>
                <strong>New location alerts</strong>
                <small>Notify workspace administrators when this member signs in from a new location.</small>
              </span>
            </label>
          </div>
        </section>

        {formError ? (
          <p aria-live="assertive" className="settings-invite-error" role="alert">
            <AlertTriangle /> {formError}
          </p>
        ) : null}
      </form>
    </Dialog>
  );
}

function TeamSettings({ notify }: { notify: (message: string) => void }) {
  const [members, setMembers] = useState(teamMembers);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);
  const pageSize = 5;
  const filtered = useMemo(
    () =>
      members.filter((member) =>
        `${member.name} ${member.email} ${member.role}`.toLowerCase().includes(query.toLowerCase())
      ),
    [members, query]
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleMembers = filtered.slice((page - 1) * pageSize, page * pageSize);

  const activeMembers = members.filter((member) => member.active !== "Invite pending").length;
  const membersNeedingTwoFactor = members.filter((member) => !member.twoFactor).length;
  const twoFactorCoverage = members.length
    ? Math.round(((members.length - membersNeedingTwoFactor) / members.length) * 100)
    : 100;
  const pendingInvitations = members.filter((member) => member.active === "Invite pending").length;

  function invite(submission: TeamInviteSubmission) {
    const accessSummary = summarizeTeamAccess(submission.permissions);
    setMembers((current) => [
      ...current,
      {
        id: Date.now(),
        name: submission.name,
        email: submission.email,
        initials: submission.name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        role: submission.role,
        scope: `${accessSummary.enabledPages} pages · ${accessSummary.managedPages} manage`,
        active: "Invite pending",
        twoFactor: false,
        tone: "slate"
      }
    ]);
    setPage(Math.ceil((members.length + 1) / pageSize));
    setInviteOpen(false);
    notify(`Secure invitation sent to ${submission.email} · 2-step setup required`);
  }

  return (
    <div className="settings-section">
      <SectionHeading
        title="Team"
        description="Give each teammate exactly the access they need and review workspace security at a glance."
        action={
          <button className="settings-primary-button" type="button" onClick={() => setInviteOpen(true)}>
            <UserPlus /> Invite member
          </button>
        }
      />

      <div className="settings-metric-row three">
        <article>
          <span>
            <Users />
          </span>
          <div>
            <small>Active members</small>
            <strong>{activeMembers}</strong>
            <em>Across 5 role groups</em>
          </div>
        </article>
        <article>
          <span>
            <ShieldCheck />
          </span>
          <div>
            <small>2-step coverage</small>
            <strong>{twoFactorCoverage}%</strong>
            <em>
              {membersNeedingTwoFactor} {membersNeedingTwoFactor === 1 ? "member needs" : "members need"} attention
            </em>
          </div>
        </article>
        <article>
          <span>
            <Clock3 />
          </span>
          <div>
            <small>Pending invitations</small>
            <strong>{pendingInvitations}</strong>
            <em>{pendingInvitations ? "Access blocked until security setup" : "No outstanding invitations"}</em>
          </div>
        </article>
      </div>

      <SettingsCard
        title="Team members"
        description={`${members.length} people have access to Northstar Studio.`}
        aside={
          <div className="settings-table-tools">
            <label className="settings-search">
              <Search />
              <input
                value={query}
                placeholder="Search members"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            </label>
            <button type="button" aria-label="More team actions" onClick={() => notify("Team actions opened")}>
              <MoreHorizontal />
            </button>
          </div>
        }
      >
        <div className="settings-team-list">
          <div className="settings-team-header">
            <span>Member</span>
            <span>Role & access</span>
            <span>Last active</span>
            <span>2-step</span>
            <span />
          </div>
          {visibleMembers.map((member) => (
            <div className="settings-team-row" key={member.id}>
              <div>
                <span className={`settings-avatar ${member.tone}`}>{member.initials}</span>
                <span>
                  <strong>{member.name}</strong>
                  <small>{member.email}</small>
                </span>
              </div>
              <div>
                <strong>{member.role}</strong>
                <small>{member.scope}</small>
              </div>
              <div>
                <strong>{member.active}</strong>
                <small>{member.active === "Invite pending" ? "Not joined" : "New York, US"}</small>
              </div>
              <div>
                {member.twoFactor ? (
                  <StatusPill>
                    <ShieldCheck /> Enabled
                  </StatusPill>
                ) : (
                  <StatusPill tone="gold">Required</StatusPill>
                )}
              </div>
              <button
                type="button"
                aria-label={`More actions for ${member.name}`}
                onClick={() => notify(`Opened access controls for ${member.name}`)}
              >
                <MoreHorizontal />
              </button>
            </div>
          ))}
        </div>
        <div className="settings-pagination">
          <span>
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </span>
          <div>
            <button
              type="button"
              aria-label="Previous page"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
            >
              <ChevronLeft />
            </button>
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                className={page === index + 1 ? "active" : ""}
                type="button"
                key={index}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              type="button"
              aria-label="Next page"
              disabled={page === pageCount}
              onClick={() => setPage((current) => current + 1)}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Roles & permissions"
        description="Use roles to keep access consistent as your team grows."
        aside={
          <button className="settings-tertiary-button" type="button" onClick={() => notify("Role editor opened")}>
            <Settings2 /> Manage roles
          </button>
        }
      >
        <div className="settings-role-grid">
          {roleCards.map((role) => (
            <article key={role.title}>
              <span>{role.count}</span>
              <h3>{role.title}</h3>
              <p>{role.detail}</p>
              <button type="button" onClick={() => notify(`${role.title} permissions opened`)}>
                View permissions <ArrowUpRight />
              </button>
            </article>
          ))}
        </div>
      </SettingsCard>

      {inviteOpen ? (
        <TeamInviteDialog
          memberEmails={members.map((member) => member.email)}
          onInvite={invite}
          onOpenChange={setInviteOpen}
        />
      ) : null}
    </div>
  );
}

function BankingSettings({ notify }: { notify: (message: string) => void }) {
  const [schedule, setSchedule] = useState("Daily");
  const [instantPayouts, setInstantPayouts] = useState(true);
  const [reserveAlerts, setReserveAlerts] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="settings-section">
      <SectionHeading
        title="Banking & payouts"
        description="Control where funds settle, when payouts arrive, and who is notified."
        action={
          <button className="settings-primary-button" type="button" onClick={() => setAddOpen(true)}>
            <Plus /> Add bank account
          </button>
        }
      />

      <section className="settings-balance-hero">
        <div>
          <span className="settings-hero-icon">
            <WalletCards />
          </span>
          <div>
            <small>Available to pay out</small>
            <strong>$284,913.20</strong>
            <span>
              <i /> Funds are available
            </span>
          </div>
        </div>
        <div>
          <small>Next automatic payout</small>
          <strong>Tomorrow, 5:00 PM ET</strong>
          <span>Estimated arrival · August 28</span>
        </div>
        <button type="button" onClick={() => notify("Payout request started")}>
          Request payout <ArrowUpRight />
        </button>
      </section>

      <SettingsCard
        title="Settlement accounts"
        description="Verified accounts that can receive payouts from ACRU."
        aside={
          <StatusPill>
            <BadgeCheck /> 2 verified
          </StatusPill>
        }
      >
        <div className="settings-bank-list">
          <article>
            <span className="settings-bank-logo chase">
              <Landmark />
            </span>
            <div>
              <strong>JPMorgan Chase</strong>
              <small>Business checking · •••• 4242</small>
            </div>
            <span>
              <StatusPill tone="blue">Primary</StatusPill>
              <StatusPill>Verified</StatusPill>
            </span>
            <div>
              <small>USD payouts</small>
              <strong>1–2 business days</strong>
            </div>
            <button
              type="button"
              onClick={() => notify("Primary account controls opened")}
              aria-label="Edit JPMorgan Chase"
            >
              <MoreHorizontal />
            </button>
          </article>
          <article>
            <span className="settings-bank-logo wells">
              <Landmark />
            </span>
            <div>
              <strong>Wells Fargo</strong>
              <small>Business checking · •••• 7788</small>
            </div>
            <span>
              <StatusPill>Verified</StatusPill>
            </span>
            <div>
              <small>USD payouts</small>
              <strong>1–2 business days</strong>
            </div>
            <button
              type="button"
              onClick={() => notify("Backup account controls opened")}
              aria-label="Edit Wells Fargo"
            >
              <MoreHorizontal />
            </button>
          </article>
        </div>
      </SettingsCard>

      <div className="settings-two-column">
        <SettingsCard title="Payout schedule" description="Choose how frequently your available balance is sent.">
          <div className="settings-segmented-control">
            {["Daily", "Weekly", "Monthly", "Manual"].map((option) => (
              <button type="button" data-active={schedule === option} key={option} onClick={() => setSchedule(option)}>
                {option}
              </button>
            ))}
          </div>
          <div className="settings-form-stack">
            <label>
              Payout timing
              <Select defaultValue="5pm">
                <option value="5pm">5:00 PM Eastern Time</option>
                <option>9:00 AM Eastern Time</option>
              </Select>
            </label>
            <label>
              Minimum payout amount
              <span className="settings-money-input">
                <b>$</b>
                <input defaultValue="5,000.00" />
              </span>
            </label>
          </div>
          <div className="settings-preference-row compact">
            <div>
              <span className="settings-row-icon">
                <PayoutIcon />
              </span>
              <span>
                <strong>Instant payouts</strong>
                <small>Eligible debit cards can receive funds in minutes for a 1% fee.</small>
              </span>
            </div>
            <SettingsToggle checked={instantPayouts} onChange={setInstantPayouts} label="Instant payouts" />
          </div>
        </SettingsCard>

        <SettingsCard
          title="Reserve & payout protection"
          description="Keep cash-flow changes visible to your finance team."
        >
          <div className="settings-reserve-meter">
            <div>
              <span>Current rolling reserve</span>
              <strong>$41,382.18</strong>
            </div>
            <i>
              <b />
            </i>
            <div>
              <small>7.5% of eligible volume</small>
              <small>Releases Sep 26</small>
            </div>
          </div>
          <div className="settings-preference-row compact">
            <div>
              <span className="settings-row-icon">
                <Bell />
              </span>
              <span>
                <strong>Reserve change alerts</strong>
                <small>Notify finance administrators when held funds change by 10% or more.</small>
              </span>
            </div>
            <SettingsToggle checked={reserveAlerts} onChange={setReserveAlerts} label="Reserve change alerts" />
          </div>
          <div className="settings-payout-contact">
            <span className="settings-avatar green">JL</span>
            <span>
              <small>Primary payout contact</small>
              <strong>Jordan Lee · jordan@northstar.studio</strong>
            </span>
            <button type="button" onClick={() => notify("Payout contact editor opened")}>
              <Pencil />
            </button>
          </div>
        </SettingsCard>
      </div>

      <SettingsCard
        title="Payout configuration"
        description="Details used for statements, reconciliation, and transfer delivery."
      >
        <div className="settings-form-grid two-column">
          <label>
            Settlement currency
            <Select defaultValue="usd">
              <option value="usd">USD — US dollar</option>
              <option>EUR — Euro</option>
              <option>GBP — Pound sterling</option>
            </Select>
          </label>
          <label>
            Statement descriptor
            <input defaultValue="ACRU NORTHSTAR" maxLength={22} />
          </label>
          <label>
            Payout email
            <input defaultValue="finance@northstar.studio" />
          </label>
          <label>
            Failed payout fallback
            <Select defaultValue="pause">
              <option value="pause">Pause and notify finance team</option>
              <option>Retry primary account</option>
              <option>Use backup account</option>
            </Select>
          </label>
        </div>
        <div className="settings-history-line">
          <Clock3 />
          <span>
            <strong>Last changed by Christian Brown</strong>August 18, 2026 at 11:32 AM · Payouts are protected by
            2-step verification.
          </span>
          <button type="button" onClick={() => notify("Payout audit log opened")}>
            View audit log
          </button>
        </div>
      </SettingsCard>
      <SaveBar
        onSave={() => notify("Banking and payout settings saved")}
        text="Sensitive payout changes require 2-step verification and are recorded in your audit log."
      />

      {addOpen ? (
        <BankModal
          onClose={() => setAddOpen(false)}
          onComplete={() => {
            setAddOpen(false);
            notify("Bank verification started");
          }}
        />
      ) : null}
    </div>
  );
}

function BankModal({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  useDismissOnEscape(true, onClose);
  return (
    <div
      className="settings-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        className="settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bank-title"
        onSubmit={(event) => {
          event.preventDefault();
          onComplete();
        }}
      >
        <header>
          <span>
            <Landmark />
          </span>
          <div>
            <h2 id="bank-title">Add a bank account</h2>
            <p>Connect a US bank account for verified payouts.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </header>
        <div className="settings-modal-security">
          <LockKeyhole />
          <span>
            <strong>Bank-grade encryption</strong>Account credentials are encrypted and never visible to ACRU team
            members.
          </span>
        </div>
        <div className="settings-form-grid">
          <label>
            Account holder name
            <input required defaultValue="Northstar Studio LLC" />
          </label>
          <label>
            Routing number
            <input required inputMode="numeric" placeholder="9 digits" />
          </label>
          <label>
            Account number
            <input required inputMode="numeric" placeholder="Enter account number" />
          </label>
          <label>
            Account type
            <Select>
              <option>Business checking</option>
              <option>Business savings</option>
            </Select>
          </label>
        </div>
        <footer>
          <button className="settings-tertiary-button" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="settings-primary-button" type="submit">
            <BadgeCheck /> Verify account
          </button>
        </footer>
      </form>
    </div>
  );
}

function BrandingSettings({ notify }: { notify: (message: string) => void }) {
  const [accent, setAccent] = useState("#4AA6DA");
  const [surface, setSurface] = useState("#222222");
  const [preview, setPreview] = useState("Checkout");
  const [radius, setRadius] = useState("Rounded");

  return (
    <div className="settings-section settings-branding-section">
      <SectionHeading
        title="Branding"
        description="Create a consistent identity across checkout, payment links, invoices, and receipts."
        action={
          <button className="settings-tertiary-button" type="button" onClick={() => notify("Preview link copied")}>
            <Copy /> Copy preview link
          </button>
        }
      />

      <div className="settings-branding-layout">
        <div className="settings-branding-controls">
          <SettingsCard title="Brand assets" description="Use clear, high-resolution SVG or PNG files.">
            <div className="settings-upload-grid">
              <article>
                <div className="settings-logo-preview">NORTHSTAR</div>
                <span>
                  <strong>Primary logo</strong>
                  <small>SVG · 1.2 MB · Updated Aug 12</small>
                </span>
                <button type="button" onClick={() => notify("Logo uploader opened")}>
                  <Upload /> Replace
                </button>
              </article>
              <article>
                <div className="settings-icon-preview">NS</div>
                <span>
                  <strong>Brand mark</strong>
                  <small>PNG · 512 × 512 · Updated Aug 12</small>
                </span>
                <button type="button" onClick={() => notify("Brand mark uploader opened")}>
                  <Upload /> Replace
                </button>
              </article>
            </div>
            <div className="settings-asset-guidance">
              <ImageIcon />
              <span>
                <strong>Asset guidance</strong>Logos should have a transparent background with at least 24 px of clear
                space.
              </span>
              <button type="button" onClick={() => notify("Brand asset guidelines opened")}>
                View guidelines
              </button>
            </div>
          </SettingsCard>

          <SettingsCard
            title="Colors & shape"
            description="These tokens are applied consistently to hosted experiences."
          >
            <div className="settings-color-grid">
              <label>
                Accent color
                <span>
                  <input
                    type="color"
                    value={accent}
                    onChange={(event) => setAccent(event.target.value.toUpperCase())}
                  />
                  <input value={accent} onChange={(event) => setAccent(event.target.value)} />
                </span>
              </label>
              <label>
                Surface color
                <span>
                  <input
                    type="color"
                    value={surface}
                    onChange={(event) => setSurface(event.target.value.toUpperCase())}
                  />
                  <input value={surface} onChange={(event) => setSurface(event.target.value)} />
                </span>
              </label>
            </div>
            <div className="settings-shape-row">
              <span>
                <strong>Corner style</strong>
                <small>Applied to buttons, fields, and checkout cards.</small>
              </span>
              <div className="settings-segmented-control">
                {["Square", "Soft", "Rounded"].map((option) => (
                  <button type="button" data-active={radius === option} key={option} onClick={() => setRadius(option)}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </SettingsCard>

          <SettingsCard title="Business identity" description="Customer-facing details displayed with your brand.">
            <div className="settings-form-grid">
              <label>
                Display name
                <input defaultValue="Northstar Studio" />
              </label>
              <label>
                Support statement
                <input defaultValue="Questions? support@northstar.studio" />
              </label>
              <label>
                Receipt footer
                <textarea defaultValue="Thank you for choosing Northstar Studio. We’re here if you need us." />
              </label>
            </div>
          </SettingsCard>
        </div>

        <aside className="settings-brand-preview-wrap">
          <div className="settings-preview-header">
            <div>
              <span>Live preview</span>
              <small>Updates as you edit</small>
            </div>
            <div className="settings-segmented-control">
              {["Checkout", "Receipt"].map((option) => (
                <button type="button" data-active={preview === option} key={option} onClick={() => setPreview(option)}>
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div
            className="settings-device-preview"
            style={
              {
                "--brand-accent": accent,
                "--brand-surface": surface,
                "--brand-radius": radius === "Square" ? "4px" : radius === "Soft" ? "10px" : "20px"
              } as React.CSSProperties
            }
          >
            <div className="settings-preview-browser">
              <i />
              <i />
              <i />
              <span>pay.northstar.studio</span>
              <LockKeyhole />
            </div>
            {preview === "Checkout" ? (
              <div className="settings-checkout-preview">
                <header>
                  <span className="settings-preview-logo">N</span>
                  <strong>Northstar Studio</strong>
                  <small>Secure checkout</small>
                </header>
                <div className="settings-order-preview">
                  <span>
                    <ImageIcon />
                  </span>
                  <div>
                    <strong>Annual Pro plan</strong>
                    <small>1 × $249.00</small>
                  </div>
                  <strong>$249.00</strong>
                </div>
                <label>
                  Email address
                  <input value="alex@example.com" readOnly />
                </label>
                <label>
                  Card information
                  <div>
                    <CreditCard />
                    <span>4242 4242 4242 4242</span>
                    <small>12/29 · 123</small>
                  </div>
                </label>
                <button type="button" disabled aria-disabled="true">
                  Pay $249.00
                </button>
                <footer>
                  <ShieldCheck /> Secured by ACRU
                </footer>
              </div>
            ) : (
              <div className="settings-receipt-preview">
                <span className="settings-preview-logo">N</span>
                <CheckCircle2 />
                <h3>Payment complete</h3>
                <p>A receipt was sent to alex@example.com</p>
                <div>
                  <span>
                    Amount paid<strong>$249.00 USD</strong>
                  </span>
                  <span>
                    Payment method<strong>Visa •••• 4242</strong>
                  </span>
                  <span>
                    Date<strong>Aug 27, 2026</strong>
                  </span>
                </div>
                <button type="button" disabled aria-disabled="true">
                  Download receipt
                </button>
              </div>
            )}
          </div>
          <p className="settings-preview-note">
            <Eye /> Preview only. Real payment experiences automatically include required disclosures and localization.
          </p>
        </aside>
      </div>
      <SaveBar
        onSave={() => notify("Brand changes published")}
        text="Your published brand is used across every hosted ACRU customer experience."
      />
    </div>
  );
}

function SecuritySettings({ notify }: { notify: (message: string) => void }) {
  const [devices, setDevices] = useState(initialDevices);
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("12 hours");
  const [recoveryOpen, setRecoveryOpen] = useState(false);

  return (
    <div className="settings-section">
      <SectionHeading
        title="Security"
        description="Protect your workspace with strong authentication, trusted devices, and session controls."
        action={
          <StatusPill>
            <ShieldCheck /> Strong protection
          </StatusPill>
        }
      />

      <section className="settings-security-score">
        <div>
          <span>
            <ShieldCheck />
          </span>
          <div>
            <small>Security score</small>
            <strong>92 / 100</strong>
            <p>Your workspace is well protected. Add a security key to reach the highest level.</p>
          </div>
        </div>
        <div>
          <span>4 of 5 recommended protections enabled</span>
          <i>
            <b />
          </i>
          <button type="button" onClick={() => notify("Security recommendations opened")}>
            Review recommendations <ChevronRight />
          </button>
        </div>
      </section>

      <SettingsCard
        title="2-step verification"
        description="Require a second factor when signing in or changing sensitive account details."
        aside={<SettingsToggle checked={twoFactor} onChange={setTwoFactor} label="Require 2-step verification" />}
      >
        <div className="settings-auth-methods">
          <article>
            <span className="settings-auth-icon blue">
              <Smartphone />
            </span>
            <div>
              <strong>Authenticator app</strong>
              <small>Primary method · Added April 18, 2026</small>
            </div>
            <StatusPill>Active</StatusPill>
            <button type="button" onClick={() => notify("Authenticator settings opened")}>
              <ChevronRight />
            </button>
          </article>
          <article>
            <span className="settings-auth-icon purple">
              <Fingerprint />
            </span>
            <div>
              <strong>Passkeys & security keys</strong>
              <small>Use Face ID, Touch ID, or a hardware security key.</small>
            </div>
            <StatusPill tone="blue">1 passkey</StatusPill>
            <button type="button" onClick={() => notify("Passkey setup opened")}>
              <ChevronRight />
            </button>
          </article>
          <article>
            <span className="settings-auth-icon gold">
              <Phone />
            </span>
            <div>
              <strong>SMS backup</strong>
              <small>+1 (212) •••-0187 · Backup only</small>
            </div>
            <StatusPill tone="neutral">Backup</StatusPill>
            <button type="button" onClick={() => notify("SMS backup settings opened")}>
              <ChevronRight />
            </button>
          </article>
          <article>
            <span className="settings-auth-icon green">
              <KeyRound />
            </span>
            <div>
              <strong>Recovery codes</strong>
              <small>10 one-time codes · Generated May 22, 2026</small>
            </div>
            <button className="settings-tertiary-button" type="button" onClick={() => setRecoveryOpen(true)}>
              <Download /> View codes
            </button>
          </article>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Active devices"
        description="Sessions signed in to your ACRU account. Revoke anything you don’t recognize."
        aside={
          <button
            className="settings-tertiary-button danger-text"
            type="button"
            onClick={() => {
              setDevices((current) => current.filter((device) => device.current));
              notify("Other sessions signed out");
            }}
          >
            Sign out other sessions
          </button>
        }
      >
        <div className="settings-device-list">
          {devices.map((device) => {
            const DeviceIcon = device.icon;
            return (
              <article key={device.id}>
                <span>
                  <DeviceIcon />
                </span>
                <div>
                  <strong>
                    {device.name}
                    {device.current ? <StatusPill tone="blue">This device</StatusPill> : null}
                  </strong>
                  <small>{device.browser}</small>
                </div>
                <div>
                  <strong>
                    <MapPin /> {device.location}
                  </strong>
                  <small>{device.activity}</small>
                </div>
                {device.current ? (
                  <StatusPill>Protected</StatusPill>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setDevices((current) => current.filter((item) => item.id !== device.id));
                      notify(`${device.name} signed out`);
                    }}
                  >
                    Revoke
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </SettingsCard>

      <div className="settings-two-column">
        <SettingsCard title="Session policy" description="Apply these controls to every team member.">
          <div className="settings-form-stack">
            <label>
              Automatic sign-out
              <Select value={sessionTimeout} onChange={(event) => setSessionTimeout(event.target.value)}>
                <option>4 hours</option>
                <option>12 hours</option>
                <option>24 hours</option>
                <option>7 days</option>
              </Select>
            </label>
            <label>
              Reauthentication for payouts
              <Select defaultValue="always">
                <option value="always">Always require 2-step verification</option>
                <option>Once per session</option>
              </Select>
            </label>
          </div>
          <div className="settings-preference-row compact">
            <div>
              <span className="settings-row-icon">
                <Bell />
              </span>
              <span>
                <strong>New sign-in alerts</strong>
                <small>Email the account owner when a new browser or device signs in.</small>
              </span>
            </div>
            <SettingsToggle checked={loginAlerts} onChange={setLoginAlerts} label="New sign-in alerts" />
          </div>
        </SettingsCard>
        <SettingsCard title="Password & sign-in" description="Credentials and federated identity controls.">
          <button className="settings-action-row" type="button" onClick={() => notify("Password change flow opened")}>
            <span>
              <LockKeyhole />
            </span>
            <span>
              <strong>Change password</strong>
              <small>Last changed 42 days ago</small>
            </span>
            <ChevronRight />
          </button>
          <button className="settings-action-row" type="button" onClick={() => notify("Single sign-on setup opened")}>
            <span>
              <Globe2 />
            </span>
            <span>
              <strong>Single sign-on (SSO)</strong>
              <small>Configure SAML 2.0 for your organization</small>
            </span>
            <StatusPill tone="neutral">Not configured</StatusPill>
            <ChevronRight />
          </button>
          <button className="settings-action-row" type="button" onClick={() => notify("Domain verification opened")}>
            <span>
              <BadgeCheck />
            </span>
            <span>
              <strong>Verified domains</strong>
              <small>northstar.studio</small>
            </span>
            <StatusPill>Verified</StatusPill>
            <ChevronRight />
          </button>
        </SettingsCard>
      </div>

      <SettingsCard
        title="Recent security activity"
        description="Security-sensitive events from the last 30 days."
        aside={
          <button
            className="settings-tertiary-button"
            type="button"
            onClick={() => notify("Security audit log opened")}
          >
            <Activity /> View full audit log
          </button>
        }
      >
        <div className="settings-security-timeline">
          <article>
            <span>
              <Check />
            </span>
            <div>
              <strong>Passkey used to sign in</strong>
              <small>Chrome on MacBook Pro · New York, United States</small>
            </div>
            <time>Today, 9:14 AM</time>
          </article>
          <article>
            <span>
              <ShieldEllipsis />
            </span>
            <div>
              <strong>Payout settings changed</strong>
              <small>2-step verification completed by Christian Brown</small>
            </div>
            <time>Aug 18, 11:32 AM</time>
          </article>
          <article>
            <span>
              <KeyRound />
            </span>
            <div>
              <strong>API key rotated</strong>
              <small>Production payments key · Changed by Maya Patel</small>
            </div>
            <time>Aug 12, 2:06 PM</time>
          </article>
        </div>
      </SettingsCard>

      <SaveBar
        onSave={() => notify("Security policy saved")}
        text="Security changes are recorded and may sign members out when applied."
      />
      {recoveryOpen ? <RecoveryCodes onClose={() => setRecoveryOpen(false)} notify={notify} /> : null}
    </div>
  );
}

function RecoveryCodes({ onClose, notify }: { onClose: () => void; notify: (message: string) => void }) {
  useDismissOnEscape(true, onClose);
  const codes = [
    "NSTR-8K4P-7Q2M",
    "NSTR-3T9X-5L6D",
    "NSTR-2V7R-4C8J",
    "NSTR-9A6N-1F3W",
    "NSTR-5H2B-8Y7E",
    "NSTR-6M4Q-9P2K"
  ];
  return (
    <div className="settings-modal-backdrop" role="presentation">
      <section className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="recovery-title">
        <header>
          <span>
            <KeyRound />
          </span>
          <div>
            <h2 id="recovery-title">Recovery codes</h2>
            <p>Store these somewhere safe. Each code works once.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </header>
        <div className="settings-recovery-warning">
          <AlertTriangle />
          <span>
            <strong>Keep these private</strong>Anyone with a recovery code can access your account.
          </span>
        </div>
        <div className="settings-recovery-codes">
          {codes.map((code) => (
            <code key={code}>{code}</code>
          ))}
        </div>
        <footer>
          <button
            className="settings-tertiary-button"
            type="button"
            onClick={() => notify("Recovery codes downloaded")}
          >
            <Download /> Download
          </button>
          <button
            className="settings-primary-button"
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(codes.join("\n"));
              notify("Recovery codes copied");
            }}
          >
            <Copy /> Copy codes
          </button>
        </footer>
      </section>
    </div>
  );
}

function NotificationSettings({ notify }: { notify: (message: string) => void }) {
  const [preferences, setPreferences] = useState(initialNotificationPreferences);
  const [digest, setDigest] = useState("Weekly");
  const [quietHours, setQuietHours] = useState(true);
  const [webhook, setWebhook] = useState(false);

  function toggle(id: string, channel: Channel) {
    setPreferences((current) => ({ ...current, [id]: { ...current[id], [channel]: !current[id][channel] } }));
  }

  return (
    <div className="settings-section">
      <SectionHeading
        title="Notifications"
        description="Choose what your team hears about, where alerts are delivered, and when summaries arrive."
        action={
          <button
            className="settings-tertiary-button"
            type="button"
            onClick={() => {
              setPreferences(initialNotificationPreferences);
              notify("Notification defaults restored");
            }}
          >
            <RotateCcw /> Restore defaults
          </button>
        }
      />

      <section className="settings-notification-channels">
        <article>
          <span className="blue">
            <Mail />
          </span>
          <div>
            <small>Email channel</small>
            <strong>finance@northstar.studio</strong>
            <StatusPill>Verified</StatusPill>
          </div>
          <button type="button" onClick={() => notify("Email routing editor opened")}>
            <Pencil />
          </button>
        </article>
        <article>
          <span className="purple">
            <Smartphone />
          </span>
          <div>
            <small>SMS channel</small>
            <strong>+1 (212) •••-0187</strong>
            <StatusPill>Verified</StatusPill>
          </div>
          <button type="button" onClick={() => notify("SMS routing editor opened")}>
            <Pencil />
          </button>
        </article>
        <article>
          <span className="green">
            <Bell />
          </span>
          <div>
            <small>In-app</small>
            <strong>All administrators</strong>
            <StatusPill tone="blue">Enabled</StatusPill>
          </div>
          <button type="button" onClick={() => notify("In-app routing editor opened")}>
            <Pencil />
          </button>
        </article>
      </section>

      <SettingsCard title="Event notifications" description="Security-critical alerts cannot be fully disabled.">
        <div className="settings-notification-matrix">
          <div className="settings-notification-matrix-head">
            <span>Event</span>
            <span>
              <Mail /> Email
            </span>
            <span>
              <Bell /> In-app
            </span>
            <span>
              <MessageSquareText /> SMS
            </span>
          </div>
          {notificationRows.map((row) => {
            const RowIcon = row.icon;
            return (
              <div className="settings-notification-matrix-row" key={row.id}>
                <div>
                  <span className="settings-row-icon">
                    <RowIcon />
                  </span>
                  <span>
                    <strong>{row.title}</strong>
                    <small>{row.detail}</small>
                  </span>
                </div>
                {(["email", "inApp", "sms"] as Channel[]).map((channel) => (
                  <div key={channel}>
                    <SettingsToggle
                      checked={preferences[row.id][channel]}
                      onChange={() => toggle(row.id, channel)}
                      label={`${row.title} ${channel}`}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </SettingsCard>

      <div className="settings-two-column">
        <SettingsCard title="Digest & summaries" description="Get the signal without every individual event.">
          <div className="settings-form-stack">
            <label>
              Performance digest
              <Select value={digest} onChange={(event) => setDigest(event.target.value)}>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Never</option>
              </Select>
            </label>
            <label>
              Delivery time
              <Select defaultValue="monday">
                <option value="monday">Monday at 9:00 AM ET</option>
                <option>Friday at 4:00 PM ET</option>
              </Select>
            </label>
          </div>
          <div className="settings-digest-preview">
            <CalendarClock />
            <span>
              <strong>Next digest</strong>Monday, August 31 at 9:00 AM ET
            </span>
            <button type="button" onClick={() => notify("Preview digest sent")}>
              Send preview
            </button>
          </div>
        </SettingsCard>
        <SettingsCard title="Quiet hours" description="Pause non-critical messages while your team is offline.">
          <div className="settings-preference-row">
            <div>
              <span className="settings-row-icon">
                <Clock3 />
              </span>
              <span>
                <strong>Enable quiet hours</strong>
                <small>Critical security and payout alerts are always delivered.</small>
              </span>
            </div>
            <SettingsToggle checked={quietHours} onChange={setQuietHours} label="Enable quiet hours" />
          </div>
          {quietHours ? (
            <div className="settings-form-grid two-column settings-spaced-grid">
              <label>
                From
                <Select defaultValue="8pm">
                  <option value="8pm">8:00 PM</option>
                  <option>10:00 PM</option>
                </Select>
              </label>
              <label>
                Until
                <Select defaultValue="8am">
                  <option value="8am">8:00 AM</option>
                  <option>7:00 AM</option>
                </Select>
              </label>
              <label className="settings-wide-field">
                Time zone
                <Select defaultValue="et">
                  <option value="et">America/New_York (ET)</option>
                  <option>America/Los_Angeles (PT)</option>
                </Select>
              </label>
            </div>
          ) : null}
        </SettingsCard>
      </div>

      <SettingsCard
        title="Advanced routing"
        description="Send operational events to shared channels and automated systems."
      >
        <div className="settings-advanced-routing">
          <article>
            <span className="settings-auth-icon purple">
              <Webhook />
            </span>
            <div>
              <strong>Notification webhook</strong>
              <small>Send signed JSON events to your incident or operations platform.</small>
            </div>
            <SettingsToggle checked={webhook} onChange={setWebhook} label="Notification webhook" />
          </article>
          {webhook ? (
            <div className="settings-form-grid two-column">
              <label>
                Endpoint URL
                <input defaultValue="https://ops.northstar.studio/acru-events" />
              </label>
              <label>
                Signing secret
                <span className="settings-secure-input">
                  <input value="whsec_••••••••••••8f31" readOnly />
                  <LockKeyhole />
                </span>
              </label>
            </div>
          ) : null}
          <article>
            <span className="settings-auth-icon blue">
              <Users />
            </span>
            <div>
              <strong>Team routing rules</strong>
              <small>Finance receives payouts; developers receive API and webhook alerts.</small>
            </div>
            <button
              className="settings-tertiary-button"
              type="button"
              onClick={() => notify("Team routing editor opened")}
            >
              Configure routing
            </button>
          </article>
        </div>
      </SettingsCard>
      <SaveBar onSave={() => notify("Notification preferences saved")} />
    </div>
  );
}

export function SettingsWorkspace({ section }: { section: SettingsSection }) {
  const settingsResource = useListCollection(settingsSnapshotAdapter);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (settingsResource.status !== "ready") {
    return (
      <CollectionPageState
        description="Manage business, team, payout, brand, security, and notification preferences."
        error={settingsResource.error}
        onRetry={settingsResource.retry}
        status={settingsResource.status}
        title="Settings"
      />
    );
  }

  return (
    <div className="settings-workspace">
      <main className="settings-detail" aria-label="Workspace settings">
        {section === "business" ? <BusinessSettings notify={setToast} /> : null}
        {section === "team" ? <TeamSettings notify={setToast} /> : null}
        {section === "banking-payouts" ? <BankingSettings notify={setToast} /> : null}
        {section === "branding" ? <BrandingSettings notify={setToast} /> : null}
        {section === "security" ? <SecuritySettings notify={setToast} /> : null}
        {section === "notifications" ? <NotificationSettings notify={setToast} /> : null}
      </main>

      {toast ? (
        <div className="settings-toast" role="status">
          <CheckCircle2 /> {toast}
        </div>
      ) : null}
    </div>
  );
}
