import { Request } from 'express';

export type VerifyResult = { ok: true } | { ok: false; message: string };

export type JwtVerifyStrategy = (token: string, secret: string) => VerifyResult;

export type GetTokenStrategy = (req: Request) => string | null;
