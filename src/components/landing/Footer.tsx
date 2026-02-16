import Link from 'next/link'

const footerCols = [
    {
        title: 'Navigation',
        links: [
            { label: 'Features', href: '#features' },
            { label: 'How it works', href: '#how-it-works' },
            { label: 'Technology', href: '#technology' },
            { label: 'Contact', href: '#contact' },
        ],
    },
    {
        title: 'Technology',
        links: [
            { label: 'Compatibility scoring', href: '#features' },
            { label: 'Intent modeling', href: '#features' },
            { label: 'Privacy controls', href: '#features' },
        ],
    },
    {
        title: 'Contact',
        links: [
            { label: 'hello@pairengine.app', href: 'mailto:hello@pairengine.app' },
            { label: 'X', href: '#' },
            { label: 'LinkedIn', href: '#' },
        ],
    },
]

export function Footer() {
    return (
        <footer id="contact" className="bg-[#FFAAB8] text-[#4E3C41]">
            <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
                <div>
                    <p className="text-sm font-semibold tracking-[0.14em] text-[#2A2A2A] uppercase">Pair Engine</p>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#5A454B]">
                        Compatibility intelligence for people who want dating to feel intentional.
                    </p>
                </div>

                {footerCols.map((col) => (
                    <div key={col.title}>
                        <h3 className="text-sm font-semibold text-[#2A2A2A]">{col.title}</h3>
                        <ul className="mt-3 space-y-2 text-sm">
                            {col.links.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="transition-colors hover:text-[#2A2A2A]">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="border-t border-[#FFD8DF]">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-[#614A50] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <p>© {new Date().getFullYear()} Pair Engine. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link href="#" className="transition-colors hover:text-[#2A2A2A]">
                            Privacy
                        </Link>
                        <Link href="#" className="transition-colors hover:text-[#2A2A2A]">
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
