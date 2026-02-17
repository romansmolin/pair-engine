'use client'

import { useEffect, useRef, useState } from 'react'
import type { SidebarSection } from '@/components/editorial/types'

const sidebarSections: SidebarSection[] = [
    {
        title: 'Now',
        items: [
            { label: 'Active compatibility model', value: 'v3.7' },
            { label: 'Weekly curated intros', value: '12' },
        ],
    },
    {
        title: 'Signals',
        items: [
            { label: 'Value alignment', value: 'High' },
            { label: 'Lifestyle overlap', value: 'Moderate' },
            { label: 'Dealbreaker confidence', value: 'Strong' },
        ],
    },
    {
        title: 'Notes',
        items: [
            { label: 'Read the matching story', href: '#how-it-works' },
            { label: 'See product details', href: '#technology' },
        ],
    },
]

function SidebarContent() {
    return (
        <div className="editorial-sidebar-panel">
            <p className="editorial-sidebar-kicker">Workbench</p>
            {sidebarSections.map((section) => (
                <section key={section.title} className="editorial-sidebar-section" aria-label={section.title}>
                    <h3>{section.title}</h3>
                    <ul>
                        {section.items.map((item) => (
                            <li key={`${section.title}-${item.label}`}>
                                {item.href ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}
                                {item.value ? <strong>{item.value}</strong> : null}
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    )
}

export function EditorialSidebar() {
    const [open, setOpen] = useState(false)
    const drawerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return

        const previousActive = document.activeElement as HTMLElement | null
        const focusableSelector =
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

        const focusables = Array.from(
            drawerRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
        )

        focusables[0]?.focus()

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault()
                setOpen(false)
                return
            }

            if (event.key !== 'Tab' || focusables.length === 0) return

            const current = document.activeElement as HTMLElement | null
            const first = focusables[0]
            const last = focusables[focusables.length - 1]

            if (event.shiftKey && current === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && current === last) {
                event.preventDefault()
                first.focus()
            }
        }

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        document.addEventListener('keydown', onKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener('keydown', onKeyDown)
            previousActive?.focus()
        }
    }, [open])

    return (
        <>
            <div className="editorial-sidebar-mobile-trigger">
                <button
                    type="button"
                    className="editorial-sidebar-open"
                    aria-expanded={open}
                    aria-controls="editorial-sidebar-drawer"
                    onClick={() => setOpen(true)}
                >
                    Open story sidebar
                </button>
            </div>

            <aside className="editorial-sidebar-desktop" aria-label="Story metadata sidebar">
                <SidebarContent />
            </aside>

            {open ? (
                <div className="editorial-sidebar-overlay" onClick={() => setOpen(false)}>
                    <div
                        id="editorial-sidebar-drawer"
                        ref={drawerRef}
                        className="editorial-sidebar-drawer"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Story metadata sidebar"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="editorial-sidebar-drawer-head">
                            <p>Story Sidebar</p>
                            <button type="button" onClick={() => setOpen(false)}>
                                Close
                            </button>
                        </div>
                        <SidebarContent />
                    </div>
                </div>
            ) : null}
        </>
    )
}
