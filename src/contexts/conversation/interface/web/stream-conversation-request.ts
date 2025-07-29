import { z } from 'zod';

export const StreamConversationRequestSchema = z.object({
    conversationId: z.string(),
});

export type StreamConversationRequest = z.infer<typeof StreamConversationRequestSchema>;
