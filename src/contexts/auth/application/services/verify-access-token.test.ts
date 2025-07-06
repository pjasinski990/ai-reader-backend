import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthenticatedData, CreateAccessTokenStrategy, JwtAuthenticatedData, VerifyAccessTokenStrategy } from '@/contexts/auth/entities/auth-strategy';
import { createJwtAccessToken, verifyJwtAccessToken } from '@/contexts/auth/application/services/access-token-strategies';
import { expectResultOk } from '@/shared/infra/testing/assertions';

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

        expectResultOk<AuthenticatedData>(result);
        expectIsJwtAuth(result.value);
        expect(result.value.payload.userId).toBe(userId);
    });

    it('should not expire token before 15 minutes', async () => {
        const token = await issueJwtStrat(userId);
        const fourteenMinutes = 14 * 60 * 1000;
        skipTime(fourteenMinutes);

        const result = await verifyJwtStrat(token);

        expectResultOk<AuthenticatedData>(result);
        expectIsJwtAuth(result.value);
        expect(result.value.expired).toBe(false);
    });

    it('should expire token after 15 minutes', async () => {
        const token = await issueJwtStrat(userId);
        const sixteenMinutes = 16 * 60 * 1000;
        skipTime(sixteenMinutes);

        const result = await verifyJwtStrat(token);

        expectResultOk<AuthenticatedData>(result);
        expectIsJwtAuth(result.value);
        expect(result.value.expired).toBe(true);
    });
});

function skipTime(amountMs: number) {
    const now = Date.now();
    const later = now + amountMs;
    vi.spyOn(Date, 'now').mockReturnValue(later);
}

function expectIsJwtAuth(result: AuthenticatedData): asserts result is JwtAuthenticatedData {
    expect(result.authType).toBe('jwt');
}
