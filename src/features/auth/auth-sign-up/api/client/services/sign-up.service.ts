import { apiClient } from '@/shared/api/client/axios.config'
import { SignUpDto } from '@/features/auth/auth-sign-up/contracts/sign-up.dto'

export interface SignUpResponse {
    token: string | null
    user: {
        id: string
        email: string
        name: string
    }
}

export async function signUp(data: SignUpDto): Promise<SignUpResponse> {
    const payload = {
        name: data.username.trim(),
        password: data.password,
        email: data.email,
        callbackURL: '/dashboard',
    }

    const response = await apiClient.post<SignUpResponse>('/api/auth/sign-up/email', {
        ...payload,
    })

    return response.data
}
