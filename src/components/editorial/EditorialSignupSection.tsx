import { SignUpForm } from '@/components/auth/SignUpForm'

export function EditorialSignupSection() {
    return (
        <section className="editorial-signup" aria-labelledby="editorial-signup-title">
            <div className="editorial-signup-shell">
                <article className="editorial-signup-card tilt-right">
                    <header>
                        <p className="editorial-eyebrow">Fast start</p>
                        <h2 id="editorial-signup-title">Build your profile in one minute, then start matching with intent</h2>
                        <p>
                            Same trusted sign-up flow, redesigned for a calmer first step. No waitlist,
                            no spam, just better introductions.
                        </p>
                    </header>

                    <SignUpForm redirectTo="/dashboard" submitLabel="Open App" className="editorial-signup-form" />
                </article>
            </div>
        </section>
    )
}
