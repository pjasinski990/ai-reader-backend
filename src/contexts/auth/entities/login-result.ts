import { Result } from '@/shared/entities/result';

export interface AuthData {
    userId: string;
    accessToken: string;
    refreshToken: string;
}

export type LoginResult = Result<AuthData, string>
