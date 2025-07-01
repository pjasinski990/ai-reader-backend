import { z } from 'zod';

export const AccessTokenPayloadSchema = z.object({
    userId: z.string(),
});

export type AccessTokenPayload = z.infer<typeof AccessTokenPayloadSchema>;
