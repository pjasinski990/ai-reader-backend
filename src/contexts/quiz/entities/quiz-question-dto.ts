import { MultipleChoiceQuizQuestion, OpenEndedQuizQuestion, QuizQuestion } from './quiz-question';

export type OpenEndedQuizQuestionDTO = OpenEndedQuizQuestion;
export type MulitpleChoiceQuizQuestionDTO = Omit<MultipleChoiceQuizQuestion, 'correctChoiceId'>;

export type QuizQuestionDTO = OpenEndedQuizQuestionDTO | MulitpleChoiceQuizQuestionDTO;

export function toQuizQuestionDTO(q: QuizQuestion): QuizQuestionDTO {
    switch (q.type) {
        case 'multiple_choice': {
            const { correctChoiceId, ...rest } = q;
            return rest;
        }
        case 'open_ended':
            return { ...q };
    }
}
