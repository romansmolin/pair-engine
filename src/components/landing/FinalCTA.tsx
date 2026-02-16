import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern'
import { BlurFade } from '@/components/magicui/blur-fade'

export function FinalCTA() {
    return (
        <section className="relative overflow-hidden bg-[#A8DF8E] py-16 sm:py-20">
            <AnimatedGridPattern className="opacity-25" />
            <div className="relative mx-auto w-full max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                <BlurFade>
                    <h2 className="text-balance text-3xl font-semibold text-[#2A2A2A] sm:text-4xl">
                        Start matching with intention
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-pretty text-[#3F3F3F]">
                        Better matches. Better conversations.
                    </p>
                    <Button asChild size="lg" className="mt-7 bg-[#FFAAB8] text-[#2A2A2A] hover:bg-[#FFD8DF]">
                        <Link href="/auth/sign-in">Open App</Link>
                    </Button>
                </BlurFade>
            </div>
        </section>
    )
}
