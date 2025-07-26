import { Result, ok } from '@/shared/entities/result';
import { QuizQuestion } from '../../entities/quiz-question';
import { Answer } from '../../entities/user-answer';
import { ContentExtractionStrategy } from '@/shared/ports/out/content-extraction-strategy';
import { StructuredLLMProvider } from '@/contexts/material/application/ports/out/structured-llm-provider';

export type QuestionValidationResult = Result<void, string>;

export class QuestionServices {
    constructor(
        private readonly llmProvider: StructuredLLMProvider,
        private readonly contentExtractionStrategy: ContentExtractionStrategy
    ) {}

    async validate(question: QuizQuestion, userAnswer: Answer): Promise<QuestionValidationResult> {
        return ok(undefined);
    }
}
