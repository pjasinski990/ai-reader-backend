export interface GeneratedQuestion {
    readonly id: string;
    readonly content: string;
    readonly type: QuestionType;
}

export interface Choice {
    id: string;
    label: string;
}

export type GeneratedQuizQuestion = GeneratedMultipleChoiceQuestion | GeneratedOpenEndedQuestion;
export type QuestionType = 'multiple_choice' | 'open_ended';

export interface GeneratedOpenEndedQuestion extends GeneratedQuestion {
    readonly type: 'open_ended';
}

export interface GeneratedMultipleChoiceQuestion extends GeneratedQuestion {
    readonly type: 'multiple_choice';
    readonly choices: Choice[];
    readonly correctChoiceId: string;
    readonly content: string;
} 
