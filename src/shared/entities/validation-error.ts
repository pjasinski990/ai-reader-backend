import { HttpError } from '@/shared/entities/http-error';

export class ValidationError extends HttpError {
    details: unknown;
    constructor(message: string, details?: unknown) {
        super(400, message);
        this.details = details;
    }
}
