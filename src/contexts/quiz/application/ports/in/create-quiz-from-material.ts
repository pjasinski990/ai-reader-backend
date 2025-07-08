import { Quiz } from '../../../entities/quiz';
import { QuizProvider } from '../out/quiz-provider';
import { MaterialRepo } from '@/contexts/material/application/ports/out/material-repo';
import { ContentExtractionStrategy } from '../out/content-extraction-strategy';

export interface CreateQuizFromMaterial {
    execute(
        projectTitle: string,
        materialIds: string[],
        quizProvider: QuizProvider,
        materialRepo: MaterialRepo,
        contentExtractionStrategy: ContentExtractionStrategy,
        params: QuizCreationParams
    ): Promise<Quiz>;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'expert';

export interface QuizCreationParams {
    numberOfQuestions: number;
    difficulty: DifficultyLevel;
    includeMultipleChoice: boolean;
    includeOpenEnded: boolean;
    extractionPrompt?: string;
    topicFocus?: string[];
    additionalContext?: Record<string, unknown>;
} 
