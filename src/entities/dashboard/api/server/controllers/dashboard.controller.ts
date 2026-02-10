import { inject, injectable } from 'inversify'
import { NextRequest, NextResponse } from 'next/server'
import { AppError } from '@/shared/errors/app-error'
import { DashboardService } from '../services/dashboard.service'

const maskSessionId = (sessionId?: string): string | undefined => {
    if (!sessionId) return undefined
    if (sessionId.length <= 6) return '***'
    return `${sessionId.slice(0, 3)}***${sessionId.slice(-3)}`
}

@injectable()
export class DashboardController {
    constructor(@inject(DashboardService) private dashboardService: DashboardService) {}

    private getSessionId(request: NextRequest): string {
        const sessionId = request.cookies.get('dating_session_id')?.value

        if (!sessionId) {
            throw AppError.authenticationError('Authentication required')
        }

        return sessionId
    }

    async getCommunityActivity(request: NextRequest): Promise<NextResponse> {
        const sessionId = this.getSessionId(request)
        console.info('[DashboardController] /api/dashboard/activity request', {
            sessionId: maskSessionId(sessionId),
        })

        const result = await this.dashboardService.getCommunityActivity(sessionId)

        console.info('[DashboardController] /api/dashboard/activity success', {
            itemsCount: result.items.length,
        })

        return NextResponse.json(result)
    }

    async getTopMembers(request: NextRequest): Promise<NextResponse> {
        const sessionId = this.getSessionId(request)
        const { searchParams } = new URL(request.url)
        const result = await this.dashboardService.getTopMembers(sessionId, searchParams)

        return NextResponse.json(result)
    }

    async getRecentVisitors(request: NextRequest): Promise<NextResponse> {
        const sessionId = this.getSessionId(request)
        const { searchParams } = new URL(request.url)
        const result = await this.dashboardService.getRecentVisitors(sessionId, searchParams)

        return NextResponse.json(result)
    }
}
