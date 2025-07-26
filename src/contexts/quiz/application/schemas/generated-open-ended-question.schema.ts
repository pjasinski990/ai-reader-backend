import Ajv, { ValidateFunction } from 'ajv';
import { GeneratedOpenEndedQuestion } from '../../entities/quiz-question';
import { ValidateSchemaFn } from '../../../material/application/ports/out/structured-llm-provider';

const ajv = new Ajv({ allErrors: true, strict: false });

export const openEndedQuestionSchemaJson = {
    $id: 'OpenEndedQuestion',
    type: 'object',
    properties: {
        id:   { type: 'string' },
        type: { type: 'string', enum: ['open_ended'] },
        content: { type: 'string' },
    },

    required: ['id', 'type', 'content'],
    additionalProperties: false,
} as const;

const validateOEQ: ValidateFunction<GeneratedOpenEndedQuestion> = ajv.compile<GeneratedOpenEndedQuestion>(openEndedQuestionSchemaJson);

export const validateOEQSchema: ValidateSchemaFn<GeneratedOpenEndedQuestion> = (value: unknown): value is GeneratedOpenEndedQuestion => {
    return validateOEQ(value);
}; 
