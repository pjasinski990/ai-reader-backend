import { UserRepo } from '@/contexts/auth/application/ports/out/user-repo';
import { LoginAttempt } from '@/contexts/auth/application/ports/in/login-attempt';
import { LoginResult } from '@/contexts/auth/entities/login-result';
import { AuthDescription } from '@/contexts/auth/entities/auth-description';
import { RefreshTokenService } from '@/contexts/auth/application/services/refresh-token-service';

export class LoginAttemptUseCase implements LoginAttempt {
    constructor(
        private readonly userRepo: UserRepo,
        private readonly refreshTokenService: RefreshTokenService,
        private readonly authDescription: AuthDescription,
    ) { }

    async execute(email: string, password: string): Promise<LoginResult> {
        const existingUser = await this.userRepo.getByEmail(email);
        if (!existingUser) {
            return { ok: false, error: 'User does not exist' };
        }

        const verifyResult = await this.authDescription.verifyPassword(password, existingUser.passwordHash);
        if (!verifyResult.ok) {
            return { ok: false, error: 'Invalid password' };
        }

        const accessToken = await this.authDescription.createAccessToken(existingUser.id);
        const refreshToken = await this.refreshTokenService.issue(existingUser.id);
        return {
            ok: true,
            userId: existingUser.id,
            accessToken,
            refreshToken
        };
    }
}
