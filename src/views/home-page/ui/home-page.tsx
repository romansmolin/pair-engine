import {
    BenefitsSection,
    ContentSection,
    CtaSection,
    FaqSection,
    HeroSection,
    HowItWorksSection,
    TestimonialsSection,
} from '@/widgets/sections'

export const HomePage = () => {
    return (
        <>
            <HeroSection />
            <BenefitsSection />
            <HowItWorksSection />
            <ContentSection />
            <TestimonialsSection />
            <FaqSection />
            <CtaSection />
        </>
    )
}
