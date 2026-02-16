'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUp, signUpSchema, type SignUpDto } from '@/features/auth'
import { normalizeError } from '@/shared/api/client/error-normalizer'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type SignUpFormProps = {
    redirectTo?: string
    submitLabel?: string
    className?: string
}

const signUpFieldNames: Array<keyof SignUpDto> = [
    'username',
    'password',
    'email',
    'gender',
    'lookingFor',
    'dateOfBirth',
    'consentAccepted',
]

const selectClassName =
    'flex h-10 w-full rounded-xl border border-[#A8DF8E] bg-white px-3 py-2 text-sm text-[#2A2A2A] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAAB8]'

export function SignUpForm({ redirectTo, submitLabel = 'Create account', className }: SignUpFormProps) {
    const router = useRouter()
    const [formError, setFormError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignUpDto>({
        resolver: zodResolver(signUpSchema),
        shouldFocusError: true,
        defaultValues: {
            username: '',
            password: '',
            email: '',
            gender: 'man',
            lookingFor: 'women',
            dateOfBirth: '',
            consentAccepted: false,
        },
    })

    const onSubmit = handleSubmit(async (data) => {
        setFormError(null)

        try {
            await signUp(data)

            if (redirectTo) {
                router.replace(redirectTo)
            }
        } catch (error) {
            const normalized = normalizeError(error)

            if (normalized.fields?.length) {
                normalized.fields.forEach((issue) => {
                    const field = issue.field as keyof SignUpDto
                    if (signUpFieldNames.includes(field)) {
                        setError(field, {
                            type: 'server',
                            message: issue.message,
                        })
                    }
                })
            }

            setFormError(normalized.message || 'Unable to create account right now. Please try again.')
        }
    })

    return (
        <form className={cn('space-y-4', className)} onSubmit={onSubmit} noValidate>
            {formError ? (
                <div className="rounded-xl border border-[#FFAAB8] bg-[#FFD8DF]/50 px-3 py-2 text-sm text-[#5A454B]" role="alert">
                    {formError}
                </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <label htmlFor="sign-up-username" className="text-sm font-medium text-[#2A2A2A]">
                        Username
                    </label>
                    <Input
                        id="sign-up-username"
                        autoComplete="username"
                        aria-invalid={errors.username ? 'true' : 'false'}
                        {...register('username')}
                    />
                    {errors.username ? <p className="text-xs text-[#A33D4F]">{errors.username.message}</p> : null}
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="sign-up-email" className="text-sm font-medium text-[#2A2A2A]">
                        Email
                    </label>
                    <Input
                        id="sign-up-email"
                        type="email"
                        autoComplete="email"
                        aria-invalid={errors.email ? 'true' : 'false'}
                        {...register('email')}
                    />
                    {errors.email ? <p className="text-xs text-[#A33D4F]">{errors.email.message}</p> : null}
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="sign-up-password" className="text-sm font-medium text-[#2A2A2A]">
                        Password
                    </label>
                    <Input
                        id="sign-up-password"
                        type="password"
                        autoComplete="new-password"
                        aria-invalid={errors.password ? 'true' : 'false'}
                        {...register('password')}
                    />
                    {errors.password ? <p className="text-xs text-[#A33D4F]">{errors.password.message}</p> : null}
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="sign-up-dob" className="text-sm font-medium text-[#2A2A2A]">
                        Date of birth
                    </label>
                    <Input
                        id="sign-up-dob"
                        type="date"
                        aria-invalid={errors.dateOfBirth ? 'true' : 'false'}
                        {...register('dateOfBirth')}
                    />
                    {errors.dateOfBirth ? <p className="text-xs text-[#A33D4F]">{errors.dateOfBirth.message}</p> : null}
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="sign-up-gender" className="text-sm font-medium text-[#2A2A2A]">
                        I am
                    </label>
                    <select
                        id="sign-up-gender"
                        className={selectClassName}
                        aria-invalid={errors.gender ? 'true' : 'false'}
                        {...register('gender')}
                    >
                        <option value="man">Man</option>
                        <option value="woman">Woman</option>
                        <option value="non_binary">Non-binary</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.gender ? <p className="text-xs text-[#A33D4F]">{errors.gender.message}</p> : null}
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="sign-up-looking-for" className="text-sm font-medium text-[#2A2A2A]">
                        Looking for
                    </label>
                    <select
                        id="sign-up-looking-for"
                        className={selectClassName}
                        aria-invalid={errors.lookingFor ? 'true' : 'false'}
                        {...register('lookingFor')}
                    >
                        <option value="man">Men</option>
                        <option value="women">Women</option>
                        <option value="couple">Couple</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.lookingFor ? <p className="text-xs text-[#A33D4F]">{errors.lookingFor.message}</p> : null}
                </div>
            </div>

            <div className="space-y-1.5">
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
                {isSubmitting ? 'Creating account...' : submitLabel}
            </Button>
        </form>
    )
}
