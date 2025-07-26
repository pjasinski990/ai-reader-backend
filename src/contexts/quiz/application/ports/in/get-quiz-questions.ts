import { QuizQuestion } from '@/contexts/quiz/entities';

export interface GetQuizQuestions {
    execute(quizId: string): Promise<QuizQuestion[]>;
}
