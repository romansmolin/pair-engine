import { authClient } from '@/shared/lib/auth/auth-client'
import { SignInDto } from '@/features/auth/auth-sign-in/contracts/sign-in.dto'

export interface SignInResponse {
    user: {
        id: string
        email: string
        name: string
    }
    session: {
        token: string
        expiresAt: string
    }
}

export async function signIn(data: SignInDto): Promise<SignInResponse> {
    const { consent: _consent, ...payload } = data
    const response = await authClient.signIn.email({
        email: payload.email,
        password: payload.password,
    })

    if (response.error) throw new Error(response.error.message || 'Sign in failed')

    if (!response.data) throw new Error('Sign in failed: no data returned')

    return {
        user: {
            id: response.data.user.id,
            email: response.data.user.email,
            name: response.data.user.name,
        },
        session: {
            token: response.data.token || '',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
    }
}
