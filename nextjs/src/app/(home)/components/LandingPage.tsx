import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import StatsSection from "./StatsSection";
import LeadComponent from "./LeadComponent";
import CTASection from "./CTASection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <LeadComponent />
      <CTASection />
    </div>
  );
}
