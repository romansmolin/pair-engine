'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn, signInSchema, type SignInDto } from '@/features/auth'
import { normalizeError } from '@/shared/api/client/error-normalizer'
import { ErrorCode } from '@/shared/errors/error-codes'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type SignInFormProps = {
    redirectTo?: string
    submitLabel?: string
    className?: string
}

const signInFieldNames: Array<keyof SignInDto> = ['username', 'password', 'rememberMe', 'consentAccepted']

export function SignInForm({ redirectTo, submitLabel = 'Sign In', className }: SignInFormProps) {
    const router = useRouter()
    const [formError, setFormError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignInDto>({
        resolver: zodResolver(signInSchema),
        shouldFocusError: true,
        defaultValues: {
            username: '',
            password: '',
            rememberMe: false,
            consentAccepted: false,
        },
    })

    const onSubmit = handleSubmit(async (data) => {
        setFormError(null)

        try {
            await signIn(data)

            if (redirectTo) {
                router.replace(redirectTo)
            }
        } catch (error) {
            const normalized = normalizeError(error)

            if (normalized.fields?.length) {
                normalized.fields.forEach((issue) => {
                    const field = issue.field as keyof SignInDto
                    if (signInFieldNames.includes(field)) {
                        setError(field, {
                            type: 'server',
                            message: issue.message,
                        })
                    }
                })
            }

            if (normalized.code === ErrorCode.INVALID_CREDENTIALS) {
                setFormError('Invalid username or password. Please try again.')
                return
            }

            setFormError(normalized.message || 'Unable to sign in right now. Please try again.')
        }
    })

    return (
        <form className={cn('space-y-4', className)} onSubmit={onSubmit} noValidate>
            {formError ? (
                <div className="rounded-xl border border-[#FFAAB8] bg-[#FFD8DF]/50 px-3 py-2 text-sm text-[#5A454B]" role="alert">
                    {formError}
                </div>
            ) : null}

            <div className="space-y-1.5">
                <label htmlFor="sign-in-username" className="text-sm font-medium text-[#2A2A2A]">
                    Username
                </label>
                <Input
                    id="sign-in-username"
                    autoComplete="username"
                    aria-invalid={errors.username ? 'true' : 'false'}
                    {...register('username')}
                />
                {errors.username ? <p className="text-xs text-[#A33D4F]">{errors.username.message}</p> : null}
            </div>

            <div className="space-y-1.5">
                <label htmlFor="sign-in-password" className="text-sm font-medium text-[#2A2A2A]">
                    Password
                </label>
                <Input
                    id="sign-in-password"
                    type="password"
                    autoComplete="current-password"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    {...register('password')}
                />
                {errors.password ? <p className="text-xs text-[#A33D4F]">{errors.password.message}</p> : null}
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-[#2A2A2A]">
                    <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-[#A8DF8E] accent-[#FFAAB8]"
                        {...register('rememberMe')}
                    />
                    Remember me
                </label>

                <label className="flex items-center gap-2 text-sm text-[#2A2A2A]">
                    <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-[#A8DF8E] accent-[#FFAAB8]"
                        {...register('consentAccepted')}
                    />
                    I agree to the Terms and Privacy Policy
                </label>
                {errors.consentAccepted ? (
                    <p className="text-xs text-[#A33D4F]">{errors.consentAccepted.message}</p>
                ) : null}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : submitLabel}
            </Button>
        </form>
    )
}
