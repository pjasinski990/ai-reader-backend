import { NextFunction, Request, Response } from 'express';

export type AuthMiddleware = (req: Request, res: Response, next: NextFunction) => void;
