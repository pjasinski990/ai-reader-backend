import { QuizQuestion } from '../../../entities/quiz-question';
import { DifficultyLevel } from '../in/create-quiz-from-material';
import { ReturnSchema } from '@/contexts/material/application/ports/out/structured-llm-provider';

export interface QuizGenerationParams {
    difficulty: DifficultyLevel;
    numberOfQuestions: number;
}

export interface QuizProvider {
    generateQuestions<T extends QuizQuestion>(
        resource: string, 
        questionSchema: ReturnSchema<T>, 
        params: QuizGenerationParams
    ): Promise<T[]>; 
} 