import { QuizQuestionDTO } from '@/contexts/quiz/entities/quiz-question-dto';

export interface GetQuizQuestions {
    execute(quizId: string): Promise<QuizQuestionDTO[]>;
}
