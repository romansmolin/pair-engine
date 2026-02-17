import { EditorialEmptyState } from '@/components/editorial/EditorialEmptyState'
import type { ContentCardItem, EmptyStateConfig } from '@/components/editorial/types'

const storyCards: ContentCardItem[] = [
    {
        id: 'card-compatibility',
        kicker: 'Feature lens',
        title: 'Compatibility scoring with context, not guesswork',
        body: 'Each recommendation combines value alignment, habits, and relationship intent so users spend less time filtering mismatches.',
        tag: 'Core engine',
        status: 'featured',
    },
    {
        id: 'card-prompts',
        kicker: 'Conversation quality',
        title: 'Prompt-guided openers that feel personal',
        body: 'Instead of empty “hey” messages, Pair Engine introduces match-specific prompts that lead to useful, human conversation.',
        tag: 'Chat UX',
        status: 'default',
    },
    {
        id: 'card-privacy',
        kicker: 'Trust controls',
        title: 'Privacy settings that support intentional pacing',
        body: 'Profile visibility, interaction limits, and pace controls help users choose when and how they appear in discovery.',
        tag: 'Safety',
        status: 'default',
    },
    {
        id: 'card-curation',
        kicker: 'Less swipe fatigue',
        title: 'Curated recommendations over endless feeds',
        body: 'The product prefers fewer, stronger introductions each cycle, helping users stay focused on meaningful matches.',
        tag: 'Curation',
        status: 'default',
    },
]

const emptyStateConfig: EmptyStateConfig = {
    title: 'No active storycards yet',
    description:
        'Once users complete profile intent and boundaries, this area turns into their weekly compatibility journal.',
    action: {
        label: 'Complete profile',
        href: '/auth/sign-in',
    },
}

export function EditorialCardGrid() {
    return (
        <section id="how-it-works" className="editorial-grid-shell" aria-label="Product story cards">
            <div className="editorial-grid-head">
                <p>How it works</p>
                <h2>Designed like a story, not a spreadsheet</h2>
            </div>

            <div className="editorial-grid" id="features">
                {storyCards.map((card, index) => (
                    <article
                        key={card.id}
                        className={`editorial-story-card ${
                            card.status === 'featured' ? 'is-featured' : ''
                        } ${index % 2 ? 'tilt-right' : 'tilt-left'}`}
                    >
                        {card.kicker ? <p className="editorial-story-kicker">{card.kicker}</p> : null}
                        <h3>{card.title}</h3>
                        <p>{card.body}</p>
                        {card.tag ? <span className="editorial-story-tag">{card.tag}</span> : null}
                    </article>
                ))}
            </div>

            <div id="technology">
                <EditorialEmptyState config={emptyStateConfig} />
            </div>
        </section>
    )
}
