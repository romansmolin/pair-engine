'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '@/entities/user/api/client/endpoints'
import { AppShell } from '@/components/app/AppShell'
import { LoadState, getErrorMessage } from '@/components/app/LoadState'
import { SectionCard } from '@/components/app/SectionCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type ProfileFormState = {
    fullName: string
    email: string
    description: string
    height: string
    weight: string
    children: string
    education: string
    profession: string
}

const parseOptionalNumber = (value: string): number | undefined => {
    const normalized = value.trim()
    if (!normalized) return undefined

    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : undefined
}

export default function ProfilePage() {
    const profileQuery = useGetUserProfileQuery()
    const [updateProfile, updateState] = useUpdateUserProfileMutation()

    const [formState, setFormState] = useState<ProfileFormState>({
        fullName: '',
        email: '',
        description: '',
        height: '',
        weight: '',
        children: '',
        education: '',
        profession: '',
    })

    const [saveError, setSaveError] = useState<string | null>(null)
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

    const profile = profileQuery.data?.user

    useEffect(() => {
        if (!profile) return

        setFormState({
            fullName: profile.fullName || profile.username || '',
            email: profile.email || '',
            description: profile.description || '',
            height: profile.height?.toString() || '',
            weight: profile.weight?.toString() || '',
            children: profile.children?.toString() || '',
            education: profile.education?.toString() || '',
            profession: profile.profession?.toString() || '',
        })
    }, [profile])

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!formState.fullName.trim()) {
            setSaveError('Full name is required.')
            return
        }

        setSaveError(null)
        setSaveSuccess(null)

        try {
            await updateProfile({
                fullName: formState.fullName.trim(),
                email: formState.email.trim() || undefined,
                description: formState.description.trim() || undefined,
                height: parseOptionalNumber(formState.height),
                weight: parseOptionalNumber(formState.weight),
                children: parseOptionalNumber(formState.children),
                education: parseOptionalNumber(formState.education),
                profession: parseOptionalNumber(formState.profession),
            }).unwrap()

            setSaveSuccess('Settings saved successfully.')
            void profileQuery.refetch()
        } catch (error) {
            setSaveError(getErrorMessage(error, 'Unable to save settings right now.'))
        }
    }

    return (
        <AppShell title="Personal Settings" description="Manage your account profile and key matchmaking preferences.">
            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                <SectionCard title="Profile Snapshot" description="Read-only details from your account." className="h-fit">
                    <LoadState isLoading={profileQuery.isLoading} error={profileQuery.error}>
                        <div className="space-y-2 text-sm text-[#4E4E4E]">
                            <p>
                                <span className="font-medium text-[#2A2A2A]">Username:</span>{' '}
                                {profile?.username || '—'}
                            </p>
                            <p>
                                <span className="font-medium text-[#2A2A2A]">Age:</span> {profile?.age ?? '—'}
                            </p>
                            <p>
                                <span className="font-medium text-[#2A2A2A]">Gender:</span>{' '}
                                {profile?.gender || '—'}
                            </p>
                            <p>
                                <span className="font-medium text-[#2A2A2A]">Location:</span>{' '}
                                {profile?.location || '—'}
                            </p>
                            <p>
                                <span className="font-medium text-[#2A2A2A]">Last visit:</span>{' '}
                                {profile?.lastVisit || '—'}
                            </p>
                            <p>
                                <span className="font-medium text-[#2A2A2A]">Photos:</span>{' '}
                                {profile?.photoCount ?? profile?.photos?.length ?? 0}
                            </p>
                        </div>
                    </LoadState>
                </SectionCard>

                <SectionCard title="Edit Settings" description="Update profile, account, and preference fields.">
                    <LoadState isLoading={profileQuery.isLoading} error={profileQuery.error}>
                        <form className="space-y-4" onSubmit={onSubmit}>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="space-y-1.5">
                                    <span className="text-sm font-medium text-[#2A2A2A]">Full name</span>
                                    <Input
                                        value={formState.fullName}
                                        onChange={(event) =>
                                            setFormState((prev) => ({ ...prev, fullName: event.target.value }))
                                        }
                                    />
                                </label>

                                <label className="space-y-1.5">
                                    <span className="text-sm font-medium text-[#2A2A2A]">Email</span>
                                    <Input
                                        type="email"
                                        value={formState.email}
                                        onChange={(event) =>
                                            setFormState((prev) => ({ ...prev, email: event.target.value }))
                                        }
                                    />
                                </label>

                                <label className="space-y-1.5 sm:col-span-2">
                                    <span className="text-sm font-medium text-[#2A2A2A]">Description</span>
                                    <textarea
                                        value={formState.description}
                                        onChange={(event) =>
                                            setFormState((prev) => ({ ...prev, description: event.target.value }))
                                        }
                                        rows={4}
                                        className="w-full rounded-xl border border-[#A8DF8E] bg-white px-3 py-2 text-sm text-[#2A2A2A] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAAB8]"
                                    />
                                </label>

                                <label className="space-y-1.5">
                                    <span className="text-sm font-medium text-[#2A2A2A]">Height</span>
                                    <Input
                                        type="number"
                                        value={formState.height}
                                        onChange={(event) =>
                                            setFormState((prev) => ({ ...prev, height: event.target.value }))
                                        }
                                    />
                                </label>

                                <label className="space-y-1.5">
                                    <span className="text-sm font-medium text-[#2A2A2A]">Weight</span>
                                    <Input
                                        type="number"
                                        value={formState.weight}
                                        onChange={(event) =>
                                            setFormState((prev) => ({ ...prev, weight: event.target.value }))
                                        }
                                    />
                                </label>

                                <label className="space-y-1.5">
                                    <span className="text-sm font-medium text-[#2A2A2A]">Children</span>
                                    <Input
                                        type="number"
                                        value={formState.children}
                                        onChange={(event) =>
                                            setFormState((prev) => ({ ...prev, children: event.target.value }))
                                        }
                                    />
                                </label>

                                <label className="space-y-1.5">
                                    <span className="text-sm font-medium text-[#2A2A2A]">Education</span>
                                    <Input
                                        type="number"
                                        value={formState.education}
                                        onChange={(event) =>
                                            setFormState((prev) => ({ ...prev, education: event.target.value }))
                                        }
                                    />
                                </label>

                                <label className="space-y-1.5 sm:col-span-2">
                                    <span className="text-sm font-medium text-[#2A2A2A]">Profession</span>
                                    <Input
                                        type="number"
                                        value={formState.profession}
                                        onChange={(event) =>
                                            setFormState((prev) => ({ ...prev, profession: event.target.value }))
                                        }
                                    />
                                </label>
                            </div>

                            {saveError ? (
                                <p className="rounded-xl border border-[#FFAAB8] bg-[#FFD8DF]/50 px-3 py-2 text-sm text-[#5A454B]">
                                    {saveError}
                                </p>
                            ) : null}

                            {saveSuccess ? (
                                <p className="rounded-xl border border-[#A8DF8E] bg-[#F0FFDF] px-3 py-2 text-sm text-[#2A2A2A]">
                                    {saveSuccess}
                                </p>
                            ) : null}

                            <Button type="submit" disabled={updateState.isLoading}>
                                {updateState.isLoading ? 'Saving...' : 'Save settings'}
                            </Button>
                        </form>
                    </LoadState>
                </SectionCard>
            </div>
        </AppShell>
    )
}
