import { Button } from '@/shared/ui/button'
import { Gift, Heart } from 'lucide-react'

const packs = [
    {
        name: 'Starter pack',
        credits: 5,
        price: '0.10 EUR',
    },
    {
        name: 'Boost pack',
        credits: 25,
        price: '0.50 EUR',
        label: 'Popular',
    },
    {
        name: 'Pro pack',
        credits: 50,
        price: '1.00 EUR',
        label: 'Best value',
    },
]

export const PricingSection = () => {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-3xl border border-border p-4 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
                            Buy credits
                        </h2>
                        <p className="mt-2 text-lg text-foreground/90 sm:text-xl">
                            0.10 EUR equals 5 credits. Pick a pack and checkout securely.
                        </p>
                    </div>
                    <div className="inline-flex items-center rounded-xl border border-border px-4 py-2 text-sm font-medium tracking-[0.2em] uppercase">
                        3 packs
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {packs.map((pack) => (
                        <div
                            key={pack.name}
                            className="flex w-full flex-col gap-5 rounded-3xl border border-border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between"
                        >
                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h3 className="text-3xl font-extrabold">{pack.name}</h3>
                                    {pack.label && (
                                        <span className="rounded-xl bg-primary px-3 py-1 text-sm font-semibold">
                                            {pack.label}
                                        </span>
                                    )}
                                </div>
                                <p className="mt-3 text-2xl">{pack.credits} credits</p>
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end lg:items-center">
                                <div className="sm:text-right">
                                    <div className="text-5xl font-extrabold leading-none">
                                        {pack.price}
                                    </div>
                                    <div className="mt-1 text-2xl text-muted-foreground">
                                        {pack.credits} credits included
                                    </div>
                                </div>
                                <Button className="h-14 text-xl px-8">Buy credits</Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                        <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
                            <Gift className="size-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
                                Gifts that start real conversations
                                <Heart className="size-5 text-primary" />
                            </h3>
                            <p className="mt-2 text-base text-muted-foreground sm:text-lg">
                                People who send a gift in chat get replies up to 25% more often.
                            </p>
                            <p className="mt-2 text-base text-muted-foreground sm:text-lg">
                                A small, thoughtful gesture can break the ice, show genuine
                                interest, and help you turn matches into real conversations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
