import * as React from 'react'
import { cn } from '@/shared/lib/css/utils'

function Checkbox({
    className,
    ...props
}: Omit<React.ComponentProps<'input'>, 'type'>) {
    return (
        <input
            type="checkbox"
            data-slot="checkbox"
            className={cn(
                'size-4 shrink-0 rounded border border-input bg-background align-middle accent-primary disabled:cursor-not-allowed disabled:opacity-50',
                className,
            )}
            {...props}
        />
    )
}

export { Checkbox }
