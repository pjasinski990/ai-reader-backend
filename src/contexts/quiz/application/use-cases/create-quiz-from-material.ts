import { Quiz } from '../../entities/quiz';
import { CreateQuizFromMaterial, QuizCreationParams } from '../ports/in/create-quiz-from-material';
import { QuizProvider, QuizGenerationParams } from '../ports/out/quiz-provider';
import { v4 as uuidv4 } from 'uuid';
import { MaterialRepo } from '@/contexts/material/application/ports/out/material-repo';
import { ContentExtractionStrategy } from '../ports/out/content-extraction-strategy';
import { multipleChoiceQuestionSchemaJson, validateMCQSchema } from '../schemas/multiple-choice-question.schema';
import { openEndedQuestionSchemaJson, validateOEQSchema } from '../schemas/open-ended-question.schema';
import { QuizQuestion } from '../../entities/quiz-question';

export class CreateQuizFromMaterialUseCase implements CreateQuizFromMaterial {
    async execute(
        projectTitle: string,
        materialIds: string[],
        quizProvider: QuizProvider, 
        materialRepo: MaterialRepo,
        contentExtractionStrategy: ContentExtractionStrategy,
        params: QuizCreationParams
    ): Promise<Quiz> {
        const extractionContext = {
            projectTitle,
            materialIds,
            options: {
                difficulty: params.difficulty,
                numberOfQuestions: params.numberOfQuestions,
                extractionPrompt: params.extractionPrompt,
                topicFocus: params.topicFocus,
                ...params.additionalContext
            }
        };
        
        const content = await contentExtractionStrategy.extractContent(extractionContext, materialRepo);
        const questions: QuizQuestion[] = [];

        const { multipleChoiceCount, openEndedCount } = this.calculateQuestionDistribution(params);

        const generationParams: QuizGenerationParams = {
            difficulty: params.difficulty,
            numberOfQuestions: params.numberOfQuestions
        };

        if (params.includeMultipleChoice && multipleChoiceCount > 0) {
            const multipleChoiceQuestions = await quizProvider.generateQuestions(
                content,
                {
                    schemaDefinition: multipleChoiceQuestionSchemaJson,
                    validateSchema: validateMCQSchema
                },
                { ...generationParams, numberOfQuestions: multipleChoiceCount }
            );
            questions.push(...multipleChoiceQuestions);
        }

        if (params.includeOpenEnded && openEndedCount > 0) {
            const openEndedQuestions = await quizProvider.generateQuestions(
                content,
                {
                    schemaDefinition: openEndedQuestionSchemaJson,
                    validateSchema: validateOEQSchema
                },
                { ...generationParams, numberOfQuestions: openEndedCount }
            );
            questions.push(...openEndedQuestions);
        }

        const shuffledQuestions = this.shuffleQuestions(questions);

        return {
            id: uuidv4(),
            name: `${this.formatDifficultyLevel(params.difficulty)} Quiz for ${projectTitle}`,
            questions: shuffledQuestions,
            completed: false
        };
    }

    private calculateQuestionDistribution(params: QuizCreationParams): { multipleChoiceCount: number; openEndedCount: number } {
        const { numberOfQuestions, includeMultipleChoice, includeOpenEnded } = params;

        if (includeMultipleChoice && includeOpenEnded) {
            const openEndedCount = Math.floor(numberOfQuestions * 0.3);
            const multipleChoiceCount = numberOfQuestions - openEndedCount;
            return { multipleChoiceCount, openEndedCount };
        }
        
        if (includeMultipleChoice && !includeOpenEnded) {
            return { multipleChoiceCount: numberOfQuestions, openEndedCount: 0 };
        }
        
        if (!includeMultipleChoice && includeOpenEnded) {
            return { multipleChoiceCount: 0, openEndedCount: numberOfQuestions };
        }
        
        return { multipleChoiceCount: numberOfQuestions, openEndedCount: 0 };
    }

    private shuffleQuestions(questions: QuizQuestion[]): QuizQuestion[] {
        const shuffled = [...questions];
        
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        return shuffled;
    }

    private formatDifficultyLevel(difficulty: string): string {
        return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    }


} 
