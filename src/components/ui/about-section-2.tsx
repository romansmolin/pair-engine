'use client'

import { TimelineContent } from '@/components/ui/timeline-animation'
import { Zap } from 'lucide-react'
import { useRef } from 'react'

export default function AboutSection2() {
    const heroRef = useRef<HTMLDivElement>(null)
    const revealVariants = {
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            transition: {
                delay: i * 1.5,
                duration: 0.7,
            },
        }),
        hidden: {
            filter: 'blur(10px)',
            y: 40,
            opacity: 0,
        },
    }
    const textVariants = {
        visible: (i: number) => ({
            filter: 'blur(0px)',
            opacity: 1,
            transition: {
                delay: i * 0.3,
                duration: 0.7,
            },
        }),
        hidden: {
            filter: 'blur(10px)',
            opacity: 0,
        },
    }
    return (
        <section className="w-full bg-gray-50 px-4 py-28">
            <div className="mx-auto max-w-6xl" ref={heroRef}>
                <div className="flex flex-col items-start gap-8 lg:flex-row">
                    <div className="flex-1">
                        <TimelineContent
                            as="h1"
                            animationNum={0}
                            timelineRef={heroRef}
                            customVariants={revealVariants}
                            className="mb-8 text-2xl font-semibold text-gray-900 !leading-[110%] sm:text-4xl md:text-5xl"
                        >
                            We are{' '}
                            <TimelineContent
                                as="span"
                                animationNum={1}
                                timelineRef={heroRef}
                                customVariants={textVariants}
                                className="inline-block rounded-md border-2 border-dotted border-blue-500 px-2 text-blue-600 xl:h-16"
                            >
                                rethinking
                            </TimelineContent>{' '}
                            online dating to be more intentional and always people-first. Our goal
                            is to build{' '}
                            <TimelineContent
                                as="span"
                                animationNum={2}
                                timelineRef={heroRef}
                                customVariants={textVariants}
                                className="inline-block rounded-md border-2 border-dotted border-orange-500 px-2 text-orange-600 xl:h-16"
                            >
                                trust
                            </TimelineContent>{' '}
                            at every step and make{' '}
                            <TimelineContent
                                as="span"
                                animationNum={3}
                                timelineRef={heroRef}
                                customVariants={textVariants}
                                className="inline-block rounded-md border-2 border-dotted border-green-500 px-2 text-green-600 xl:h-16"
                            >
                                compatibility work for you.
                            </TimelineContent>
                        </TimelineContent>

                        <div className="mt-12 flex justify-between gap-2">
                            <TimelineContent
                                as="div"
                                animationNum={4}
                                timelineRef={heroRef}
                                customVariants={textVariants}
                                className="mb-4 text-xs sm:text-xl"
                            >
                                <div className="mb-1 capitalize font-medium text-gray-900">
                                    We are Pairly and we help people
                                </div>
                                <div className="font-semibold text-gray-600 uppercase">
                                    build meaningful relationships
                                </div>
                            </TimelineContent>

                            <TimelineContent
                                as="button"
                                animationNum={5}
                                timelineRef={heroRef}
                                customVariants={textVariants}
                                className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-blue-600 px-4 text-sm font-medium text-white shadow-lg shadow-blue-600"
                            >
                                <Zap fill="white" size={16} />
                                About Pairly
                            </TimelineContent>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
