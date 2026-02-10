import { api } from '@/shared/api/client/api'
import { signIn, SignInResponse } from './services/sign-in.service'
import { SignInDto } from '@/features/auth/auth-sign-in/contracts/sign-in.dto'
import { normalizeError } from '@/shared/api/client/error-normalizer'

/**
 * Sign in API endpoints
 */
export const signInApi = api.injectEndpoints({
    endpoints: (builder) => ({
        signIn: builder.mutation<SignInResponse, SignInDto>({
            queryFn: async (data) => {
                try {
                    const result = await signIn(data)
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

export const { useSignInMutation } = signInApi
