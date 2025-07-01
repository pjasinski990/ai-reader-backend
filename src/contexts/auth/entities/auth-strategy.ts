import { Request, Response } from 'express';
import { AccessTokenPayload } from '@/contexts/auth/entities/access-token-payload';

export type AuthVerifyOk = { ok: true, authType: 'generic' }
export type JwtVerifyOk = { ok: true, authType: 'jwt', payload: AccessTokenPayload, expired: boolean }
export type AuthVerifyError = { ok: false, error: string };

export type AuthVerifyResult = AuthVerifyError | AuthVerifyOk | JwtVerifyOk;

export type CreateAccessTokenStrategy = (ownerId: string) => Promise<string>;
export type VerifyAccessTokenStrategy = (token: string) => Promise<AuthVerifyResult>;

export type CreateRefreshTokenStrategy = (ownerId: string) => Promise<string>;

export type SetTokenStrategy = (token: string, res: Response) => Promise<void>;

export type ExtractTokenStrategy = (req: Request) => Promise<string | null>;

export type HashPasswordStrategy = (password: string) => Promise<string>;
export type VerifyPasswordStrategy = (password: string, hash: string) => Promise<AuthVerifyResult>;
