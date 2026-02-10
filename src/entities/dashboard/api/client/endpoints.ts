import { api } from '@/shared/api/client/api'
import { normalizeError } from '@/shared/api/client/error-normalizer'
import {
    getCommunityActivity,
    getRecentVisitors,
    getTopMembers,
    type RecentVisitorsQuery,
    type TopMembersQuery,
} from './services/dashboard.service'
import type {
    CommunityActivityResponse,
    RecentVisitorsResponse,
    TopMembersResponse,
} from '@/entities/dashboard/model/types'

export const dashboardApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCommunityActivity: builder.query<CommunityActivityResponse, void>({
            queryFn: async () => {
                try {
                    const data = await getCommunityActivity()
                    return { data }
                } catch (error) {
                    const normalized = normalizeError(error)
                    return {
                        error: {
                            status: 'CUSTOM_ERROR' as const,
                            data: normalized,
                            error: normalized.message,
                        },
                    }
                }
            },
        }),
        getTopMembers: builder.query<TopMembersResponse, TopMembersQuery>({
            queryFn: async (query) => {
                try {
                    const data = await getTopMembers(query)
                    return { data }
                } catch (error) {
                    const normalized = normalizeError(error)
                    return {
                        error: {
                            status: 'CUSTOM_ERROR' as const,
                            data: normalized,
                            error: normalized.message,
                        },
                    }
                }
            },
        }),
        getRecentVisitors: builder.query<RecentVisitorsResponse, RecentVisitorsQuery | void>({
            queryFn: async (query) => {
                try {
                    const data = await getRecentVisitors(query ?? {})
                    return { data }
                } catch (error) {
                    const normalized = normalizeError(error)
                    return {
                        error: {
                            status: 'CUSTOM_ERROR' as const,
                            data: normalized,
                            error: normalized.message,
                        },
                    }
                }
            },
        }),
    }),
})

export const {
    useGetCommunityActivityQuery,
    useGetTopMembersQuery,
    useGetRecentVisitorsQuery,
} = dashboardApi
