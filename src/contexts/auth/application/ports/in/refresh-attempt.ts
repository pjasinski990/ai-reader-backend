import { LoginResult } from '@/contexts/auth/entities/login-result';

export interface RefreshAttempt {
    execute(accessToken: string, refreshToken: string): Promise<LoginResult>;
}
