import { QuizDescription } from '@/contexts/quiz/entities';

export interface QuizRepo {
    upsert(quiz: QuizDescription): Promise<QuizDescription>;
    deleteById(quizId: string): Promise<void>;
    getAllForProject(projId: string): Promise<QuizDescription[]>;
}
