import { HttpError } from '@/shared/entities/http-error';

export class MissingResourceError extends HttpError {
    details: unknown;
    constructor(message: string, details?: unknown) {
        super(404, message);
        this.details = details;
    }
}
