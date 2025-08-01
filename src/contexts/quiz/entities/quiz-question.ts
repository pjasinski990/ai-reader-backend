import { GeneratedMultipleChoiceQuestion, GeneratedOpenEndedQuestion, GeneratedQuizQuestion } from './generated-question';
import { UserAnswer } from './user-answer';

export interface QuizQuestionContext {
    readonly quizId: string,
    userAnswer: UserAnswer
}

export interface OpenEndedQuizQuestion extends GeneratedOpenEndedQuestion, QuizQuestionContext {};
export interface MultipleChoiceQuizQuestion extends GeneratedMultipleChoiceQuestion, QuizQuestionContext {};

export type QuizQuestion = OpenEndedQuizQuestion | MultipleChoiceQuizQuestion;

export function toQuizQuestion(q: GeneratedQuizQuestion, quizId: string): QuizQuestion {
    return {
        ...q,
        quizId,
        userAnswer: {
            state: 'UNANSWERED'
        }
    };
}
