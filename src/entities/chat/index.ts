export type {
    ChatMessage,
    ContactPreview,
    ContactsResponse,
    MessagesResponse,
    SendMessageRequest,
    SendMessageResponse,
} from './model/types'

export {
    useGetChatContactsQuery,
    useGetChatMessagesQuery,
    useSendChatMessageMutation,
} from './api/client/endpoints'

export type { GetChatMessagesQuery } from './api/client/services/chat.service'

export { ChatController } from './api/server/controllers/chat.controller'
export { ChatService } from './api/server/services/chat.service'
export {
    ChatRepository,
    type ContactBlock,
    type EclairBlock,
    type LoadContactsResponse,
    type LoadMessagesResponse,
    type SendMessageApiResponse,
} from './api/server/repositories/chat.repo'
