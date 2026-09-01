import { describe, expect, it } from "vitest";

import { legalDocuments } from "@/features/marketing/data/legal";

describe("official legal documents", () => {
  it("preserves the complete supplied terms structure", () => {
    expect(legalDocuments.terms.effectiveDate).toBe("August 26, 2026");
    expect(legalDocuments.terms.updated).toBe("August 26, 2026");
    expect(legalDocuments.terms.sections).toHaveLength(47);
    expect(legalDocuments.terms.sections[38]?.heading).toBe(
      "39. Dispute Resolution; Binding Arbitration; Class Action Waiver"
    );
    expect(legalDocuments.terms.sections.at(-1)?.heading).toBe("47. Contact Information");
    expect(
      legalDocuments.terms.introduction.some(
        (block) => block.type === "callout" && block.text.includes("CLASS ACTION WAIVER")
      )
    ).toBe(true);
  });

  it("preserves the complete supplied privacy structure and tables", () => {
    expect(legalDocuments.privacy.effectiveDate).toBe("August 26, 2026");
    expect(legalDocuments.privacy.updated).toBe("August 26, 2026");
    expect(legalDocuments.privacy.sections).toHaveLength(26);
    expect(legalDocuments.privacy.sections.at(-1)?.heading).toBe("26. Contact Acru");

    const tables = legalDocuments.privacy.sections.flatMap((section) =>
      section.blocks.filter((block) => block.type === "table")
    );
    expect(tables).toHaveLength(2);
    expect(tables[0]?.headers).toEqual(["Information", "General Retention Criteria"]);
    expect(tables[1]?.headers).toEqual(["CCPA Category", "Examples"]);
  });
});
