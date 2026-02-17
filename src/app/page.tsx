import { BenefitsSplit } from '@/components/landing/BenefitsSplit'
import { FeatureBlock } from '@/components/landing/FeatureBlock'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { Footer } from '@/components/landing/Footer'
import { Integrations } from '@/components/landing/Integrations'
import { LandingSignupSection } from '@/components/landing/LandingSignupSection'
import { Navbar } from '@/components/landing/Navbar'
import { EditorialHero } from '@/components/editorial/EditorialHero'

export default function Home() {
    return (
        <>
            <Navbar />
            <main className="bg-[#F0FFDF] text-[#2A2A2A]">
                <div className="editorial-root">
                    <EditorialHero />
                </div>
                <LandingSignupSection />
                <FeatureBlock />
                <BenefitsSplit />
                <Integrations />
                <FinalCTA />
            </main>
            <Footer />
        </>
    )
}
