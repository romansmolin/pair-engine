'use client'

import { useEffect, useMemo, useState } from 'react'
import {
    useDiscoverMatchesQuery,
    useGetMatchesQuery,
    useMatchActionMutation,
} from '@/entities/match/api/client/endpoints'
import type { MatchCandidate } from '@/entities/match/model/types'
import { AppShell } from '@/components/app/AppShell'
import { LoadState, getErrorMessage } from '@/components/app/LoadState'
import { SectionCard } from '@/components/app/SectionCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const toOptionalNumber = (value: string): number | undefined => {
    const normalized = value.trim()
    if (!normalized) return undefined

    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : undefined
}

export default function MatchPage() {
    const [page, setPage] = useState(1)
    const [gender, setGender] = useState<'men' | 'women' | 'couple'>('women')
    const [ageFrom, setAgeFrom] = useState('')
    const [ageTo, setAgeTo] = useState('')
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [actionMessage, setActionMessage] = useState<string | null>(null)

    const discoverQuery = useDiscoverMatchesQuery({
        page,
        gender,
        ageFrom: toOptionalNumber(ageFrom),
        ageTo: toOptionalNumber(ageTo),
    })

    const matchesQuery = useGetMatchesQuery()
    const [matchAction, actionState] = useMatchActionMutation()

    const discoverItems = discoverQuery.data?.items ?? []
    const totalPages = discoverQuery.data?.totalPages ?? 1
    const currentMatches = matchesQuery.data?.items ?? []

    useEffect(() => {
        if (!discoverItems.length) {
            setSelectedId(null)
            return
        }

        if (!selectedId || !discoverItems.some((item) => item.id === selectedId)) {
            setSelectedId(discoverItems[0].id)
        }
    }, [discoverItems, selectedId])

    const selectedCandidate = useMemo<MatchCandidate | undefined>(
        () => discoverItems.find((item) => item.id === selectedId),
        [discoverItems, selectedId],
    )

    const onAction = async (action: 'like' | 'dislike') => {
        if (!selectedCandidate) return

        setActionMessage(null)

        try {
            const result = await matchAction({ userId: selectedCandidate.id, action }).unwrap()

            if (result.isMatch) {
                setActionMessage(`It's a match with ${selectedCandidate.username}!`)
            } else {
                setActionMessage(`${action === 'like' ? 'Like' : 'Dislike'} sent.`)
            }

            await Promise.all([discoverQuery.refetch(), matchesQuery.refetch()])
        } catch (error) {
            setActionMessage(getErrorMessage(error, 'Unable to submit match action right now.'))
        }
    }

    return (
        <AppShell title="Match" description="Discover recommendations, review profiles, and take action.">
            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                <SectionCard title="Recommendations" description="Filter and browse suggested profiles.">
                    <div className="mb-4 grid gap-2 sm:grid-cols-2">
                        <select
                            className="h-10 rounded-xl border border-[#A8DF8E] bg-white px-3 text-sm"
                            value={gender}
                            onChange={(event) => {
                                setGender(event.target.value as 'men' | 'women' | 'couple')
                                setPage(1)
                            }}
                        >
                            <option value="women">Women</option>
                            <option value="men">Men</option>
                            <option value="couple">Couple</option>
                        </select>
                        <Input
                            type="number"
                            placeholder="Age from"
                            value={ageFrom}
                            onChange={(event) => {
                                setAgeFrom(event.target.value)
                                setPage(1)
                            }}
                        />
                        <Input
                            type="number"
                            placeholder="Age to"
                            value={ageTo}
                            onChange={(event) => {
                                setAgeTo(event.target.value)
                                setPage(1)
                            }}
                        />
                    </div>

                    <LoadState
                        isLoading={discoverQuery.isLoading}
                        error={discoverQuery.error}
                        isEmpty={!discoverQuery.isLoading && !discoverQuery.error && discoverItems.length === 0}
                        emptyMessage="No recommendations available with current filters."
                    >
                        <ul className="space-y-2">
                            {discoverItems.map((candidate) => (
                                <li key={candidate.id}>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedId(candidate.id)}
                                        className={`w-full rounded-2xl border p-3 text-left ${
                                            selectedId === candidate.id
                                                ? 'border-[#FFAAB8] bg-[#FFD8DF]/50'
                                                : 'border-[#A8DF8E] hover:bg-[#F0FFDF]'
                                        }`}
                                    >
                                        <p className="text-sm font-semibold text-[#2A2A2A]">{candidate.username}</p>
                                        <p className="text-xs text-[#5A5A5A]">
                                            {[candidate.age ? `${candidate.age} y/o` : null, candidate.location]
                                                .filter(Boolean)
                                                .join(' • ') || 'No extra details'}
                                        </p>
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4 flex items-center justify-between">
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={page <= 1 || discoverQuery.isFetching}
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
                                disabled={page >= totalPages || discoverQuery.isFetching}
                                onClick={() => setPage((prev) => prev + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </LoadState>
                </SectionCard>

                <div className="space-y-6">
                    <SectionCard title="Match Profile" description="Selected recommendation details and actions.">
                        {!selectedCandidate ? (
                            <p className="text-sm text-[#5A5A5A]">Select a recommendation to view details.</p>
                        ) : (
                            <div className="space-y-4">
                                {selectedCandidate.photoUrl ? (
                                    <img
                                        src={selectedCandidate.photoUrl}
                                        alt={selectedCandidate.username}
                                        className="max-h-[420px] w-full rounded-2xl border border-[#A8DF8E] bg-[#F0FFDF] object-contain"
                                    />
                                ) : null}

                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-semibold text-[#2A2A2A]">{selectedCandidate.username}</h2>
                                    {typeof selectedCandidate.rating === 'number' ? (
                                        <Badge variant="secondary">Rating {selectedCandidate.rating}</Badge>
                                    ) : null}
                                </div>

                                <p className="text-sm text-[#5A5A5A]">
                                    {[selectedCandidate.age ? `${selectedCandidate.age} y/o` : null, selectedCandidate.gender, selectedCandidate.location]
                                        .filter(Boolean)
                                        .join(' • ') || 'No profile details available'}
                                </p>

                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        disabled={actionState.isLoading}
                                        onClick={() => {
                                            void onAction('like')
                                        }}
                                    >
                                        Like
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={actionState.isLoading}
                                        onClick={() => {
                                            void onAction('dislike')
                                        }}
                                    >
                                        Dislike
                                    </Button>
                                </div>

                                {actionMessage ? (
                                    <p className="rounded-xl border border-[#A8DF8E] bg-[#F0FFDF] px-3 py-2 text-sm text-[#2A2A2A]">
                                        {actionMessage}
                                    </p>
                                ) : null}
                            </div>
                        )}
                    </SectionCard>

                    <SectionCard title="Current Matches" description="Profiles with existing match status.">
                        <LoadState
                            isLoading={matchesQuery.isLoading}
                            error={matchesQuery.error}
                            isEmpty={!matchesQuery.isLoading && !matchesQuery.error && currentMatches.length === 0}
                            emptyMessage="No active matches yet."
                        >
                            <ul className="space-y-2">
                                {currentMatches.map((candidate) => (
                                    <li key={candidate.id} className="rounded-2xl border border-[#A8DF8E] p-3">
                                        <p className="text-sm font-semibold text-[#2A2A2A]">{candidate.username}</p>
                                        <p className="text-xs text-[#5A5A5A]">
                                            {[candidate.age ? `${candidate.age} y/o` : null, candidate.location]
                                                .filter(Boolean)
                                                .join(' • ') || 'No details'}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </LoadState>
                    </SectionCard>
                </div>
            </div>
        </AppShell>
    )
}
