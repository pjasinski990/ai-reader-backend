import { z } from 'zod';
import { Role } from '@/shared/entities/message';

export const NewMessageRequestSchema = z.object({
    message: z.object({
        id: z.string(),
        conversationId: z.string(),
        previousId: z.string().nullable(),
        role: z.nativeEnum(Role),
        content: z.string().or(z.array(z.string())),
    })
});

export type NewMessageRequest = z.infer<typeof NewMessageRequestSchema>;
