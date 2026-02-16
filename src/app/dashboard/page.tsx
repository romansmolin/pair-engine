'use client'

import { useMemo, useState } from 'react'
import { useGetCommunityActivityQuery, useGetTopMembersQuery } from '@/entities/dashboard/api/client/endpoints'
import { useGetGiftInventoryQuery } from '@/entities/gift/api/client/endpoints'
import { AppShell } from '@/components/app/AppShell'
import { LoadState } from '@/components/app/LoadState'
import { SectionCard } from '@/components/app/SectionCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const actionLabelMap: Record<string, string> = {
    con: 'Connected',
    visite: 'Visited',
    vote: 'Voted',
    modif: 'Updated profile',
    add_tof: 'Added photo',
    birthday: 'Birthday',
    friends: 'Became friends',
}

const formatDateTime = (value?: string): string => {
    if (!value) return 'Unknown time'

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value

    return date.toLocaleString()
}

export default function DashboardPage() {
    const [gender, setGender] = useState<'men' | 'women'>('women')
    const [page, setPage] = useState(1)

    const topMembersQuery = useGetTopMembersQuery({ gender, page })
    const activityQuery = useGetCommunityActivityQuery()
    const giftsQuery = useGetGiftInventoryQuery()

    const totalPages = topMembersQuery.data?.totalPages ?? 1

    const topMembers = topMembersQuery.data?.items ?? []
    const activityItems = activityQuery.data?.items ?? []
    const giftItems = giftsQuery.data?.items ?? []

    const topMemberActions = useMemo(
        () => (
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    size="sm"
                    variant={gender === 'women' ? 'default' : 'outline'}
                    onClick={() => {
                        setGender('women')
                        setPage(1)
                    }}
                >
                    Women
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={gender === 'men' ? 'default' : 'outline'}
                    onClick={() => {
                        setGender('men')
                        setPage(1)
                    }}
                >
                    Men
                </Button>
            </div>
        ),
        [gender],
    )

    return (
        <AppShell
            title="Home"
            description="Track top members, community activity, and your available gifts in one place."
        >
            <div className="grid gap-6 lg:grid-cols-2">
                <SectionCard
                    title="Top Members"
                    description="Most relevant members for your selected audience."
                    actions={topMemberActions}
                >
                    <LoadState
                        isLoading={topMembersQuery.isLoading}
                        error={topMembersQuery.error}
                        isEmpty={!topMembersQuery.isLoading && !topMembersQuery.error && topMembers.length === 0}
                        emptyMessage="No top members found."
                    >
                        <div className="space-y-3">
                            {topMembers.map((member) => (
                                <article key={member.id} className="rounded-2xl border border-[#A8DF8E] p-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-sm font-semibold text-[#2A2A2A]">{member.username}</h3>
                                            <p className="text-xs text-[#5A5A5A]">
                                                {[member.age ? `${member.age} y/o` : null, member.location]
                                                    .filter(Boolean)
                                                    .join(' • ') || 'No extra details'}
                                            </p>
                                        </div>
                                        {typeof member.rating === 'number' ? (
                                            <Badge variant="secondary">Rating {member.rating}</Badge>
                                        ) : null}
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={page <= 1 || topMembersQuery.isFetching}
                                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            >
                                Previous
                            </Button>
                            <p className="text-xs text-[#5A5A5A]">
                                Page {page} of {totalPages}
                            </p>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={page >= totalPages || topMembersQuery.isFetching}
                                onClick={() => setPage((prev) => prev + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </LoadState>
                </SectionCard>

                <SectionCard title="Recent Activity" description="Latest actions from the community.">
                    <LoadState
                        isLoading={activityQuery.isLoading}
                        error={activityQuery.error}
                        isEmpty={!activityQuery.isLoading && !activityQuery.error && activityItems.length === 0}
                        emptyMessage="No recent activity available."
                    >
                        <ul className="space-y-3">
                            {activityItems.map((item) => (
                                <li
                                    key={`${item.id}-${item.action}`}
                                    className="rounded-2xl border border-[#A8DF8E] p-3"
                                >
                                    <p className="text-sm font-medium text-[#2A2A2A]">{item.username}</p>
                                    <p className="mt-0.5 text-xs text-[#5A5A5A]">
                                        {actionLabelMap[item.action] ?? item.action}
                                        {item.location ? ` • ${item.location}` : ''}
                                    </p>
                                    <p className="mt-1 text-xs text-[#6A6A6A]">{formatDateTime(item.timestamp)}</p>
                                </li>
                            ))}
                        </ul>
                    </LoadState>
                </SectionCard>
            </div>

            <div className="mt-6">
                <SectionCard title="Gift Library" description="Gifts currently available in your personal inventory.">
                    <LoadState
                        isLoading={giftsQuery.isLoading}
                        error={giftsQuery.error}
                        isEmpty={!giftsQuery.isLoading && !giftsQuery.error && giftItems.length === 0}
                        emptyMessage="Your gift inventory is empty."
                    >
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {giftItems.map((gift) => (
                                <article key={`${gift.giftId}-${gift.updatedAt}`} className="rounded-2xl border border-[#A8DF8E] p-3">
                                    <img
                                        src={gift.giftImagePath}
                                        alt={gift.giftName}
                                        className="h-24 w-full rounded-xl object-cover"
                                    />
                                    <h3 className="mt-2 text-sm font-semibold text-[#2A2A2A]">{gift.giftName}</h3>
                                    <p className="text-xs text-[#5A5A5A]">Quantity: {gift.quantity}</p>
                                </article>
                            ))}
                        </div>
                    </LoadState>
                </SectionCard>
            </div>
        </AppShell>
    )
}
