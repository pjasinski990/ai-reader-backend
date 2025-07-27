import { QuizQuestionDTO } from '@/contexts/quiz/entities';

export interface GetQuizQuestions {
    execute(quizId: string): Promise<QuizQuestionDTO[]>;
}
