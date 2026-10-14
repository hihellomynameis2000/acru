"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { demoBusinessTypes, demoRequestSchema, demoVolumes } from "../data/demo-request";

export function DemoRequestForm() {
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [received, setReceived] = useState(false);
  const [bookingUrl, setBookingUrl] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setNotice("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = demoRequestSchema.safeParse({ ...values, contactConsent: values.contactConsent === "on" });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] ??= issue.message;
      setErrors(next);
      form.current?.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data)
      });
      const result = await response.json();
      if (!response.ok || result.accepted !== true) {
        setNotice(
          response.status === 503
            ? "Demo scheduling is not connected yet. You can reach our team at sales@acru.com."
            : "We couldn’t send your request. Your details are still here—please try again or email sales@acru.com."
        );
        return;
      }
      setBookingUrl(result.bookingUrl ?? null);
      setReceived(true);
    } catch {
      setNotice("We couldn’t connect. Please try again, or email sales@acru.com. Your details have not been cleared.");
    } finally {
      setPending(false);
    }
  }

  if (received)
    return (
      <div className="demo-received" role="status" aria-live="polite">
        <span className="demo-received-mark">
          <Check aria-hidden="true" />
        </span>
        <h2>{bookingUrl ? "Let’s find a time." : "Thank you for reaching out."}</h2>
        <p>
          {bookingUrl
            ? "Your details are with our team. Choose a time for your conversation with Acru."
            : "Your request has been received. Our team will email you to arrange a conversation about your business."}
        </p>
        {bookingUrl ? (
          <a href={bookingUrl} className="demo-book-link" target="_blank" rel="noopener noreferrer">
            Choose a time <ArrowRight aria-hidden="true" />
          </a>
        ) : (
          <Link href="/">
            Back to Acru <ArrowRight aria-hidden="true" />
          </Link>
        )}
      </div>
    );

  const errorProps = (name: string) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `demo-error-${name}` : undefined
  });
  const error = (name: string) => (errors[name] ? <span id={`demo-error-${name}`}>{errors[name]}</span> : undefined);
  return (
    <form ref={form} className="demo-form" onSubmit={submit} noValidate>
      <div className="demo-form-intro">
        <h2>Request a demo</h2>
        <p>Tell us a little about your business.</p>
      </div>
      <fieldset disabled={pending}>
        <legend className="ui-sr-only">Your contact and business details</legend>
        <div className="demo-form-grid">
          <Field label="First name" error={error("firstName")}>
            <Input name="firstName" autoComplete="given-name" required maxLength={120} {...errorProps("firstName")} />
          </Field>
          <Field label="Last name" error={error("lastName")}>
            <Input name="lastName" autoComplete="family-name" required maxLength={120} {...errorProps("lastName")} />
          </Field>
          <Field label="Work email" className="demo-field-full" error={error("email")}>
            <Input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              placeholder="you@company.com"
              {...errorProps("email")}
            />
          </Field>
          <Field label="Company name" error={error("company")}>
            <Input name="company" autoComplete="organization" required maxLength={120} {...errorProps("company")} />
          </Field>
          <Field label="Company website" optional error={error("website")}>
            <Input
              name="website"
              autoComplete="url"
              maxLength={300}
              placeholder="company.com"
              {...errorProps("website")}
            />
          </Field>
          <Field label="Country / region" error={error("country")}>
            <Input name="country" autoComplete="country-name" required maxLength={120} {...errorProps("country")} />
          </Field>
          <Field label="Business type" error={error("businessType")}>
            <Select name="businessType" defaultValue="" required {...errorProps("businessType")}>
              <option value="" disabled>
                Select type
              </option>
              {demoBusinessTypes.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Monthly payment volume (USD)" className="demo-field-full" error={error("volume")}>
            <Select name="volume" defaultValue="" required {...errorProps("volume")}>
              <option value="" disabled>
                Select volume
              </option>
              {demoVolumes.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="What would you like to build?" className="demo-field-full" optional error={error("message")}>
            <Textarea
              name="message"
              maxLength={1500}
              rows={3}
              placeholder="A little context helps us tailor the conversation."
              {...errorProps("message")}
            />
          </Field>
        </div>
        <div className="demo-honeypot" aria-hidden="true">
          <label>
            Fax
            <Input name="companyFax" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <label className="demo-consent">
          <input name="contactConsent" type="checkbox" required {...errorProps("contactConsent")} />
          <span>
            Acru may contact me about this request. Read our <Link href="/legal/privacy">Privacy Policy</Link>.
          </span>
        </label>
        {errors.contactConsent && (
          <p className="demo-field-error" id="demo-error-contactConsent" role="alert">
            {errors.contactConsent}
          </p>
        )}
      </fieldset>
      {notice && (
        <p className="demo-submit-notice" role="alert">
          {notice}
        </p>
      )}
      <Button className="demo-submit" variant="primary" type="submit" loading={pending} loadingLabel="Sending request">
        Request a demo <ArrowRight aria-hidden="true" />
      </Button>
      <p className="demo-form-footnote">
        Already using Acru? <a href="mailto:support@acru.com">Contact support</a>.
      </p>
    </form>
  );
}
