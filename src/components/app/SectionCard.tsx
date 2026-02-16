import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type SectionCardProps = {
    title: string
    description?: string
    actions?: ReactNode
    children: ReactNode
    className?: string
    contentClassName?: string
}

export function SectionCard({
    title,
    description,
    actions,
    children,
    className,
    contentClassName,
}: SectionCardProps) {
    return (
        <Card className={cn('border-[#A8DF8E] bg-white', className)}>
            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
                <div>
                    <CardTitle className="text-xl text-[#2A2A2A]">{title}</CardTitle>
                    {description ? <CardDescription className="mt-1">{description}</CardDescription> : null}
                </div>
                {actions ? <div className="shrink-0">{actions}</div> : null}
            </CardHeader>
            <CardContent className={cn('pt-0', contentClassName)}>{children}</CardContent>
        </Card>
    )
}
