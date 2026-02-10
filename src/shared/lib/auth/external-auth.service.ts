import 'server-only'

import { HttpError } from '@/shared/errors/http-error'
import { getEnvVar } from '@/shared/utils/get-env-var'
import type {
    ExternalSignInInput,
    ExternalSignInResult,
    ExternalSignUpInput,
    ExternalSignUpResult,
    Gender,
    LookingFor,
} from './external-auth.types'

type QueryParamValue = string | number | undefined | null
type QueryParams = Record<string, QueryParamValue>

type ExternalSignUpResponse = {
    accepted?: number | string
    session_id?: string
    user_id?: string | number
    lang?: string
    error?: string
}

type ExternalSignInResponse = {
    connected?: number | string
    session_id?: string
    user_id?: string | number
    token_login?: string
    lang?: string
    error?: string
}

const API_BASE_URL = getEnvVar('DATING_EXTERNAL_API_URL')
const API_KEY = getEnvVar('DATING_EXTERNAL_API_KEY')

const isSuccessFlag = (value: unknown): boolean => value === 1 || value === '1'

export const mapGenderToApi = (gender: Gender): string => gender

export const mapLookingForToApi = (lookingFor: LookingFor): string => lookingFor

export const toOptionalNumber = (value?: string): number | undefined => {
    if (!value) return undefined
    const trimmed = value.trim()
    if (!trimmed) return undefined
    const parsed = Number(trimmed)
    return Number.isFinite(parsed) ? parsed : undefined
}

export const cleanParams = <T extends QueryParams>(params: T): QueryParams => {
    return Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
    )
}

const buildUrl = (path: string, params: QueryParams): URL => {
    const url = new URL(path, API_BASE_URL)

    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === '') continue
        url.searchParams.set(key, String(value))
    }

    return url
}

const parseJsonResponse = async <T>(response: Response): Promise<T> => {
    try {
        return (await response.json()) as T
    } catch {
        throw new HttpError('External auth service returned invalid JSON', 502)
    }
}

async function requestExternal<T>(path: string, params: QueryParams): Promise<T> {
    const url = buildUrl(path, cleanParams(params))

    let response: Response
    try {
        response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            cache: 'no-store',
        })
    } catch {
        throw new HttpError('External auth service unavailable', 502)
    }

    const payload = await parseJsonResponse<T>(response)

    if (!response.ok) {
        const errorMessage = (payload as { error?: string })?.error || 'External auth request failed'
        throw new HttpError(errorMessage, response.status >= 400 && response.status < 500 ? 400 : 502)
    }

    return payload
}

async function signUp(payload: ExternalSignUpInput): Promise<ExternalSignUpResult> {
    const response = await requestExternal<ExternalSignUpResponse>('/index_api/subscribe', {
        login: payload.username,
        pass: payload.password,
        mail: payload.email,
        'fast-part': '1',
        sex: mapGenderToApi(payload.gender),
        cherche1: mapLookingForToApi(payload.lookingFor),
        birthday_date: payload.dateOfBirth,
        ip_adress: payload.ipAddress ?? '0.0.0.0',
        city: toOptionalNumber(payload.city),
        browser: payload.userAgent,
        lang_ui: 'en',
        api_key: API_KEY,
    })

    if (!isSuccessFlag(response.accepted) || !response.session_id || !response.user_id) {
        throw new HttpError(response.error ?? 'Registration failed', 400)
    }

    return {
        accepted: 1,
        sessionId: response.session_id,
        userId: String(response.user_id),
        lang: response.lang,
    }
}

async function signIn(payload: ExternalSignInInput): Promise<ExternalSignInResult> {
    const response = await requestExternal<ExternalSignInResponse>('/index_api/login', {
        login: payload.username,
        pass: payload.password,
        rememberme: payload.rememberMe ? '1' : undefined,
        browser: payload.userAgent,
        api_key: API_KEY,
    })

    if (!isSuccessFlag(response.connected) || !response.session_id || !response.user_id) {
        throw new HttpError('Invalid credentials', 401)
    }

    return {
        connected: 1,
        sessionId: response.session_id,
        userId: String(response.user_id),
        tokenLogin: response.token_login,
        lang: response.lang,
    }
}

export const authService = {
    signUp,
    signIn,
}
