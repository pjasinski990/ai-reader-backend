// TODO move to service
export type QuestionValidationResult = { ok: true } | { ok: false; feedback?: string };

export interface QuestionServices {
    validate(question: Question, userAnswer: Answer, context?: string): Promise<QuestionValidationResult>;
}
// TODO end

export interface Question {
    readonly id: string;
    readonly content: string;
    readonly type: QuestionType;
}

export interface Choice {
    id: string;
    label: string;
}

export type QuizQuestion = MultipleChoiceQuestion | OpenEndedQuestion;
export type QuestionType = 'multiple_choice' | 'open_ended';

export interface OpenEndedQuestion extends Question {
    readonly type: 'open_ended';
}

export interface MultipleChoiceQuestion extends Question {
    readonly type: 'multiple_choice';
    readonly choices: Choice[];
    readonly correctChoiceId: string;
    readonly content: string;
}

export interface Answer {
    value: unknown;
}
