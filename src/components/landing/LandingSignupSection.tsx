import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SignUpForm } from '@/components/auth/SignUpForm'

export function LandingSignupSection() {
    return (
        <section className="py-16 sm:py-20" aria-labelledby="landing-signup-title">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <Card className="border-[#A8DF8E] bg-white shadow-md">
                    <CardHeader>
                        <CardTitle id="landing-signup-title" className="text-balance text-3xl text-[#2A2A2A] sm:text-4xl">
                            Start with a compatibility-first profile
                        </CardTitle>
                        <CardDescription className="max-w-2xl text-[#4E4E4E]">
                            Create your account now and let Pair Engine suggest more compatible matches
                            from day one.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <SignUpForm redirectTo="/dashboard" submitLabel="Open App" />
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
