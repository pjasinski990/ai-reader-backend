import { NextFunction, Request, Response } from 'express';

export const expressErrorWrapper = (fn: CallableFunction) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
