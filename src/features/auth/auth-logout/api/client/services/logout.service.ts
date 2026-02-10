import { authClient } from '@/shared/lib/auth/auth-client'

/**
 * Logout service
 * Signs out the current user using Better Auth
 */
export async function logout(): Promise<void> {
    const response = await authClient.signOut()

    if (response.error) {
        throw new Error(response.error.message || 'Logout failed')
    }
}
