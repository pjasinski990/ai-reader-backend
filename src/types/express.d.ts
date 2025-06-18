import { JwtPayload } from '@/contexts/auth/entities/jwt-payload';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export {};
