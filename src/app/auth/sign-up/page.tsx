import { redirect } from 'next/navigation'
import { toSingleQueryValue } from '@/components/auth/auth-redirect'

type SignUpPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
    const params = await searchParams
    const next = toSingleQueryValue(params.next)
    const reason = toSingleQueryValue(params.reason)

    const redirectParams = new URLSearchParams({ tab: 'sign-up' })

    if (next) {
        redirectParams.set('next', next)
    }

    if (reason) {
        redirectParams.set('reason', reason)
    }

    redirect(`/auth/sign-in?${redirectParams.toString()}`)
}
