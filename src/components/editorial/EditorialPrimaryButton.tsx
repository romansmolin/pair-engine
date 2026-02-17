import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type EditorialPrimaryButtonBase = {
    children: ReactNode
    className?: string
    variant?: 'solid' | 'ghost'
}

type EditorialPrimaryButtonLinkProps = EditorialPrimaryButtonBase &
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'> & {
        href: string
    }

type EditorialPrimaryButtonNativeProps = EditorialPrimaryButtonBase &
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
        href?: undefined
    }

type EditorialPrimaryButtonProps = EditorialPrimaryButtonLinkProps | EditorialPrimaryButtonNativeProps

export function EditorialPrimaryButton({
    children,
    className,
    variant = 'solid',
    ...props
}: EditorialPrimaryButtonProps) {
    const buttonClassName = cn(
        'editorial-button',
        variant === 'solid' ? 'editorial-button--solid' : 'editorial-button--ghost',
        className,
    )

    if ('href' in props && props.href) {
        const { href } = props as EditorialPrimaryButtonLinkProps
        return (
            <Link href={href} className={buttonClassName}>
                <span className="editorial-button__label">{children}</span>
            </Link>
        )
    }

    const buttonProps = props as EditorialPrimaryButtonNativeProps

    return (
        <button type={buttonProps.type ?? 'button'} {...buttonProps} className={buttonClassName}>
            <span className="editorial-button__label">{children}</span>
        </button>
    )
}
