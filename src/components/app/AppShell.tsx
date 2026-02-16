import type { ReactNode } from 'react'
import { AppHeader } from '@/components/app/AppHeader'

type AppShellProps = {
    title: string
    description?: string
    children: ReactNode
    actions?: ReactNode
}

export function AppShell({ title, description, children, actions }: AppShellProps) {
    return (
        <div className="min-h-screen bg-[#F0FFDF] text-[#2A2A2A]">
            <AppHeader />

            <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
                        {description ? <p className="mt-2 max-w-2xl text-sm text-[#4E4E4E] sm:text-base">{description}</p> : null}
                    </div>
                    {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
                </header>

                {children}
            </main>
        </div>
    )
}
