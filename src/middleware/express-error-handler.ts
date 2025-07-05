import { NextFunction, Request, Response } from 'express';
import { HttpError } from '@/shared/entities/http-errors';

export const expressErrorHandler = ((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    void req;
    void _next;

    if (err instanceof HttpError) {
        res.status(err.status).json({
            error: err.message,
            details: err.details
        });
        return;
    }

    console.error(err);
    res.status(500).json({
        error: err instanceof Error ? err.message : 'Internal server error',
    });
});

