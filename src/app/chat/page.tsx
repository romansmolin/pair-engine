'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
    useGetChatContactsQuery,
    useGetChatMessagesQuery,
    useSendChatMessageMutation,
} from '@/entities/chat/api/client/endpoints'
import { AppShell } from '@/components/app/AppShell'
import { LoadState, getErrorMessage } from '@/components/app/LoadState'
import { SectionCard } from '@/components/app/SectionCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const formatDateTime = (value?: string): string => {
    if (!value) return 'Unknown time'

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value

    return date.toLocaleString()
}

export default function ChatPage() {
    const contactsQuery = useGetChatContactsQuery(undefined, {
        pollingInterval: 5000,
    })

    const [selectedContactId, setSelectedContactId] = useState<number | null>(null)
    const [messageText, setMessageText] = useState('')
    const [sendError, setSendError] = useState<string | null>(null)

    const contacts = contactsQuery.data?.contacts ?? []

    useEffect(() => {
        if (!contacts.length) {
            setSelectedContactId(null)
            return
        }

        if (!selectedContactId || !contacts.some((contact) => contact.id === selectedContactId)) {
            setSelectedContactId(contacts[0].id)
        }
    }, [contacts, selectedContactId])

    const selectedContact = useMemo(
        () => contacts.find((contact) => contact.id === selectedContactId),
        [contacts, selectedContactId],
    )

    const messagesArgs = useMemo(
        () => ({
            contactId: selectedContactId ?? 1,
            contact: selectedContact?.username,
        }),
        [selectedContactId, selectedContact?.username],
    )

    const messagesQuery = useGetChatMessagesQuery(messagesArgs, {
        pollingInterval: 5000,
        skip: !selectedContactId,
    })

    const [sendMessage, sendState] = useSendChatMessageMutation()

    const messages = messagesQuery.data?.messages ?? []

    const handleSend = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!selectedContactId) {
            setSendError('Select a conversation first.')
            return
        }

        const content = messageText.trim()
        if (!content) {
            return
        }

        setSendError(null)

        try {
            await sendMessage({
                contactId: selectedContactId,
                contact: selectedContact?.username,
                message: content,
            }).unwrap()

            setMessageText('')
            void messagesQuery.refetch()
        } catch (error) {
            setSendError(getErrorMessage(error, 'Unable to send message right now.'))
        }
    }

    return (
        <AppShell title="Chat" description="Review your conversations and send messages in real time via polling.">
            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                <SectionCard title="Conversations" description="Your current contacts" className="h-fit">
                    <LoadState
                        isLoading={contactsQuery.isLoading}
                        error={contactsQuery.error}
                        isEmpty={!contactsQuery.isLoading && !contactsQuery.error && contacts.length === 0}
                        emptyMessage="No conversations found."
                    >
                        <ul className="space-y-2">
                            {contacts.map((contact) => {
                                const isActive = contact.id === selectedContactId

                                return (
                                    <li key={contact.id}>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedContactId(contact.id)}
                                            className={`w-full rounded-2xl border p-3 text-left transition-colors ${
                                                isActive
                                                    ? 'border-[#FFAAB8] bg-[#FFD8DF]/50'
                                                    : 'border-[#A8DF8E] hover:bg-[#F0FFDF]'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-sm font-semibold text-[#2A2A2A]">{contact.username}</p>
                                                {contact.unreadCount ? (
                                                    <Badge variant="default">{contact.unreadCount}</Badge>
                                                ) : null}
                                            </div>
                                            <p className="mt-1 text-xs text-[#5A5A5A]">
                                                {contact.lastMessagePreview || 'No recent message'}
                                            </p>
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </LoadState>
                </SectionCard>

                <SectionCard
                    title={selectedContact ? `Chat with ${selectedContact.username}` : 'Active Chat'}
                    description="Messages refresh automatically every 5 seconds."
                >
                    {!selectedContactId ? (
                        <p className="text-sm text-[#5A5A5A]">Select a conversation to start chatting.</p>
                    ) : (
                        <>
                            <LoadState
                                isLoading={messagesQuery.isLoading}
                                error={messagesQuery.error}
                                isEmpty={!messagesQuery.isLoading && !messagesQuery.error && messages.length === 0}
                                emptyMessage="No messages yet in this conversation."
                            >
                                <div className="max-h-[420px] space-y-2 overflow-y-auto rounded-2xl border border-[#A8DF8E] p-3">
                                    {messages.map((message, index) => {
                                        const isIncoming = message.senderId === selectedContactId

                                        return (
                                            <article
                                                key={`${message.id}-${index}`}
                                                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                                                    isIncoming
                                                        ? 'border border-[#A8DF8E] bg-[#F0FFDF]'
                                                        : 'ml-auto border border-[#FFAAB8] bg-[#FFD8DF]/50'
                                                }`}
                                            >
                                                <p className="text-[#2A2A2A]">{message.text || message.extra || 'Message'}</p>
                                                <p className="mt-1 text-[11px] text-[#6A6A6A]">{formatDateTime(message.sentAt)}</p>
                                            </article>
                                        )
                                    })}
                                </div>
                            </LoadState>

                            <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={handleSend}>
                                <Input
                                    value={messageText}
                                    onChange={(event) => setMessageText(event.target.value)}
                                    placeholder="Type your message"
                                    aria-label="Message text"
                                />
                                <Button type="submit" disabled={sendState.isLoading || !selectedContactId || !messageText.trim()}>
                                    {sendState.isLoading ? 'Sending...' : 'Send'}
                                </Button>
                            </form>

                            {sendError ? (
                                <p className="mt-2 rounded-xl border border-[#FFAAB8] bg-[#FFD8DF]/50 px-3 py-2 text-sm text-[#5A454B]">
                                    {sendError}
                                </p>
                            ) : null}
                        </>
                    )}
                </SectionCard>
            </div>
        </AppShell>
    )
}
