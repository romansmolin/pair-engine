import 'server-only'

import { injectable } from 'inversify'
import { HttpError } from '@/shared/errors/http-error'
import { getEnvVar } from '@/shared/utils/get-env-var'

type QueryValue = string | number | undefined

type QueryParams = Record<string, QueryValue>

export type WallAddPhotoBlock = {
    user_id?: number
    pseudo?: string
    nb?: number
    jour?: string
    cherche1?: number
}

export type WallBirthdayBlock = {
    id?: number
    pseudo?: string
    sexe1?: number
    cherche1?: number
}

export type WallChangeBlock = {
    id?: number
    pseudo?: string
    date_modification?: string
    cherche1?: number
}

export type WallFriendsBlock = {
    id1?: number
    pseudo1?: string
    id2?: number
    pseudo2?: string
    date?: string
    sexe1?: number
}

export type WallOnlineBlock = {
    id?: number
    pseudo?: string
    sexe1?: number
    date?: string
    cherche1?: number
}

export type GetActivitiesResponse = {
    wall_addPhoto?: WallAddPhotoBlock
    wall_birthday?: WallBirthdayBlock
    wall_change?: WallChangeBlock
    wall_friends?: WallFriendsBlock
    wall_online?: WallOnlineBlock
}

export type MembreBlock = {
    id?: number | string
    user_id?: number | string
    pseudo?: string
    prenom?: string
    sexe1?: number | string
    age?: number | string
    zone_name?: string
    moyenne?: number | string
    photo?: string
    photos?: unknown
}

export type MembrePhoto = {
    sq_small?: string
    sq_middle?: string
    normal?: string
}

export type TopMembersResponse = {
    connected?: number | string
    nb_pages?: number | string
    result?: MembreBlock[]
}

export type GuestVisitesResponse = {
    connected?: number | string
    nb_pages?: number | string
    result?: MembreBlock[]
}

type TopMembersParams = {
    sessionId: string
    sex: 'man' | 'woman'
    ageRange?: string
    page?: number
}

type RecentVisitorsParams = {
    sessionId: string
    page?: number
}

const API_BASE_URL = getEnvVar('DATING_EXTERNAL_API_URL')
const API_KEY = getEnvVar('DATING_EXTERNAL_API_KEY')

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

    return sanitized
}

const cleanParams = (params: QueryParams): QueryParams => {
    return Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== ''),
    )
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

        console.error('[DashboardRepository] Failed to parse upstream JSON', {
            path,
            status: response.status,
            preview,
        })

        throw new HttpError('Dashboard upstream returned invalid JSON', 502)
    }
}

const requestGet = async <T>(path: string, params: QueryParams): Promise<T> => {
    const url = buildUrl(path, params)
    const sanitizedParams = sanitizeParams(params)

    console.info('[DashboardRepository] GET upstream request', {
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
        console.error('[DashboardRepository] GET upstream network error', {
            path,
            params: sanitizedParams,
            error,
        })
        throw new HttpError('Dashboard upstream service unavailable', 502)
    }

    const payload = await parseJsonResponse<T & { error?: string }>(response, path)

    console.info('[DashboardRepository] GET upstream response', {
        path,
        status: response.status,
        ok: response.ok,
    })

    if (!response.ok) {
        console.error('[DashboardRepository] GET upstream non-ok response', {
            path,
            status: response.status,
            payload,
        })
        throw new HttpError(
            payload.error ?? 'Dashboard upstream request failed',
            toStatusCode(response.status),
        )
    }

    return payload
}

const requestPost = async <T>(path: string, params: QueryParams): Promise<T> => {
    const url = new URL(path, API_BASE_URL)
    const bodyParams = new URLSearchParams()
    const sanitizedParams = sanitizeParams(params)
    const cleanedParams = cleanParams(params)

    console.info('[DashboardRepository] POST upstream request', {
        path,
        params: sanitizedParams,
    })

    for (const [key, value] of Object.entries(cleanedParams)) {
        // Some Fotochat endpoints validate api_key/session_id from query even on POST,
        // so we send params both in URL query and x-www-form-urlencoded body.
        url.searchParams.set(key, String(value))
        bodyParams.set(key, String(value))
    }

    let response: Response
    try {
        response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: bodyParams.toString(),
            cache: 'no-store',
        })
    } catch (error) {
        console.error('[DashboardRepository] POST upstream network error', {
            path,
            params: sanitizedParams,
            error,
        })
        throw new HttpError('Dashboard upstream service unavailable', 502)
    }

    const payload = await parseJsonResponse<T & { error?: string }>(response, path)

    console.info('[DashboardRepository] POST upstream response', {
        path,
        status: response.status,
        ok: response.ok,
    })

    if (!response.ok) {
        console.error('[DashboardRepository] POST upstream non-ok response', {
            path,
            status: response.status,
            payload,
        })
        throw new HttpError(
            payload.error ?? 'Dashboard upstream request failed',
            toStatusCode(response.status),
        )
    }

    return payload
}

@injectable()
export class DashboardRepository {
    async getActivities(sessionId: string): Promise<GetActivitiesResponse> {
        const payload = await requestGet<GetActivitiesResponse>('/ajax_api/getActivities', {
            session_id: sessionId,
            api_key: API_KEY,
        })

        console.info('[DashboardRepository] getActivities payload received', {
            hasWallOnline: Boolean(payload.wall_online),
            hasWallChange: Boolean(payload.wall_change),
            hasWallAddPhoto: Boolean(payload.wall_addPhoto),
            hasWallBirthday: Boolean(payload.wall_birthday),
            hasWallFriends: Boolean(payload.wall_friends),
        })

        return payload
    }

    async getTopMembers(params: TopMembersParams): Promise<TopMembersResponse> {
        return requestPost<TopMembersResponse>('/index_api/topmembers', {
            session_id: params.sessionId,
            api_key: API_KEY,
            sex: params.sex,
            age_range: params.ageRange,
            page: params.page,
        })
    }

    async getRecentVisitors(params: RecentVisitorsParams): Promise<GuestVisitesResponse> {
        return requestPost<GuestVisitesResponse>('/index_api/guest/get/visites', {
            session_id: params.sessionId,
            api_key: API_KEY,
            page: params.page,
        })
    }
}
