import jwt from 'jsonwebtoken';
import { JwtVerifyStrategy } from '@/contexts/auth/entities/strategies';


export const prodJwtVerify: JwtVerifyStrategy = (token: string, secret: string) => {
    try {
        jwt.verify(token, secret);
        return { ok: true };
    } catch (e) {
        return {
            ok: false,
            message: e instanceof Error ? e.message : 'Invalid or expired token',
        };
    }
};

export const mockJwtVerify: JwtVerifyStrategy = (token: string, secret: string) => {
    void token;
    void secret;
    return { ok: true };
};
