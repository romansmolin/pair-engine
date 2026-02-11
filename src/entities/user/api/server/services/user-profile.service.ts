import { inject, injectable } from 'inversify'
import { AppError } from '@/shared/errors/app-error'
import type {
    UpdateProfileRequest,
    UpdateProfileResponse,
    UserGender,
    UserProfile,
    UserProfileResponse,
    UserProfilePhoto,
} from '@/entities/user/model/types'
import {
    UserProfileRepository,
    type ProfileBlock,
    type ProfilePhotoLegacy,
    type ProfilePhotoV2,
    type UpdateProfileApiResponse,
} from '../repositories/user-profile.repo'

const normalizeText = (value?: string | null): string | undefined => {
    if (!value) return undefined

    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
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

const mapGender = (value?: number | string): UserGender | undefined => {
    const gender = toInteger(value)

    if (gender === 1) return 'man'
    if (gender === 2) return 'woman'
    if (gender === 3) return 'couple'

    return undefined
}

const mapPhotoV2 = (photo: ProfilePhotoV2): UserProfilePhoto | null => {
    const large = normalizeText(photo.sq_430) ?? normalizeText(photo.normal)
    const medium = normalizeText(photo.sq_middle) ?? normalizeText(photo.normal)
    const small = normalizeText(photo.sq_small)

    if (!large && !medium && !small) {
        return null
    }

    return {
        large,
        medium,
        small,
    }
}

const mapPhotoLegacy = (photo: ProfilePhotoLegacy): UserProfilePhoto | null => {
    const large = normalizeText(photo.url_big)
    const medium = normalizeText(photo.url_middle)
    const small = normalizeText(photo.url_small)

    if (!large && !medium && !small) {
        return null
    }

    return {
        large,
        medium,
        small,
    }
}

const getPhotos = (profile: ProfileBlock): UserProfilePhoto[] => {
    const photosV2 = (profile.photos_v2 ?? [])
        .map(mapPhotoV2)
        .filter((photo): photo is UserProfilePhoto => photo != null)

    if (photosV2.length > 0) {
        return photosV2
    }

    return (profile.photos ?? [])
        .map(mapPhotoLegacy)
        .filter((photo): photo is UserProfilePhoto => photo != null)
}

const toUserProfile = (profile: ProfileBlock): UserProfile => {
    const photos = getPhotos(profile)

    const mapped: UserProfile = {
        id: toPositiveInteger(profile.id) ?? 0,
        username: normalizeText(profile.pseudo) ?? 'Member',
        fullName: normalizeText(profile.nom_complet) ?? normalizeText(profile.prenom),
        gender: mapGender(profile.sexe1),
        location: normalizeText(profile.zone_name),
        email: normalizeText(profile.email),
        lastVisit: normalizeText(profile.visite),
        avatarUrl: photos[0]?.large ?? photos[0]?.medium ?? photos[0]?.small,
        photos,
        photoCount: toPositiveInteger(profile.photo),
        description: normalizeText(profile.description),
        age: toPositiveInteger(profile.age),
        height: toInteger(profile.taille),
        weight: toInteger(profile.poids),
        eyeColor: toInteger(profile.yeux),
        hairColor: toInteger(profile.cheveux),
        situation: toInteger(profile.situation),
        silhouette: toInteger(profile.silhouette),
        personality: toInteger(profile.personnalite),
        schedule: toInteger(profile.horaires),
        orientation: toInteger(profile.sexe2),
        children: toInteger(profile.child),
        education: toInteger(profile.etudes),
        profession: toInteger(profile.travail),
    }

    return Object.fromEntries(
        Object.entries(mapped).filter(([, value]) => value !== undefined),
    ) as UserProfile
}

const isConnectedZero = (value?: number | string): boolean => {
    return toInteger(value) === 0
}

const resolveUpdateErrorMessage = (response: UpdateProfileApiResponse): string => {
    return normalizeText(response.error) ?? 'Profile update rejected'
}

@injectable()
export class UserProfileService {
    constructor(@inject(UserProfileRepository) private repository: UserProfileRepository) {}

    async getProfile(sessionId: string, userId: number): Promise<UserProfileResponse> {
        const payload = await this.repository.getProfile({
            sessionId,
            userId,
            withPhotos: true,
        })

        if (isConnectedZero(payload.connected)) {
            throw AppError.authenticationError('Session expired')
        }

        if (!payload.result) {
            throw AppError.notFoundError('Profile not found')
        }

        return {
            user: toUserProfile(payload.result),
        }
    }

    async updateProfile(
        sessionId: string,
        payload: UpdateProfileRequest,
    ): Promise<UpdateProfileResponse> {
        const updateInfoResult = await this.repository.updateInformations({
            sessionId,
            payload,
        })

        if (toInteger(updateInfoResult.accepted) === 0) {
            throw AppError.validationError(resolveUpdateErrorMessage(updateInfoResult))
        }

        const description = payload.description?.trim()

        if (description) {
            const updateDescriptionResult = await this.repository.updateDescription({
                sessionId,
                description,
            })

            if (toInteger(updateDescriptionResult.accepted) === 0) {
                throw AppError.validationError(resolveUpdateErrorMessage(updateDescriptionResult))
            }
        }

        return { accepted: 1 }
    }
}
