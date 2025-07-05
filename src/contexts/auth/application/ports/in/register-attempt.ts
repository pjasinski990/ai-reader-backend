import { RegisterResult } from '@/contexts/auth/entities/register-result';

export interface RegisterAttempt {
    execute(email: string, password: string): Promise<RegisterResult>;
}
