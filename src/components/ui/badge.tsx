import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors',
    {
        variants: {
            variant: {
                default: 'border-transparent bg-[#A8DF8E] text-[#223022]',
                secondary: 'border-[#A8DF8E] bg-[#F0FFDF] text-[#2A2A2A]',
                outline: 'border-[#FFAAB8] text-[#2A2A2A]',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
