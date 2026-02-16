'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SignInForm } from '@/components/auth/SignInForm'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { resolvePostAuthRedirect } from '@/components/auth/auth-redirect'

type AuthTab = 'sign-in' | 'sign-up'

function toAuthTab(value: string | null): AuthTab {
    return value === 'sign-up' ? 'sign-up' : 'sign-in'
}

export function AuthTabsCard() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const activeTab = toAuthTab(searchParams.get('tab'))
    const reason = searchParams.get('reason')

    const redirectTo = useMemo(() => {
        return resolvePostAuthRedirect(searchParams.get('next'), '/dashboard')
    }, [searchParams])

    const onTabChange = (value: string) => {
        const tab = toAuthTab(value)
        const params = new URLSearchParams(searchParams.toString())
        params.set('tab', tab)

        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return (
        <Card className="w-full border-[#A8DF8E] bg-white shadow-md">
            <CardHeader className="space-y-2 pb-2">
                <CardTitle className="text-2xl text-[#2A2A2A]">Welcome to Pair Engine</CardTitle>
                <CardDescription className="text-[#4B4B4B]">
                    Sign in to continue or create your account in under a minute.
                </CardDescription>
                {reason === 'session-expired' ? (
                    <div className="rounded-xl border border-[#FFAAB8] bg-[#FFD8DF]/50 px-3 py-2 text-sm text-[#5A454B]" role="status">
                        Your session expired. Please sign in again.
                    </div>
                ) : null}
            </CardHeader>

            <CardContent className="pt-4">
                <Tabs value={activeTab} onValueChange={onTabChange}>
                    <TabsList>
                        <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                        <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="sign-in">
                        <SignInForm redirectTo={redirectTo} submitLabel="Sign In" />
                    </TabsContent>

                    <TabsContent value="sign-up">
                        <SignUpForm redirectTo={redirectTo} submitLabel="Create account" />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
