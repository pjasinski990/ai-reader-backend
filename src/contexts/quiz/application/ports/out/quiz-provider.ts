import { GeneratedMultipleChoiceQuestion, GeneratedOpenEndedQuestion, QuestionType } from '@/contexts/quiz/entities';
import { QuizDifficulty } from '../in/create-quiz-from-material';
import { ReturnSchema } from '@/contexts/material/application/ports/out/structured-llm-provider';
import { multipleChoiceQuestionSchemaJson, validateMCQSchema } from '../../schemas/generated-multiple-choice-question.schema';
import { openEndedQuestionSchemaJson, validateOEQSchema } from '../../schemas/generated-open-ended-question.schema';

export interface QuizGenerationParams {
    difficulty: QuizDifficulty;
    numberOfQuestions: number;
    questionType: QuestionType; 
}

export type QuestionTypeMap = {
    'multiple_choice': GeneratedMultipleChoiceQuestion;
    'open_ended': GeneratedOpenEndedQuestion;
};

export const jsonSchemaForQuestions: { [K in QuestionType]: ReturnSchema<QuestionTypeMap[K]> } = {
    'multiple_choice': {
        schemaDefinition: multipleChoiceQuestionSchemaJson,
        validateSchema: validateMCQSchema
    },
    'open_ended': {
        schemaDefinition: openEndedQuestionSchemaJson,
        validateSchema: validateOEQSchema
    }
};

type GenerateQuestionsParams<T extends QuestionType> = QuizGenerationParams & { questionType: T };

export interface QuizProvider {
    generateQuestionsFromContent<T extends QuestionType>(
        content: string, 
        params: GenerateQuestionsParams<T>
    ): Promise<QuestionTypeMap[T][]>; 
}
