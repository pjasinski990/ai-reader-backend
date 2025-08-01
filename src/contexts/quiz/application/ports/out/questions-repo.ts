import { QuizQuestion } from '@/contexts/quiz/entities';

export interface QuestionsRepo {
    getById(id: string): Promise<QuizQuestion>;
    upsert(question: QuizQuestion): Promise<QuizQuestion>;
    getAll(quizId: string): Promise<QuizQuestion[]>;
}
