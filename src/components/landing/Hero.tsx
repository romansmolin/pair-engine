import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern'
import { BlurFade } from '@/components/magicui/blur-fade'
import { Compass, HeartHandshake, Sparkles } from 'lucide-react'

const metrics = [
    { value: '100+', label: 'Compatibility signals' },
    { value: '1951+', label: 'Successful introductions' },
    { value: '6+', label: 'Years matching research' },
]

export function Hero() {
    return (
        <section className="relative overflow-hidden border-b border-[#A8DF8E]" aria-labelledby="hero-title">
            <AnimatedGridPattern className="opacity-45" />
            <div className="relative mx-auto flex w-full max-w-6xl flex-col px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pt-24">
                <BlurFade delay={0.05}>
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="secondary" className="mb-5">
                            Compatibility-first matching
                        </Badge>
                        <h1 id="hero-title" className="text-balance text-4xl font-semibold leading-tight text-[#222222] sm:text-5xl lg:text-6xl">
                            The future of matching with compatibility intelligence
                        </h1>
                        <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-[#4E4E4E] sm:text-lg">
                            Pair Engine models values, lifestyle, and intent to recommend people who
                            actually fit.
                        </p>
                    </div>
                </BlurFade>

                <BlurFade delay={0.12}>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <Button asChild size="lg" className="min-w-32 shadow-sm">
                            <Link href="/auth/sign-in">Open App</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="min-w-40">
                            <a href="#how-it-works">See How It Works</a>
                        </Button>
                    </div>
                </BlurFade>

                <BlurFade delay={0.2}>
                    <p className="mt-5 text-center text-sm text-[#595959]">★★★★★ 5.0 beta feedback</p>
                </BlurFade>

                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <BlurFade delay={0.26}>
                        <Card className="h-full overflow-hidden border-none bg-gradient-to-br from-[#FFAAB8] via-[#FFD8DF] to-[#A8DF8E] text-[#2A2A2A] shadow-lg shadow-[#FFAAB8]/35">
                            <CardContent className="flex h-full min-h-[170px] flex-col justify-between p-5">
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/60">
                                    <HeartHandshake className="h-5 w-5" />
                                </span>
                                <p className="text-sm text-[#2A2A2A]/90">
                                    Compatibility-first dates start with better context.
                                </p>
                            </CardContent>
                        </Card>
                    </BlurFade>

                    {metrics.map((item, index) => (
                        <BlurFade key={item.value} delay={0.3 + index * 0.06}>
                            <Card className="h-full border-[#A8DF8E] bg-white">
                                <CardContent className="flex h-full min-h-[170px] flex-col justify-between p-5">
                                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F0FFDF] text-[#2A2A2A]">
                                        {index === 0 ? (
                                            <Sparkles className="h-4 w-4" />
                                        ) : index === 1 ? (
                                            <Compass className="h-4 w-4" />
                                        ) : (
                                            <HeartHandshake className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-3xl font-semibold text-[#2A2A2A]">{item.value}</p>
                                        <p className="mt-1 text-sm text-[#535353]">{item.label}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </BlurFade>
                    ))}

                    <BlurFade delay={0.5}>
                        <Card className="h-full border-none bg-[#FFAAB8] text-[#2A2A2A] shadow-lg shadow-[#FFAAB8]/35">
                            <CardContent className="flex h-full min-h-[170px] items-end p-5">
                                <p className="text-sm leading-relaxed text-[#2A2A2A]/90">
                                    Improve match quality and reduce swipe fatigue.
                                </p>
                            </CardContent>
                        </Card>
                    </BlurFade>
                </div>
            </div>
        </section>
    )
}
