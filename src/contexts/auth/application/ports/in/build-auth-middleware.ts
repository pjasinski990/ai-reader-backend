import { AuthMiddleware } from '@/contexts/auth/entities/auth-middleware';
import { VerifyAccessTokenStrategy } from '@/contexts/auth/entities/auth-strategy';

export interface BuildAuthMiddleware {
    execute(getToken: GetTokenStrategy, strategy: VerifyAccessTokenStrategy): AuthMiddleware;
}
