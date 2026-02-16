'use client'

import Link from 'next/link'
import { CalendarCheck2, MapPin, MessageCircle, Shield, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BlurFade } from '@/components/magicui/blur-fade'
import { FloatingIcons } from '@/components/magicui/floating-icons'

const integrationIcons = [
    { label: 'Calendar', icon: CalendarCheck2, x: 50, y: 22 },
    { label: 'Maps', icon: MapPin, x: 78, y: 40 },
    { label: 'Chat', icon: MessageCircle, x: 70, y: 70 },
    { label: 'Safety', icon: Shield, x: 30, y: 70 },
    { label: 'Payments', icon: Wallet, x: 22, y: 40 },
]

export function Integrations() {
    return (
        <section id="technology" className="py-16 sm:py-20">
            <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                <BlurFade>
                    <div>
                        <h2 className="text-balance text-3xl font-semibold text-[#2A2A2A] sm:text-4xl">
                            Works with your dating flow
                        </h2>
                        <p className="mt-4 max-w-xl text-pretty text-[#4E4E4E]">
                            Coordinate schedules, keep conversation context, and keep safety controls
                            in one compatibility-first workflow.
                        </p>
                        <Button asChild className="mt-6" size="lg">
                            <Link href="/auth/sign-in">Open App</Link>
                        </Button>
                    </div>
                </BlurFade>

                <BlurFade delay={0.08}>
                    <Card className="border-[#A8DF8E] bg-[#F0FFDF] shadow-sm">
                        <CardContent className="p-4 sm:p-6">
                            <FloatingIcons icons={integrationIcons} />
                        </CardContent>
                    </Card>
                </BlurFade>
            </div>
        </section>
    )
}
