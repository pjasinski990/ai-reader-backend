import { QuizQuestion } from '@/contexts/quiz/entities/quiz-question';

export interface GetQuizQuestions {
    execute(quizId: string): Promise<QuizQuestion[]>;
}
