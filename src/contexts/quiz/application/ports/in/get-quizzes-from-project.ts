import { QuizDescription } from '@/contexts/quiz/entities';

export interface GetQuizzesFromProject {
    execute(projId: string): Promise<QuizDescription[]>;
}
