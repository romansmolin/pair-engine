import type { ReactNode } from 'react'

type LoadStateProps = {
    isLoading?: boolean
    error?: unknown
    isEmpty?: boolean
    emptyMessage?: string
    children: ReactNode
}

type ErrorPayload = {
    message?: string
}

type ErrorContainer = {
    data?: ErrorPayload
    error?: string
}

const isObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null
}

export const getErrorMessage = (error: unknown, fallback = 'Unable to load data.'): string => {
    if (!error) return fallback

    if (typeof error === 'string') {
        return error
    }

    if (isObject(error)) {
        const payload = error as ErrorContainer

        if (payload.data?.message) {
            return payload.data.message
        }

        if (payload.error) {
            return payload.error
        }
    }

    return fallback
}

export function LoadState({
    isLoading,
    error,
    isEmpty,
    emptyMessage = 'No data available.',
    children,
}: LoadStateProps) {
    if (isLoading) {
        return <p className="text-sm text-[#5A5A5A]">Loading...</p>
    }

    if (error) {
        return (
            <p className="rounded-xl border border-[#FFAAB8] bg-[#FFD8DF]/50 px-3 py-2 text-sm text-[#5A454B]">
                {getErrorMessage(error)}
            </p>
        )
    }

    if (isEmpty) {
        return <p className="text-sm text-[#5A5A5A]">{emptyMessage}</p>
    }

    return <>{children}</>
}
