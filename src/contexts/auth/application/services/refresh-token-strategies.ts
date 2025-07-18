import {
    ClearTokenStrategy,
    CreateRefreshTokenStrategy,
    ExtractTokenStrategy,
    SetTokenStrategy
} from '@/contexts/auth/entities/auth-strategy';
import { CookieOptions, Request, Response } from 'express';
import crypto from 'crypto';

export const createRandomToken: CreateRefreshTokenStrategy = async (userId: string) => {
    void userId;
    return crypto.randomBytes(64).toString('base64');
};

export const setRefreshTokenToCookie: SetTokenStrategy = async (token: string, res: Response) => {
    res.cookie('refreshToken', token, secureCookieOptions());
};

export const clearRefreshTokenFromCookie: ClearTokenStrategy = async (token: string, res: Response) => {
    res.clearCookie('refreshToken', secureCookieOptions());
};

export const extractRefreshTokenFromCookie: ExtractTokenStrategy = (req: Request) => {
    const token = req.cookies.refreshToken;
    return token ?? null;
};

const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

function secureCookieOptions(): CookieOptions {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: sevenDaysMs,
        path: '/',
    };
}
