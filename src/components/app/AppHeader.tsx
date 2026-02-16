'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
    { href: '/dashboard', label: 'Home' },
    { href: '/chat', label: 'Chat' },
    { href: '/match', label: 'Match' },
    { href: '/gifts', label: 'Gifts' },
    { href: '/wallet', label: 'Wallet' },
    { href: '/profile', label: 'Settings' },
]

export function AppHeader() {
    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-40 border-b border-[#A8DF8E]/80 bg-[#F0FFDF]/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <Link href="/dashboard" className="text-sm font-semibold tracking-[0.12em] text-[#2A2A2A] uppercase">
                    Pair Engine
                </Link>

                <nav aria-label="App navigation" className="overflow-x-auto">
                    <ul className="flex items-center gap-2 text-sm">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            'rounded-full px-3 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAAB8]',
                                            isActive
                                                ? 'bg-[#FFD8DF] text-[#2A2A2A]'
                                                : 'text-[#4E4E4E] hover:bg-[#FFD8DF]/60',
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </div>
        </header>
    )
}
