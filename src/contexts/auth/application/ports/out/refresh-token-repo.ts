import { RefreshToken } from '@/contexts/auth/entities/refresh-token';

export interface RefreshTokenRepo {
    upsert(token: RefreshToken): Promise<RefreshToken>;
    getByOwnerId(ownerId: string): Promise<RefreshToken[]>;
    getByHash(valueHash: string): Promise<RefreshToken | null>;
    remove(id: string): Promise<void>;
}
