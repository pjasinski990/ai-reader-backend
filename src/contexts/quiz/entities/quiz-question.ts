import { GeneratedQuizQuestion } from './generated-question';
import { UserAnswer } from './user-answer';

export interface QuizQuestionContext {
    readonly quizId: string,
    userAnswer: UserAnswer
}

export type QuizQuestion = GeneratedQuizQuestion & QuizQuestionContext;

export function toQuizQuestion(q: GeneratedQuizQuestion, quizId: string): QuizQuestion {
    return {
        ...q,
        quizId,
        userAnswer: {
            state: 'UNASWERED'
        }
    };
}
