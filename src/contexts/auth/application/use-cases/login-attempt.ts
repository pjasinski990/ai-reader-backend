import { UserRepo } from '@/contexts/auth/application/ports/out/user-repo';
import { LoginAttempt } from '@/contexts/auth/application/ports/in/login-attempt';
import { AuthData, LoginResult } from '@/contexts/auth/entities/login-result';
import { AuthDescription } from '@/contexts/auth/entities/auth-description';
import { RefreshTokenService } from '@/contexts/auth/application/services/refresh-token-service';
import { nok, ok } from '@/shared/entities/result';
import { toPublicUserData } from '@/contexts/auth/entities/who-am-i-result';

export class LoginAttemptUseCase implements LoginAttempt {
    constructor(
        private readonly userRepo: UserRepo,
        private readonly refreshTokenService: RefreshTokenService,
        private readonly authDescription: AuthDescription,
    ) { }

    async execute(email: string, password: string): Promise<LoginResult> {
        const existingUser = await this.userRepo.getByEmail(email);
        if (!existingUser) {
            return nok('User does not exist');
        }

        const verifyResult = await this.authDescription.verifyPassword(password, existingUser.passwordHash);
        if (!verifyResult.ok) {
            return nok('Invalid password');
        }

        const publicUserData = toPublicUserData(existingUser);
        const accessToken = await this.authDescription.createAccessToken(existingUser.id);
        const refreshToken = await this.refreshTokenService.issue(existingUser.id);
        return ok<AuthData>({
            user: publicUserData,
            accessToken,
            refreshToken
        });
    }
}
