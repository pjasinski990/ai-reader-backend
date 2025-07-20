import {
    ClearTokenStrategy,
    CreateAccessTokenStrategy,
    ExtractTokenStrategy, JwtAuthenticatedData,
    SetTokenStrategy,
    VerifyAccessTokenStrategy
} from '@/contexts/auth/entities/auth-strategy';
import { AccessTokenPayload, AccessTokenPayloadSchema } from '@/contexts/auth/entities/access-token-payload';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { CookieOptions, Request, Response } from 'express';
import { ValidationError } from '@/shared/entities/http-errors';
import { nok, ok } from '@/shared/entities/result';

// TODO once deployed
process.env.JWT_SECRET = 'mock secret';

export const createJwtAccessToken: CreateAccessTokenStrategy = async (ownerId: string) => {
    const payload: AccessTokenPayload = { userId: ownerId };
    const secret = getJwtSecret();
    return jwt.sign(payload, secret, {expiresIn: '15m',});
};

export const setAccessTokenToCookie: SetTokenStrategy = async (token: string, res: Response) => {
    res.cookie('accessToken', token, secureCookieOptions());
};

export const clearAccessTokenFromCookie: ClearTokenStrategy = async (token: string, res: Response) => {
    res.clearCookie('accessToken', secureCookieOptions());
};

export const extractAccessTokenFromCookie: ExtractTokenStrategy = (req: Request) => {
    const token = req.cookies?.accessToken;
    return token ?? null;
};

export const verifyJwtAccessToken: VerifyAccessTokenStrategy = async (token: string) => {
    const secret = getJwtSecret();
    try {
        const data = jwt.verify(token, secret);
        const payload = validatePayload(data);
        return ok<JwtAuthenticatedData>({ authType: 'jwt', payload, expired: false });
    } catch (e) {
        if (e instanceof TokenExpiredError) {
            const payload = jwt.verify(token, secret, { ignoreExpiration: true }) as AccessTokenPayload;
            return ok<JwtAuthenticatedData>({ authType: 'jwt', payload, expired: true });
        }
        const errorMsg = e instanceof Error ? e.message : 'Invalid or expired token';
        return nok(errorMsg);
    }
};

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET must be set');
    }
    return secret;
}

function validatePayload(data: unknown): AccessTokenPayload {
    const parseResult = AccessTokenPayloadSchema.safeParse(data);
    if (!parseResult.success) {
        throw new ValidationError('Malformed payload', parseResult.error.flatten());
    }
    return parseResult.data;
}

// TODO pull from config?
const fifteenMinutesMs = 15 * 60 * 1000;
function secureCookieOptions(): CookieOptions {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: fifteenMinutesMs,
        path: '/',
    };
}
