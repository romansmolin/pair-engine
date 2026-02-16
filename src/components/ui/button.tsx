import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-[#FFAAB8] text-[#2A2A2A] hover:bg-[#FFD8DF] focus-visible:ring-[#FFAAB8]',
                secondary:
                    'bg-[#A8DF8E] text-[#1F2A1F] hover:bg-[#A8DF8E]/85 focus-visible:ring-[#A8DF8E]',
                outline:
                    'border border-[#FFAAB8] bg-[#F0FFDF] text-[#2A2A2A] hover:bg-[#FFD8DF]/60 focus-visible:ring-[#A8DF8E]',
                ghost: 'text-[#2A2A2A] hover:bg-[#FFD8DF]/60 focus-visible:ring-[#FFAAB8]',
            },
            size: {
                default: 'h-10 px-5',
                sm: 'h-9 px-4 text-xs',
                lg: 'h-11 px-7',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button'
        return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
