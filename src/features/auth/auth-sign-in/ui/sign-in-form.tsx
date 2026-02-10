'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'

import { useSignInMutation } from '../api/client/endpoints'
import { SignInDto, signInSchema } from '@/features/auth/auth-sign-in/contracts/sign-in.dto'
import { normalizeError } from '@/shared/api/client/error-normalizer'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export function SignInForm() {
    const router = useRouter()
    const [signIn, { isLoading }] = useSignInMutation()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInDto>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            username: '',
            password: '',
            rememberMe: false,
            consentAccepted: false,
        },
    })

    const onSubmit = async (data: SignInDto) => {
        if (!data.username.trim() || !data.password) {
            toast.error('Please enter username and password')
            return
        }

        if (!data.consentAccepted) {
            toast.error('You must accept terms to continue')
            return
        }

        try {
            await signIn(data).unwrap()
            toast.success('Signed in successfully')
            router.push('/dashboard')
        } catch (err) {
            const normalized = normalizeError(err)
            toast.error(normalized.message || 'Sign in failed')
        }
    }

    const onInvalid = () => {
        if (errors.username || errors.password) {
            toast.error('Please enter username and password')
            return
        }

        if (errors.consentAccepted) {
            toast.error('You must accept terms to continue')
            return
        }

        const firstError = Object.values(errors)[0]
        if (firstError?.message) {
            toast.error(firstError.message as string)
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="space-y-4"
            data-testid="sign-in-form"
        >
            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    type="text"
                    required
                    autoComplete="username"
                    placeholder="john_doe"
                    {...register('username')}
                    data-testid="username-input"
                />
                {errors.username && (
                    <p className="text-sm text-destructive" data-testid="username-error">
                        {errors.username.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="password">Password</Label>
                    <Link
                        href="/forgot-password"
                        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>
                <Input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
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
                <div className="flex items-center gap-2">
                    <Checkbox id="rememberMe" {...register('rememberMe')} />
                    <Label
                        htmlFor="rememberMe"
                        className="text-sm font-normal text-muted-foreground"
                    >
                        Remember me
                    </Label>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-start gap-2">
                    <Checkbox
                        id="consentAccepted"
                        className="mt-0.5"
                        {...register('consentAccepted')}
                        data-testid="sign-in-consent-checkbox"
                    />
                    <div className="w-full overflow-x-auto">
                        <Label
                            htmlFor="consentAccepted"
                            className="inline-flex min-w-max items-center gap-1 whitespace-nowrap text-sm font-normal text-slate-600"
                        >
                            <span>I agree to the</span>
                            <Link
                                href="/terms-of-service"
                                className="underline hover:text-slate-900"
                                data-testid="sign-in-terms-link"
                            >
                                Terms of Service
                            </Link>
                            <span>,</span>
                            <Link
                                href="/privacy-policy"
                                className="underline hover:text-slate-900"
                                data-testid="sign-in-privacy-link"
                            >
                                Privacy Policy
                            </Link>
                            <span>, and</span>
                            <Link
                                href="/return-policy"
                                className="underline hover:text-slate-900"
                                data-testid="sign-in-return-link"
                            >
                                Return Policy
                            </Link>
                            <span>.</span>
                        </Label>
                    </div>
                </div>
                {errors.consentAccepted && (
                    <p className="text-sm text-destructive" data-testid="sign-in-consent-error">
                        {errors.consentAccepted.message}
                    </p>
                )}
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-testid="submit-button"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="size-4 animate-spin" />
                        Signing in...
                    </>
                ) : (
                    <>
                        <LogIn className="size-4" />
                        Sign in
                    </>
                )}
            </Button>
        </form>
    )
}
