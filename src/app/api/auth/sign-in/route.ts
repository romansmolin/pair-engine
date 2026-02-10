import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { authService } from '@/shared/lib/auth/external-auth.service'
import { getClientIp } from '@/shared/http/get-client-ip'
import { setSessionCookies } from '@/shared/lib/auth/session-cookies'
import { AppError, FieldError } from '@/shared/errors/app-error'
import { asyncHandler } from '@/shared/http/async-handler'

const signInBodySchema = z.object({
    username: z.string().trim().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional().default(false),
})

const methodNotAllowed = () => NextResponse.json({ error: { message: 'Method not allowed' } }, { status: 405 })

export const GET = methodNotAllowed
export const PUT = methodNotAllowed
export const PATCH = methodNotAllowed
export const DELETE = methodNotAllowed

export const POST = asyncHandler(async (request: NextRequest) => {
    let body: unknown

    try {
        body = await request.json()
    } catch {
        throw AppError.validationError('Invalid JSON payload')
    }

    const parsed = signInBodySchema.safeParse(body)

    if (!parsed.success) {
        const fields: FieldError[] = parsed.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }))

        throw AppError.validationError('Invalid sign-in payload', fields)
    }

    const userAgent = request.headers.get('user-agent') ?? undefined
    const ipAddress = getClientIp(request)

    const result = await authService.signIn({
        ...parsed.data,
        userAgent,
        ipAddress,
    })

    const response = NextResponse.json({
        connected: result.connected,
        sessionId: result.sessionId,
        userId: result.userId,
        tokenLogin: result.tokenLogin,
        lang: result.lang,
    })

    setSessionCookies(response, {
        sessionId: result.sessionId,
        userId: result.userId,
        tokenLogin: result.tokenLogin,
        lang: result.lang,
        rememberMe: parsed.data.rememberMe,
    })

    return response
})
