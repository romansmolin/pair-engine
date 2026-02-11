import { NextRequest } from 'next/server'
import { asyncHandler } from '@/shared/http/async-handler'
import { container } from '@/shared/lib/di/container.server'
import { UserProfileController } from '@/entities/user'

const getUserProfileController = (): UserProfileController => {
    return container.get(UserProfileController)
}

export const GET_USER_PROFILE = asyncHandler(async (request: NextRequest) => {
    return getUserProfileController().getProfile(request)
})

export const PATCH_USER_PROFILE = asyncHandler(async (request: NextRequest) => {
    return getUserProfileController().patchProfile(request)
})
