import { z } from 'zod';

export const NewConversationRequestSchema = z.object({
    projectId: z.string(),
    mode: z.enum(['course', 'explain', 'quiz']),
    initialPrompt: z.string(),
});

export type NewConversationRequest = z.infer<typeof NewConversationRequestSchema>;
