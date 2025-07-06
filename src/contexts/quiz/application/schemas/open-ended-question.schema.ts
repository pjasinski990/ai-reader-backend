import Ajv, { ValidateFunction } from 'ajv';
import { OpenEndedQuestion } from '../../entities/quiz-question';
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

const validateOEQ: ValidateFunction<OpenEndedQuestion> = ajv.compile<OpenEndedQuestion>(openEndedQuestionSchemaJson);

export const validateOEQSchema: ValidateSchemaFn<OpenEndedQuestion> = (value: unknown): value is OpenEndedQuestion => {
    return validateOEQ(value);
}; 
