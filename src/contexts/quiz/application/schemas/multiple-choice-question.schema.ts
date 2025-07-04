import Ajv, { ValidateFunction } from 'ajv';
import { MultipleChoiceQuestion } from '../../entities/quiz-question';
import { ValidateSchemaFn } from '../../../material/application/ports/out/structured-llm-provider';

const ajv = new Ajv({ allErrors: true, strict: false });

export const multipleChoiceQuestionSchemaJson = {
    $id: 'MultipleChoiceQuestion',
    type: 'object',
    properties: {
        id:   { type: 'string' },
        type: { type: 'string', enum: ['multiple_choice'] },
        content: { type: 'string' },

        choices: {
            type: 'array',
            minItems: 4,
            items: {
                type: 'object',
                properties: {
                    id:    { type: 'string' },
                    label: { type: 'string' },
                },
                required: ['id', 'label'],
                additionalProperties: false,
            },
        },
        correctChoiceId: { type: 'string' },
    },

    required: ['id', 'type', 'content', 'choices', 'correctChoiceId'],
    additionalProperties: false,
} as const;

const validateMCQ: ValidateFunction<MultipleChoiceQuestion> = ajv.compile(multipleChoiceQuestionSchemaJson);

export const validateMCQSchema: ValidateSchemaFn<MultipleChoiceQuestion> = (value: unknown): value is MultipleChoiceQuestion => {
    if (!validateMCQ(value)) {
        return false;
    }

    return value.choices.some((c) => c.id === value.correctChoiceId);
}; 