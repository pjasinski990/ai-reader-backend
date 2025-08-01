import Ajv, { ValidateFunction } from 'ajv';
import { ValidateSchemaFn } from '../../../material/application/ports/out/structured-llm-provider';
import { QuestionValidationResult } from '../services/quiz-question.service';

const ajv = new Ajv({ allErrors: true, strict: false });

export const questionValidationResultSchema = {
    oneOf: [
        {
            type: 'object',
            properties: { ok: { const: true } },
            required:  ['ok'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                ok:      { const: false },
                feedback:{ type: 'string' },
            },
            required: ['ok'],
            additionalProperties: false,
        },
    ],
} as const;

const validateQVR: ValidateFunction<QuestionValidationResult> = ajv.compile(questionValidationResultSchema);

export const validateQVRSchema: ValidateSchemaFn<QuestionValidationResult> = (value: unknown): value is QuestionValidationResult => {
    return validateQVR(value);
};
