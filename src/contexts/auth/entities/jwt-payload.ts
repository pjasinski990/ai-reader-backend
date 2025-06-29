import { z } from 'zod';

export const JwtPayloadSchema = z.object({
    userId: z.string(),
    username: z.string(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
