import Link from 'next/link'
import { FooterBankingInfo } from '@/shared/ui/footer-banking-info/footer-banking-info'

const quickLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Start Matching', href: '/match' },
    { label: 'Chat', href: '/chat' },
    { label: 'Wallet', href: '/wallet' },
    { label: 'Gifts', href: '/gifts' },
]

export const Footer = () => {
    return (
        <footer className="border-t border-border bg-background/95">
            <div className="container mx-auto flex flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-lg font-bold text-primary">Pairly</p>
                        <p className="text-sm text-muted-foreground/90">
                            Meaningful dating through compatibility, chat, and safe interactions.
                        </p>
                    </div>

                    <nav aria-label="Footer navigation">
                        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="font-medium transition-colors hover:text-primary"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className="rounded-lg border border-border/70 bg-muted/20 px-3 py-2">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Secure payments
                    </p>
                    <FooterBankingInfo className="mx-auto h-8 w-auto max-w-full opacity-75" />
                </div>

                <p className="text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Pairly. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
