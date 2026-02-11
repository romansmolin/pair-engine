import { apiClient } from '@/shared/api/client/axios.config'
import type {
    ContactsResponse,
    MessagesResponse,
    SendMessageRequest,
    SendMessageResponse,
} from '@/entities/chat/model/types'

export type GetChatMessagesQuery = {
    contactId: number
    contact?: string
}

export async function getChatContacts(): Promise<ContactsResponse> {
    const response = await apiClient.get<ContactsResponse>('/api/chat/contacts')
    return response.data
}

export async function getChatMessages(query: GetChatMessagesQuery): Promise<MessagesResponse> {
    const params = new URLSearchParams()
    params.set('contactId', String(query.contactId))

    if (query.contact) {
        params.set('contact', query.contact)
    }

    const response = await apiClient.get<MessagesResponse>(`/api/chat/messages?${params.toString()}`)
    return response.data
}

export async function sendChatMessage(payload: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await apiClient.post<SendMessageResponse>('/api/chat/send', payload)
    return response.data
}
