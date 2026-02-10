'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'

import { useSignUpMutation } from '../api/client/endpoints'
import { SignUpDto, signUpSchema } from '@/features/auth/auth-sign-up/contracts/sign-up.dto'
import { normalizeError } from '@/shared/api/client/error-normalizer'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export function SignUpForm() {
    const router = useRouter()
    const [signUp, { isLoading }] = useSignUpMutation()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpDto>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            password: '',
            email: '',
            gender: 'man',
            lookingFor: 'women',
            dateOfBirth: '',
            city: '',
            consentAccepted: false,
        },
    })

    const onSubmit = async (data: SignUpDto) => {
        if (
            !data.username.trim() ||
            !data.password ||
            !data.email ||
            !data.gender ||
            !data.lookingFor ||
            !data.dateOfBirth
        ) {
            toast.error('Please fill all required fields')
            return
        }

        if (!data.consentAccepted) {
            toast.error('You must accept terms to continue')
            return
        }

        try {
            await signUp(data).unwrap()
            toast.success('Account created successfully')
            router.push('/dashboard')
        } catch (err) {
            const normalized = normalizeError(err)
            toast.error(normalized.message || 'Sign up failed')
        }
    }

    const onInvalid = () => {
        if (errors.consentAccepted) {
            toast.error('You must accept terms to continue')
            return
        }

        const firstError = Object.values(errors)[0]
        if (firstError?.message) {
            toast.error(firstError.message as string)
            return
        }

        toast.error('Please fill all required fields')
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="space-y-4"
            data-testid="sign-up-form"
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
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
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
                    required
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
                <Label htmlFor="gender">Gender</Label>
                <select
                    id="gender"
                    {...register('gender')}
                    className="border-input bg-background focus-visible:ring-ring/50 focus-visible:border-ring h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
                    data-testid="gender-select"
                >
                    <option value="man">Man</option>
                    <option value="woman">Woman</option>
                    <option value="non_binary">Non-binary</option>
                    <option value="other">Other</option>
                </select>
                {errors.gender && (
                    <p className="text-sm text-destructive" data-testid="gender-error">
                        {errors.gender.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="lookingFor">Looking for</Label>
                <select
                    id="lookingFor"
                    {...register('lookingFor')}
                    className="border-input bg-background focus-visible:ring-ring/50 focus-visible:border-ring h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
                    data-testid="looking-for-select"
                >
                    <option value="man">Man</option>
                    <option value="women">Women</option>
                    <option value="couple">Couple</option>
                    <option value="other">Other</option>
                </select>
                {errors.lookingFor && (
                    <p className="text-sm text-destructive" data-testid="looking-for-error">
                        {errors.lookingFor.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of birth</Label>
                <Input
                    id="dateOfBirth"
                    type="date"
                    required
                    {...register('dateOfBirth')}
                    data-testid="date-of-birth-input"
                />
                {errors.dateOfBirth && (
                    <p className="text-sm text-destructive" data-testid="date-of-birth-error">
                        {errors.dateOfBirth.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="city">City ID (optional)</Label>
                <Input
                    id="city"
                    type="text"
                    inputMode="numeric"
                    placeholder="123"
                    {...register('city')}
                    data-testid="city-input"
                />
                {errors.city && (
                    <p className="text-sm text-destructive" data-testid="city-error">
                        {errors.city.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-start gap-2">
                    <Checkbox
                        id="consentAccepted"
                        className="mt-0.5"
                        {...register('consentAccepted')}
                        data-testid="sign-up-consent-checkbox"
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
                                data-testid="sign-up-terms-link"
                            >
                                Terms of Service
                            </Link>
                            <span>,</span>
                            <Link
                                href="/privacy-policy"
                                className="underline hover:text-slate-900"
                                data-testid="sign-up-privacy-link"
                            >
                                Privacy Policy
                            </Link>
                            <span>, and</span>
                            <Link
                                href="/return-policy"
                                className="underline hover:text-slate-900"
                                data-testid="sign-up-return-link"
                            >
                                Return Policy
                            </Link>
                            <span>.</span>
                        </Label>
                    </div>
                </div>
                {errors.consentAccepted && (
                    <p className="text-sm text-destructive" data-testid="sign-up-consent-error">
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
                        Creating account...
                    </>
                ) : (
                    <>
                        <UserPlus className="size-4" />
                        Create account
                    </>
                )}
            </Button>
        </form>
    )
}
