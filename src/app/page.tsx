import Navbar from '@/src/components/home/Navbar'
import Hero from '@/src/components/home/Hero'
import TrustStats from '@/src/components/home/TrustStats'
import HowItWorks from '@/src/components/home/HowItWorks'
import Features from '@/src/components/home/Features'
import DayInTrip from '@/src/components/home/DayInTrip'
import FAQ from '@/src/components/home/FAQ'
import CTASection from '@/src/components/home/CTASection'
import Footer from '@/src/components/home/Footer'
import RevealObserver from '@/src/components/home/RevealObserver'

export default function HomePage() {
  return (
    <>
      <RevealObserver />
      <Navbar />
      <main>
        <Hero />
        <TrustStats />
        <HowItWorks />
        <Features />
        <DayInTrip />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
