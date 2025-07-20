import { LogoutUser } from '@/contexts/auth/application/ports/in/logout-user';
import { RefreshTokenService } from '@/contexts/auth/application/services/refresh-token-service';
import { nok, ok } from '@/shared/entities/result';
import { LogoutResult } from '@/contexts/auth/entities/logout-result';
import { AuthDescription } from '@/contexts/auth/entities/auth-description';
import { extractUserId } from '@/contexts/auth/application/services/access-token-utils';

export class LogoutUserUseCase implements LogoutUser {
    constructor(
        private readonly refreshTokenService: RefreshTokenService,
        private readonly authDescription: AuthDescription,
    ) { }

    async execute(accessToken: string, refreshToken: string): Promise<LogoutResult> {
        const userId = await extractUserId(accessToken, this.authDescription.verifyAccessToken);
        const rt = await this.refreshTokenService.find(refreshToken);

        if (!userId) {
            return nok('Malformed access token');
        }

        if (!rt) {
            return ok('User already logged out');
        }

        if (rt.ownerId !== userId) {
            return nok('Invalid refresh token');
        }

        await this.refreshTokenService.revoke(rt);
        return ok('Logged out successfully');
    }
}
