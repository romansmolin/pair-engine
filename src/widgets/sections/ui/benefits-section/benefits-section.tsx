import { Compass, HeartHandshake, Lock, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react'

const benefits = [
    {
        title: 'Better matches',
        description:
            'Compatibility-based matching helps you meet people who actually fit your lifestyle and values.',
        icon: HeartHandshake,
        className: 'md:col-span-2',
    },
    {
        title: 'Real conversations',
        description: 'Thoughtful prompts make starting conversations easier and more natural.',
        icon: MessageCircle,
    },
    {
        title: 'Less swiping',
        description: 'We focus on quality over quantity, so you spend less time scrolling.',
        icon: Sparkles,
    },
    {
        title: 'Safer profiles',
        description: 'Profile verification helps reduce fake accounts and spam.',
        icon: ShieldCheck,
    },
    {
        title: 'Privacy control',
        description: 'You decide what to share and when.',
        icon: Lock,
    },
    {
        title: 'Intentional dating',
        description:
            'Pairly is designed for people who want meaningful connections, not distractions.',
        icon: Compass,
        className: 'md:col-span-3',
    },
]

export const BenefitsSection = () => {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8" id="safety">
            <div className="mb-8 flex flex-col gap-3 sm:mb-10">
                <h2 className="text-3xl font-extrabold uppercase leading-tight sm:text-4xl lg:text-5xl">
                    Why people choose <span className="text-primary">Pairly</span>
                </h2>
                <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                    Built for meaningful connections with less noise and more intention.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {benefits.map(({ title, description, icon: Icon, className }) => (
                    <article
                        key={title}
                        className={`rounded-2xl border border-border bg-card p-5 sm:p-6 ${className ?? ''}`}
                    >
                        <div className="mb-4 inline-flex rounded-xl border border-border bg-background p-2.5">
                            <Icon className="size-5 text-primary" />
                        </div>
                        <h3 className="mb-2 text-lg font-bold sm:text-xl">{title}</h3>
                        <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                            {description}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    )
}
