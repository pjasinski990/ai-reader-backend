import { Result } from '@/shared/entities/result';
import { PublicUserData } from '@/contexts/auth/entities/who-am-i-result';

export interface AuthData {
    user: PublicUserData;
    accessToken: string;
    refreshToken: string;
}

export type LoginResult = Result<AuthData, string>
