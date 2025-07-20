import { beforeEach, describe, expect, it } from 'vitest';
import { RefreshTokenService } from '@/contexts/auth/application/services/refresh-token-service';
import { AuthDescription } from '@/contexts/auth/entities/auth-description';
import { InMemoryRefreshTokenRepo } from '@/contexts/auth/infra/in-memory-refresh-token-repo';
import { RefreshTokenRepo } from '@/contexts/auth/application/ports/out/refresh-token-repo';
import { getAuthDescription } from '@/contexts/auth/application/services/get-auth-description';
import { LogoutUserUseCase } from '@/contexts/auth/application/use-cases/logout-user';
import { LogoutUser } from '@/contexts/auth/application/ports/in/logout-user';
import { returnsOkAccessTokenWith } from '@/contexts/auth/infra/testing/mock-token-verify';

describe('RefreshAttemptUseCase', () => {
    let refreshTokenRepo: RefreshTokenRepo;
    let refreshTokenService: RefreshTokenService;
    let authDescription: AuthDescription;
    let useCase: LogoutUser;

    const userId = 'someUserId';
    const unusedAccessToken = 'validAccessToken';
    const unusedRefreshToken = 'validRefreshToken';

    beforeEach(() => {
        refreshTokenRepo = new InMemoryRefreshTokenRepo();
        authDescription = { ...getAuthDescription() };
        refreshTokenService = new RefreshTokenService(refreshTokenRepo, authDescription.createRefreshToken);
        useCase = new LogoutUserUseCase(refreshTokenService, authDescription);
    });

    it('returns error if access token is malformed', async () => {
        const result = await useCase.execute('malformed', unusedRefreshToken);

        expect(result).toEqual({ ok: false, error: 'Malformed access token' });
    });

    it('returns error if user does not own refresh token', async () => {
        authDescription.verifyAccessToken = returnsOkAccessTokenWith({ userId });
        const rt = await refreshTokenService.issue('not-our-user');

        const result = await useCase.execute(unusedAccessToken, rt);

        expect(result).toEqual({ ok: false, error: 'Invalid refresh token' });
    });

    it('returns ok if refresh token is not found', async () => {
        authDescription.verifyAccessToken = returnsOkAccessTokenWith({ userId });

        const result = await useCase.execute(unusedAccessToken, 'already-removed-token');

        expect(result).toEqual({ ok: true, value: 'User already logged out' });
    });

    it('removes refresh token when request correct', async () => {
        authDescription.verifyAccessToken = returnsOkAccessTokenWith({ userId });
        const rt = await refreshTokenService.issue(userId);

        const result = await useCase.execute(unusedAccessToken, rt);

        expect(result).toEqual({ ok: true, value: 'Logged out successfully' });
    });
});
