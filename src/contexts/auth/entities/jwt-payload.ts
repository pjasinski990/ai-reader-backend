import { z } from 'zod';

export const JwtPayloadSchema = z.object({
    username: z.string(),
    userId: z.string(),
    expires: z.number()
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
