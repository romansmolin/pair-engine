import { inject, injectable } from 'inversify'
import { AppError } from '@/shared/errors/app-error'
import type {
    CommunityActivityItem,
    CommunityActivityResponse,
    MemberGender,
    MemberSummary,
    RecentVisitorsResponse,
    TopMembersResponse,
} from '@/entities/dashboard/model/types'
import {
    DashboardRepository,
    type GetActivitiesResponse,
    type MembreBlock,
} from '../repositories/dashboard.repo'

type TopMembersFilters = {
    sex: 'man' | 'woman'
    page?: number
    ageRange?: string
}

type RecentVisitorsFilters = {
    page?: number
}

const toNumber = (value?: number | string): number | undefined => {
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

const toInteger = (value?: number | string): number | undefined => {
    const parsed = toNumber(value)

    if (parsed === undefined || !Number.isInteger(parsed)) {
        return undefined
    }

    return parsed
}

const toPositiveInteger = (value?: number | string): number | undefined => {
    const parsed = toInteger(value)

    if (parsed === undefined || parsed < 1) {
        return undefined
    }

    return parsed
}

const mapGender = (value?: number | string): MemberGender | undefined => {
    const normalizedValue = toInteger(value)

    if (normalizedValue === 1) return 'man'
    if (normalizedValue === 2) return 'woman'
    if (normalizedValue === 3) return 'couple'
    return undefined
}

const parsePage = (value: string | null): number | undefined => {
    if (!value) return undefined

    const page = Number.parseInt(value, 10)
    if (!Number.isFinite(page) || page < 1) {
        throw AppError.validationError('Invalid page query parameter', [
            { field: 'page', message: 'Page must be a positive integer' },
        ])
    }

    return page
}

const normalizeOptionalText = (value: string | null): string | undefined => {
    if (value == null) return undefined
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
}

const normalizePhotoUrl = (value?: string): string | undefined => {
    if (!value) return undefined
    const trimmed = value.trim()
    if (!trimmed) return undefined

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed
    }

    return undefined
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null
}

const extractPhotoUrl = (value: unknown): string | undefined => {
    if (!value) return undefined

    if (typeof value === 'string') {
        const direct = normalizePhotoUrl(value)
        if (direct) return direct

        const trimmed = value.trim()
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            try {
                return extractPhotoUrl(JSON.parse(trimmed))
            } catch {
                return undefined
            }
        }

        return undefined
    }

    if (Array.isArray(value)) {
        for (const item of value) {
            const resolved = extractPhotoUrl(item)
            if (resolved) return resolved
        }
        return undefined
    }

    if (!isRecord(value)) {
        return undefined
    }

    const preferred =
        normalizePhotoUrl(typeof value.sq_middle === 'string' ? value.sq_middle : undefined) ??
        normalizePhotoUrl(typeof value.normal === 'string' ? value.normal : undefined) ??
        normalizePhotoUrl(typeof value.sq_small === 'string' ? value.sq_small : undefined) ??
        normalizePhotoUrl(typeof value.photo_url === 'string' ? value.photo_url : undefined)

    if (preferred) {
        return preferred
    }

    for (const nestedValue of Object.values(value)) {
        const resolved = extractPhotoUrl(nestedValue)
        if (resolved) return resolved
    }

    return undefined
}

const toMemberSummary = (member: MembreBlock): MemberSummary | null => {
    const username = member.pseudo?.trim()
    const id = toPositiveInteger(member.id) ?? toPositiveInteger(member.user_id)

    if (!id || !username) {
        return null
    }

    const result: MemberSummary = {
        id,
        username,
        gender: mapGender(member.sexe1),
        photoUrl: extractPhotoUrl(member.photos) ?? normalizePhotoUrl(member.photo),
    }

    const age = toPositiveInteger(member.age)
    if (age !== undefined) {
        result.age = age
    }

    if (member.zone_name?.trim()) {
        result.location = member.zone_name.trim()
    }

    const rating = toNumber(member.moyenne)
    if (rating !== undefined) {
        result.rating = rating
    }

    return result
}

const pushActivity = (items: CommunityActivityItem[], item: CommunityActivityItem | null): void => {
    if (item) {
        items.push(item)
    }
}

const getTopMembersFilters = (searchParams: URLSearchParams): TopMembersFilters => {
    const gender = searchParams.get('gender')

    if (gender !== 'men' && gender !== 'women') {
        throw AppError.validationError('Invalid gender query parameter', [
            { field: 'gender', message: 'gender must be one of: men, women' },
        ])
    }

    return {
        sex: gender === 'men' ? 'man' : 'woman',
        page: parsePage(searchParams.get('page')),
        ageRange:
            normalizeOptionalText(searchParams.get('ageRange')) ??
            normalizeOptionalText(searchParams.get('age_range')),
    }
}

