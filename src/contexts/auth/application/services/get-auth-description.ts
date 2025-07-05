import { AuthDescription } from '@/contexts/auth/entities/auth-description';
import {
    createJwtAccessToken,
    extractAccessTokenFromCookie,
    setAccessTokenToCookie,
    verifyJwtAccessToken
} from '@/contexts/auth/application/services/access-token-strategies';
import {
    createRandomToken,
    extractRefreshTokenFromCookie,
    setRefreshTokenToCookie
} from '@/contexts/auth/application/services/refresh-token-strategies';
import { bcryptHashStrategy, bcryptVerifyStrategy } from '@/contexts/auth/application/services/password-strategies';

const authDescription: AuthDescription = {
    createAccessToken: createJwtAccessToken,
    setAccessToken: setAccessTokenToCookie,
    extractAccessToken: extractAccessTokenFromCookie,
    verifyAccessToken: verifyJwtAccessToken,

    createRefreshToken: createRandomToken,
    setRefreshToken: setRefreshTokenToCookie,
    extractRefreshToken: extractRefreshTokenFromCookie,

    hashPassword: bcryptHashStrategy,
    verifyPassword: bcryptVerifyStrategy,
};

export const getAuthDescription = () => authDescription;
