"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, Check, ChevronDown, ChevronRight, Copy, Info, Search } from "lucide-react";
import {
  docContent,
  docsNav,
  integrationSpecification,
  type CodeLanguage,
  type DocTopic
} from "../data/integration-documentation";

const languages: CodeLanguage[] = ["cURL", "JavaScript", "Python"];

export function DocumentationPage({ initialTopic = "quickstart" }: { initialTopic?: DocTopic }) {
  const [topic, setTopic] = useState<DocTopic>(initialTopic);
  const [language, setLanguage] = useState<CodeLanguage>("cURL");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const active = docContent[topic];
  const matchingTopics = docsNav
    .flatMap((group) => group.items)
    .filter((item) =>
      `${item.label} ${docContent[item.id].description}`.toLowerCase().includes(query.trim().toLowerCase())
    );

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function selectTopic(next: DocTopic) {
    setTopic(next);
    setQuery("");
    setMobileNavigationOpen(false);
    requestAnimationFrame(() => articleRef.current?.focus({ preventScroll: false }));
  }

  async function copy(value: string, message: string) {
    try {
      await navigator.clipboard.writeText(value);
      setToast(message);
    } catch {
      setToast("Copy is unavailable. Select the code to copy it manually.");
    }
  }

  return (
    <div className="developer-workspace docs-workspace docs-site" data-theme="dark">
      <a className="docs-skip-link" href="#documentation-content">
        Skip to documentation
      </a>
      <header className="docs-site-header">
        <div className="docs-site-brand">
          <Link className="docs-brand-mark" href="/" aria-label="Acru home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/marketing/acru-wordmark.png" width="660" height="323" alt="Acru" />
          </Link>
          <Link className="docs-site-brand-label" href="/developers/documentation" aria-current="page">
            Developers
          </Link>
        </div>
        <nav className="docs-site-links" aria-label="Developer site navigation">
          <Link className="docs-home-link" href="/">
            Back to Acru
          </Link>
          <Link className="developer-secondary-button" href="/demo">
            Talk to Acru <ArrowRight aria-hidden="true" />
          </Link>
        </nav>
      </header>
      <main className="docs-shell" id="documentation-content" tabIndex={-1}>
        <aside className="docs-navigation-rail" aria-label="Documentation topics">
          <button
            className="docs-mobile-toggle"
            type="button"
            aria-expanded={mobileNavigationOpen}
            aria-controls="docs-topic-navigation"
            onClick={() => setMobileNavigationOpen(!mobileNavigationOpen)}
          >
            <BookOpen aria-hidden="true" /> Browse documentation <ChevronDown aria-hidden="true" />
          </button>
          <nav className="docs-navigation" id="docs-topic-navigation" data-open={mobileNavigationOpen}>
            <label>
              <Search aria-hidden="true" />
              <input
                aria-label="Search documentation"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search documentation"
                type="search"
                value={query}
              />
            </label>
            {query ? (
              <div className="docs-search-results">
                <span role="status">{matchingTopics.length} results</span>
                {matchingTopics.map((item) => (
                  <button key={item.id} onClick={() => selectTopic(item.id)} type="button">
                    <span>
                      <b>{item.label}</b>
                      <small>{docContent[item.id].description}</small>
                    </span>
                  </button>
                ))}
                {!matchingTopics.length && <p>No matching documentation.</p>}
              </div>
            ) : (
              docsNav.map((group) => (
                <section key={group.group}>
                  <h2>{group.group}</h2>
                  {group.items.map((item) => (
                    <button
                      aria-current={topic === item.id ? "page" : undefined}
                      className={topic === item.id ? "active" : ""}
                      key={item.id}
                      onClick={() => selectTopic(item.id)}
                      type="button"
                    >
                      {item.label}
                    </button>
                  ))}
                </section>
              ))
            )}
          </nav>
        </aside>

        <article className="docs-article" ref={articleRef} tabIndex={-1} aria-label={active.title}>
          <div className="docs-breadcrumb">
            <BookOpen aria-hidden="true" /> Documentation <ChevronRight aria-hidden="true" /> {active.title}
          </div>
          <header>
            <span className="docs-availability">{integrationSpecification.status}</span>
            <h1>{active.title}</h1>
            <p>{active.description}</p>
          </header>
          <div className="docs-callout">
            <Info aria-hidden="true" />
            <p>
              <strong>API specification, not a live service yet.</strong> This is the contract Acru is building.
              Examples become usable once the backend is implemented and integration access is provisioned.
            </p>
          </div>
          {active.endpoint && (
            <div className="docs-endpoint">
              <code>{active.endpoint.method}</code>
              <code>{active.endpoint.path}</code>
              <button
                aria-label="Copy endpoint path"
                onClick={() => void copy(active.endpoint!.path, "Endpoint path copied")}
                type="button"
              >
                <Copy aria-hidden="true" />
              </button>
            </div>
          )}
          {active.sections.map((section) => (
            <section className="docs-section" id={section.id} key={`${topic}-${section.id}`}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.items && (
                <ul className="docs-requirements">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.fields && (
                <dl className="docs-fields">
                  {section.fields.map((field) => (
                    <div key={field.name}>
                      <dt>{field.name}</dt>
                      <dd>{field.detail}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {section.example && (
                <>
                  <div className="docs-code-shell">
                    <header>
                      <div role="group" aria-label="Code language">
                        {languages.map((item) => (
                          <button
                            aria-pressed={language === item}
                            className={language === item ? "active" : ""}
                            key={item}
                            onClick={() => setLanguage(item)}
                            type="button"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                      <button
                        aria-label="Copy code example"
                        onClick={() => void copy(section.example!.samples[language], "Code example copied")}
                        type="button"
                      >
                        <Copy aria-hidden="true" />
                        <span>Copy</span>
                      </button>
                    </header>
                    <pre tabIndex={0} aria-label={`${language} request example`}>
                      <code>{section.example.samples[language]}</code>
                    </pre>
                  </div>
                  <div className="docs-response-example">
                    <span>{section.example.status}</span>
                    <pre tabIndex={0} aria-label="Example response">
                      <code>{section.example.response}</code>
                    </pre>
                  </div>
                  <p className="docs-example-note">{section.example.note}</p>
                </>
              )}
            </section>
          ))}
          <footer className="docs-next">
            <div>
              <h2>Connect your real payment flow</h2>
              <p>Confirm the live API contract and access with Acru.</p>
            </div>
            <Link href="/demo">
              Talk to Acru <ArrowRight aria-hidden="true" />
            </Link>
          </footer>
        </article>

        <aside className="docs-on-page-rail" aria-label="On this page">
          <nav className="docs-on-page">
            <span>On this page</span>
            {active.sections.map((section) => (
              <a href={`#${section.id}`} key={section.id}>
                {section.title}
              </a>
            ))}
            <div>
              <Info aria-hidden="true" />
              <b>Specification v{integrationSpecification.version}</b>
              <p>
                Designed for Acru’s payment API. HTTP examples use standard clients; SDKs will be documented when
                released.
              </p>
            </div>
          </nav>
        </aside>
      </main>
      {toast && (
        <div className="developer-toast" role="status">
          <Check aria-hidden="true" />
          {toast}
        </div>
      )}
    </div>
  );
}
