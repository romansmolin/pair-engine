import { inject, injectable } from 'inversify'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AppError } from '@/shared/errors/app-error'
import { ChatService } from '../services/chat.service'

const sendMessageBodySchema = z.object({
    contactId: z.number().int().positive('contactId must be a positive integer'),
    contact: z.string().trim().min(1, 'contact cannot be empty').optional(),
    message: z.string().trim().min(1, 'Message cannot be empty'),
})

const parseContactId = (value: string | null): number => {
    if (!value) {
        throw AppError.validationError('Invalid contactId query parameter', [
            {
                field: 'contactId',
                message: 'contactId is required',
            },
        ])
    }

    const parsed = Number.parseInt(value, 10)

    if (!Number.isFinite(parsed) || parsed < 1) {
        throw AppError.validationError('Invalid contactId query parameter', [
            {
                field: 'contactId',
                message: 'contactId must be a positive integer',
            },
        ])
    }

    return parsed
}

const parseOptionalContact = (value: string | null): string | undefined => {
    if (!value) return undefined

    const normalized = value.trim()
    return normalized.length > 0 ? normalized : undefined
}

@injectable()
export class ChatController {
    constructor(@inject(ChatService) private chatService: ChatService) {}

    private getSessionId(request: NextRequest): string {
        const sessionId = request.cookies.get('dating_session_id')?.value

        if (!sessionId) {
            throw AppError.authenticationError('Authentication required')
        }

        return sessionId
    }

    async getContacts(request: NextRequest): Promise<NextResponse> {
        const sessionId = this.getSessionId(request)
        const response = await this.chatService.getContacts(sessionId)

        return NextResponse.json(response)
    }

    async getMessages(request: NextRequest): Promise<NextResponse> {
        const sessionId = this.getSessionId(request)
        const { searchParams } = new URL(request.url)
        const contactId = parseContactId(searchParams.get('contactId'))
        const contact = parseOptionalContact(searchParams.get('contact'))

        const response = await this.chatService.getMessages({
            sessionId,
            contactId,
            contact,
        })

        return NextResponse.json(response)
    }

    async postSend(request: NextRequest): Promise<NextResponse> {
        const sessionId = this.getSessionId(request)

        let body: unknown

        try {
            body = await request.json()
        } catch {
            throw AppError.validationError('Invalid JSON payload')
        }

        const parsed = sendMessageBodySchema.safeParse(body)

        if (!parsed.success) {
            throw AppError.validationError(
                'Invalid message payload',
                parsed.error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                })),
            )
        }

        const response = await this.chatService.sendMessage({
            sessionId,
            contactId: parsed.data.contactId,
            contact: parsed.data.contact,
            message: parsed.data.message,
        })

        return NextResponse.json(response)
    }
}
