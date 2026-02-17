'use client'

import { useState } from 'react'
import Link from 'next/link'
import { EditorialPrimaryButton } from '@/components/editorial/EditorialPrimaryButton'
import type { NavItem } from '@/components/editorial/types'

const navItems: NavItem[] = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Technology', href: '#technology' },
    { label: 'Contact', href: '#contact' },
]

export function EditorialNavbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="editorial-nav-wrap">
            <div className="editorial-nav-shell">
                <div className="editorial-wordmark">
                    <Link href="/" aria-label="Pair Engine Home">
                        Pair Engine
                    </Link>
                </div>

                <button
                    type="button"
                    className="editorial-nav-toggle"
                    aria-label="Toggle navigation menu"
                    aria-expanded={isOpen}
                    aria-controls="editorial-mobile-nav"
                    onClick={() => setIsOpen((current) => !current)}
                >
                    {isOpen ? 'Close' : 'Menu'}
                </button>

                <nav className="editorial-nav-links" aria-label="Primary navigation">
                    <ul>
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <a href={item.href}>{item.label}</a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="editorial-nav-cta">
                    <EditorialPrimaryButton href="/auth/sign-in">Open App</EditorialPrimaryButton>
                </div>
            </div>

            <nav
                id="editorial-mobile-nav"
                className={`editorial-mobile-nav ${isOpen ? 'is-open' : ''}`}
                aria-label="Mobile primary navigation"
            >
                <ul>
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <a href={item.href} onClick={() => setIsOpen(false)}>
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    )
}
