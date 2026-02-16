'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
    useBuyGiftMutation,
    useGetGiftCatalogQuery,
    useGetGiftHistoryQuery,
    useGetGiftInventoryQuery,
    useSendGiftMutation,
} from '@/entities/gift/api/client/endpoints'
import { useGetMatchesQuery } from '@/entities/match/api/client/endpoints'
import { useGetWalletQuery } from '@/entities/credit/api/client/endpoints'
import { AppShell } from '@/components/app/AppShell'
import { LoadState, getErrorMessage } from '@/components/app/LoadState'
import { SectionCard } from '@/components/app/SectionCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type GiftVisualInput = {
    name?: string
    slug?: string
    imagePath?: string
}

type GiftVisualMeta = {
    keys: string[]
    imageSrc: string
    displayName: string
}

const GIFT_VISUALS: GiftVisualMeta[] = [
    {
        keys: ['bottle', 'rose', 'roses'],
        imageSrc: '/gifts/Bottle.png',
        displayName: 'Midnight Message Bottle',
    },
    {
        keys: ['coins', 'coin', 'pions', 'peony'],
        imageSrc: '/gifts/Coins.png',
        displayName: 'Golden Coin Shower',
    },
    {
        keys: ['flower', 'bloom', 'tulip', 'gerbera', 'freesia', 'ranunculus'],
        imageSrc: '/gifts/Flower.png',
        displayName: 'Velvet Bloom Surprise',
    },
    {
        keys: ['roket', 'rocket', 'orhid', 'orchid'],
        imageSrc: '/gifts/Roket%201.png',
        displayName: 'Skyfire Love Rocket',
    },
    {
        keys: ['star', 'hydrangea'],
        imageSrc: '/gifts/Star.png',
        displayName: 'Starlight Wish Token',
    },
    {
        keys: ['tresure', 'treasure', 'lilac', 'dahlia'],
        imageSrc: '/gifts/Tresure.png',
        displayName: 'Hidden Heart Treasure',
    },
]

const DEFAULT_GIFT_VISUAL = GIFT_VISUALS[0]

const toTitleCase = (value: string): string => {
    return value
        .split(' ')
        .map((part) => (part ? `${part[0].toUpperCase()}${part.slice(1).toLowerCase()}` : part))
        .join(' ')
}

const normalizeSource = (input: GiftVisualInput): string => {
    return `${input.slug || ''} ${input.name || ''} ${input.imagePath || ''}`.toLowerCase()
}

