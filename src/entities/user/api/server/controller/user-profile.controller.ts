import { inject, injectable } from 'inversify'
import { NextRequest, NextResponse } from 'next/server'
import { AppError } from '@/shared/errors/app-error'
import type { UpdateProfileRequest } from '@/entities/user/model/types'
import { UserProfileService } from '../services/user-profile.service'

const parseOptionalNumber = (value: unknown): number | undefined => {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : undefined
    }

    if (typeof value === 'string') {
        const trimmed = value.trim()
        if (!trimmed) return undefined

        const parsed = Number(trimmed)
        return Number.isFinite(parsed) ? parsed : undefined
    }

    return undefined
}

const parseOptionalString = (value: unknown): string | undefined => {
    if (typeof value !== 'string') return undefined

    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
}

const parseBodyOptions = (value: unknown): number[] | undefined => {
    if (!Array.isArray(value)) {
        return undefined
    }

    const parsed = value
        .map(parseOptionalNumber)
        .filter((item): item is number => item !== undefined)

    return parsed.length > 0 ? parsed : undefined
}

const parseUserId = (request: NextRequest): number => {
    const rawUserId =
        request.cookies.get('dating_user_id')?.value ??
        request.cookies.get('fotochat_user_id')?.value

    if (!rawUserId) {
        throw AppError.authenticationError('Authentication required')
    }

    const parsed = Number.parseInt(rawUserId, 10)

    if (!Number.isFinite(parsed) || parsed < 1) {
        throw AppError.authenticationError('Authentication required')
    }

    return parsed
}

const parseSessionId = (request: NextRequest): string => {
    const sessionId =
        request.cookies.get('dating_session_id')?.value ??
        request.cookies.get('fotochat_session_id')?.value

    if (!sessionId) {
        throw AppError.authenticationError('Authentication required')
    }

    return sessionId
}

const parsePatchPayload = (body: unknown): UpdateProfileRequest => {
    if (typeof body !== 'object' || body == null) {
        throw AppError.validationError('Invalid request payload', [
            {
                field: 'body',
                message: 'body must be an object',
            },
        ])
    }

    const payload = body as Record<string, unknown>

    const fullName = parseOptionalString(payload.fullName)

    if (!fullName) {
        throw AppError.validationError('Invalid request payload', [
            {
                field: 'fullName',
                message: 'fullName is required and must be a non-empty string',
            },
        ])
    }

    return {
        fullName,
        height: parseOptionalNumber(payload.height),
        weight: parseOptionalNumber(payload.weight),
        eyeColor: parseOptionalNumber(payload.eyeColor),
        hairColor: parseOptionalNumber(payload.hairColor),
        situation: parseOptionalNumber(payload.situation),
        silhouette: parseOptionalNumber(payload.silhouette),
        personality: parseOptionalNumber(payload.personality),
        schedule: parseOptionalNumber(payload.schedule),
        orientation: parseOptionalNumber(payload.orientation),
        children: parseOptionalNumber(payload.children),
        education: parseOptionalNumber(payload.education),
        profession: parseOptionalNumber(payload.profession),
        email: parseOptionalString(payload.email),
        langUi: parseOptionalString(payload.langUi),
        bodyOptions: parseBodyOptions(payload.bodyOptions),
        description: typeof payload.description === 'string' ? payload.description : undefined,
    }
}

@injectable()
export class UserProfileController {
    constructor(@inject(UserProfileService) private userProfileService: UserProfileService) {}

    async getProfile(request: NextRequest): Promise<NextResponse> {
        const sessionId = parseSessionId(request)
        const userId = parseUserId(request)

        const response = await this.userProfileService.getProfile(sessionId, userId)

        return NextResponse.json(response)
    }

    async patchProfile(request: NextRequest): Promise<NextResponse> {
        const sessionId = parseSessionId(request)

        let body: unknown

        try {
            body = await request.json()
        } catch {
            throw AppError.validationError('Invalid JSON payload')
        }

        const payload = parsePatchPayload(body)
        const response = await this.userProfileService.updateProfile(sessionId, payload)

        return NextResponse.json(response)
    }
}
