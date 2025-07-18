import { AuthDescription } from '@/contexts/auth/entities/auth-description';
import {
    clearAccessTokenFromCookie,
    createJwtAccessToken,
    extractAccessTokenFromCookie,
    setAccessTokenToCookie,
    verifyJwtAccessToken
} from '@/contexts/auth/application/services/access-token-strategies';
import {
    clearRefreshTokenFromCookie,
    createRandomToken,
    extractRefreshTokenFromCookie,
    setRefreshTokenToCookie
} from '@/contexts/auth/application/services/refresh-token-strategies';
import { bcryptHashStrategy, bcryptVerifyStrategy } from '@/contexts/auth/application/services/password-strategies';

const authDescription: AuthDescription = {
    createAccessToken: createJwtAccessToken,
    setAccessToken: setAccessTokenToCookie,
    clearAccessToken: clearAccessTokenFromCookie,
    extractAccessToken: extractAccessTokenFromCookie,
    verifyAccessToken: verifyJwtAccessToken,

    createRefreshToken: createRandomToken,
    setRefreshToken: setRefreshTokenToCookie,
    clearRefreshToken: clearRefreshTokenFromCookie,
    extractRefreshToken: extractRefreshTokenFromCookie,

    hashPassword: bcryptHashStrategy,
    verifyPassword: bcryptVerifyStrategy,
};

export const getAuthDescription = () => authDescription;
