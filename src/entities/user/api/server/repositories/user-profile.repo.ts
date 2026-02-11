import 'server-only'

import { injectable } from 'inversify'
import { HttpError } from '@/shared/errors/http-error'
import type { UpdateProfileRequest } from '@/entities/user/model/types'
import { getEnvVar } from '@/shared/utils/get-env-var'

type ScalarValue = string | number

type QueryParamValue = ScalarValue | ScalarValue[] | undefined

type QueryParams = Record<string, QueryParamValue>

export type ProfilePhotoV2 = {
    normal?: string
    sq_430?: string
    sq_middle?: string
    sq_small?: string
}

export type ProfilePhotoLegacy = {
    url_big?: string
    url_middle?: string
    url_small?: string
}

export type ProfileBlock = {
    id?: number | string
    pseudo?: string
    prenom?: string
    nom_complet?: string
    age?: number | string
    sexe1?: number | string
    zone_name?: string
    email?: string
    visite?: string
    photo?: number | string
    description?: string
    taille?: number | string
    poids?: number | string
    yeux?: number | string
    cheveux?: number | string
    situation?: number | string
    silhouette?: number | string
    personnalite?: number | string
    horaires?: number | string
    sexe2?: number | string
    child?: number | string
    etudes?: number | string
    travail?: number | string
    photos?: ProfilePhotoLegacy[]
    photos_v2?: ProfilePhotoV2[]
}

export type GetProfileApiResponse = {
    connected?: number | string
    result?: ProfileBlock
    error?: string
}

export type UpdateProfileApiResponse = {
    accepted?: number | string
    error?: string
}

type GetProfileInput = {
    sessionId: string
    userId: number
    withPhotos?: boolean
}

type UpdateInformationsInput = {
    sessionId: string
    payload: UpdateProfileRequest
}

type UpdateDescriptionInput = {
    sessionId: string
    description: string
}

const API_BASE_URL = getEnvVar('DATING_EXTERNAL_API_URL')
const API_KEY = getEnvVar('DATING_EXTERNAL_API_KEY')

const cleanParams = (params: QueryParams): QueryParams => {
    return Object.fromEntries(
        Object.entries(params).filter(([, value]) => {
            if (value === undefined) return false
            if (Array.isArray(value)) return value.length > 0
            return value !== ''
        }),
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

    return sanitized
}

const toStatusCode = (status: number): number => {
    return status >= 400 && status < 500 ? 400 : 502
}

const appendQueryParam = (params: URLSearchParams, key: string, value: QueryParamValue): void => {
    if (value === undefined) return

    if (Array.isArray(value)) {
        for (const item of value) {
            params.append(key, String(item))
        }

        return
    }

    params.set(key, String(value))
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

        console.error('[UserProfileRepository] Failed to parse upstream JSON', {
            path,
            status: response.status,
            preview,
        })

        throw new HttpError('User profile upstream returned invalid JSON', 502)
    }
}

const requestPost = async <T>(path: string, params: QueryParams): Promise<T> => {
    const cleanedParams = cleanParams(params)
    const sanitizedParams = sanitizeParams(cleanedParams)

    const url = new URL(path, API_BASE_URL)
    const bodyParams = new URLSearchParams()

    for (const [key, value] of Object.entries(cleanedParams)) {
        appendQueryParam(url.searchParams, key, value)
        appendQueryParam(bodyParams, key, value)
    }

    console.info('[UserProfileRepository] POST upstream request', {
        path,
        params: sanitizedParams,
    })

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
        console.error('[UserProfileRepository] POST upstream network error', {
            path,
            params: sanitizedParams,
            error,
        })

        throw new HttpError('User profile upstream service unavailable', 502)
    }

    const payload = await parseJsonResponse<T & { error?: string }>(response, path)

    console.info('[UserProfileRepository] POST upstream response', {
        path,
        status: response.status,
        ok: response.ok,
    })

    if (!response.ok) {
        console.error('[UserProfileRepository] POST upstream non-ok response', {
            path,
            status: response.status,
            payload,
        })

        throw new HttpError(
            payload.error ?? 'User profile upstream request failed',
            toStatusCode(response.status),
        )
    }

    return payload
}

@injectable()
export class UserProfileRepository {
    async getProfile(input: GetProfileInput): Promise<GetProfileApiResponse> {
        return requestPost<GetProfileApiResponse>('/index_api/user', {
            session_id: input.sessionId,
            api_key: API_KEY,
            id: input.userId,
            get_picture_430: input.withPhotos ? 1 : undefined,
        })
    }

    async updateInformations(input: UpdateInformationsInput): Promise<UpdateProfileApiResponse> {
        return requestPost<UpdateProfileApiResponse>('/index_api/user/modify/informations', {
            session_id: input.sessionId,
            api_key: API_KEY,
            nom_complet: input.payload.fullName,
            'opts_body[]': input.payload.bodyOptions,
            taille: input.payload.height,
            poids: input.payload.weight,
            yeux: input.payload.eyeColor,
            cheveux: input.payload.hairColor,
            situation: input.payload.situation,
            silhouette: input.payload.silhouette,
            personnalite: input.payload.personality,
            horaires: input.payload.schedule,
            sexe2: input.payload.orientation,
            child: input.payload.children,
            etudes: input.payload.education,
            travail: input.payload.profession,
            email: input.payload.email,
            lang_ui: input.payload.langUi,
        })
    }

    async updateDescription(input: UpdateDescriptionInput): Promise<UpdateProfileApiResponse> {
        return requestPost<UpdateProfileApiResponse>('/index_api/user/modify/description', {
            session_id: input.sessionId,
            api_key: API_KEY,
            description: input.description,
        })
    }
}
