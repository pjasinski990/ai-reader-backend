import { QuizQuestion } from '@/contexts/quiz/entities';

export interface QuestionsRepo {
    getById(id: string): Promise<QuizQuestion>;
    upsertQuestion(question: QuizQuestion): Promise<QuizQuestion>;
    getAllQuestionsFromQuiz(quizId: string): Promise<QuizQuestion[]>;
}
