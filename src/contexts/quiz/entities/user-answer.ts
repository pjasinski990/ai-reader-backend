export interface Answer {
    value: unknown;
}

type AnswerLifecycle = 'UNASWERED' | 'NOT_CHECKED' | 'CHECKED';

interface BaseUserAnswer {
    state: AnswerLifecycle;
}

export interface EmptyAnswer extends BaseUserAnswer {
    state: 'UNASWERED'
}

export interface NotCheckedAnswer extends BaseUserAnswer {
    state: 'NOT_CHECKED',
    answer: Answer
}

export interface CheckedAnswer extends BaseUserAnswer {
    state: 'CHECKED',
    answer: Answer,
    isCorrect: boolean,
    comment?: string
}

export type UserAnswer = EmptyAnswer | NotCheckedAnswer | CheckedAnswer; 
