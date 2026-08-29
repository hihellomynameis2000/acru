import { ForgotPasswordPage } from "@/features/auth/components/auth-pages";
import { portalFromValue } from "@/lib/portal";

type PageProps = {
  searchParams: Promise<{ portal?: string | string[] }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const portal = Array.isArray(params.portal) ? params.portal[0] : params.portal;
  return <ForgotPasswordPage portal={portalFromValue(portal)} />;
}
