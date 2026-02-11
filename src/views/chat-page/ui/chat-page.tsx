'use client'

import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Loader2, MessageCircle, Send } from 'lucide-react'
import { toast } from 'sonner'
import type { ChatMessage, ContactPreview } from '@/entities/chat/model/types'
import {
    useGetChatContactsQuery,
    useGetChatMessagesQuery,
    useSendChatMessageMutation,
} from '@/entities/chat/api/client/endpoints'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'

const POLL_INTERVAL_MS = 10_000

const getErrorMessage = (error: unknown): string => {
    if (typeof error === 'object' && error !== null) {
        const maybeMessage = (error as { data?: { message?: string } }).data?.message
        if (typeof maybeMessage === 'string' && maybeMessage.trim()) {
            return maybeMessage
        }

        const nestedMessage =
            (error as { error?: string }).error ?? (error as { message?: string }).message

        if (typeof nestedMessage === 'string' && nestedMessage.trim()) {
            return nestedMessage
        }
    }

    return 'Unable to load data right now'
}

const parsePositiveInteger = (value: string | null): number | undefined => {
    if (!value) return undefined

    const parsed = Number.parseInt(value, 10)

    if (!Number.isFinite(parsed) || parsed < 1) {
        return undefined
    }

    return parsed
}

const statusBadgeClass = (status?: ContactPreview['onlineStatus']): string => {
    if (status === 'online') {
        return 'border-emerald-300 bg-emerald-50 text-emerald-700'
    }

    if (status === 'recent') {
        return 'border-amber-300 bg-amber-50 text-amber-700'
    }

    return 'border-zinc-300 bg-zinc-50 text-zinc-700'
}

const formatTime = (value?: string): string => {
    if (!value) return ''

    return value
}

const isIncomingMessage = (message: ChatMessage, contactId?: number): boolean => {
    if (!contactId || typeof message.senderId !== 'number') {
        return false
    }

    return message.senderId === contactId
}

