import { AccessTokenPayload } from '@/contexts/auth/entities/access-token-payload';

declare global {
    namespace Express {
        interface Request {
            authToken?: AccessTokenPayload;
        }
    }
}

export {};
