import { beforeEach, describe, expect, it } from 'vitest';
import { RefreshAttemptUseCase } from '@/contexts/auth/application/use-cases/refresh-attempt';
import { RefreshTokenService } from '@/contexts/auth/application/services/refresh-token-service';
import { AuthDescription } from '@/contexts/auth/entities/auth-description';
import { InMemoryRefreshTokenRepo } from '@/contexts/auth/infra/in-memory-refresh-token-repo';
import { RefreshTokenRepo } from '@/contexts/auth/application/ports/out/refresh-token-repo';
import { getAuthDescription } from '@/contexts/auth/application/services/get-auth-description';
import { AuthData } from '@/contexts/auth/entities/login-result';
import { skipTime } from '@/shared/infra/testing/utils';
import { expectResultOk } from '@/shared/infra/testing/assertions';
import { returnsExpiredAccessTokenWith } from '@/contexts/auth/infra/testing/mock-token-verify';
import { UserRepo } from '@/contexts/auth/application/ports/out/user-repo';
import { InMemoryUserRepo } from '@/contexts/auth/infra/in-memory-user-repo';

describe('RefreshAttemptUseCase', () => {
    let refreshTokenRepo: RefreshTokenRepo;
    let userRepo: UserRepo;
    let refreshTokenService: RefreshTokenService;
    let authDescription: AuthDescription;
    let useCase: RefreshAttemptUseCase;

    const userId = 'someUserId';

    beforeEach(() => {
        refreshTokenRepo = new InMemoryRefreshTokenRepo();
        userRepo = new InMemoryUserRepo();
        authDescription = { ...getAuthDescription() };
        refreshTokenService = new RefreshTokenService(refreshTokenRepo, authDescription.createRefreshToken);
        useCase = new RefreshAttemptUseCase(userRepo, refreshTokenService, authDescription);
    });

    it('returns error if refresh token is invalid', async () => {
        authDescription.verifyAccessToken = returnsExpiredAccessTokenWith({ userId });

        const result = await useCase.execute('invalidRefresh');

        expect(result).toEqual({ ok: false, error: 'Invalid refresh token' });
    });

    it('returns error if refresh token is expired', async () => {
        authDescription.verifyAccessToken = returnsExpiredAccessTokenWith({ userId });
        const refreshToken = await refreshTokenService.issue(userId);
        const eightDaysMs = 8 * 24 * 60 * 60 * 1000;
        skipTime(eightDaysMs);

        const result = await useCase.execute(refreshToken);

        expect(result).toEqual({ ok: false, error: 'Refresh token expired' });
    });

    it('returns error if user does not exist', async () => {
        authDescription.verifyAccessToken = returnsExpiredAccessTokenWith({ userId });
        const refreshToken = await refreshTokenService.issue(userId);

        const result = await useCase.execute(refreshToken);

        expect(result).toEqual({ ok: false, error: 'Invalid user' });
    });

    it('returns new valid tokens on valid request', async () => {
        authDescription.verifyAccessToken = returnsExpiredAccessTokenWith({ userId });
        await userRepo.upsert({ id: userId, passwordHash: 'unnecessary', email: 'doesnt@matter' });
        const refreshToken = await refreshTokenService.issue(userId);

        const result = await useCase.execute(refreshToken);

        expectResultOk<AuthData>(result);
        const atVerifyResult = await authDescription.verifyAccessToken(result.value.accessToken);
        const rtFound = await refreshTokenService.find(result.value.refreshToken);
        expect(atVerifyResult.ok).toBe(true);
        expect(rtFound).not.toBeNull();
    });

    it('revokes the old refresh token', async () => {
        authDescription.verifyAccessToken = returnsExpiredAccessTokenWith({ userId });
        const initialRt = await refreshTokenService.issue(userId);

        await useCase.execute(initialRt);

        const oldTokenFound = await refreshTokenService.find(initialRt);
        expect(oldTokenFound).toBeNull();
    });
});
