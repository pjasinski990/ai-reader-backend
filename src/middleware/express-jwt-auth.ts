import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@/shared/entities/http-errors';
import { JwtPayloadSchema } from '@/contexts/auth/entities/jwt-payload';
import jwt from 'jsonwebtoken';

function getTokenFromHeader(header?: string): string | null {
    if (!header || !header.startsWith('Bearer ')) return null;
    return header.substring(7).trim();
}

export function expressJwtAuth(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    const token = getTokenFromHeader(req.headers.authorization);
    if (!token) return next(new UnauthorizedError('Missing Bearer token'));

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err || !decoded) {
            return next(new UnauthorizedError('Invalid or expired token'));
        }

        const parsed = JwtPayloadSchema.safeParse(decoded);
        if (!parsed.success) {
            return next(new UnauthorizedError('Malformed token payload'));
        }

        req.user = parsed.data;
        next();
    });
}
