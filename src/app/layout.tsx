import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'
import { Providers } from './providers'
import { Toaster } from '@/shared/ui/toaster'

export const metadata: Metadata = {
    title: 'Pairly | Dating app for meaningful relationships',
    description:
        'Pairly helps you meet compatible people through shared values, habits, and intentional conversation.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`antialiased w-svw min-h-svh overflow-x-hidden flex flex-col`}>
                <Providers>
                    <Header />
                    <main className="flex flex-1 flex-col space-y-12 sm:space-y-16 lg:space-y-20">
                        {children}
                    </main>
                    <Footer />
                    <Toaster />
                </Providers>
            </body>
        </html>
    )
}
