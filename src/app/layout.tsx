import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
    title: 'PairEngine | Backend-first dating platform',
    description:
        'PairEngine preserves core dating business logic including payments, authentication, proxying, gifts, chat, and dashboard activity.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
