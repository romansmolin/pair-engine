'use client'

import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

type AnimatedGridPatternProps = {
    className?: string
}

export function AnimatedGridPattern({ className }: AnimatedGridPatternProps) {
    const reduceMotion = useReducedMotion()

    const baseStyle = {
        backgroundImage:
            'linear-gradient(to right, rgba(168,223,142,0.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,170,184,0.24) 1px, transparent 1px)',
        backgroundSize: '38px 38px',
    }

    if (reduceMotion) {
        return <div aria-hidden className={cn('pointer-events-none absolute inset-0', className)} style={baseStyle} />
    }

    return (
        <motion.div
            aria-hidden
            className={cn('pointer-events-none absolute inset-0', className)}
            style={baseStyle}
            initial={{ opacity: 0.25 }}
            animate={{ opacity: [0.18, 0.3, 0.18] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
    )
}
