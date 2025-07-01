import {
    CreateAccessTokenStrategy,
    CreateRefreshTokenStrategy,
    ExtractTokenStrategy,
    HashPasswordStrategy,
    SetTokenStrategy,
    VerifyAccessTokenStrategy,
    VerifyPasswordStrategy
} from '@/contexts/auth/entities/auth-strategy';

export interface AuthDescription {
    createAccessToken: CreateAccessTokenStrategy;
    setAccessToken: SetTokenStrategy,
    extractAccessToken: ExtractTokenStrategy,
    verifyAccessToken: VerifyAccessTokenStrategy,

    createRefreshToken: CreateRefreshTokenStrategy;
    extractRefreshToken: ExtractTokenStrategy,
    setRefreshToken: SetTokenStrategy,

    hashPassword: HashPasswordStrategy,
    verifyPassword: VerifyPasswordStrategy,
}
