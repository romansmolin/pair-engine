import { api } from '@/shared/api/client/api'
import { signUp, SignUpResponse } from './services/sign-up.service'
import { SignUpDto } from '@/features/auth/auth-sign-up/contracts/sign-up.dto'
import { normalizeError } from '@/shared/api/client/error-normalizer'

/**
 * Sign up API endpoints
 */
export const signUpApi = api.injectEndpoints({
    endpoints: (builder) => ({
        signUp: builder.mutation<SignUpResponse, SignUpDto>({
            queryFn: async (data) => {
                try {
                    const result = await signUp(data)
                    return { data: result }
                } catch (error) {
                    const normalized = normalizeError(error)
                    return {
                        error: {
                            status: 'CUSTOM_ERROR' as const,
                            data: normalized,
                            error: normalized.message,
                        },
                    }
                }
            },
            invalidatesTags: ['Auth', 'User'],
        }),
    }),
})

export const { useSignUpMutation } = signUpApi
