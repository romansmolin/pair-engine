'use client'

import { useEffect, useMemo, useState } from 'react'
import { useGetWalletQuery, usePurchaseCreditsMutation } from '@/entities/credit'
import { AppShell } from '@/components/app/AppShell'
import { LoadState, getErrorMessage } from '@/components/app/LoadState'
import { SectionCard } from '@/components/app/SectionCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const formatDateTime = (value: unknown): string => {
    if (!value) return 'Unknown time'

    const date = new Date(String(value))
    if (Number.isNaN(date.getTime())) return String(value)

    return date.toLocaleString()
}

const statusVariant = (value: string): 'default' | 'secondary' | 'outline' => {
    if (value === 'SUCCESSFUL') return 'default'
    if (value === 'PENDING') return 'secondary'
    return 'outline'
}

export default function WalletPage() {
    const walletQuery = useGetWalletQuery()
    const [purchaseCredits, purchaseState] = usePurchaseCreditsMutation()

    const [consentAccepted, setConsentAccepted] = useState(false)
    const [customAmount, setCustomAmount] = useState('')
    const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null)
    const [purchaseError, setPurchaseError] = useState<string | null>(null)
    const [returnStatusMessage, setReturnStatusMessage] = useState<string | null>(null)

    useEffect(() => {
        const search = new URLSearchParams(window.location.search)
        const status = search.get('status')
        const token = search.get('token')

        if (!status) return

        const normalized = status.toLowerCase()
        if (normalized === 'ok' || normalized === 'success' || normalized === 'successful') {
            setReturnStatusMessage(`Payment successful${token ? ` (token: ${token})` : ''}.`)
            return
        }

        setReturnStatusMessage(`Payment status: ${status}${token ? ` (token: ${token})` : ''}.`)
    }, [])

    const wallet = walletQuery.data?.wallet
    const transactions = walletQuery.data?.transactions ?? []

    const quickPacks = useMemo(() => [1, 5, 10] as const, [])

    const runPurchase = async (amountEur: number, pricingMode: 'preset' | 'custom', presetKey?: 1 | 5 | 10) => {
        if (!consentAccepted) {
            setPurchaseError('Please accept consent before purchasing credits.')
            return
        }

        setPurchaseError(null)
        setPurchaseMessage(null)

        try {
            const result = await purchaseCredits({
                amountEur,
                pricingMode,
                presetKey,
                consentAccepted,
            }).unwrap()

            if (result.redirectUrl) {
                window.location.assign(result.redirectUrl)
                return
            }

            setPurchaseMessage(`Checkout token created: ${result.checkoutToken}`)
        } catch (error) {
            setPurchaseError(getErrorMessage(error, 'Unable to start payment right now.'))
        }
    }

    return (
        <AppShell title="Wallet" description="Review your balance and transactions, then purchase credits when needed.">
            {returnStatusMessage ? (
                <div className="mb-6 rounded-xl border border-[#A8DF8E] bg-[#F0FFDF] px-3 py-2 text-sm text-[#2A2A2A]">
                    {returnStatusMessage}
                </div>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
                <SectionCard title="Current Balance" description="Available credits and wallet summary" className="h-fit">
                    <LoadState isLoading={walletQuery.isLoading} error={walletQuery.error}>
                        <div className="space-y-2">
                            <p className="text-3xl font-semibold text-[#2A2A2A]">{wallet?.balance ?? 0}</p>
                            <p className="text-sm text-[#5A5A5A]">{wallet?.currency ?? 'EUR'} credits balance</p>
                            <p className="text-xs text-[#6A6A6A]">Total purchased: {wallet?.totalPurchased ?? 0}</p>
                            <p className="text-xs text-[#6A6A6A]">Total spent: {wallet?.totalSpent ?? 0}</p>
                            <p className="text-xs text-[#6A6A6A]">Pending credits: {wallet?.pendingCredits ?? 0}</p>
                        </div>

                        <div className="mt-5 space-y-3">
                            <p className="text-sm font-medium text-[#2A2A2A]">Quick purchase</p>
                            <div className="flex flex-wrap gap-2">
                                {quickPacks.map((pack) => (
                                    <Button
                                        key={pack}
                                        type="button"
                                        size="sm"
                                        disabled={purchaseState.isLoading}
                                        onClick={() => runPurchase(pack, 'preset', pack)}
                                    >
                                        {pack} EUR
                                    </Button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={customAmount}
                                    onChange={(event) => setCustomAmount(event.target.value)}
                                    placeholder="Custom EUR amount"
                                    aria-label="Custom amount in EUR"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={purchaseState.isLoading || !customAmount}
                                    onClick={() => {
                                        const parsed = Number(customAmount)
                                        if (!Number.isFinite(parsed) || parsed <= 0) {
                                            setPurchaseError('Please provide a valid custom amount greater than 0.')
                                            return
                                        }
                                        void runPurchase(parsed, 'custom')
                                    }}
                                >
                                    Buy
                                </Button>
                            </div>

                            <label className="flex items-center gap-2 text-sm text-[#2A2A2A]">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-[#A8DF8E] accent-[#FFAAB8]"
                                    checked={consentAccepted}
                                    onChange={(event) => setConsentAccepted(event.target.checked)}
                                />
                                I agree to proceed with payment.
                            </label>

                            {purchaseMessage ? (
                                <p className="rounded-xl border border-[#A8DF8E] bg-[#F0FFDF] px-3 py-2 text-sm text-[#2A2A2A]">
                                    {purchaseMessage}
                                </p>
                            ) : null}

                            {purchaseError ? (
                                <p className="rounded-xl border border-[#FFAAB8] bg-[#FFD8DF]/50 px-3 py-2 text-sm text-[#5A454B]">
                                    {purchaseError}
                                </p>
                            ) : null}
                        </div>
                    </LoadState>
                </SectionCard>

                <SectionCard title="Transaction History" description="Most recent wallet transactions.">
                    <LoadState
                        isLoading={walletQuery.isLoading}
                        error={walletQuery.error}
                        isEmpty={!walletQuery.isLoading && !walletQuery.error && transactions.length === 0}
                        emptyMessage="No transactions yet."
                    >
                        <div className="space-y-3">
                            {transactions.map((transaction) => (
                                <article key={transaction.id} className="rounded-2xl border border-[#A8DF8E] p-3">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-semibold text-[#2A2A2A]">{transaction.type}</p>
                                            <p className="text-xs text-[#5A5A5A]">{transaction.reason || 'No reason provided'}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={statusVariant(transaction.status)}>{transaction.status}</Badge>
                                            <span className="text-sm font-medium text-[#2A2A2A]">{transaction.amount}</span>
                                        </div>
                                    </div>
                                    <p className="mt-1 text-xs text-[#6A6A6A]">{formatDateTime(transaction.createdAt)}</p>
                                </article>
                            ))}
                        </div>
                    </LoadState>
                </SectionCard>
            </div>
        </AppShell>
    )
}
