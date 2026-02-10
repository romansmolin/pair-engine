import { apiClient } from '@/shared/api/client/axios.config'
import type {
    CommunityActivityResponse,
    RecentVisitorsResponse,
    TopMembersResponse,
} from '@/entities/dashboard/model/types'

export type TopMembersQuery = {
    gender: 'men' | 'women'
    ageRange?: string
    age_range?: string
    page?: number
}

export type RecentVisitorsQuery = {
    page?: number
}

export async function getCommunityActivity(): Promise<CommunityActivityResponse> {
    const response = await apiClient.get<CommunityActivityResponse>('/api/dashboard/activity')
    return response.data
}

export async function getTopMembers(query: TopMembersQuery): Promise<TopMembersResponse> {
    const params = new URLSearchParams()
    params.set('gender', query.gender)

    const ageRange = query.ageRange ?? query.age_range
    if (ageRange) {
        params.set('ageRange', ageRange)
    }

    if (query.page) {
        params.set('page', String(query.page))
    }

    const response = await apiClient.get<TopMembersResponse>(
        `/api/dashboard/top-members?${params.toString()}`,
    )
    return response.data
}

export async function getRecentVisitors(
    query: RecentVisitorsQuery = {},
): Promise<RecentVisitorsResponse> {
    const params = new URLSearchParams()

    if (query.page) {
        params.set('page', String(query.page))
    }

    const path = params.toString()
        ? `/api/dashboard/recent-visitors?${params.toString()}`
        : '/api/dashboard/recent-visitors'

    const response = await apiClient.get<RecentVisitorsResponse>(path)
    return response.data
}
