import { LLMQueryError } from '@/shared/entities/llm-query-error';

export class LLMHttpError extends LLMQueryError {
    status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.status = status;
    }
}
