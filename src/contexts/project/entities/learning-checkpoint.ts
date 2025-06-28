import { z } from 'zod';

export const LearningCheckpointSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    completedTimestamp: z.date(),
});

export type LearningCheckpoint = z.infer<typeof LearningCheckpointSchema>;
