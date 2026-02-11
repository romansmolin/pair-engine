import 'server-only'

import { injectable } from 'inversify'
import { HttpError } from '@/shared/errors/http-error'
import { getEnvVar } from '@/shared/utils/get-env-var'

type QueryValue = string | number | undefined

type QueryParams = Record<string, QueryValue>

export type ContactBlock = {
    m_id?: number | string
    pseudo?: string
    photo?: string
    nb_new?: number | string
    online?: string
    is_friend?: number | string
    tab_last_msg?: string | string[] | null
}

export type LoadContactsResponse = {
    contacts?: ContactBlock[]
    error?: string
}

export type EclairBlock = {
    id?: number | string
    exp?: number | string
    date?: string
    msg?: string
    p_extra?: string
    album_share?: string
    state?: string
}

export type LoadMessagesResponse = {
    credits_counter?: number | string
    eclairs?: EclairBlock[]
    error?: string
}

export type SendMessageApiResponse = {
    notification?: string
    msg?: string
    p_extra?: string
    date?: string
    id?: number | string
    error?: string
}

type LoadMessagesParams = {
    sessionId: string
    contactId: number
    contact?: string
}

type SendMessageParams = {
    sessionId: string
    contactId: number
    contact?: string
    message: string
}

const API_BASE_URL = getEnvVar('DATING_EXTERNAL_API_URL')
const API_KEY = getEnvVar('DATING_EXTERNAL_API_KEY')

const cleanParams = (params: QueryParams): QueryParams => {
    return Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== ''),
    )
}

const maskValue = (value?: string): string | undefined => {
    if (!value) return undefined
    if (value.length <= 6) return '***'
    return `${value.slice(0, 3)}***${value.slice(-3)}`
}

const sanitizeParams = (params: QueryParams): QueryParams => {
    const sanitized: QueryParams = { ...params }

    if (typeof sanitized.session_id === 'string') {
        sanitized.session_id = maskValue(sanitized.session_id)
    }

    if (typeof sanitized.api_key === 'string') {
        sanitized.api_key = '***'
    }

    if (typeof sanitized['api-key'] === 'string') {
        sanitized['api-key'] = '***'
    }

    return sanitized
}

const toStatusCode = (status: number): number => {
    return status >= 400 && status < 500 ? 400 : 502
}

const buildUrl = (path: string, params: QueryParams): URL => {
    const url = new URL(path, API_BASE_URL)

    for (const [key, value] of Object.entries(cleanParams(params))) {
        url.searchParams.set(key, String(value))
    }

    return url
}

const parseJsonResponse = async <T>(response: Response, path: string): Promise<T> => {
    const responseForDebug = response.clone()

    try {
        return (await response.json()) as T
    } catch {
        let preview = ''

        try {
            preview = (await responseForDebug.text()).slice(0, 300)
        } catch {
            preview = '[unavailable]'
        }

        console.error('[ChatRepository] Failed to parse upstream JSON', {
            path,
            status: response.status,
            preview,
        })

        throw new HttpError('Chat upstream returned invalid JSON', 502)
    }
}

const requestGet = async <T>(path: string, params: QueryParams): Promise<T> => {
    const url = buildUrl(path, params)
    const sanitizedParams = sanitizeParams(params)

    console.info('[ChatRepository] GET upstream request', {
        path,
        params: sanitizedParams,
    })

    let response: Response

    try {
        response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
            cache: 'no-store',
        })
    } catch (error) {
        console.error('[ChatRepository] GET upstream network error', {
            path,
            params: sanitizedParams,
            error,
        })
        throw new HttpError('Chat upstream service unavailable', 502)
    }

    const payload = await parseJsonResponse<T & { error?: string }>(response, path)

    console.info('[ChatRepository] GET upstream response', {
        path,
        status: response.status,
        ok: response.ok,
    })

    if (!response.ok) {
        console.error('[ChatRepository] GET upstream non-ok response', {
            path,
            status: response.status,
            payload,
        })

        throw new HttpError(payload.error ?? 'Chat upstream request failed', toStatusCode(response.status))
    }

    return payload
}

@injectable()
export class ChatRepository {
    async loadContacts(sessionId: string): Promise<LoadContactsResponse> {
        return requestGet<LoadContactsResponse>('/ajax_api/load_contacts', {
            session_id: sessionId,
            filter: 1,
            api_key: API_KEY,
        })
    }

    async loadMessages(params: LoadMessagesParams): Promise<LoadMessagesResponse> {
        return requestGet<LoadMessagesResponse>('/ajax_api/load_messages', {
            session_id: params.sessionId,
            contact_id: params.contactId,
            contact: params.contact,
            api_key: API_KEY,
            'api-key': API_KEY,
        })
    }

    async sendMessage(params: SendMessageParams): Promise<SendMessageApiResponse> {
        return requestGet<SendMessageApiResponse>('/ajax_api/send_message', {
            session_id: params.sessionId,
            contact_id: params.contactId,
            contact: params.contact,
            msg: params.message,
            api_key: API_KEY,
            'api-key': API_KEY,
        })
    }
}
