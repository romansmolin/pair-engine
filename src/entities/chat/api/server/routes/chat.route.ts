import { NextRequest } from 'next/server'
import { asyncHandler } from '@/shared/http/async-handler'
import { container } from '@/shared/lib/di/container.server'
import { ChatController } from '@/entities/chat'

const getChatController = (): ChatController => {
    return container.get(ChatController)
}

export const GET_CHAT_CONTACTS = asyncHandler(async (request: NextRequest) => {
    return getChatController().getContacts(request)
})

export const GET_CHAT_MESSAGES = asyncHandler(async (request: NextRequest) => {
    return getChatController().getMessages(request)
})

export const POST_CHAT_SEND = asyncHandler(async (request: NextRequest) => {
    return getChatController().postSend(request)
})
