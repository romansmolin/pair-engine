import { Suspense } from 'react'
import { AuthTabsCard } from '@/components/auth/AuthTabsCard'

export default function SignInPage() {
    return (
        <main className="min-h-screen bg-[#F0FFDF] px-4 py-14 sm:px-6 lg:px-8">
            <section className="mx-auto w-full max-w-xl">
                <Suspense fallback={null}>
                    <AuthTabsCard />
                </Suspense>
            </section>
        </main>
    )
}
