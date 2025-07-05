import { GetLoggedInUser } from '@/contexts/auth/application/ports/in/get-logged-in-user';
import { AuthDescription } from '@/contexts/auth/entities/auth-description';
import { UserRepo } from '@/contexts/auth/application/ports/out/user-repo';
import { extractUserId } from '@/contexts/auth/application/services/access-token-utils';
import { PublicUserData, WhoAmIResult } from '@/contexts/auth/entities/who-am-i-result';
import { User } from '@/contexts/auth/entities/user';

export class GetLoggedInUserUseCase implements GetLoggedInUser {
    constructor(
        private readonly userRepo: UserRepo,
        private readonly authDescription: AuthDescription
    ) { }

    async execute(accessToken: string): Promise<WhoAmIResult> {
        const userId = await extractUserId(accessToken, this.authDescription.verifyAccessToken);
        if (!userId) {
            return { ok: false, error: 'Malformed access token' };
        }

        const user = await this.userRepo.getById(userId);
        if (!user) {
            return { ok: false, error: `No such user: ${userId}` };
        }

        const userData = toPublicUserData(user);
        return { ok: true, user: userData };
    }
}

function toPublicUserData(user: User): PublicUserData {
    const { passwordHash, ...publicFields } = user;
    void passwordHash;
    return publicFields;
}
