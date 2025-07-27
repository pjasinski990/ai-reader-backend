export class HttpError extends Error {
    details: unknown;
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export class ValidationError extends HttpError {
    details: unknown;
    constructor(message: string, details?: unknown) {
        super(400, message);
        this.details = details;
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message = 'Unauthorized') {
        super(401, message);
    }
}

export class ForbiddenError extends HttpError {
    constructor(message = 'Forbidden') {
        super(403, message);
    }
}

export class MissingResourceError extends HttpError {
    constructor(message: string, details?: unknown) {
        super(404, message);
        this.details = details;
    }
}

export class InternalServerError extends HttpError {
    constructor(message = 'Internal Server Error') {
        super(500, message);
    }
}
