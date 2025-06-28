import { GetTokenStrategy } from '@/contexts/auth/entities/strategies';
import { Request } from 'express';

export const getTokenFromHeader: GetTokenStrategy = (req: Request) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return null;
    }
    return header.substring(7).trim();
};
