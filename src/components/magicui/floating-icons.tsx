'use client'

import type { ComponentType } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

type FloatingIcon = {
    label: string
    icon: ComponentType<{ className?: string }>
    x: number
    y: number
    delay?: number
}

type FloatingIconsProps = {
    icons: FloatingIcon[]
    className?: string
}

export function FloatingIcons({ icons, className }: FloatingIconsProps) {
    const reduceMotion = useReducedMotion()

    return (
        <div className={cn('relative h-full min-h-[260px] w-full', className)}>
            <div className="absolute inset-5 rounded-full border border-[#A8DF8E]/80" />
            <div className="absolute inset-14 rounded-full border border-[#A8DF8E]/70" />
            <div className="absolute inset-24 rounded-full border border-[#A8DF8E]/60" />

            {icons.map((item, index) => {
                const Icon = item.icon
                const style = {
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                }

                if (reduceMotion) {
                    return (
                        <div
                            key={item.label}
                            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#FFAAB8] bg-[#F0FFDF]/95 p-2 shadow-sm"
                            style={style}
                        >
                            <Icon className="h-4 w-4 text-[#2A2A2A]" />
                            <span className="sr-only">{item.label}</span>
                        </div>
                    )
                }

                return (
                    <motion.div
                        key={item.label}
                        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#FFAAB8] bg-[#F0FFDF]/95 p-2 shadow-sm"
                        style={style}
                        initial={{ y: 0 }}
                        animate={{ y: [0, -7, 0] }}
                        transition={{
                            duration: 2.8 + (index % 3) * 0.35,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: item.delay ?? index * 0.12,
                        }}
                    >
                        <Icon className="h-4 w-4 text-[#2A2A2A]" />
                        <span className="sr-only">{item.label}</span>
                    </motion.div>
                )
            })}
        </div>
    )
}
