import type { HeroProps } from '@/components/editorial/types'
import { EditorialPrimaryButton } from '@/components/editorial/EditorialPrimaryButton'

const hero: HeroProps = {
    eyebrow: 'Intentional dating, engineered with context',
    title: 'The future of matching with compatibility intelligence',
    subtitle:
        'Pair Engine reads values, lifestyle, and intent before it recommends people. Less noise, more conversations that lead somewhere.',
    primaryCta: { label: 'Open App', href: '/auth/sign-in' },
    secondaryCta: { label: 'See How It Works', href: '#how-it-works' },
}

export function EditorialHero() {
    return (
        <section className="editorial-hero" aria-labelledby="editorial-hero-title">
            <div className="editorial-hero-grid">
                <article className="editorial-hero-copy">
                    <p className="editorial-eyebrow">{hero.eyebrow}</p>
                    <h1 id="editorial-hero-title" className="editorial-hero-title">
                        The future of matching with <span>compatibility intelligence</span>
                    </h1>
                    <p className="editorial-hero-subtitle">{hero.subtitle}</p>

                    <div className="editorial-hero-actions">
                        <EditorialPrimaryButton href={hero.primaryCta.href}>{hero.primaryCta.label}</EditorialPrimaryButton>
                        <EditorialPrimaryButton href={hero.secondaryCta.href} variant="ghost">
                            {hero.secondaryCta.label}
                        </EditorialPrimaryButton>
                    </div>
                </article>

                <aside className="editorial-hero-notes" aria-label="Compatibility notes">
                    <div className="editorial-annotation-card tilt-left">
                        <p className="editorial-annotation-label">Quick signal</p>
                        <p>Shared pace + aligned relationship goals boost reply quality.</p>
                    </div>
                    <div className="editorial-annotation-card tilt-right">
                        <p className="editorial-annotation-label">Conversation starter</p>
                        <p>
                            “What boundary has improved your relationships the most?” performs 2.2x better
                            than small talk.
                        </p>
                    </div>
                    <div className="editorial-hero-visual" role="img" aria-label="Layered cards representing compatibility signals" />
                </aside>
            </div>
        </section>
    )
}
