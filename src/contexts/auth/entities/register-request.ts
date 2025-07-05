import { z } from 'zod';

export const RegisterRequestSchema = z.object({
    email: z.string(),
    password: z.string(),
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
