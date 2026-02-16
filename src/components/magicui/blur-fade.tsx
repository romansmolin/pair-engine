'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

type BlurFadeProps = {
    children: ReactNode
    className?: string
    delay?: number
    duration?: number
    yOffset?: number
}

export function BlurFade({
    children,
    className,
    delay = 0,
    duration = 0.5,
    yOffset = 10,
}: BlurFadeProps) {
    const reduceMotion = useReducedMotion()

    if (reduceMotion) {
        return <div className={className}>{children}</div>
    }

    return (
        <motion.div
            className={cn(className)}
            initial={{ opacity: 0, y: yOffset, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay, duration, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    )
}
