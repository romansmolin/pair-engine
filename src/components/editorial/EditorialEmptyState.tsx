import type { EmptyStateConfig } from '@/components/editorial/types'
import { EditorialPrimaryButton } from '@/components/editorial/EditorialPrimaryButton'

type EditorialEmptyStateProps = {
    config: EmptyStateConfig
}

export function EditorialEmptyState({ config }: EditorialEmptyStateProps) {
    return (
        <article className="editorial-empty" aria-live="polite">
            <svg viewBox="0 0 240 140" className="editorial-empty-illustration" role="img" aria-label="Sketch style empty state illustration">
                <defs>
                    <linearGradient id="empty-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFE2D7" />
                        <stop offset="100%" stopColor="#FFD2D2" />
                    </linearGradient>
                </defs>
                <rect x="14" y="22" width="210" height="92" rx="16" fill="url(#empty-gradient)" />
                <circle cx="66" cy="66" r="20" fill="#fff4ec" stroke="#2A2522" strokeWidth="2" />
                <path d="M48 90 Q67 106 86 90" stroke="#2A2522" strokeWidth="2" fill="none" />
                <path d="M112 56 L195 56" stroke="#2A2522" strokeWidth="2" strokeLinecap="round" />
                <path d="M112 74 L177 74" stroke="#2A2522" strokeWidth="2" strokeLinecap="round" />
                <path d="M112 92 L165 92" stroke="#2A2522" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h3>{config.title}</h3>
            <p>{config.description}</p>
            {config.action ? (
                <EditorialPrimaryButton href={config.action.href} variant="ghost">
                    {config.action.label}
                </EditorialPrimaryButton>
            ) : null}
        </article>
    )
}
