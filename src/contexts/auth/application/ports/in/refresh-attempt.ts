import { LoginResult } from '@/contexts/auth/entities/login-result';

export interface RefreshAttempt {
    execute(refreshToken: string): Promise<LoginResult>;
}
