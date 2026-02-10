'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { useSignInMutation } from '../api/client/endpoints'
import { SignInDto, signInSchema } from '@/features/auth/auth-sign-in/contracts/sign-in.dto'
import { normalizeError } from '@/shared/api/client/error-normalizer'
import { Alert } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export function SignInForm() {
    const router = useRouter()
    const [signIn, { isLoading }] = useSignInMutation()
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInDto>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            consent: false,
        },
    })

    const onSubmit = async (data: SignInDto) => {
        try {
            setError(null)
            await signIn(data).unwrap()
            router.push('/pdf-insights')
        } catch (err) {
            const normalized = normalizeError(err)
            setError(normalized.message)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="sign-in-form">
            {error && (
                <Alert variant="destructive" data-testid="error-message">
                    {error}
                </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register('email')}
                    data-testid="email-input"
                />
                {errors.email && (
                    <p className="text-sm text-destructive" data-testid="email-error">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    data-testid="password-input"
                />
                {errors.password && (
                    <p className="text-sm text-destructive" data-testid="password-error">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-start gap-2">
                    <input
                        id="consent"
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        {...register('consent')}
                        data-testid="sign-in-consent-checkbox"
                    />
                    <Label
                        htmlFor="consent"
                        className="text-sm font-normal leading-snug text-slate-600"
                    >
                        I agree to the{' '}
                        <a
                            href="/terms-of-service"
                            target="_blank"
                            rel="noreferrer"
                            className="underline hover:text-slate-900"
                            data-testid="sign-in-terms-link"
                        >
                            Terms of Service
                        </a>
                        ,{' '}
                        <a
                            href="/privacy-policy"
                            target="_blank"
                            rel="noreferrer"
                            className="underline hover:text-slate-900"
                            data-testid="sign-in-privacy-link"
                        >
                            Privacy Policy
                        </a>
                        , and{' '}
                        <a
                            href="/return-policy"
                            target="_blank"
                            rel="noreferrer"
                            className="underline hover:text-slate-900"
                            data-testid="sign-in-return-link"
                        >
                            Return Policy
                        </a>
                        .
                    </Label>
                </div>
                {errors.consent && (
                    <p className="text-sm text-destructive" data-testid="sign-in-consent-error">
                        {errors.consent.message}
                    </p>
                )}
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-testid="submit-button"
            >
                {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
        </form>
    )
}
