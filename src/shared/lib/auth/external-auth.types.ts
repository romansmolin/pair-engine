export const GENDER_VALUES = ['man', 'woman', 'non_binary', 'other'] as const
export type Gender = (typeof GENDER_VALUES)[number]

export const LOOKING_FOR_VALUES = ['man', 'women', 'couple', 'other'] as const
export type LookingFor = (typeof LOOKING_FOR_VALUES)[number]

export type ExternalAuthMeta = {
    userAgent?: string
    ipAddress?: string
}

export type ExternalSignUpInput = ExternalAuthMeta & {
    username: string
    password: string
    email: string
    gender: Gender
    lookingFor: LookingFor
    dateOfBirth: string
    city?: string
}

export type ExternalSignInInput = ExternalAuthMeta & {
    username: string
    password: string
    rememberMe?: boolean
}

export type ExternalSignUpResult = {
    accepted: 1
    sessionId: string
    userId: string
    lang?: string
}

export type ExternalSignInResult = {
    connected: 1
    sessionId: string
    userId: string
    tokenLogin?: string
    lang?: string
}
