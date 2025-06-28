import { GetTokenStrategy, JwtVerifyStrategy } from '@/contexts/auth/entities/strategies';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '@/shared/entities/http-errors';
import jwt from 'jsonwebtoken';
import { JwtPayloadSchema } from '@/contexts/auth/entities/jwt-payload';
import { BuildAuthMiddleware } from '@/contexts/auth/application/ports/in/build-auth-middleware';
import { AuthMiddleware } from '@/contexts/auth/entities/auth-middleware';

export class BuildAuthMiddlewareUseCase implements BuildAuthMiddleware {
    execute(getToken: GetTokenStrategy, jwtVerify: JwtVerifyStrategy): AuthMiddleware {
        return (req: Request, _res: Response, next: NextFunction): void => {
            const token = getToken(req);
            if (!token) return next(new UnauthorizedError('Missing Bearer token'));

            const resCheck = jwtVerify(token, process.env.JWT_SECRET as string);
            if (!resCheck.ok) return next(new UnauthorizedError(resCheck.message));

            const decoded = jwt.decode(token);
            const parsed = JwtPayloadSchema.safeParse(decoded);
            if (!parsed.success) {
                return next(new UnauthorizedError('Malformed token payload'));
            }

            req.user = parsed.data;
            next();
        };
    }
}
