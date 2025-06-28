import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

// safely catches errors from async calls in route handlers, passes error to "next"
export const asyncWrapper = (fn: AsyncHandler): RequestHandler =>
    (req, res, next) => void fn(req, res, next).catch(next);
