import { Quiz } from '@/contexts/quiz/entities/quiz';

export interface QuizRepo {
    upsert(quiz: Quiz): Promise<void>;
    getByIds(ids: string[]): Promise<Quiz[]>;
}
