"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowDiagonalIcon, SearchIcon } from "@shopify/polaris-icons";
import { searchHelpArticles } from "../data/help-articles";
import styles from "./help-center.module.css";

export function HelpSearch() {
  const [query, setQuery] = useState("");
  const results = searchHelpArticles(query);
  return (
    <>
      <label className={styles.search}>
        <SearchIcon aria-hidden="true" />
        <span className={styles.srOnly}>Search help articles</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search checkout, transactions, exports…"
        />
      </label>
      <div className={styles.results}>
        <p className={styles.resultCount} role="status">
          {query ? `${results.length} matching ${results.length === 1 ? "article" : "articles"}` : "Start here"}
        </p>
        {results.map((article) => (
          <Link key={article.slug} href={`/help/${article.slug}`} className={styles.result}>
            <span>{article.category}</span>
            <h2>{article.title}</h2>
            <p>{article.summary}</p>
            <ArrowDiagonalIcon className={styles.resultArrow} aria-hidden="true" focusable="false" />
          </Link>
        ))}
        {results.length === 0 && <p>No articles match that search. Try “checkout”, “CSV”, or “payment status”.</p>}
      </div>
    </>
  );
}
