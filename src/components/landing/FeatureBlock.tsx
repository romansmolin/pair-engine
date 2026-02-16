import { ShieldCheck, Sparkle, MessageCircleMore, SearchCheck, SlidersHorizontal, LineChart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const features = [
    {
        title: 'Compatibility scoring',
        description: 'Rank potential matches across values, lifestyle, and communication style.',
        icon: Sparkle,
    },
    {
        title: 'Dealbreaker filtering',
        description: 'Filter out mismatches before they ever reach your queue.',
        icon: SlidersHorizontal,
    },
    {
        title: 'Intent modeling',
        description: 'Match by relationship intent and long-term expectations.',
        icon: SearchCheck,
    },
    {
        title: 'Conversation prompts',
        description: 'Kick off better chats with context-aware opening prompts.',
        icon: MessageCircleMore,
    },
    {
        title: 'Privacy controls',
        description: 'Adjust visibility, limits, and boundaries by comfort level.',
        icon: ShieldCheck,
    },
    {
        title: 'Match insights',
        description: 'See why suggestions were made and what signals drove fit.',
        icon: LineChart,
    },
]

export function FeatureBlock() {
    return (
        <section id="features" className="bg-[#FFAAB8] py-16 sm:py-20">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-balance text-3xl font-semibold text-[#2A2A2A] sm:text-4xl">
                        A smarter compatibility engine
                    </h2>
                    <p className="mt-3 text-pretty text-sm text-[#46353A] sm:text-base">
                        Everything needed to turn profiles into meaningful matches.
                    </p>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => {
                        const Icon = feature.icon
                        return (
                            <Card
                                key={feature.title}
                                className={cn(
                                    'group border-[#A8DF8E] bg-[#F0FFDF] shadow-sm shadow-[#FFAAB8]/30 transition-all duration-300',
                                    'hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#FFAAB8]/40',
                                )}
                            >
                                <CardContent className="p-6">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#A8DF8E] bg-[#FFD8DF] text-[#2A2A2A]">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <h3 className="mt-4 text-lg font-semibold text-[#2A2A2A]">{feature.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[#4F4F4F]">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
