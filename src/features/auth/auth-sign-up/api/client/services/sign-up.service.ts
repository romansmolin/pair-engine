import { authClient } from '@/shared/lib/auth/auth-client'
import { SignUpDto } from '@/features/auth/auth-sign-up/contracts/sign-up.dto'

export interface SignUpResponse {
    user: {
        id: string
        email: string
        name: string
    }
    message?: string
}

export async function signUp(data: SignUpDto): Promise<SignUpResponse> {
    const { consent: _consent, ...payload } = data
    const response = await authClient.signUp.email({
        email: payload.email,
        password: payload.password,
        name: payload.name,
    })

    if (response.error) throw new Error(response.error.message || 'Sign up failed')

    return {
        user: {
            id: response.data?.user?.id || '',
            email: response.data?.user?.email || payload.email,
            name: response.data?.user?.name || payload.name,
        },
        message: 'Account created successfully',
    }
}
