import { RefreshTokenRepo } from '@/contexts/auth/application/ports/out/refresh-token-repo';
import { RefreshToken } from '@/contexts/auth/entities/refresh-token';

export class InMemoryRefreshTokenRepo implements RefreshTokenRepo {
    tokens: RefreshToken[] = [];

    getByOwnerId(ownerId: string): Promise<RefreshToken[]> {
        const result = this.tokens.filter(token => token.ownerId === ownerId);
        return Promise.resolve(result);
    }

    upsert(token: RefreshToken): Promise<RefreshToken> {
        if (this.tokens.find(rt => rt.id === token.id)) {
            this.tokens = this.tokens.map(rt => rt.id === token.id ? token : rt);
        } else {
            this.tokens.push(token);
        }
        return Promise.resolve(token);
    }

    remove(id: string): Promise<void> {
        this.tokens = this.tokens.filter((rt) => rt.id !== id);
        return Promise.resolve();
    }

    getByHash(valueHash: string): Promise<RefreshToken | null> {
        const result = this.tokens.find(token => token.valueHash === valueHash);
        return Promise.resolve(result ?? null);
    }
}
