export type NavItem = {
    label: string
    href: string
    isExternal?: boolean
}

export type HeroProps = {
    eyebrow: string
    title: string
    subtitle: string
    primaryCta: { label: string; href: string }
    secondaryCta: { label: string; href: string }
}

export type SidebarSection = {
    title: string
    items: { label: string; href?: string; value?: string }[]
}

export type ContentCardItem = {
    id: string
    title: string
    kicker?: string
    body: string
    tag?: string
    status?: 'default' | 'featured' | 'empty'
}

export type EmptyStateConfig = {
    title: string
    description: string
    action?: { label: string; href: string }
}
