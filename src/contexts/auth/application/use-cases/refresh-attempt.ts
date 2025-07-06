import { RefreshAttempt } from '@/contexts/auth/application/ports/in/refresh-attempt';
import { AuthData, LoginResult } from '@/contexts/auth/entities/login-result';
import { AuthDescription } from '@/contexts/auth/entities/auth-description';
import { RefreshTokenService } from '@/contexts/auth/application/services/refresh-token-service';
import { extractUserId } from '@/contexts/auth/application/services/access-token-utils';
import { nok, ok } from '@/shared/entities/result';

export class RefreshAttemptUseCase implements RefreshAttempt {
    constructor(
        private readonly refreshTokenService: RefreshTokenService,
        private readonly authDescription: AuthDescription,
    ) { }

    async execute(accessToken: string, refreshToken: string): Promise<LoginResult> {
        const userId = await extractUserId(accessToken, this.authDescription.verifyAccessToken);
        if (!userId) {
            return nok<string>('Malformed access token');
        }

        const foundRefreshToken = await this.refreshTokenService.find(refreshToken);
        if (!foundRefreshToken) {
            return nok<string>('Invalid refresh token');
        }

        if (foundRefreshToken.ownerId !== userId) {
            return nok<string>('Access token mismatch - invalid owner');
        }

        await this.refreshTokenService.revoke(foundRefreshToken);
        if (Date.now() > foundRefreshToken.exp) {
            return nok<string>('Refresh token expired');
        }

        const newAccessToken = await this.authDescription.createAccessToken(userId);
        const newRefreshToken = await this.refreshTokenService.issue(userId);
        return ok<AuthData>({
            userId,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    }
}
