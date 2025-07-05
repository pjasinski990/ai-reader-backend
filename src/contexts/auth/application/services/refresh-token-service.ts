import { RefreshTokenRepo } from '@/contexts/auth/application/ports/out/refresh-token-repo';
import { CreateRefreshTokenStrategy } from '@/contexts/auth/entities/auth-strategy';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { RefreshToken } from '@/contexts/auth/entities/refresh-token';

export class RefreshTokenService {
    constructor(
        private readonly repo: RefreshTokenRepo,
        private readonly createToken: CreateRefreshTokenStrategy
    ) {}

    sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    async issue(ownerId: string): Promise<string> {
        const value = await this.createToken(ownerId);
        await this.repo.upsert({
            id: uuidv4(),
            ownerId,
            valueHash: hashToken(value),
            exp: Date.now() + this.sevenDaysMs,
        });
        return value;
    }

    async find(value: string): Promise<RefreshToken | null> {
        const hash = hashToken(value);
        return await this.repo.getByHash(hash);
    }

    async revoke(rt: RefreshToken): Promise<void> {
        await this.repo.remove(rt.id);
    }
}

export function hashToken(value: string): string {
    return crypto
        .createHash('sha256')
        .update(value, 'utf8')
        .digest('hex');
}
