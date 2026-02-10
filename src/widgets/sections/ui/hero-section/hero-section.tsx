import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { ArrowBigDown, Rocket } from 'lucide-react'
import Image from 'next/image'

const userAvatars = [
    'https://api.dicebear.com/7.x/avataaars/png?seed=Reader1',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Reader2',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Reader3',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Reader4',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Reader5',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Reader6',
]

export const HeroSection = () => {
    return (
        <section className="relative mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-7xl flex-col items-center justify-center gap-7 px-4 sm:gap-8 sm:px-6 lg:gap-10 lg:px-8">
            <Badge className="h-auto  max-w-full bg-transparent px-3 py-2 text-center text-sm font-bold text-primary border-2 border-primary border-dashed sm:text-base md:text-lg lg:text-xl">
                <span className="text-wrap">
                    ✨ Trusted by people looking for real relationships, not endless swiping.
                </span>
            </Badge>

            <h1 className="max-w-6xl text-center text-4xl font-extrabold uppercase leading-tight sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[1.15]">
                Find someone who actually{' '}
                <span className="italic text-primary">fits your life</span>.
            </h1>
            <p className="max-w-4xl text-center text-base leading-7 sm:text-lg sm:leading-8 md:text-xl md:leading-9 lg:text-2xl lg:leading-10">
                Pairly is a dating app built around values, habits, and emotional compatibility
                so meaningful conversations start naturally.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
                <div className="flex -space-x-3">
                    {userAvatars.map((avatar, idx) => (
                        <div
                            key={idx}
                            className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-slate-100 sm:h-10 sm:w-10"
                        >
                            <Image
                                width={200}
                                height={200}
                                src={avatar}
                                alt={`User ${idx + 1}`}
                                className="w-full h-full object-cover"
                                unoptimized={avatar.endsWith('.svg')}
                            />
                        </div>
                    ))}
                </div>
                <h3 className="text-center text-lg font-extrabold italic text-primary sm:text-left sm:text-xl">
                    Join 500+ early Pairly members
                </h3>
            </div>
            <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
                <Button className="flex h-12 w-full items-center justify-center gap-3 text-base sm:h-14 sm:w-auto sm:text-lg">
                    Start matching <Rocket className="size-6" />
                </Button>
                <Button
                    className="flex h-12 w-full items-center justify-center gap-3 border-2 border-dashed text-base sm:h-14 sm:w-auto sm:text-lg"
                    variant={'outline'}
                >
                    How Pairly works <ArrowBigDown className="size-6" />
                </Button>
            </div>

            <div className="absolute -right-24 -bottom-6 -z-50 h-56 w-56 rounded-full bg-primary/70 blur-[90px] sm:-right-36 sm:h-72 sm:w-72 lg:-right-56 lg:bottom-0 lg:h-96 lg:w-96 lg:blur-[110px]" />
            <div className="absolute -left-24 top-26 -z-50 h-56 w-56 rounded-full bg-primary/70 blur-[90px] sm:-left-36 sm:h-72 sm:w-72 lg:-left-56 lg:h-96 lg:w-96 lg:blur-[110px]" />
        </section>
    )
}
