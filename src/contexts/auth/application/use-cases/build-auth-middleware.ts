import { ExtractTokenStrategy, VerifyAccessTokenStrategy } from '@/contexts/auth/entities/auth-strategy';
import { NextFunction, Request, Response } from 'express';
import { InternalServerError, UnauthorizedError } from '@/shared/entities/http-errors';
import { BuildAuthMiddleware } from '@/contexts/auth/application/ports/in/build-auth-middleware';
import { Middleware } from '@/contexts/auth/entities/middleware';
import { isJwtAuthenticatedData } from '@/contexts/auth/application/services/access-token-utils';

export class BuildAuthMiddlewareUseCase implements BuildAuthMiddleware {
    execute(getToken: ExtractTokenStrategy, verifyToken: VerifyAccessTokenStrategy): Middleware {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            void res;

            const token = await getToken(req);
            if (!token) return next(new UnauthorizedError('Missing access token'));

            const resCheck = await verifyToken(token);
            if (!resCheck.ok) {
                return next(new UnauthorizedError(resCheck.error));
            }

            if (!isJwtAuthenticatedData(resCheck.value)) {
                return next(new InternalServerError('Unexpected authorization result type'));
            }

            if (resCheck.value.expired) {
                return next(new UnauthorizedError('Access token expired'));
            }

            req.authToken = resCheck.value.payload;
            next();
        };
    }
}
