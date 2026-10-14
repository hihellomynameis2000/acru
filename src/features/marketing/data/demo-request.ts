import { z } from "zod";

export const demoBusinessTypes = ["Ecommerce", "Fintech", "Gaming", "Marketplaces", "Other"] as const;
export const demoVolumes = [
  "Not processing yet",
  "Under $100,000",
  "$100,000–$1 million",
  "$1–10 million",
  "Over $10 million"
] as const;

const shortText = (label: string) =>
  z.string().trim().min(1, `${label} is required.`).max(120, "Please use 120 characters or fewer.");
export const demoRequestSchema = z.object({
  firstName: shortText("First name"),
  lastName: shortText("Last name"),
  email: z.string().trim().max(254).email("Enter a valid email address."),
  company: shortText("Company name"),
  website: z
    .string()
    .trim()
    .max(300)
    .refine((value) => {
      if (!value) return true;
      try {
        const url = new URL(value.includes("://") ? value : `https://${value}`);
        return ["http:", "https:"].includes(url.protocol) && url.hostname.includes(".");
      } catch {
        return false;
      }
    }, "Enter a valid company website."),
  country: shortText("Country or region"),
  businessType: z.enum(demoBusinessTypes, { message: "Select your business type." }),
  volume: z.enum(demoVolumes, { message: "Select your monthly payment volume." }),
  message: z.string().trim().max(1500, "Please use 1,500 characters or fewer."),
  contactConsent: z.literal(true, { message: "Please confirm we can contact you about your request." }),
  companyFax: z.string().max(0)
});

export type DemoRequest = z.infer<typeof demoRequestSchema>;
