import { LearningRoadmapSchema } from '@/contexts/project/entities/learning-roadmap';
import { z } from 'zod';

export const ProjectSchema = z.object({
    id: z.string(),
    ownerId: z.string(),
    title: z.string(),
    roadmap: LearningRoadmapSchema,
    materialIds: z.array(z.string()),
    conversationIds: z.array(z.string()),
    quizIds: z.array(z.string()),
});

export type Project = z.infer<typeof ProjectSchema>;
