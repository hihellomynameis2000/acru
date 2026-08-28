import { notFound } from "next/navigation";

import { SettingsWorkspace, type SettingsSection } from "@/features/settings/components/settings-workspace";

const settingsSections: SettingsSection[] = [
  "business",
  "team",
  "banking-payouts",
  "branding",
  "security",
  "notifications"
];

export default async function SettingsSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;

  if (!settingsSections.includes(section as SettingsSection)) notFound();

  return <SettingsWorkspace section={section as SettingsSection} />;
}
