export type {
    ActivityAction,
    CommunityActivityItem,
    CommunityActivityResponse,
    MemberGender,
    MemberSummary,
    RecentVisitorsResponse,
    TopMembersResponse,
} from './model/types'

export {
    useGetCommunityActivityQuery,
    useGetTopMembersQuery,
    useGetRecentVisitorsQuery,
} from './api/client/endpoints'

export type { TopMembersQuery, RecentVisitorsQuery } from './api/client/services/dashboard.service'

export { DashboardController } from './api/server/controllers/dashboard.controller'
export { DashboardService } from './api/server/services/dashboard.service'
export {
    DashboardRepository,
    type GetActivitiesResponse,
    type GuestVisitesResponse,
    type MembreBlock,
    type TopMembersResponse as RawTopMembersResponse,
    type WallAddPhotoBlock,
    type WallBirthdayBlock,
    type WallChangeBlock,
    type WallFriendsBlock,
    type WallOnlineBlock,
} from './api/server/repositories/dashboard.repo'
