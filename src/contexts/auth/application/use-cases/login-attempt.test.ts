import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginAttemptUseCase } from '@/contexts/auth/application/use-cases/login-attempt';
import { InMemoryRefreshTokenRepo } from '@/contexts/auth/infra/in-memory-refresh-token-repo';
import { InMemoryUserRepo } from '@/contexts/auth/infra/in-memory-user-repo';
import { RefreshTokenService } from '@/contexts/auth/application/services/refresh-token-service';
import { AuthDescription } from '@/contexts/auth/entities/auth-description';
import { getAuthDescription } from '@/contexts/auth/application/services/get-auth-description';
import { plainHashStrategy, plainVerifyStrategy } from '@/contexts/auth/application/services/password-strategies';
import { User } from '@/contexts/auth/entities/user';
import { LoginFailed, LoginOk, LoginResult } from '@/contexts/auth/entities/login-result';

describe('login attempt use case', () => {
    let authDescription: AuthDescription;
    let userRepo: InMemoryUserRepo;
    let refreshTokenRepo: InMemoryRefreshTokenRepo;
    let refreshTokenService: RefreshTokenService;
    let useCase: LoginAttemptUseCase;

    const testUser: User = {
        id: 'someId',
        email: 'testEmail',
        passwordHash: 'testPassword',
    };

    beforeEach(() => {
        authDescription = { ...getAuthDescription() };
        authDescription.hashPassword = plainHashStrategy;
        authDescription.verifyPassword = plainVerifyStrategy;
        authDescription.createAccessToken = vi.fn().mockResolvedValue('dummy-access-token');
        authDescription.createRefreshToken = vi.fn().mockResolvedValue('dummy-refresh-token');
        userRepo = new InMemoryUserRepo();
        refreshTokenRepo = new InMemoryRefreshTokenRepo();
        refreshTokenService = new RefreshTokenService(refreshTokenRepo, authDescription.createRefreshToken);
        useCase = new LoginAttemptUseCase(userRepo, refreshTokenService, authDescription);
    });

    it('should pass with valid password', async () => {
        await userRepo.upsert(testUser);

        const result = await useCase.execute(testUser.email, testUser.passwordHash);

        expectLoginOk(result);
        expect(result.accessToken).toBe('dummy-access-token');
        expect(result.refreshToken).toBe('dummy-refresh-token');
        expect(result.userId).toBe(testUser.id);
    });

    it('should fail when user does not exist', async () => {
        const result = await useCase.execute('notfound@email.com', 'irrelevant');
        expectLoginFailed(result);
        expect(result.error).toBe('User does not exist');
    });

    it('should fail with wrong password', async () => {
        await userRepo.upsert(testUser);
        const result = await useCase.execute(testUser.email, 'wrongPassword');
        expectLoginFailed(result);
        expect(result.error).toBe('Invalid password');
    });

    it('should fail if password is empty', async () => {
        await userRepo.upsert(testUser);
        const result = await useCase.execute(testUser.email, '');
        expectLoginFailed(result);
        expect(result.error).toBe('Invalid password');
    });

    it('should return correct tokens on success', async () => {
        await userRepo.upsert(testUser);
        const result = await useCase.execute(testUser.email, testUser.passwordHash);
        expectLoginOk(result);
        expect(result.accessToken).toBe('dummy-access-token');
        expect(result.refreshToken).toBe('dummy-refresh-token');
    });

    it('should not create tokens on failed login', async () => {
        await userRepo.upsert(testUser);
        const accessSpy = vi.spyOn(authDescription, 'createAccessToken');
        const refreshSpy = vi.spyOn(refreshTokenService, 'issue');
        await useCase.execute(testUser.email, 'wrongPassword');
        expect(accessSpy).not.toHaveBeenCalled();
        expect(refreshSpy).not.toHaveBeenCalled();
    });
});

function expectLoginFailed(result: LoginResult): asserts result is LoginFailed {
    expect(result.ok).toBe(false);
}

function expectLoginOk(result: LoginResult): asserts result is LoginOk {
    expect(result.ok).toBe(true);
}
