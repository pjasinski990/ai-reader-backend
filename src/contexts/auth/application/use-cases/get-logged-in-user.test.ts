import { beforeEach, describe, expect, it } from 'vitest';
import { GetLoggedInUserUseCase } from '@/contexts/auth/application/use-cases/get-logged-in-user';
import { InMemoryUserRepo } from '@/contexts/auth/infra/in-memory-user-repo';
import { AuthDescription } from '@/contexts/auth/entities/auth-description';
import { User } from '@/contexts/auth/entities/user';
import { getAuthDescription } from '@/contexts/auth/application/services/get-auth-description';
import { PublicUserData } from '@/contexts/auth/entities/who-am-i-result';
import { returnsOkAccessTokenWith } from '@/contexts/auth/infra/testing/mock-token-verify';
import { expectResultError, expectResultOk } from '@/shared/infra/testing/assertions';

describe('GetLoggedInUserUseCase', () => {
    let userRepo: InMemoryUserRepo;
    let authDescription: AuthDescription;
    let useCase: GetLoggedInUserUseCase;

    const testUser: User = {
        id: 'someUser',
        email: 'bob@email.com',
        passwordHash: 'verySecret',
    };

    beforeEach(() => {
        userRepo = new InMemoryUserRepo();
        authDescription = { ...getAuthDescription() };
        useCase = new GetLoggedInUserUseCase(userRepo, authDescription);
    });

    it('should return public user data when given valid access token', async () => {
        await userRepo.upsert(testUser);
        authDescription.verifyAccessToken = returnsOkAccessTokenWith({ userId: testUser.id });

        const result = await useCase.execute('doesnt.matter');

        expectResultOk(result);
        expect(result.value.id).toBe(testUser.id);
        expect(result.value.email).toBe(testUser.email);
    });

    it('should fail if access token is malformed', async () => {
        const result = await useCase.execute('bad.token');

        expectResultError(result);

        expect(result.error).toMatch(/Malformed access token/);
    });

    it('should fail if access token is valid but user does not exist', async () => {
        authDescription.verifyAccessToken = returnsOkAccessTokenWith({ userId: testUser.id });

        const result = await useCase.execute('doesnt.matter');

        expectResultError(result);
        expect(result.error).toMatch(/No such user/);
    });

    for (const field of strippedFields) {
        it(`should strip ${field} from the returned user`, async () => {
            authDescription.verifyAccessToken = returnsOkAccessTokenWith({ userId: testUser.id });
            await userRepo.upsert(testUser);

            const result = await useCase.execute('doesnt.matter');

            expectResultOk<PublicUserData>(result);
            expect(field in result.value).toBe(false);
        });
    }
});

const strippedFields: (keyof User)[] = [
    'passwordHash'
];
