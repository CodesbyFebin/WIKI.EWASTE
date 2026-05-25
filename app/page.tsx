import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FlavorCarousel } from "@/components/flavor-carousel"
import { BentoGrid } from "@/components/bento-grid"
import { ActivationsSection } from "@/components/activations-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07120f]">
      <Navigation />
      <HeroSection />
      <FlavorCarousel />
      <BentoGrid />
      <ActivationsSection />
      <Footer />
    </main>
  )
}
