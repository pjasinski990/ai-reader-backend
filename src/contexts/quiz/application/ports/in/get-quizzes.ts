import { Quiz } from '@/contexts/quiz/entities/quiz';

export interface GetQuizzes {
    execute: (
        ids: string[]
    ) => Promise<Quiz[]>;
}
