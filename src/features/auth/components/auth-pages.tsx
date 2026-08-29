"use client";

import {
  ArrowRightIcon as ArrowRight,
  CheckIcon as Check,
  EmailIcon as Mail,
  HideIcon as EyeOff,
  LockIcon as LockKeyhole,
  ViewIcon as Eye
} from "@shopify/polaris-icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { ACRU_PENDING_EMAIL_KEY, ACRU_PENDING_PORTAL_KEY, destinationForSession, saveSession } from "@/lib/auth/client";
import {
  confirmationPathForPortal,
  destinationForPortal,
  forgotPasswordPathForPortal,
  portalFromValue,
  portalLabels,
  signInPathForPortal,
  signUpPathForPortal
} from "@/lib/portal";
import type { AcruPortal } from "@/lib/portal";

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.39-.19-2.04H12v3.86h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.23c1.89-1.74 2.98-4.31 2.98-7.35Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.89 6.62-2.42l-3.23-2.51c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H3.08v2.59A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.91A6 6 0 0 1 6.1 12c0-.66.11-1.3.31-1.91V7.5H3.08A10 10 0 0 0 2 12c0 1.61.39 3.14 1.08 4.5l3.33-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.97c1.47 0 2.79.51 3.83 1.5l2.87-2.88A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.92 5.5l3.33 2.59C7.2 7.73 9.4 5.97 12 5.97Z"
      />
    </svg>
  );
}

const portalAuthCopy: Record<
  AcruPortal,
  { signInTitle: string; signInBody: string; signUpTitle: string; signUpBody: string; newLabel: string }
> = {
  merchant: {
    signInTitle: "Sign in to Acru",
    signInBody: "Access your payments workspace securely.",
    signUpTitle: "Get started with Acru",
    signUpBody: "One secure account for payments, risk, and settlement.",
    newLabel: "New to Acru?"
  },
  sandbox: {
    signInTitle: "Sign in to the API sandbox",
    signInBody: "Test direct API connections in an isolated environment.",
    signUpTitle: "Create a sandbox account",
    signUpBody: "Build and validate your Acru integration with test data.",
    newLabel: "Need sandbox access?"
  },
  partner: {
    signInTitle: "Sign in to Acru Partners",
    signInBody: "Manage referred accounts, clients, and partner activity.",
    signUpTitle: "Join Acru Partners",
    signUpBody: "Create your partner account and start managing referrals.",
    newLabel: "New to Acru Partners?"
  },
  admin: {
    signInTitle: "Sign in to Acru Admin",
    signInBody: "Review merchants, risk, pricing, payouts, and platform operations.",
    signUpTitle: "Create an Acru admin account",
    signUpBody: "Administrator access is limited to approved Acru team members.",
    newLabel: "Need administrator access?"
  }
};

function AuthFrame({ children, portal }: { children: React.ReactNode; portal: AcruPortal }) {
  return (
    <main className="auth-page">
      <Link className="auth-brand" href={destinationForPortal(portal)} aria-label={`${portalLabels[portal]} home`}>
        <Image src="/acru-logo.png" width={46} height={39} alt="ACRU" priority />
      </Link>
      <section className="auth-panel">{children}</section>
      <footer className="auth-footer">
        <span>
          © {new Date().getFullYear()} {portalLabels[portal]}
        </span>
        <Link href="#">Privacy</Link>
        <Link href="#">Terms</Link>
      </footer>
    </main>
  );
}

function SocialButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button className="auth-google" type="button" onClick={onClick}>
      <GoogleMark />
      <span>{label}</span>
    </button>
  );
}

function PasswordInput({
  value,
  onChange,
  autoFocus = false
}: {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="auth-password-wrap">
      <input
        autoFocus={autoFocus}
        autoComplete="current-password"
        minLength={8}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter your password"
        required
        type={visible ? "text" : "password"}
        value={value}
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? <EyeOff /> : <Eye />}
      </button>
    </div>
  );
}

