import { beforeEach, describe, vi, it, expect } from 'vitest';
import {
    AuthVerifyError, AuthVerifyResult,
    CreateAccessTokenStrategy,
    JwtVerifyOk,
    VerifyAccessTokenStrategy
} from '@/contexts/auth/entities/auth-strategy';
import {
    createJwtAccessToken,
    verifyJwtAccessToken
} from '@/contexts/auth/application/services/access-token-strategies';

describe('verify jwt token', () => {
    const userId = 'someUser';
    let issueJwtStrat: CreateAccessTokenStrategy;
    let verifyJwtStrat: VerifyAccessTokenStrategy;

    beforeEach(async () => {
        issueJwtStrat = createJwtAccessToken;
        verifyJwtStrat = verifyJwtAccessToken;
    });

    it('should return ok with valid token', async () => {
        const token = await issueJwtStrat(userId);

        const result = await verifyJwtStrat(token);

        expectResultOk(result);
        expect(result.payload.userId).toBe(userId);
    });

    it('should not expire token before 15 minutes', async () => {
        const token = await issueJwtStrat(userId);
        const fourteenMinutes = 14 * 60 * 1000;
        skipTime(fourteenMinutes);

        const result = await verifyJwtStrat(token);

        expectResultOk(result);
        expect(result.expired).toBe(false);
    });

    it('should expire token after 15 minutes', async () => {
        const token = await issueJwtStrat(userId);
        const sixteenMinutes = 16 * 60 * 1000;
        skipTime(sixteenMinutes);

        const result = await verifyJwtStrat(token);

        expectResultOk(result);
        expect(result.expired).toBe(true);
    });
});

function skipTime(amountMs: number) {
    const now = Date.now();
    const later = now + amountMs;
    vi.spyOn(Date, 'now').mockReturnValue(later);
}

function expectResultOk(result: AuthVerifyResult): asserts result is JwtVerifyOk {
    expect(result.ok).toBe(true);
}
