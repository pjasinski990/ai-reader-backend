// This is object that is stored in the quiz repo
export interface QuizDescription {
    id: string;
    projId: string;
    userId: string;
    name: string;
    completed: ProgressStage;
}

export type ProgressStage = 'NEW' | 'STARTRED' | 'COMPLETED';
