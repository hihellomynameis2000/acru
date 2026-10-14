import type { Metadata } from "next";
import { HelpIndex } from "@/features/marketing/components/help-center";

export const metadata: Metadata = {
  title: "Help center",
  description: "Checkout and payment operations help from Acru."
};
export default function Page() {
  return <HelpIndex />;
}
