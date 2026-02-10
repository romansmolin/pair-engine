import { cn } from '@/shared/lib/css/utils'

const defaultSteps = [
    {
        title: 'Create your profile',
        description:
            'Share your values, lifestyle, and relationship goals so we can understand what truly matters to you.',
    },
    {
        title: 'Get curated matches',
        description:
            'Pairly highlights people with strong compatibility, so every match is intentional from the start.',
    },
    {
        title: 'Start meaningful chats',
        description:
            'Use guided prompts to move beyond small talk and begin conversations that feel natural and genuine.',
    },
    {
        title: 'Meet with confidence',
        description:
            'Built-in safety tools and clear intentions help you connect with more trust and less guesswork.',
    },
]

export function HowItWorksSection() {
    return (
        <section className={cn('container mx-auto')} id="how-it-works">
            <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                <div className="flex justify-between items-center gap-8 mb-12 md:mb-20">
                    <div>
                        <h2 className="text-3xl font-extrabold uppercase leading-tight sm:text-4xl lg:text-5xl">
                            How <span className="text-primary">Pairly</span> works
                        </h2>
                    </div>
                    <div className="flex items-start md:items-center">
                        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                            A simpler way to meet people who truly fit your life.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-center">
                    <div className="flex-1 flex flex-col justify-center gap-12 md:gap-16 lg:gap-20 w-full">
                        {/* Step 01 */}
                        <div className="space-y-2">
                            <div className="text-xs font-bold text-slate-400 tracking-wider">
                                01
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-slate-900">
                                {defaultSteps[0]?.title}
                            </h3>
                            <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-xs">
                                {defaultSteps[0]?.description}
                            </p>
                        </div>

                        {/* Step 02 */}
                        <div className="space-y-2">
                            <div className="text-xs font-bold text-slate-400 tracking-wider">
                                02
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-slate-900">
                                {defaultSteps[1]?.title}
                            </h3>
                            <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-xs">
                                {defaultSteps[1]?.description}
                            </p>
                        </div>
                    </div>

                    {/* Center Column - Visual */}
                    <div className="shrink-0 w-full md:w-auto">
                        <div className="w-full md:w-70 lg:w-[320px] xl:w-90 aspect-3/4 rounded-3xl overflow-hidden shadow-2xl mx-auto">
                            <div className="w-full h-full bg-linear-to-br from-slate-50 to-slate-200 p-6 flex flex-col">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs uppercase tracking-wide text-slate-500">
                                        Dating Insights
                                    </div>
                                    <div className="text-[10px] px-2 py-1 rounded-full bg-white text-slate-600 shadow-sm border border-slate-200">
                                        Live
                                    </div>
                                </div>

                                <div className="mt-6 rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                                    <div className="text-xs text-slate-500">Compatibility score</div>
                                    <div className="mt-2 text-3xl font-bold text-slate-900">
                                        92%
                                    </div>
                                    <div className="mt-3 h-2 rounded-full bg-slate-100">
                                        <div className="h-2 w-4/5 rounded-full bg-primary/60" />
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl bg-white border border-slate-200 p-3">
                                        <div className="text-[10px] text-slate-500">Shared values</div>
                                        <div className="text-lg font-bold text-slate-900">6</div>
                                    </div>
                                    <div className="rounded-2xl bg-white border border-slate-200 p-3">
                                        <div className="text-[10px] text-slate-500">Green flags</div>
                                        <div className="text-lg font-bold text-slate-900">4</div>
                                    </div>
                                </div>

                                <div className="mt-auto rounded-2xl bg-white border border-slate-200 p-4">
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span>Match quality</span>
                                        <span className="text-emerald-600 font-semibold">98%</span>
                                    </div>
                                    <div className="mt-3 space-y-2">
                                        <div className="h-2 w-5/6 rounded-full bg-slate-200" />
                                        <div className="h-2 w-2/3 rounded-full bg-slate-200" />
                                        <div className="h-2 w-1/2 rounded-full bg-slate-200" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Steps 03 & 04 */}
                    <div className="flex-1 flex flex-col justify-center gap-12 md:gap-16 lg:gap-20 w-full md:items-end">
                        {/* Step 03 */}
                        <div className="space-y-2 md:text-right">
                            <div className="text-xs font-bold text-slate-400 tracking-wider">
                                03
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-slate-900">
                                {defaultSteps[2]?.title}
                            </h3>
                            <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-xs md:ml-auto">
                                {defaultSteps[2]?.description}
                            </p>
                        </div>

                        {/* Step 04 */}
                        <div className="space-y-2 md:text-right">
                            <div className="text-xs font-bold text-slate-400 tracking-wider">
                                04
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-slate-900">
                                {defaultSteps[3]?.title}
                            </h3>
                            <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-xs md:ml-auto">
                                {defaultSteps[3]?.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
