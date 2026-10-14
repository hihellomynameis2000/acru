import { siX } from "simple-icons";

// Approved footer destinations; Facebook and YouTube removed October 11, 2026.
export const socialLinks = [
  { href: "https://x.com/acruhq", label: "X", path: siX.path },
  {
    href: "https://www.linkedin.com/company/acruhq/",
    label: "LinkedIn",
    path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.1 20.45H3.54V9H7.1v11.45Z"
  }
] as const;
