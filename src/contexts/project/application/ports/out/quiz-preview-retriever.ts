import { QuizPreview } from '@/contexts/project/entities/quiz-preview';

export interface QuizPreviewRetriever {
    execute(ids: string[]): Promise<QuizPreview[]>
}
