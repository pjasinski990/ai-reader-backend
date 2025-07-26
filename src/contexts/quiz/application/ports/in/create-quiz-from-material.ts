import { QuizDescription } from '@/contexts/quiz/entities';
import { z } from 'zod';

export interface CreateQuizFromMaterial {
    execute(
        params: QuizCreationParams
    ): Promise<QuizDescription>;
}

export const DifficultyLevels = ['beginner', 'intermediate', 'expert'] as const;

export const QuizCreationParamsSchema = z.object({
    projId: z.string(),
    userId: z.string(),
    name: z.string().min(1, 'Name cannot be empty'),
    numberOfQuestions: z.number().int().positive('Number of questions must be a positive integer'),
    difficulty: z.enum(DifficultyLevels),
    includeMultipleChoice: z.boolean(),
    includeOpenEnded: z.boolean(),
    extractionPrompt: z.string().optional(),
    additionalContext: z.record(z.unknown()).optional(),
}).refine(
    (data) => data.includeMultipleChoice || data.includeOpenEnded,
    {
        message: 'At least one question type (multiple choice or open-ended) must be included',
        path: ['includeMultipleChoice'],
    }
);

export type QuizCreationParams = z.infer<typeof QuizCreationParamsSchema>;
export type QuizDifficulty = (typeof DifficultyLevels)[number];
