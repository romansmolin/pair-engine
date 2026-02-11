import { apiClient } from '@/shared/api/client/axios.config'
import type {
    UpdateProfileRequest,
    UpdateProfileResponse,
    UserProfileResponse,
} from '@/entities/user/model/types'

export async function getUserProfile(): Promise<UserProfileResponse> {
    const response = await apiClient.get<UserProfileResponse>('/api/user/profile')
    return response.data
}

export async function updateUserProfile(
    payload: UpdateProfileRequest,
): Promise<UpdateProfileResponse> {
    const response = await apiClient.patch<UpdateProfileResponse>('/api/user/profile', payload)
    return response.data
}
