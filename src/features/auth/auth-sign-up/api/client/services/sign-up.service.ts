import { apiClient } from '@/shared/api/client/axios.config'
import { SignUpDto } from '@/features/auth/auth-sign-up/contracts/sign-up.dto'

export interface SignUpResponse {
    accepted: 1
    sessionId: string
    userId: string
    lang?: string
}

export async function signUp(data: SignUpDto): Promise<SignUpResponse> {
    const payload = {
        username: data.username.trim(),
        password: data.password,
        email: data.email,
        gender: data.gender,
        lookingFor: data.lookingFor,
        dateOfBirth: data.dateOfBirth,
        city: data.city?.trim() ? data.city.trim() : undefined,
    }

    const response = await apiClient.post<SignUpResponse>('/api/auth/sign-up', {
        ...payload,
    })

    return response.data
}