const getRecentVisitorsFilters = (searchParams: URLSearchParams): RecentVisitorsFilters => {
    return {
        page: parsePage(searchParams.get('page')),
    }
}

const toActivityItems = (payload: GetActivitiesResponse): CommunityActivityItem[] => {
    const items: CommunityActivityItem[] = []

    pushActivity(
        items,
        payload.wall_online?.pseudo
            ? {
                  id: payload.wall_online.id ?? `online-${payload.wall_online.pseudo}`,
                  username: payload.wall_online.pseudo,
                  gender: mapGender(payload.wall_online.sexe1),
                  action: 'con',
                  timestamp: payload.wall_online.date,
              }
            : null,
    )

    pushActivity(
        items,
        payload.wall_change?.pseudo
            ? {
                  id: payload.wall_change.id ?? `change-${payload.wall_change.pseudo}`,
                  username: payload.wall_change.pseudo,
                  action: 'modif',
                  timestamp: payload.wall_change.date_modification,
              }
            : null,
    )

    pushActivity(
        items,
        payload.wall_addPhoto?.pseudo
            ? {
                  id: payload.wall_addPhoto.user_id ?? `photo-${payload.wall_addPhoto.pseudo}`,
                  username: payload.wall_addPhoto.pseudo,
                  action: 'add_tof',
                  timestamp: payload.wall_addPhoto.jour,
              }
            : null,
    )

    pushActivity(
        items,
        payload.wall_birthday?.pseudo
            ? {
                  id: payload.wall_birthday.id ?? `birthday-${payload.wall_birthday.pseudo}`,
                  username: payload.wall_birthday.pseudo,
                  gender: mapGender(payload.wall_birthday.sexe1),
                  action: 'birthday',
              }
            : null,
    )

    pushActivity(
        items,
        payload.wall_friends?.pseudo1
            ? {
                  id:
                      payload.wall_friends.id1 ??
                      payload.wall_friends.id2 ??
                      `friends-${payload.wall_friends.pseudo1}`,
                  username: payload.wall_friends.pseudo1,
                  gender: mapGender(payload.wall_friends.sexe1),
                  action: 'friends',
                  timestamp: payload.wall_friends.date,
              }
            : null,
    )

    return items
}

const getTotalPages = (value?: number | string): number | undefined => {
    return toPositiveInteger(value)
}

@injectable()
export class DashboardService {
    constructor(@inject(DashboardRepository) private repository: DashboardRepository) {}

    async getCommunityActivity(sessionId: string): Promise<CommunityActivityResponse> {
        console.info('[DashboardService] getCommunityActivity start')
        const payload = await this.repository.getActivities(sessionId)
        const items = toActivityItems(payload)

        console.info('[DashboardService] getCommunityActivity normalized', {
            itemsCount: items.length,
        })

        return {
            items,
        }
    }

    async getTopMembers(
        sessionId: string,
        searchParams: URLSearchParams,
    ): Promise<TopMembersResponse> {
        const filters = getTopMembersFilters(searchParams)
        const payload = await this.repository.getTopMembers({
            sessionId,
            sex: filters.sex,
            ageRange: filters.ageRange,
            page: filters.page,
        })
        const items = (payload.result ?? [])
            .map(toMemberSummary)
            .filter((item): item is MemberSummary => item != null)

        console.info('[DashboardService] getTopMembers normalized', {
            itemsCount: items.length,
            itemsWithPhoto: items.filter((item) => Boolean(item.photoUrl)).length,
        })

        return {
            items,
            page: filters.page,
            totalPages: getTotalPages(payload.nb_pages),
        }
    }

    async getRecentVisitors(
        sessionId: string,
        searchParams: URLSearchParams,
    ): Promise<RecentVisitorsResponse> {
        const filters = getRecentVisitorsFilters(searchParams)

        const payload = await this.repository.getRecentVisitors({
            sessionId,
            page: filters.page,
        })
        const items = (payload.result ?? [])
            .map(toMemberSummary)
            .filter((item): item is MemberSummary => item != null)

        console.info('[DashboardService] getRecentVisitors normalized', {
            itemsCount: items.length,
            itemsWithPhoto: items.filter((item) => Boolean(item.photoUrl)).length,
        })

        return {
            items,
            page: filters.page,
            totalPages: getTotalPages(payload.nb_pages),
        }
    }
}
