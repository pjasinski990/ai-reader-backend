import 'express';
import { JwtPayload } from '@/contexts/auth/entities/jwt-payload';

declare module 'express' {
    interface Request {
        user?: JwtPayload;
    }
}