export function SignInPage({ portal = "merchant" }: { portal?: AcruPortal }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const copy = portalAuthCopy[portal];

  function continueWithGoogle() {
    saveSession({
      email: "founder@acru.dev",
      name: "Acru Founder",
      portal,
      provider: "google",
      verified: true
    });
    router.push(destinationForSession(portal));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => {
      saveSession({ email, portal, provider: "email", verified: true });
      router.push(destinationForSession(portal));
    }, 420);
  }

  return (
    <AuthFrame portal={portal}>
      <header className="auth-heading">
        <h1>{copy.signInTitle}</h1>
        <p>{copy.signInBody}</p>
      </header>
      <SocialButton onClick={continueWithGoogle} label="Continue with Google" />
      <div className="auth-divider">
        <span>or continue with email</span>
      </div>
      <form className="auth-form" onSubmit={submit}>
        <label>
          <span>Email address</span>
          <input
            autoComplete="email"
            inputMode="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            required
            type="email"
            value={email}
          />
        </label>
        <label>
          <span className="auth-label-row">
            <span>Password</span>
            <Link href={forgotPasswordPathForPortal(portal)}>Forgot password?</Link>
          </span>
          <PasswordInput value={password} onChange={setPassword} />
        </label>
        <button className="auth-primary" disabled={submitting} type="submit">
          <span>{submitting ? "Signing in…" : "Sign in"}</span>
          {submitting ? <i className="auth-spinner" /> : null}
        </button>
      </form>
      <p className="auth-switch">
        {copy.newLabel} <Link href={signUpPathForPortal(portal)}>Create an account</Link>
      </p>
    </AuthFrame>
  );
}

const passwordRecoveryTitles: Record<AcruPortal, string> = {
  merchant: "Reset your password",
  sandbox: "Recover sandbox access",
  partner: "Reset your partner password",
  admin: "Reset your admin password"
};

export function ForgotPasswordPage({ portal = "merchant" }: { portal?: AcruPortal }) {
  const [email, setEmail] = useState("");
  const [deliveredEmail, setDeliveredEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const emailReady = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()), [email]);

  useEffect(() => {
    if (status === "sent") successHeading.current?.focus();
  }, [status]);

  function sendResetLink(event?: FormEvent) {
    event?.preventDefault();
    if (!emailReady || status === "submitting") return;

    setStatus("submitting");
    window.setTimeout(() => {
      setDeliveredEmail(email.trim().toLowerCase());
      setStatus("sent");
    }, 480);
  }

  function resend() {
    if (resending) return;
    setResending(true);
    window.setTimeout(() => {
      setResent(true);
      setResending(false);
    }, 420);
  }

  if (status === "sent") {
    return (
      <AuthFrame portal={portal}>
        <div className="auth-confirm-icon auth-recovery-icon">
          <Mail />
        </div>
        <header className="auth-heading auth-confirm-heading">
          <span className="auth-kicker">Password recovery</span>
          <h1 ref={successHeading} tabIndex={-1}>
            Check your email
          </h1>
          <p>
            If an account exists for <strong>{deliveredEmail}</strong>, we’ve sent a secure password reset link.
          </p>
        </header>
        <div className="auth-recovery-note" role="status" aria-live="polite">
          <LockKeyhole />
          <p>
            <strong>{resent ? "A new link is on its way." : "The link expires in 30 minutes."}</strong>
            <span>Check your spam folder if it doesn’t arrive within a few minutes.</span>
          </p>
        </div>
        <button className="auth-secondary" disabled={resending} type="button" onClick={resend}>
          {resending ? "Sending again…" : "Resend email"}
        </button>
        <p className="auth-switch auth-recovery-switch">
          <Link href={signInPathForPortal(portal)}>Back to sign in</Link>
        </p>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame portal={portal}>
      <div className="auth-confirm-icon auth-recovery-icon">
        <LockKeyhole />
      </div>
      <header className="auth-heading auth-confirm-heading">
        <span className="auth-kicker">Password recovery</span>
        <h1>{passwordRecoveryTitles[portal]}</h1>
        <p>Enter the work email associated with your account and we’ll send you a secure reset link.</p>
      </header>
      <form className="auth-form" onSubmit={sendResetLink}>
        <label>
          <span>Email address</span>
          <input
            autoComplete="email"
            autoFocus
            inputMode="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            required
            type="email"
            value={email}
          />
        </label>
        <button className="auth-primary" disabled={!emailReady || status === "submitting"} type="submit">
          <span>{status === "submitting" ? "Sending secure link…" : "Send reset link"}</span>
          {status === "submitting" ? <i className="auth-spinner" /> : null}
        </button>
      </form>
      <div className="auth-recovery-privacy">
        <LockKeyhole />
        <p>For security, we’ll show the same confirmation whether or not the email is registered.</p>
      </div>
      <p className="auth-switch auth-recovery-switch">
        Remembered your password? <Link href={signInPathForPortal(portal)}>Back to sign in</Link>
      </p>
    </AuthFrame>
  );
}

