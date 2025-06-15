import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export const asyncWrapper = (fn: AsyncHandler): RequestHandler =>
    (req, res, next) => void fn(req, res, next).catch(next);
