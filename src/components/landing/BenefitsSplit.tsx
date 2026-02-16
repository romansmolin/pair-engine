import { CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const benefits = [
    'Better alignment',
    'Less swipe fatigue',
    'Higher-quality conversations',
    'More intentional dating',
]

export function BenefitsSplit() {
    return (
        <section id="how-it-works" className="bg-[#F0FFDF] py-16 sm:py-20">
            <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                <Card className="border-[#A8DF8E] bg-white">
                    <CardContent className="relative p-6 sm:p-8">
                        <div className="rounded-2xl border border-[#A8DF8E] bg-[#F0FFDF] p-4">
                            <p className="text-xs text-[#535353]">Match quality trend</p>
                            <div className="mt-3 space-y-3">
                                {[68, 82, 77, 90].map((value, idx) => (
                                    <div key={value} className="flex items-center gap-3">
                                        <span className="w-14 text-[11px] text-[#5A5A5A]">Week {idx + 1}</span>
                                        <div className="h-2 flex-1 rounded-full bg-[#FFD8DF]">
                                            <div
                                                className="h-full rounded-full bg-[#A8DF8E]"
                                                style={{ width: `${value}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5 max-w-[220px] rounded-2xl border border-[#FFAAB8] bg-[#FFD8DF]/40 p-4 shadow-sm">
                            <p className="text-xs text-[#525252]">Successful introductions</p>
                            <p className="mt-1 text-3xl font-semibold text-[#2A2A2A]">1951+</p>
                            <p className="text-xs text-[#626262]">Last 30 days</p>
                        </div>
                    </CardContent>
                </Card>

                <div>
                    <h2 className="text-balance text-3xl font-semibold text-[#2A2A2A] sm:text-4xl">
                        Why compatibility-first matching works
                    </h2>
                    <p className="mt-4 max-w-xl text-pretty text-[#4E4E4E]">
                        Pair Engine focuses on relationship fit before attraction loops, helping people
                        spend time on higher-probability matches.
                    </p>

                    <ul className="mt-6 space-y-3">
                        {benefits.map((benefit) => (
                            <li key={benefit} className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#FFAAB8]" />
                                <span className="text-sm text-[#2F2F2F] sm:text-base">{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}
