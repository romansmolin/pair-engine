'use client'

import { type FormEvent } from 'react'
import { Loader2, Save, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import {
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
} from '@/entities/user/api/client/endpoints'
import type { UpdateProfileRequest } from '@/entities/user/model/types'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

const getErrorMessage = (error: unknown): string => {
    if (typeof error === 'object' && error !== null) {
        const maybeMessage = (error as { data?: { message?: string } }).data?.message
        if (typeof maybeMessage === 'string' && maybeMessage.trim()) {
            return maybeMessage
        }

        const nestedMessage =
            (error as { error?: string }).error ?? (error as { message?: string }).message

        if (typeof nestedMessage === 'string' && nestedMessage.trim()) {
            return nestedMessage
        }
    }

    return 'Unable to process request right now'
}

const parseOptionalNumber = (value: string): number | undefined => {
    const trimmed = value.trim()
    if (!trimmed) return undefined

    const parsed = Number(trimmed)
    if (!Number.isFinite(parsed)) return undefined

    return parsed
}

const parseBodyOptions = (value: string): number[] | undefined => {
    const parsed = value
        .split(',')
        .map((item) => Number(item.trim()))
        .filter((item) => Number.isFinite(item))

    return parsed.length > 0 ? parsed : undefined
}

const getFormString = (formData: FormData, name: string): string => {
    const raw = formData.get(name)
    return typeof raw === 'string' ? raw : ''
}

export function ProfilePage() {
    const profileQuery = useGetUserProfileQuery()
    const [updateProfile, updateProfileState] = useUpdateUserProfileMutation()

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const fullName = getFormString(formData, 'fullName').trim()

        if (!fullName) {
            toast.error('Full name is required')
            return
        }

        const payload: UpdateProfileRequest = {
            fullName,
            email: getFormString(formData, 'email').trim() || undefined,
            langUi: getFormString(formData, 'langUi').trim() || undefined,
            description: getFormString(formData, 'description'),
            bodyOptions: parseBodyOptions(getFormString(formData, 'bodyOptions')),
            height: parseOptionalNumber(getFormString(formData, 'height')),
            weight: parseOptionalNumber(getFormString(formData, 'weight')),
            eyeColor: parseOptionalNumber(getFormString(formData, 'eyeColor')),
            hairColor: parseOptionalNumber(getFormString(formData, 'hairColor')),
            situation: parseOptionalNumber(getFormString(formData, 'situation')),
            silhouette: parseOptionalNumber(getFormString(formData, 'silhouette')),
            personality: parseOptionalNumber(getFormString(formData, 'personality')),
            schedule: parseOptionalNumber(getFormString(formData, 'schedule')),
            orientation: parseOptionalNumber(getFormString(formData, 'orientation')),
            children: parseOptionalNumber(getFormString(formData, 'children')),
            education: parseOptionalNumber(getFormString(formData, 'education')),
            profession: parseOptionalNumber(getFormString(formData, 'profession')),
        }

        try {
            await updateProfile(payload).unwrap()
            toast.success('Profile updated successfully')
            await profileQuery.refetch()
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    const profile = profileQuery.data?.user

    return (
        <section className="py-8 sm:pb-12">
            <div className="mx-auto w-full max-w-5xl space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl sm:text-3xl">Edit Profile</CardTitle>
                        <CardDescription>
                            Update your profile information synced with Fotochat.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {profileQuery.isLoading ? (
                            <div className="flex items-center justify-center rounded-xl border border-dashed border-border py-8 text-sm text-muted-foreground">
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Loading profile...
                            </div>
                        ) : profileQuery.error ? (
                            <Alert variant="destructive">
                                <AlertTitle>Failed to load profile</AlertTitle>
                                <AlertDescription>{getErrorMessage(profileQuery.error)}</AlertDescription>
                            </Alert>
                        ) : profile ? (
                            <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                                <Avatar size="lg" className="ring-border ring-1">
                                    <AvatarImage src={profile.avatarUrl} alt={`${profile.username} avatar`} />
                                    <AvatarFallback>
                                        <UserRound className="size-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-semibold">{profile.username}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {profile.location ?? 'Location not specified'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                                Profile not found.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl sm:text-2xl">Profile Details</CardTitle>
                        <CardDescription>
                            All numeric fields accept either numbers or numeric strings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={onSubmit}
                            className="space-y-6"
                            key={profile ? `profile-form-${profile.id}` : 'profile-form-empty'}
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="fullName">Full name</Label>
                                    <Input id="fullName" name="fullName" defaultValue={profile?.fullName ?? ''} required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" defaultValue={profile?.email ?? ''} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="langUi">Language UI</Label>
                                    <Input id="langUi" name="langUi" placeholder="en" />
                                </div>

                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="bodyOptions">Body options (comma-separated ids)</Label>
                                    <Input id="bodyOptions" name="bodyOptions" placeholder="1,2,3" />
                                </div>

                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="description">Description</Label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        defaultValue={profile?.description ?? ''}
                                        placeholder="Tell people about yourself"
                                        className="border-input bg-background focus-visible:ring-ring/50 focus-visible:border-ring min-h-28 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="height">Height</Label>
                                    <Input id="height" name="height" defaultValue={profile?.height ?? ''} placeholder="170" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="weight">Weight</Label>
                                    <Input id="weight" name="weight" defaultValue={profile?.weight ?? ''} placeholder="65" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="eyeColor">Eye color</Label>
                                    <Input id="eyeColor" name="eyeColor" defaultValue={profile?.eyeColor ?? ''} placeholder="2" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hairColor">Hair color</Label>
                                    <Input id="hairColor" name="hairColor" defaultValue={profile?.hairColor ?? ''} placeholder="3" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="situation">Situation</Label>
                                    <Input id="situation" name="situation" defaultValue={profile?.situation ?? ''} placeholder="1" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="silhouette">Silhouette</Label>
                                    <Input id="silhouette" name="silhouette" defaultValue={profile?.silhouette ?? ''} placeholder="2" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="personality">Personality</Label>
                                    <Input id="personality" name="personality" defaultValue={profile?.personality ?? ''} placeholder="4" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="schedule">Schedule</Label>
                                    <Input id="schedule" name="schedule" defaultValue={profile?.schedule ?? ''} placeholder="3" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="orientation">Orientation</Label>
                                    <Input id="orientation" name="orientation" defaultValue={profile?.orientation ?? ''} placeholder="1" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="children">Children</Label>
                                    <Input id="children" name="children" defaultValue={profile?.children ?? ''} placeholder="0" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="education">Education</Label>
                                    <Input id="education" name="education" defaultValue={profile?.education ?? ''} placeholder="5" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="profession">Profession</Label>
                                    <Input id="profession" name="profession" defaultValue={profile?.profession ?? ''} placeholder="7" />
                                </div>
                            </div>

                            {updateProfileState.error ? (
                                <Alert variant="destructive">
                                    <AlertTitle>Update failed</AlertTitle>
                                    <AlertDescription>
                                        {getErrorMessage(updateProfileState.error)}
                                    </AlertDescription>
                                </Alert>
                            ) : null}

                            <Button type="submit" className="w-full" disabled={updateProfileState.isLoading}>
                                {updateProfileState.isLoading ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Saving profile...
                                    </>
                                ) : (
                                    <>
                                        <Save className="size-4" />
                                        Save profile
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
