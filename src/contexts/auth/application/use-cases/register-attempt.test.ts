import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RegisterAttemptUseCase } from '@/contexts/auth/application/use-cases/register-attempt';
import { InMemoryUserRepo } from '@/contexts/auth/infra/in-memory-user-repo';
import { AuthDescription } from '@/contexts/auth/entities/auth-description';
import { getAuthDescription } from '@/contexts/auth/application/services/get-auth-description';
import { UserRepo } from '@/contexts/auth/application/ports/out/user-repo';
import { User } from '@/contexts/auth/entities/user';
import { v4 as uuidv4 } from 'uuid';
import { expectResultError, expectResultOk } from '@/shared/infra/testing/assertions';

vi.mock('uuid', () => ({
    v4: vi.fn(),
}));

describe('RegisterAttemptUseCase', () => {
    let authDescription: AuthDescription;
    let userRepo: InMemoryUserRepo;
    let useCase: RegisterAttemptUseCase;

    const testEmail = 'testing@email.com';
    const testPassword = 'testPassword';
    const testHash = 'hashedPassword';

    beforeEach(() => {
        authDescription = { ...getAuthDescription() };
        authDescription.hashPassword = vi.fn().mockResolvedValue(testHash);
        userRepo = new InMemoryUserRepo();
        useCase = new RegisterAttemptUseCase(userRepo, authDescription);
    });

    it('should register a new user successfully', async () => {
        const result = await useCase.execute(testEmail, testPassword);

        expectResultOk<User>(result);
        expect(result.value.email).toBe(testEmail);
        expect(result.value.passwordHash).toBe(testHash);
        await expectHasStoredUser(result.value, userRepo);
    });

    for (const invalidEmail of invalidEmails) {
        it(`should fail with non-email email value: ${invalidEmail}`, async () => {
            const result = await useCase.execute('nonEmail', testPassword);

            expectResultError(result);
            expect(result.error).toBe('Invalid email address');
        });
    }

    for (const invalidPassword of invalidPasswords) {
        it(`should fail with invalid password value: ${invalidPassword}`, async () => {
            const result = await useCase.execute(testEmail, '');

            expectResultError(result);
            expect(result.error).toBe('Password must be at least 8 characters');
        });
    }


    it('should not allow registration with an existing email', async () => {
        await userRepo.upsert({ id: 'someId', email: testEmail, passwordHash: testHash });

        const result = await useCase.execute(testEmail, testPassword);

        expectResultError(result);
        expect(result.error).toBe('User with this email address already exists');
    });

    it('should use provided hash strategy', async () => {
        await useCase.execute(testEmail, testPassword);

        expect(authDescription.hashPassword).toHaveBeenCalledWith(testPassword);
    });

    it('should assign a uuid using uuidv4', async () => {
        await useCase.execute(testEmail, testPassword);

        expect(uuidv4).toHaveBeenCalled();
    });

    it('should be case insensitive for emails', async () => {
        await userRepo.upsert({ id: 'abc', email: testEmail, passwordHash: '123' });
        const result = await useCase.execute(testEmail.toUpperCase(), testPassword);

        expectResultError<string>(result);
        expect(result.error).toBe('User with this email address already exists');
    });
});

async function expectHasStoredUser(user: User, repo: UserRepo) {
    const saved = await repo.getByEmail(user.email);
    expect(saved).not.toBeNull();
    expect(saved?.id).toBe(user.id);
    expect(saved?.email).toBe(user.email);
    expect(saved?.passwordHash).toBe(user.passwordHash);
}

const invalidEmails = [
    'nonEmail',
    '',
];

const invalidPasswords = [
    'short',
    '',
];
