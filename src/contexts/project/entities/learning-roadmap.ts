import z from 'zod';
import { LearningCheckpointSchema } from './learning-checkpoint';

export const LearningRoadmapSchema = z.object({
    id: z.string(),
    title: z.string(),
    checkpoints: z.array(LearningCheckpointSchema),
});

export type LearningRoadmap = z.infer<typeof LearningRoadmapSchema>;
