import { HttpError } from '@/shared/entities/http-error';

export class LLMHttpError extends HttpError {
    constructor(message: string, status?: number) {
        super(status ?? 502, message);
    }
}
