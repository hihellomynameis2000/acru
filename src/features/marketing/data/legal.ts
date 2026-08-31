export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalDocument = {
  description: string;
  title: string;
  updated: string;
  sections: LegalSection[];
};

export const legalDocuments: Record<string, LegalDocument> = {
  privacy: {
    title: "Privacy policy",
    description: "How Acru collects, uses, shares, and protects personal information.",
    updated: "August 31, 2026",
    sections: [
      {
        heading: "Information we collect",
        paragraphs: [
          "We collect information you provide when you create an account, configure payment services, contact us, or otherwise use Acru. This may include identity, business, contact, transaction, device, and support information.",
          "We also receive information from service providers and financial partners when needed to provide the platform, verify identity, prevent fraud, comply with law, and support payment operations."
        ]
      },
      {
        heading: "How we use information",
        paragraphs: [
          "We use information to operate and secure the platform, process requested services, provide support, improve performance, communicate service updates, meet legal obligations, and protect Acru, our customers, and the financial ecosystem.",
          "We do not sell personal information. We may share information with processors, banking partners, infrastructure providers, professional advisers, and authorities when permitted or required by law."
        ]
      },
      {
        heading: "Retention and security",
        paragraphs: [
          "We retain information for as long as needed to provide services, maintain financial and audit records, resolve disputes, and satisfy legal requirements. Retention periods vary by record type and jurisdiction.",
          "Acru uses administrative, technical, and organizational safeguards designed to protect information. No system is completely secure, so customers should also protect credentials and promptly report suspected unauthorized access."
        ]
      },
      {
        heading: "Your choices and rights",
        paragraphs: [
          "Depending on where you live, you may have rights to access, correct, delete, or receive a copy of personal information, or to object to or restrict certain processing. We may need to verify your identity before completing a request.",
          "For privacy questions or requests, contact privacy@acru.com."
        ]
      }
    ]
  },
  terms: {
    title: "Terms of service",
    description: "The terms governing access to and use of the Acru platform.",
    updated: "August 31, 2026",
    sections: [
      {
        heading: "Using Acru",
        paragraphs: [
          "You may use Acru only for lawful business purposes and in accordance with these terms, the applicable service agreement, and all product-specific requirements. You are responsible for the activity of your account and authorized users.",
          "You must provide accurate information, maintain appropriate security controls, and notify us promptly of suspected compromise or unauthorized activity."
        ]
      },
      {
        heading: "Payment services",
        paragraphs: [
          "Payment services may be provided with regulated financial institutions and other partners. Availability, settlement timing, reserves, limits, and fees may depend on underwriting, risk, network rules, and applicable law.",
          "You authorize Acru and its partners to process instructions submitted through your account and to take reasonable steps necessary to prevent loss, fraud, or unlawful activity."
        ]
      },
      {
        heading: "Platform rights and responsibilities",
        paragraphs: [
          "Acru and its licensors retain all rights in the platform, documentation, and related technology. We grant you a limited, non-exclusive right to use the services during the applicable subscription or service term.",
          "Services may change over time. We may suspend access when reasonably necessary to protect the platform, comply with law, address risk, or respond to a material breach."
        ]
      },
      {
        heading: "Contact",
        paragraphs: ["Questions about these terms may be sent to legal@acru.com."]
      }
    ]
  },
  "acceptable-use": {
    title: "Acceptable use policy",
    description: "Rules designed to keep Acru safe, lawful, and reliable.",
    updated: "August 31, 2026",
    sections: [
      {
        heading: "Prohibited activity",
        paragraphs: [
          "You may not use Acru for unlawful, fraudulent, deceptive, abusive, or rights-infringing activity. You may not facilitate prohibited goods or services, evade sanctions or network rules, or misrepresent the nature of a transaction or business.",
          "You may not probe, disrupt, overload, reverse engineer, or bypass the security or access controls of the platform except as expressly authorized in writing."
        ]
      },
      {
        heading: "Security and responsible use",
        paragraphs: [
          "Protect credentials, use least-privilege access, and apply appropriate authentication and review controls. Automated use must respect documented limits and must not degrade the platform for others.",
          "Report suspected abuse or security issues to security@acru.com. We may investigate and restrict activity to protect customers, partners, or the platform."
        ]
      }
    ]
  },
  cookies: {
    title: "Cookie policy",
    description: "How Acru uses cookies and similar browser technologies.",
    updated: "August 31, 2026",
    sections: [
      {
        heading: "Essential technologies",
        paragraphs: [
          "Acru uses essential cookies and local browser storage to maintain sessions, remember security and workspace preferences, route users to the correct portal, and keep the platform reliable.",
          "These technologies are necessary for requested services and cannot always be disabled without affecting functionality."
        ]
      },
      {
        heading: "Measurement and preferences",
        paragraphs: [
          "Where enabled, we may use limited analytics to understand product performance and improve usability. We do not use payment data for cross-site advertising.",
          "Browser settings can be used to manage cookies. Where required, Acru will provide additional controls before using non-essential technologies."
        ]
      }
    ]
  },
  accessibility: {
    title: "Accessibility statement",
    description: "Acru’s commitment to accessible digital financial infrastructure.",
    updated: "August 31, 2026",
    sections: [
      {
        heading: "Our commitment",
        paragraphs: [
          "Acru is committed to making its public website and products usable by people with diverse abilities, technologies, and working environments. We design for keyboard access, clear focus, readable contrast, adaptable layouts, and reduced motion.",
          "Accessibility is an ongoing program. We test critical journeys and work to address barriers as the platform evolves."
        ]
      },
      {
        heading: "Feedback and assistance",
        paragraphs: [
          "If you encounter an accessibility barrier or need information in another format, email accessibility@acru.com. Please include the page, the issue, and the assistive technology or browser you were using when helpful.",
          "We aim to acknowledge accessibility feedback promptly and provide a practical path forward."
        ]
      }
    ]
  }
};
