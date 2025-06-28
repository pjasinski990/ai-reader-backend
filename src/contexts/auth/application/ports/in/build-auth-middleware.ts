import { AuthMiddleware } from '@/contexts/auth/entities/auth-middleware';
import { JwtVerifyStrategy } from '@/contexts/auth/entities/strategies';

export interface BuildAuthMiddleware {
    execute(getToken: GetTokenStrategy, strategy: JwtVerifyStrategy): AuthMiddleware;
}
