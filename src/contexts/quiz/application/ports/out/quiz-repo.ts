import { Quiz } from '@/contexts/quiz/entities/quiz';

export interface QuizRepo {
    upsert(quiz: Quiz): Promise<Quiz>;
    getByIds(ids: string[]): Promise<Quiz[]>;
}
