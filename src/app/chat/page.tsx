import { Suspense } from 'react'
import { ChatPage } from '@/views/chat-page'
import { AppShell } from '@/widgets/app-shell'

export default function Chat() {
    return (
        <AppShell>
            <Suspense fallback={null}>
                <ChatPage />
            </Suspense>
        </AppShell>
    )
}
