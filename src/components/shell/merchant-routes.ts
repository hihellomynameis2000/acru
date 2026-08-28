export const merchantRoutes = [
  "/dashboard",
  "/payments/transactions",
  "/payments/customers",
  "/commerce/products",
  "/payments/subscriptions",
  "/payments/checkout",
  "/payments/refunds",
  "/payments/payment-links",
  "/payments/invoices",
  "/payments/payouts",
  "/payments/disputes",
  "/reports/analytics",
  "/reports/acceptance",
  "/reports/statements",
  "/reports/wallet",
  "/reports/exports",
  "/settings/business",
  "/settings/team",
  "/settings/banking-payouts",
  "/settings/branding",
  "/settings/security",
  "/settings/notifications"
] as const;

export type MerchantRoute = (typeof merchantRoutes)[number];
