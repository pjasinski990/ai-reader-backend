import { ExtractTokenStrategy, VerifyAccessTokenStrategy } from '@/contexts/auth/entities/auth-strategy';
import { NextFunction, Request, Response } from 'express';
import { InternalServerError, UnauthorizedError } from '@/shared/entities/http-errors';
import { BuildAuthMiddleware } from '@/contexts/auth/application/ports/in/build-auth-middleware';
import { AuthMiddleware } from '@/contexts/auth/entities/auth-middleware';

export class BuildAuthMiddlewareUseCase implements BuildAuthMiddleware {
    execute(getToken: ExtractTokenStrategy, verifyToken: VerifyAccessTokenStrategy): AuthMiddleware {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            void res;

            const token = await getToken(req);
            if (!token) return next(new UnauthorizedError('Missing access token'));

            const resCheck = await verifyToken(token);
            if (!resCheck.ok) {
                return next(new UnauthorizedError(resCheck.error));
            }

            if (!(resCheck.authType === 'jwt')) {
                return next(new InternalServerError('Unexpected authorization result type'));
            }
            if (resCheck.expired) {
                return next(new UnauthorizedError('Access token expired'));
            }

            req.jwt = resCheck.payload;
            next();
        };
    }
}
