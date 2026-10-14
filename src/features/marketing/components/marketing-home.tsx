import { CinematicHero } from "@/features/marketing/components/cinematic-hero";
import { LandingSections } from "@/features/marketing/components/landing-sections";
import { LandingFooter } from "@/features/marketing/components/landing-editorial";

export function MarketingHome() {
  return (
    <CinematicHero footer={<LandingFooter />}>
      <LandingSections />
    </CinematicHero>
  );
}
