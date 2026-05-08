import Navbar from '@/components/home/Navbar'
import Hero from '@/components/home/Hero'
import TrustStats from '@/components/home/TrustStats'
import HowItWorks from '@/components/home/HowItWorks'
import Features from '@/components/home/Features'
import DayInTrip from '@/components/home/DayInTrip'
import FAQ from '@/components/home/FAQ'
import CTASection from '@/components/home/CTASection'
import Footer from '@/components/home/Footer'
import RevealObserver from '@/components/home/RevealObserver'

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

