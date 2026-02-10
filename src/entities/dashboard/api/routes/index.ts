import { NextRequest } from 'next/server'
import { asyncHandler } from '@/shared/http/async-handler'
import { container } from '@/shared/lib/di/container.server'
import { DashboardController } from '@/entities/dashboard'

const getDashboardController = (): DashboardController => {
    return container.get(DashboardController)
}

export const GET_ACTIVITY = asyncHandler(async (request: NextRequest) => {
    return getDashboardController().getCommunityActivity(request)
})

export const GET_TOP_MEMBERS = asyncHandler(async (request: NextRequest) => {
    return getDashboardController().getTopMembers(request)
})

export const GET_RECENT_VISITORS = asyncHandler(async (request: NextRequest) => {
    return getDashboardController().getRecentVisitors(request)
})
