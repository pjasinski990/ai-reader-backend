import { AuthMiddleware } from '@/contexts/auth/entities/auth-middleware';
import { ExtractTokenStrategy, VerifyAccessTokenStrategy } from '@/contexts/auth/entities/auth-strategy';

export interface BuildAuthMiddleware {
    execute(getToken: ExtractTokenStrategy, strategy: VerifyAccessTokenStrategy): AuthMiddleware;
}
