import { HeroSection } from "@/components/home/HeroSection"
import { FeaturesSection } from "@/components/home/FeaturesSection"
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection"
import { CTASection } from "@/components/home/CTASection"
import AnimatedPage from "@/components/AnimatedPage"

export default function Home() {
  return (
    <AnimatedPage>
      <div className="container mx-auto px-6 py-12 space-y-20">
        <HeroSection />
        <FeaturesSection />
        <WhyChooseUsSection />
        <CTASection />
      </div>
    </AnimatedPage>
  )
}

