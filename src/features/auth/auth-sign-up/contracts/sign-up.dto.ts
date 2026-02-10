import { z } from 'zod'
import { emailSchema, passwordSchema, nameSchema } from '@/shared/lib/validation/common-schemas'

export const signUpSchema = z
    .object({
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: z.string().min(1, 'Please confirm your password'),
        name: nameSchema,
        consent: z.boolean().refine((value) => value, {
            message: 'Consent is required',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

export type SignUpDto = z.infer<typeof signUpSchema>
