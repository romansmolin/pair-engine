import { NextRequest } from 'next/server'

export function getClientIp(request: NextRequest): string | undefined {
    const forwardedFor = request.headers.get('x-forwarded-for')
    if (forwardedFor) {
        const firstIp = forwardedFor.split(',')[0]?.trim()
        if (firstIp) return firstIp
    }

    const realIp = request.headers.get('x-real-ip')
    if (realIp) return realIp

    const cloudflareIp = request.headers.get('cf-connecting-ip')
    if (cloudflareIp) return cloudflareIp

    return undefined
}
