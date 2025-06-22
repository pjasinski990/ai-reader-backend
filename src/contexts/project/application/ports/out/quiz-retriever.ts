import { QuizPreview } from '@/contexts/project/entities/quiz-preview';

export interface QuizRetriever {
    execute(ids: string[]): Promise<QuizPreview[]>
}
