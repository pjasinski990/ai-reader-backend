import { Middleware } from '@/contexts/auth/entities/middleware';
import { ExtractTokenStrategy, VerifyAccessTokenStrategy } from '@/contexts/auth/entities/auth-strategy';

export interface BuildAuthMiddleware {
    execute(getToken: ExtractTokenStrategy, strategy: VerifyAccessTokenStrategy): Middleware;
}
