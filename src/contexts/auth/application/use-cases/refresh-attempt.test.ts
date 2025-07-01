import { vi, beforeEach, describe, expect, it } from 'vitest';
import { RefreshAttemptUseCase } from '@/contexts/auth/application/use-cases/refresh-attempt';
import { RefreshTokenService } from '@/contexts/auth/application/services/refresh-token-service';
import { AuthDescription } from '@/contexts/auth/entities/auth-description';
import { InMemoryRefreshTokenRepo } from '@/contexts/auth/infra/in-memory-refresh-token-repo';
import { RefreshTokenRepo } from '@/contexts/auth/application/ports/out/refresh-token-repo';
import { getAuthDescription } from '@/contexts/auth/application/services/get-auth-description';
import { AuthVerifyError, JwtVerifyOk } from '@/contexts/auth/entities/auth-strategy';
import { AccessTokenPayload } from '@/contexts/auth/entities/access-token-payload';
import { LoginOk, LoginResult } from '@/contexts/auth/entities/login-result';

describe('RefreshAttemptUseCase', () => {
    let refreshTokenRepo: RefreshTokenRepo;
    let refreshTokenService: RefreshTokenService;
    let authDescription: AuthDescription;
    let useCase: RefreshAttemptUseCase;

    const userId = 'someUserId';
    const unusedAccessToken = 'validAccessToken';
    const unusedRefreshToken = 'validRefreshToken';

    beforeEach(() => {
        refreshTokenRepo = new InMemoryRefreshTokenRepo();
        authDescription = { ...getAuthDescription() };
        refreshTokenService = new RefreshTokenService(refreshTokenRepo, authDescription.createRefreshToken);
        useCase = new RefreshAttemptUseCase(refreshTokenService, authDescription);
    });

    it('returns error if access token is malformed', async () => {
        const result = await useCase.execute('malformed', unusedRefreshToken);

        expect(result).toEqual({ ok: false, error: 'Malformed access token' });
    });

    it('returns error if userId is not in access token', async () => {
        authDescription.verifyAccessToken = async (token: string) => invalidAccessTokenVerifyResponse();

        const result = await useCase.execute(unusedAccessToken, unusedRefreshToken);

        expect(result).toEqual({ ok: false, error: 'Malformed access token' });
    });

    it('returns error if refresh token is not owned by userId from access token', async () => {
        authDescription.verifyAccessToken = async (token: string) => expiredAccessTokenVerifyResponse({ userId: 'susUser' });
        const refreshToken = await refreshTokenService.issue(userId);

        const result = await useCase.execute(unusedAccessToken, refreshToken);

        expect(result).toEqual({ ok: false, error: 'Access token mismatch - invalid owner' });
    });

    it('returns error if refresh token is invalid', async () => {
        authDescription.verifyAccessToken = async (token: string) => expiredAccessTokenVerifyResponse( { userId });

        const result = await useCase.execute(unusedAccessToken, 'invalidRefresh');

        expect(result).toEqual({ ok: false, error: 'Invalid refresh token' });
    });

    it('returns error if refresh token is expired', async () => {
        authDescription.verifyAccessToken = async (token: string) => expiredAccessTokenVerifyResponse( { userId });
        const refreshToken = await refreshTokenService.issue(userId);
        const eightDaysMs = 8 * 24 * 60 * 60 * 1000;
        skipTime(eightDaysMs);

        const result = await useCase.execute(unusedAccessToken, refreshToken);

        expect(result).toEqual({ ok: false, error: 'Refresh token expired' });
    });

    it('returns new valid tokens on valid request', async () => {
        authDescription.verifyAccessToken = async (token: string) => expiredAccessTokenVerifyResponse( { userId });
        const refreshToken = await refreshTokenService.issue(userId);

        const result = await useCase.execute(unusedAccessToken, refreshToken);

        expectLoginOk(result);
        const atVerifyResult = await authDescription.verifyAccessToken(result.accessToken);
        const rtFound = await refreshTokenService.find(result.refreshToken);
        expect(atVerifyResult.ok).toBe(true);
        expect(rtFound).not.toBeNull();
    });

    it('revokes the old refresh token', async () => {
        authDescription.verifyAccessToken = async (token: string) => expiredAccessTokenVerifyResponse( { userId });
        const initialRt = await refreshTokenService.issue(userId);

        await useCase.execute(unusedAccessToken, initialRt);

        const oldTokenFound = await refreshTokenService.find(initialRt);
        expect(oldTokenFound).toBeNull();
    });
});

function expectLoginOk(result: LoginResult): asserts result is LoginOk {
    expect(result.ok).toBe(true);
}

function invalidAccessTokenVerifyResponse(): AuthVerifyError {
    return {
        ok: false,
        error: 'Access token invalid'
    };
}

function expiredAccessTokenVerifyResponse(payload: AccessTokenPayload): JwtVerifyOk {
    return {
        ok: true,
        authType: 'jwt',
        expired: true,
        payload,
    };
}

function skipTime(amountMs: number) {
    const now = Date.now();
    const later = now + amountMs;
    vi.spyOn(Date, 'now').mockReturnValue(later);
}