const fileStem = (value?: string): string => {
    if (!value) return ''

    const decoded = decodeURIComponent(value)
    const lastPart = decoded.split('/').pop() || decoded
    return lastPart
        .replace(/\.[^.]+$/, '')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

const resolveGiftVisual = (input: GiftVisualInput): { displayName: string; imageSrc: string } => {
    const source = normalizeSource(input)

    const matched = GIFT_VISUALS.find((meta) => meta.keys.some((key) => source.includes(key)))
    if (matched) {
        return {
            displayName: matched.displayName,
            imageSrc: matched.imageSrc,
        }
    }

    const stem = fileStem(input.imagePath || input.name || input.slug)
    const fallbackName = stem ? toTitleCase(stem) : input.name || 'Special Gift'
    const hash = source
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const fallbackVisual = GIFT_VISUALS[hash % GIFT_VISUALS.length] ?? DEFAULT_GIFT_VISUAL

    return {
        displayName: fallbackName,
        imageSrc: fallbackVisual.imageSrc,
    }
}

const formatDateTime = (value?: string): string => {
    if (!value) return 'Unknown time'

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value

    return date.toLocaleString()
}

export default function GiftsPage() {
    const catalogQuery = useGetGiftCatalogQuery()
    const inventoryQuery = useGetGiftInventoryQuery()
    const historyQuery = useGetGiftHistoryQuery({ limit: 20 })
    const matchesQuery = useGetMatchesQuery()
    const walletQuery = useGetWalletQuery()

    const [buyGift, buyState] = useBuyGiftMutation()
    const [sendGift, sendState] = useSendGiftMutation()

    const [selectedRecipient, setSelectedRecipient] = useState('')
    const [selectedGift, setSelectedGift] = useState('')
    const [buyMessage, setBuyMessage] = useState<string | null>(null)
    const [buyError, setBuyError] = useState<string | null>(null)
    const [sendMessage, setSendMessage] = useState<string | null>(null)
    const [sendError, setSendError] = useState<string | null>(null)

    const catalogItems = catalogQuery.data?.items ?? []
    const inventoryItems = inventoryQuery.data?.items ?? []
    const historyItems = historyQuery.data?.items ?? []
    const matchItems = matchesQuery.data?.items ?? []

    const inventorySelectable = useMemo(
        () => inventoryItems.filter((item) => item.quantity > 0),
        [inventoryItems],
    )

    useEffect(() => {
        if (!selectedGift && inventorySelectable.length > 0) {
            setSelectedGift(inventorySelectable[0].giftId)
        }
    }, [selectedGift, inventorySelectable])

    useEffect(() => {
        if (!selectedRecipient && matchItems.length > 0) {
            setSelectedRecipient(String(matchItems[0].id))
        }
    }, [selectedRecipient, matchItems])

    const handleBuy = async (giftId: string, displayName: string) => {
        setBuyError(null)
        setBuyMessage(null)

        try {
            const result = await buyGift({ giftId }).unwrap()
            setBuyMessage(
                `Purchased ${displayName}. Spent ${result.spentCoins} coins, remaining balance: ${result.remainingBalance}.`,
            )
            await Promise.all([inventoryQuery.refetch(), walletQuery.refetch()])
        } catch (error) {
            setBuyError(getErrorMessage(error, 'Unable to buy gift right now.'))
        }
    }

    const handleSendGift = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const recipientUserId = Number(selectedRecipient)
        if (!Number.isFinite(recipientUserId) || recipientUserId < 1) {
            setSendError('Select a match recipient first.')
            return
        }

        if (!selectedGift) {
            setSendError('Select a gift from inventory first.')
            return
        }

        setSendError(null)
        setSendMessage(null)

        try {
            const result = await sendGift({ recipientUserId, giftId: selectedGift }).unwrap()
            setSendMessage(
                `Gift sent successfully. Remaining inventory for this gift: ${result.remainingInventory}.`,
            )
            await Promise.all([inventoryQuery.refetch(), historyQuery.refetch()])
        } catch (error) {
            setSendError(getErrorMessage(error, 'Unable to send gift right now.'))
        }
    }

    const balance = walletQuery.data?.wallet.balance ?? 0

    return (
        <AppShell
            title="Gifts"
            description="Spend credits on gifts, manage your library, and send gifts to your matches."
        >
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
                <SectionCard
                    title="Gift Catalog"
                    description="Buy gifts using your available credits."
                    contentClassName="space-y-5"
                >
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">Balance: {balance} credits</Badge>
                        <Badge variant="outline">Catalog items: {catalogItems.length}</Badge>
                    </div>

                    <LoadState
                        isLoading={catalogQuery.isLoading}
                        error={catalogQuery.error}
                        isEmpty={!catalogQuery.isLoading && !catalogQuery.error && catalogItems.length === 0}
                        emptyMessage="No gifts available right now."
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            {catalogItems.map((gift) => {
                                const visual = resolveGiftVisual({
                                    name: gift.name,
                                    slug: gift.slug,
                                    imagePath: gift.imagePath,
                                })

                                return (
                                    <article
                                        key={gift.id}
                                        className="flex h-full flex-col gap-3 rounded-3xl border border-[#A8DF8E] bg-white/80 p-4 shadow-sm"
                                    >
                                        <img
                                            src={visual.imageSrc}
                                            alt={visual.displayName}
                                            className="h-40 w-full rounded-2xl border border-[#A8DF8E] bg-[#F0FFDF] object-contain p-3"
                                        />
                                        <h3 className="text-lg font-semibold text-[#2A2A2A]">{visual.displayName}</h3>
                                        <p className="text-sm text-[#5A5A5A]">Cost: {gift.priceCoins} credits</p>
                                        <Button
                                            type="button"
                                            size="sm"
                                            className="mt-auto w-full"
                                            disabled={buyState.isLoading}
                                            onClick={() => {
                                                void handleBuy(gift.id, visual.displayName)
                                            }}
                                        >
                                            {buyState.isLoading ? 'Processing...' : 'Buy Gift'}
                                        </Button>
                                    </article>
                                )
                            })}
                        </div>
                    </LoadState>

                    {buyMessage ? (
                        <p className="rounded-xl border border-[#A8DF8E] bg-[#F0FFDF] px-3 py-2 text-sm text-[#2A2A2A]">
                            {buyMessage}
                        </p>
                    ) : null}

                    {buyError ? (
                        <p className="rounded-xl border border-[#FFAAB8] bg-[#FFD8DF]/50 px-3 py-2 text-sm text-[#5A454B]">
                            {buyError}
                        </p>
                    ) : null}
                </SectionCard>

                <SectionCard
                    title="Send Gift to Match"
                    description="Choose a match recipient and send a gift from your inventory."
                    contentClassName="space-y-5"
                >
                    <form className="space-y-4" onSubmit={handleSendGift}>
                        <label className="grid gap-1.5">
                            <span className="text-sm font-medium text-[#2A2A2A]">Recipient (from your matches)</span>
                            <select
                                className="h-11 w-full rounded-xl border border-[#A8DF8E] bg-white px-3 text-base"
                                value={selectedRecipient}
                                onChange={(event) => setSelectedRecipient(event.target.value)}
                            >
                                {matchItems.length === 0 ? <option value="">No matches available</option> : null}
                                {matchItems.map((match) => (
                                    <option key={match.id} value={match.id}>
                                        {match.username} {match.age ? `(${match.age})` : ''}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="grid gap-1.5">
                            <span className="text-sm font-medium text-[#2A2A2A]">Gift (from your library)</span>
                            <select
                                className="h-11 w-full rounded-xl border border-[#A8DF8E] bg-white px-3 text-base"
                                value={selectedGift}
                                onChange={(event) => setSelectedGift(event.target.value)}
                            >
                                {inventorySelectable.length === 0 ? <option value="">No gifts in inventory</option> : null}
                                {inventorySelectable.map((gift) => {
                                    const visual = resolveGiftVisual({
                                        name: gift.giftName,
                                        imagePath: gift.giftImagePath,
                                    })

                                    return (
                                        <option key={gift.giftId} value={gift.giftId}>
                                            {visual.displayName} (x{gift.quantity})
                                        </option>
                                    )
                                })}
                            </select>
                        </label>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={sendState.isLoading || inventorySelectable.length === 0 || matchItems.length === 0}
                        >
                            {sendState.isLoading ? 'Sending...' : 'Send Gift'}
                        </Button>
                    </form>

                    {sendMessage ? (
                        <p className="rounded-xl border border-[#A8DF8E] bg-[#F0FFDF] px-3 py-2 text-sm text-[#2A2A2A]">
                            {sendMessage}
                        </p>
                    ) : null}

                    {sendError ? (
                        <p className="rounded-xl border border-[#FFAAB8] bg-[#FFD8DF]/50 px-3 py-2 text-sm text-[#5A454B]">
                            {sendError}
                        </p>
                    ) : null}

                    <div className="rounded-2xl border border-[#A8DF8E] p-4">
                        <p className="text-sm font-medium text-[#2A2A2A]">Match targets</p>
                        <LoadState
                            isLoading={matchesQuery.isLoading}
                            error={matchesQuery.error}
                            isEmpty={!matchesQuery.isLoading && !matchesQuery.error && matchItems.length === 0}
                            emptyMessage="No match recipients available yet."
                        >
                            <ul className="mt-3 space-y-2">
                                {matchItems.map((match) => (
                                    <li key={match.id} className="text-sm text-[#4E4E4E]">
                                        {match.username} {match.location ? `• ${match.location}` : ''}
                                    </li>
                                ))}
                            </ul>
                        </LoadState>
                    </div>
                </SectionCard>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
                <SectionCard
                    title="My Gift Library"
                    description="Purchased gifts ready to be sent."
                    contentClassName="space-y-4"
                >
                    <LoadState
                        isLoading={inventoryQuery.isLoading}
                        error={inventoryQuery.error}
                        isEmpty={!inventoryQuery.isLoading && !inventoryQuery.error && inventoryItems.length === 0}
                        emptyMessage="You have no gifts in your library yet."
                    >
                        <div className="space-y-3">
                            {inventoryItems.map((gift) => {
                                const visual = resolveGiftVisual({
                                    name: gift.giftName,
                                    imagePath: gift.giftImagePath,
                                })

                                return (
                                    <article
                                        key={`${gift.giftId}-${gift.updatedAt}`}
                                        className="rounded-2xl border border-[#A8DF8E] bg-white/80 p-4 shadow-sm"
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={visual.imageSrc}
                                                alt={visual.displayName}
                                                className="h-16 w-16 rounded-xl border border-[#A8DF8E] bg-[#F0FFDF] object-contain p-1.5"
                                            />
                                            <div>
                                                <p className="text-sm font-semibold text-[#2A2A2A]">{visual.displayName}</p>
                                                <p className="text-xs text-[#5A5A5A]">Quantity: {gift.quantity}</p>
                                                <p className="text-xs text-[#6A6A6A]">Updated: {formatDateTime(gift.updatedAt)}</p>
                                            </div>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    </LoadState>
                </SectionCard>

                <SectionCard
                    title="Send History"
                    description="Recent gifts you sent to other users."
                    contentClassName="space-y-4"
                >
                    <LoadState
                        isLoading={historyQuery.isLoading}
                        error={historyQuery.error}
                        isEmpty={!historyQuery.isLoading && !historyQuery.error && historyItems.length === 0}
                        emptyMessage="No gift history yet."
                    >
                        <ul className="space-y-3">
                            {historyItems.map((entry) => {
                                const visual = resolveGiftVisual({
                                    name: entry.giftName,
                                    imagePath: entry.giftImagePath,
                                })

                                return (
                                    <li key={entry.id} className="rounded-2xl border border-[#A8DF8E] bg-white/80 p-4 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={visual.imageSrc}
                                                alt={visual.displayName}
                                                className="h-12 w-12 rounded-lg border border-[#A8DF8E] bg-[#F0FFDF] object-contain p-1"
                                            />
                                            <div>
                                                <p className="text-sm font-semibold text-[#2A2A2A]">{visual.displayName}</p>
                                                <p className="text-xs text-[#5A5A5A]">Recipient user ID: {entry.recipientUserId}</p>
                                                <p className="text-xs text-[#5A5A5A]">Price: {entry.priceCoins} credits</p>
                                                <p className="text-xs text-[#6A6A6A]">Sent: {formatDateTime(entry.createdAt)}</p>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </LoadState>
                </SectionCard>
            </div>
        </AppShell>
    )
}
