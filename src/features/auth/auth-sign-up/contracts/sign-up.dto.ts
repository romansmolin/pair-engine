import { z } from 'zod'
import { emailSchema, passwordSchema } from '@/shared/lib/validation/common-schemas'

const genderSchema = z.enum(['man', 'woman', 'non_binary', 'other'])
const lookingForSchema = z.enum(['man', 'women', 'couple', 'other'])

export const signUpSchema = z.object({
    username: z.string().trim().min(1, 'Username is required'),
    password: passwordSchema,
    email: emailSchema,
    gender: genderSchema,
    lookingFor: lookingForSchema,
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    city: z
        .string()
        .trim()
        .refine((value) => value === '' || /^\d+$/.test(value), {
            message: 'City must be numeric',
        })
        .optional(),
    consentAccepted: z.boolean().refine((value) => value, {
        message: 'Consent is required',
    })
})

export type SignUpDto = z.infer<typeof signUpSchema>
