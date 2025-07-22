import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginAttemptUseCase } from '@/contexts/auth/application/use-cases/login-attempt';
import { InMemoryRefreshTokenRepo } from '@/contexts/auth/infra/in-memory-refresh-token-repo';
import { InMemoryUserRepo } from '@/contexts/auth/infra/in-memory-user-repo';
import { RefreshTokenService } from '@/contexts/auth/application/services/refresh-token-service';
import { AuthDescription } from '@/contexts/auth/entities/auth-description';
import { getAuthDescription } from '@/contexts/auth/application/services/get-auth-description';
import { plainHashStrategy, plainVerifyStrategy } from '@/contexts/auth/application/services/password-strategies';
import { User } from '@/contexts/auth/entities/user';
import { AuthData } from '@/contexts/auth/entities/login-result';
import { expectResultError, expectResultOk } from '@/shared/infra/testing/assertions';

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
        const { passwordHash, ...publicUserData } =  testUser;
        void passwordHash;

        const result = await useCase.execute(testUser.email, testUser.passwordHash);

        expectResultOk<AuthData>(result);
        expect(result.value.accessToken).toBe('dummy-access-token');
        expect(result.value.refreshToken).toBe('dummy-refresh-token');
        expect(result.value.user).to.deep.equal(publicUserData);
    });

    it('should fail when user does not exist', async () => {
        const result = await useCase.execute('notfound@email.com', 'irrelevant');
        expectResultError<string>(result);
        expect(result.error).toBe('User does not exist');
    });

    it('should fail with wrong password', async () => {
        await userRepo.upsert(testUser);
        const result = await useCase.execute(testUser.email, 'wrongPassword');
        expectResultError<string>(result);
        expect(result.error).toBe('Invalid password');
    });

    it('should fail if password is empty', async () => {
        await userRepo.upsert(testUser);
        const result = await useCase.execute(testUser.email, '');
        expectResultError<string>(result);
        expect(result.error).toBe('Invalid password');
    });

    it('should return correct tokens on success', async () => {
        await userRepo.upsert(testUser);
        const result = await useCase.execute(testUser.email, testUser.passwordHash);
        expectResultOk<AuthData>(result);
        expect(result.value.accessToken).toBe('dummy-access-token');
        expect(result.value.refreshToken).toBe('dummy-refresh-token');
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
