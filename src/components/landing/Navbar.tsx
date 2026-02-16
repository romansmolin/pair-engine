import Link from 'next/link'
import { Button } from '@/components/ui/button'

const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Technology', href: '#technology' },
    { label: 'Contact', href: '#contact' },
]

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-[#A8DF8E]/80 bg-[#F0FFDF]/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <Link href="/" className="text-sm font-semibold tracking-[0.12em] text-[#2A2A2A] uppercase">
                    Pair Engine
                </Link>

                <nav aria-label="Primary" className="hidden md:block">
                    <ul className="flex items-center gap-7 text-sm text-[#454545]">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <a href={item.href} className="transition-colors hover:text-[#FFAAB8] focus-visible:outline-none focus-visible:underline">
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <Button asChild size="sm" className="shadow-sm">
                    <Link href="/auth/sign-in">Open App</Link>
                </Button>
            </div>
        </header>
    )
}
