import { NextResponse } from 'next/server'

type SetSessionCookiesInput = {
    sessionId: string
    userId: string
    lang?: string
    tokenLogin?: string
    rememberMe?: boolean
}

const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30

const createCookieOptions = (rememberMe?: boolean) => {
    const options = {
        httpOnly: true,
        sameSite: 'lax' as const,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    }

    if (rememberMe === false) return options

    return {
        ...options,
        maxAge: THIRTY_DAYS_IN_SECONDS,
    }
}

export function setSessionCookies(response: NextResponse, input: SetSessionCookiesInput): void {
    const options = createCookieOptions(input.rememberMe)

    response.cookies.set('dating_session_id', input.sessionId, options)
    response.cookies.set('dating_user_id', input.userId, options)

    if (input.lang) {
        response.cookies.set('dating_lang', input.lang, options)
    }

    if (input.tokenLogin) {
        response.cookies.set('dating_token_login', input.tokenLogin, options)
    }
}

export function clearSessionCookies(response: NextResponse): void {
    const options = {
        httpOnly: true,
        sameSite: 'lax' as const,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0,
    }

    response.cookies.set('dating_session_id', '', options)
    response.cookies.set('dating_user_id', '', options)
    response.cookies.set('dating_lang', '', options)
    response.cookies.set('dating_token_login', '', options)
    response.cookies.set('fotochat_session_id', '', options)
    response.cookies.set('fotochat_user_id', '', options)
}
