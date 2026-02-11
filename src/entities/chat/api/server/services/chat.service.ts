import { inject, injectable } from 'inversify'
import type {
    ChatMessage,
    ContactPreview,
    ContactsResponse,
    MessagesResponse,
    SendMessageResponse,
} from '@/entities/chat/model/types'
import {
    ChatRepository,
    type ContactBlock,
    type EclairBlock,
} from '../repositories/chat.repo'

type GetMessagesInput = {
    sessionId: string
    contactId: number
    contact?: string
}

type SendMessageInput = {
    sessionId: string
    contactId: number
    contact?: string
    message: string
}

const toNumber = (value?: number | string): number | undefined => {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : undefined
    }

    if (typeof value === 'string') {
        const trimmed = value.trim()
        if (!trimmed) return undefined

        const parsed = Number(trimmed)
        return Number.isFinite(parsed) ? parsed : undefined
    }

    return undefined
}

const toInteger = (value?: number | string): number | undefined => {
    const parsed = toNumber(value)

    if (parsed === undefined || !Number.isInteger(parsed)) {
        return undefined
    }

    return parsed
}

const toPositiveInteger = (value?: number | string): number | undefined => {
    const parsed = toInteger(value)

    if (parsed === undefined || parsed < 1) {
        return undefined
    }

    return parsed
}

const toNonNegativeInteger = (value?: number | string): number | undefined => {
    const parsed = toInteger(value)

    if (parsed === undefined || parsed < 0) {
        return undefined
    }

    return parsed
}

const normalizeText = (value?: string | null): string | undefined => {
    if (!value) return undefined

    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
}

const mapOnlineStatus = (
    value?: string,
): ContactPreview['onlineStatus'] => {
    const normalized = normalizeText(value)?.toLowerCase()

    if (normalized === 'green') return 'online'
    if (normalized === 'yellow') return 'recent'
    return 'offline'
}

const getLastMessagePreview = (value?: string | string[] | null): string | undefined => {
    if (Array.isArray(value)) {
        for (const item of value) {
            const normalized = normalizeText(item)
            if (normalized) return normalized
        }

        return undefined
    }

    if (typeof value === 'string') {
        return normalizeText(value)
    }

    return undefined
}

const toContactPreview = (contact: ContactBlock): ContactPreview | null => {
    const id = toPositiveInteger(contact.m_id)

    if (!id) return null

    const username = normalizeText(contact.pseudo) ?? 'Member'

    const mapped: ContactPreview = {
        id,
        username,
        onlineStatus: mapOnlineStatus(contact.online),
    }

    const avatarUrl = normalizeText(contact.photo)
    if (avatarUrl) {
        mapped.avatarUrl = avatarUrl
    }

    const unreadCount = toNonNegativeInteger(contact.nb_new)
    if (unreadCount !== undefined) {
        mapped.unreadCount = unreadCount
    }

    const isFriend = toInteger(contact.is_friend)
    if (isFriend !== undefined) {
        mapped.isFriend = isFriend === 1
    }

    const lastMessagePreview = getLastMessagePreview(contact.tab_last_msg)
    if (lastMessagePreview) {
        mapped.lastMessagePreview = lastMessagePreview
    }

    return mapped
}

const buildFallbackMessageId = (message: EclairBlock, index: number): string => {
    const exp = normalizeText(String(message.exp ?? 'unknown')) ?? 'unknown'
    const date = normalizeText(message.date) ?? 'unknown'
    return `${exp}-${date}-${index}`
}

const toChatMessage = (message: EclairBlock, index: number): ChatMessage => {
    const mapped: ChatMessage = {
        id: toPositiveInteger(message.id) ?? buildFallbackMessageId(message, index),
    }

    const senderId = toPositiveInteger(message.exp)
    if (senderId !== undefined) {
        mapped.senderId = senderId
    }

    const text = normalizeText(message.msg)
    if (text) {
        mapped.text = text
    }

    const sentAt = normalizeText(message.date)
    if (sentAt) {
        mapped.sentAt = sentAt
    }

    const extra = normalizeText(message.p_extra) ?? normalizeText(message.album_share)
    if (extra) {
        mapped.extra = extra
    }

    return mapped
}

@injectable()
export class ChatService {
    constructor(@inject(ChatRepository) private repository: ChatRepository) {}

    async getContacts(sessionId: string): Promise<ContactsResponse> {
        const payload = await this.repository.loadContacts(sessionId)

        const contacts = (payload.contacts ?? [])
            .map(toContactPreview)
            .filter((contact): contact is ContactPreview => contact != null)

        return { contacts }
    }

    async getMessages(input: GetMessagesInput): Promise<MessagesResponse> {
        const payload = await this.repository.loadMessages({
            sessionId: input.sessionId,
            contactId: input.contactId,
            contact: input.contact,
        })

        const messages = (payload.eclairs ?? []).map((message, index) => toChatMessage(message, index))

        return { messages }
    }

    async sendMessage(input: SendMessageInput): Promise<SendMessageResponse> {
        const payload = await this.repository.sendMessage({
            sessionId: input.sessionId,
            contactId: input.contactId,
            contact: input.contact,
            message: input.message,
        })

        return {
            message: normalizeText(payload.msg),
            date: normalizeText(payload.date),
        }
    }
}
