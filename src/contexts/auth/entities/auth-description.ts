import {
    ClearTokenStrategy,
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
    clearAccessToken: ClearTokenStrategy,
    extractAccessToken: ExtractTokenStrategy,
    verifyAccessToken: VerifyAccessTokenStrategy,

    createRefreshToken: CreateRefreshTokenStrategy;
    extractRefreshToken: ExtractTokenStrategy,
    clearRefreshToken: ClearTokenStrategy,
    setRefreshToken: SetTokenStrategy,

    hashPassword: HashPasswordStrategy,
    verifyPassword: VerifyPasswordStrategy,
}
