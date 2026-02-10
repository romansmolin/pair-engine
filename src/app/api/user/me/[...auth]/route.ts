import { auth } from '@/shared/lib/auth/auth.config'
import { toNextJsHandler } from 'better-auth/next-js'

/**
 * Better Auth catch-all route handler
 *
 * This handler provides the following endpoints:
 * - POST /api/auth/sign-up - Register new user
 * - POST /api/auth/sign-in - Sign in with email/password
 * - POST /api/auth/sign-out - Sign out
 * - GET /api/auth/session - Get current session
 * - GET /api/auth/google - OAuth redirect
 * - GET /api/auth/google/callback - OAuth callback
 * - GET /api/auth/verify-email?token=xxx - Verify email
 */

export const { GET, POST } = toNextJsHandler(auth)
