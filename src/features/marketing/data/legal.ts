import privacyPolicy from "@/features/marketing/data/legal/privacy.json";
import termsOfService from "@/features/marketing/data/legal/terms.json";

export type LegalParagraph = {
  type: "paragraph";
  text: string;
};

export type LegalSubheading = {
  type: "subheading";
  text: string;
};

export type LegalCallout = {
  type: "callout";
  text: string;
};

export type LegalBulletList = {
  type: "bullet_list";
  items: string[];
};

export type LegalNumberedList = {
  type: "numbered_list";
  items: string[];
};

export type LegalTable = {
  type: "table";
  headers: string[];
  rows: string[][];
};

export type LegalBlock =
  LegalParagraph | LegalSubheading | LegalCallout | LegalBulletList | LegalNumberedList | LegalTable;

export type LegalSection = {
  blocks: LegalBlock[];
  heading: string;
  id: string;
};

export type LegalDocument = {
  company: string;
  description: string;
  effectiveDate: string;
  introduction: LegalBlock[];
  sections: LegalSection[];
  slug: "privacy" | "terms";
  title: string;
  updated: string;
  website: string;
};

export const legalDocuments = {
  privacy: privacyPolicy as LegalDocument,
  terms: termsOfService as LegalDocument
} satisfies Record<LegalDocument["slug"], LegalDocument>;

export const legalDocumentList = [legalDocuments.terms, legalDocuments.privacy] as const;

export function getLegalDocument(slug: string): LegalDocument | undefined {
  if (slug === "terms" || slug === "privacy") return legalDocuments[slug];
  return undefined;
}