function ContactsList({
    contacts,
    selectedContactId,
    onSelect,
}: {
    contacts: ContactPreview[]
    selectedContactId: number | null
    onSelect: (contactId: number) => void
}) {
    return (
        <ul className="space-y-2">
            {contacts.map((contact) => {
                const isActive = selectedContactId === contact.id

                return (
                    <li key={contact.id}>
                        <button
                            type="button"
                            onClick={() => onSelect(contact.id)}
                            className={`w-full rounded-xl border p-3 text-left transition-colors ${
                                isActive
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border bg-card hover:bg-accent'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <Avatar size="default" className="ring-border ring-1">
                                    <AvatarImage src={contact.avatarUrl} alt={`${contact.username} avatar`} />
                                    <AvatarFallback>
                                        <MessageCircle className="size-4" />
                                    </AvatarFallback>
                                </Avatar>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="truncate text-sm font-semibold">{contact.username}</p>
                                        {typeof contact.unreadCount === 'number' && contact.unreadCount > 0 ? (
                                            <Badge className="bg-rose-500 text-white hover:bg-rose-500">
                                                {contact.unreadCount}
                                            </Badge>
                                        ) : null}
                                    </div>

                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className={statusBadgeClass(contact.onlineStatus)}
                                        >
                                            {contact.onlineStatus ?? 'offline'}
                                        </Badge>
                                        {contact.isFriend ? (
                                            <Badge variant="secondary">Friend</Badge>
                                        ) : null}
                                    </div>

                                    {contact.lastMessagePreview ? (
                                        <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
                                            {contact.lastMessagePreview}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        </button>
                    </li>
                )
            })}
        </ul>
    )
}

function MessagesThread({
    messages,
    contactId,
}: {
    messages: ChatMessage[]
    contactId?: number
}) {
    return (
        <ul className="space-y-3">
            {messages.map((message) => {
                const incoming = isIncomingMessage(message, contactId)

                return (
                    <li
                        key={message.id}
                        className={`flex ${incoming ? 'justify-start' : 'justify-end'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                                incoming
                                    ? 'bg-muted text-foreground'
                                    : 'bg-primary text-primary-foreground'
                            }`}
                        >
                            <p className="whitespace-pre-wrap break-words">{message.text ?? ''}</p>
                            {message.extra ? (
                                <p className="mt-1 break-all text-xs opacity-85">{message.extra}</p>
                            ) : null}
                            {message.sentAt ? (
                                <p className="mt-1 text-[11px] opacity-80">{formatTime(message.sentAt)}</p>
                            ) : null}
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}

export function ChatPage() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [manualSelectedContactId, setManualSelectedContactId] = useState<number | null>(null)
    const [draftMessage, setDraftMessage] = useState('')

    const contactsQuery = useGetChatContactsQuery()
    const refetchContacts = contactsQuery.refetch

    const contacts = useMemo(() => contactsQuery.data?.contacts ?? [], [contactsQuery.data?.contacts])

    const queryContactId = parsePositiveInteger(searchParams.get('contactId')) ?? null

    const selectedContactId = useMemo(() => {
        if (
            manualSelectedContactId &&
            contacts.some((contact) => contact.id === manualSelectedContactId)
        ) {
            return manualSelectedContactId
        }

        if (queryContactId && contacts.some((contact) => contact.id === queryContactId)) {
            return queryContactId
        }

        return contacts[0]?.id ?? null
    }, [contacts, manualSelectedContactId, queryContactId])

    const selectedContact = useMemo(() => {
        if (selectedContactId == null) return null
        return contacts.find((contact) => contact.id === selectedContactId) ?? null
    }, [contacts, selectedContactId])

    const messagesArgs = selectedContact
        ? {
              contactId: selectedContact.id,
              contact: selectedContact.username,
          }
        : skipToken

    const messagesQuery = useGetChatMessagesQuery(messagesArgs)
    const refetchMessages = messagesQuery.refetch
    const [sendChatMessage, sendChatMessageState] = useSendChatMessageMutation()

    useEffect(() => {
        if (queryContactId === selectedContactId) {
            return
        }

        const params = new URLSearchParams(searchParams.toString())

        if (selectedContactId) {
            params.set('contactId', String(selectedContactId))
        } else {
            params.delete('contactId')
        }

        const query = params.toString()
        const href = query ? `${pathname}?${query}` : pathname
        router.replace(href, { scroll: false })
    }, [pathname, queryContactId, router, searchParams, selectedContactId])

    const contactsFetchingRef = useRef(contactsQuery.isFetching)

    useEffect(() => {
        contactsFetchingRef.current = contactsQuery.isFetching
    }, [contactsQuery.isFetching])

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!contactsFetchingRef.current) {
                void refetchContacts()
            }
        }, POLL_INTERVAL_MS)

        return () => {
            clearInterval(intervalId)
        }
    }, [refetchContacts])

    const messagesFetchingRef = useRef(messagesQuery.isFetching)

    useEffect(() => {
        messagesFetchingRef.current = messagesQuery.isFetching
    }, [messagesQuery.isFetching])

    useEffect(() => {
        if (!selectedContact) {
            return
        }

        const intervalId = setInterval(() => {
            if (!messagesFetchingRef.current) {
                void refetchMessages()
            }
        }, POLL_INTERVAL_MS)

        return () => {
            clearInterval(intervalId)
        }
    }, [refetchMessages, selectedContact])

    const handleSelectContact = (contactId: number) => {
        setManualSelectedContactId(contactId)
    }

    const handleSend = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!selectedContact) {
            toast.error('Select a contact first')
            return
        }

        const message = draftMessage.trim()

        if (!message) {
            toast.error('Message cannot be empty')
            return
        }

        try {
            await sendChatMessage({
                contactId: selectedContact.id,
                contact: selectedContact.username,
                message,
            }).unwrap()

            setDraftMessage('')
            await Promise.all([refetchContacts(), refetchMessages()])
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    const messages = messagesQuery.data?.messages ?? []

    return (
        <section className="py-8 sm:pb-12">
            <div className="mx-auto w-full max-w-6xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl sm:text-3xl">Chat</CardTitle>
                        <CardDescription>
                            View contacts, open conversations, and send messages.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
                        <div className="rounded-xl border border-border bg-card p-3">
                            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Contacts</h3>

                            {contactsQuery.isLoading ? (
                                <div className="flex items-center justify-center rounded-xl border border-dashed border-border py-8 text-sm text-muted-foreground">
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Loading contacts...
                                </div>
                            ) : contactsQuery.error ? (
                                <Alert variant="destructive">
                                    <AlertTitle>Failed to load contacts</AlertTitle>
                                    <AlertDescription>
                                        {getErrorMessage(contactsQuery.error)}
                                    </AlertDescription>
                                </Alert>
                            ) : contacts.length ? (
                                <div className="max-h-[36rem] overflow-y-auto pr-1">
                                    <ContactsList
                                        contacts={contacts}
                                        selectedContactId={selectedContactId}
                                        onSelect={handleSelectContact}
                                    />
                                </div>
                            ) : (
                                <div className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                                    No contacts available right now.
                                </div>
                            )}
                        </div>

                        <div className="rounded-xl border border-border bg-card p-3">
                            {selectedContact ? (
                                <>
                                    <div className="mb-3 flex items-center gap-3 border-b border-border pb-3">
                                        <Avatar size="default" className="ring-border ring-1">
                                            <AvatarImage
                                                src={selectedContact.avatarUrl}
                                                alt={`${selectedContact.username} avatar`}
                                            />
                                            <AvatarFallback>
                                                <MessageCircle className="size-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold">
                                                {selectedContact.username}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {selectedContact.onlineStatus ?? 'offline'}
                                            </p>
                                        </div>
                                    </div>

                                    {messagesQuery.isLoading ? (
                                        <div className="flex items-center justify-center rounded-xl border border-dashed border-border py-8 text-sm text-muted-foreground">
                                            <Loader2 className="mr-2 size-4 animate-spin" />
                                            Loading messages...
                                        </div>
                                    ) : messagesQuery.error ? (
                                        <Alert variant="destructive">
                                            <AlertTitle>Failed to load messages</AlertTitle>
                                            <AlertDescription>
                                                {getErrorMessage(messagesQuery.error)}
                                            </AlertDescription>
                                        </Alert>
                                    ) : messages.length ? (
                                        <div className="max-h-[28rem] overflow-y-auto pr-1">
                                            <MessagesThread
                                                messages={messages}
                                                contactId={selectedContact.id}
                                            />
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                                            No messages yet.
                                        </div>
                                    )}

                                    <form onSubmit={handleSend} className="mt-4 flex items-center gap-2">
                                        <Input
                                            placeholder="Type your message..."
                                            value={draftMessage}
                                            onChange={(event) => setDraftMessage(event.target.value)}
                                            disabled={sendChatMessageState.isLoading}
                                        />
                                        <Button
                                            type="submit"
                                            disabled={sendChatMessageState.isLoading || !draftMessage.trim()}
                                        >
                                            {sendChatMessageState.isLoading ? (
                                                <>
                                                    <Loader2 className="size-4 animate-spin" />
                                                    Sending
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="size-4" />
                                                    Send
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </>
                            ) : (
                                <div className="flex h-full min-h-[22rem] items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
                                    Select a contact to open conversation.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
