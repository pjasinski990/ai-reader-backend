import { Message, Role } from '@/shared/entities/message';
import { StructuredLLMProvider, ValidateSchemaFn } from '@/contexts/material/application/ports/out/structured-llm-provider';
import { QuizProvider, QuizGenerationParams, jsonSchemaForQuestions, QuestionTypeMap } from '../../application/ports/out/quiz-provider';
import { QuestionType } from '../../entities';

export class OpenAIQuizProvider implements QuizProvider {
    constructor(private readonly structuredLLMProvider: StructuredLLMProvider) {}

    async generateQuestionsFromContent<T extends QuestionType>(
        resource: string, 
        params: QuizGenerationParams & { questionType: T }
    ): Promise<QuestionTypeMap[T][]> {
        const questionSchema = jsonSchemaForQuestions[params.questionType];

        const result = await this.structuredLLMProvider.structuredQuery<QuestionTypeMap[T][]>(
            [this.systemNote(params), this.userPrompt(resource, params)],
            {
                schemaDefinition: this.wrapSchemaInArray(questionSchema.schemaDefinition, params.numberOfQuestions),
                validateSchema: this.validationForArraySchema(questionSchema.validateSchema, params.numberOfQuestions)
            },
            {
                functionName: 'questions',
                functionDescription: `Object with exactly ${params.numberOfQuestions} questions at ${params.difficulty} difficulty level`
            }
        );

        return result;
    }

    private systemNote(params: QuizGenerationParams): Message {
        const difficultyInstructions = this.getDifficultyInstructions(params.difficulty);

        return {
            id: '1',
            previousId: null,
            role: Role.SYSTEM,
            content: `You are an experienced teacher creating quiz questions. Your task is to generate questions that help students learn the provided materials.
            Difficulty Level: ${params.difficulty.toUpperCase()}
            ${difficultyInstructions}
            Requirements:
            - Generate exactly the number of questions requested
            - Ensure questions match the specified difficulty level
            - Make questions educational and relevant to the material
            - Use clear and appropriate language for the difficulty level`
        };
    }

    private userPrompt(resource: string, params: QuizGenerationParams): Message {
        return {
            id: '2',
            previousId: '1',
            role: Role.USER,
            content: `Generate ${params.numberOfQuestions} ${params.difficulty} difficulty quiz questions for the following material:
            Material:
            ${resource}
            Remember to create questions that test understanding at the ${params.difficulty} level.`
        };
    }

    private getDifficultyInstructions(difficulty: string): string {
        const instructions = {
            beginner: `- Focus on basic concepts and fundamental understanding
            - Use simple, clear language
            - Test recall and basic comprehension
            - Avoid complex scenarios or advanced terminology
            - Questions should be accessible to someone new to the topic`,

            intermediate: `- Test understanding and application of concepts
            - Use moderate complexity in language and scenarios
            - Include some analytical thinking but keep it manageable
            - Balance between recall and application
            - Assume some prior knowledge of the topic`,

            expert: `- Require deep understanding and critical thinking
            - Use complex scenarios and advanced concepts
            - Test analysis, synthesis, and evaluation skills
            - Challenge assumptions and require nuanced understanding
            - Expect mastery-level knowledge of the topic`
        };

        return instructions[difficulty as keyof typeof instructions] || instructions.intermediate;
    }

    private validationForArraySchema<T>(singleElementValidator: ValidateSchemaFn<T>, elems: number): ValidateSchemaFn<T[]> {
        return (value: unknown): value is T[] => {
            if (!Array.isArray(value) || value.length !== elems) {
                return false;
            }
            return value.every(singleElementValidator);
        };
    }

    private wrapSchemaInArray(schema: Record<string, unknown>, numOfQuestions: number): Record<string, unknown> {
        return {
            type: 'array',
            minItems: numOfQuestions,
            maxItems: numOfQuestions,
            items: schema
        };
    }
} 