export function SignUpPage({ portal = "merchant" }: { portal?: AcruPortal }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const emailReady = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()), [email]);
  const copy = portalAuthCopy[portal];

  function continueWithGoogle() {
    saveSession({
      email: "founder@acru.dev",
      name: "Acru Founder",
      portal,
      provider: "google",
      verified: true
    });
    router.push(destinationForPortal(portal));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!emailReady || password.length < 8) return;
    setSubmitting(true);
    window.localStorage.setItem(ACRU_PENDING_EMAIL_KEY, email.trim().toLowerCase());
    window.localStorage.setItem(ACRU_PENDING_PORTAL_KEY, portal);
    window.setTimeout(() => router.push(confirmationPathForPortal(portal)), 480);
  }

  return (
    <AuthFrame portal={portal}>
      <header className="auth-heading">
        <h1>{copy.signUpTitle}</h1>
        <p>{copy.signUpBody}</p>
      </header>
      <SocialButton onClick={continueWithGoogle} label="Sign up with Google" />
      <div className="auth-divider">
        <span>or use your work email</span>
      </div>
      <form className="auth-form" onSubmit={submit}>
        <label>
          <span>Email address</span>
          <input
            autoComplete="email"
            autoFocus
            inputMode="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            required
            type="email"
            value={email}
          />
        </label>
        <div className="auth-progressive-field" data-visible={emailReady} aria-hidden={!emailReady}>
          <label>
            <span>Create a password</span>
            <PasswordInput autoFocus={emailReady} value={password} onChange={setPassword} />
            <small className={password.length >= 8 ? "valid" : ""}>
              <Check /> At least 8 characters
            </small>
          </label>
        </div>
        <button className="auth-primary" disabled={!emailReady || password.length < 8 || submitting} type="submit">
          <span>{submitting ? "Creating account…" : "Create account"}</span>
          {!submitting ? <ArrowRight /> : <i className="auth-spinner" />}
        </button>
      </form>
      <p className="auth-legal">
        By continuing, you agree to Acru’s <Link href="#">Terms</Link> and <Link href="#">Privacy Policy</Link>.
      </p>
      <p className="auth-switch">
        Already have an account? <Link href={signInPathForPortal(portal)}>Sign in</Link>
      </p>
    </AuthFrame>
  );
}

export function ConfirmEmailPage({ portal = "merchant" }: { portal?: AcruPortal }) {
  const router = useRouter();
  const [email, setEmail] = useState("your inbox");
  const [resent, setResent] = useState(false);
  const [effectivePortal, setEffectivePortal] = useState(portal);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setEmail(window.localStorage.getItem(ACRU_PENDING_EMAIL_KEY) || "your inbox");
      setEffectivePortal(portalFromValue(window.localStorage.getItem(ACRU_PENDING_PORTAL_KEY) || portal));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [portal]);

  function confirm() {
    saveSession({ email, portal: effectivePortal, provider: "email", verified: true });
    window.localStorage.removeItem(ACRU_PENDING_EMAIL_KEY);
    window.localStorage.removeItem(ACRU_PENDING_PORTAL_KEY);
    router.push(destinationForPortal(effectivePortal));
  }

  return (
    <AuthFrame portal={effectivePortal}>
      <div className="auth-confirm-icon">
        <Mail />
      </div>
      <header className="auth-heading auth-confirm-heading">
        <span className="auth-kicker">One last step</span>
        <h1>Confirm your email</h1>
        <p>
          We sent a secure confirmation link to <strong>{email}</strong>.
        </p>
      </header>
      <div className="auth-confirm-card">
        <span>
          <LockKeyhole />
        </span>
        <p>
          <strong>Your link expires in 30 minutes.</strong>
          <br />
          Open it on this device to continue into your Acru workspace.
        </p>
      </div>
      <button className="auth-primary" type="button" onClick={confirm}>
        <span>I’ve confirmed my email</span>
        <ArrowRight />
      </button>
      <p className="auth-switch">
        Didn’t get it?{" "}
        <button type="button" onClick={() => setResent(true)}>
          {resent ? "Email sent" : "Resend email"}
        </button>
      </p>
    </AuthFrame>
  );
}
