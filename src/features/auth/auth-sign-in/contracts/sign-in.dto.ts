import { z } from 'zod';
import { emailSchema } from '@/shared/lib/validation/common-schemas';

/**
 * Sign in request schema
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  consent: z.boolean().refine((value) => value, {
    message: 'Consent is required',
  }),
});

export type SignInDto = z.infer<typeof signInSchema>;
