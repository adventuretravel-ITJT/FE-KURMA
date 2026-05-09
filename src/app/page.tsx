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
import { fetchHomepageContent } from '@/lib/homepageApi'

export default async function HomePage() {
  const content = await fetchHomepageContent()

  return (
    <>
      <RevealObserver />
      <Navbar data={content.navbar} />
      <main>
        <Hero data={content.hero} />
        <TrustStats data={content.trust_stats} />
        <HowItWorks data={content.how_it_works} />
        <Features data={content.features} />
        <DayInTrip data={content.day_in_trip} />
        <FAQ data={content.faq} />
        <CTASection data={content.cta_section} />
      </main>
      <Footer data={content.footer} />
    </>
  )
}
