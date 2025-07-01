import { LoginResult } from '@/contexts/auth/entities/login-result';

export interface LoginAttempt {
    execute(email: string, password: string): Promise<LoginResult>;
}
