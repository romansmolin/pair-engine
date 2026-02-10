'use client'

import React, { ReactNode } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'

interface TestimonialsColumnProps {
    className?: string
    testimonials: Testimonial[]
    duration?: number
}

export type TestimonialPlatform = 'twitter' | 'producthunt'

export interface Testimonial {
    content: ReactNode
    author: string
    handle: string
    avatar: string
    platform: TestimonialPlatform
    image?: string
}

export const TestimonialsColumn = ({
    className,
    testimonials,
    duration = 10,
}: TestimonialsColumnProps) => {
    return (
        <div className={className}>
            <motion.div
                animate={{
                    translateY: '-50%',
                }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: 'linear',
                    repeatType: 'loop',
                }}
                className="flex flex-col gap-6 pb-6 bg-background"
            >
                {[
                    ...new Array(2).fill(0).map((_, index) => (
                        <React.Fragment key={index}>
                            {testimonials.map((testimonial, i) => (
                                <div
                                    className="p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full bg-white"
                                    key={i}
                                >
                                    <div className="text-slate-700 text-sm leading-relaxed">
                                        {typeof testimonial.content === 'string'
                                            ? testimonial.content
                                            : testimonial.content}
                                    </div>
                                    <div className="flex items-center gap-2 mt-5">
                                        <Image
                                            width={40}
                                            height={40}
                                            src={testimonial.avatar}
                                            alt={testimonial.author}
                                            className="h-10 w-10 rounded-full"
                                        />
                                        <div className="flex flex-col">
                                            <div className="font-medium tracking-tight leading-5 text-slate-900">
                                                {testimonial.author}
                                            </div>
                                            <div className="leading-5 opacity-60 tracking-tight text-slate-600">
                                                {testimonial.handle}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </React.Fragment>
                    )),
                ]}
            </motion.div>
        </div>
    )
}
