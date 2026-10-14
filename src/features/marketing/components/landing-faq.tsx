"use client";

import { useState } from "react";
import { landingFaqs } from "@/features/marketing/data/editorial";

export function LandingFaq({
  items = landingFaqs,
  limit = 6
}: {
  items?: readonly { id: string; question: string; answer: string }[];
  limit?: number | null;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const visibleItems = limit === null ? items : items.slice(0, limit);

  return (
    <div className="landing-faq-list">
      {visibleItems.map(({ id, question, answer }) => {
        const open = expanded === id;
        return (
          <div className="landing-faq-item" data-open={open} key={id}>
            <h3>
              <button
                type="button"
                id={`faq-${id}`}
                aria-expanded={open}
                aria-controls={`faq-${id}-answer`}
                onClick={() => setExpanded(open ? null : id)}
              >
                {question}
                <span className="landing-faq-plus" aria-hidden="true" />
              </button>
            </h3>
            <div
              className="landing-faq-answer"
              id={`faq-${id}-answer`}
              role="region"
              aria-labelledby={`faq-${id}`}
              aria-hidden={!open}
              inert={!open}
            >
              <div>
                <p>{answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
