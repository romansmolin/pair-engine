export function resolvePostAuthRedirect(rawNext: string | null | undefined, fallback = '/dashboard'): string {
    if (!rawNext) {
        return fallback
    }

    let next = rawNext

    try {
        next = decodeURIComponent(rawNext)
    } catch {
        next = rawNext
    }

    if (!next.startsWith('/') || next.startsWith('//')) {
        return fallback
    }

    return next
}

export function toSingleQueryValue(value: string | string[] | undefined): string | undefined {
    if (typeof value === 'string') {
        return value
    }

    if (Array.isArray(value)) {
        return value[0]
    }

    return undefined
}
