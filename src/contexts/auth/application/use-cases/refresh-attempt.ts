import { RefreshAttempt } from '@/contexts/auth/application/ports/in/refresh-attempt';
import { LoginResult } from '@/contexts/auth/entities/login-result';
import { AuthDescription } from '@/contexts/auth/entities/auth-description';
import { RefreshTokenService } from '@/contexts/auth/application/services/refresh-token-service';
import { VerifyAccessTokenStrategy } from '@/contexts/auth/entities/auth-strategy';

export class RefreshAttemptUseCase implements RefreshAttempt {
    constructor(
        private readonly refreshTokenService: RefreshTokenService,
        private readonly authDescription: AuthDescription,
    ) { }

    async execute(accessToken: string, refreshToken: string): Promise<LoginResult> {
        const userId = await extractUserId(accessToken, this.authDescription.verifyAccessToken);
        if (!userId) {
            return { ok: false, error: 'Malformed access token' };
        }

        const foundRefreshToken = await this.refreshTokenService.find(refreshToken);
        if (!foundRefreshToken) {
            return { ok: false, error: 'Invalid refresh token' };
        }

        if (foundRefreshToken.ownerId !== userId) {
            return { ok: false, error: 'Access token mismatch - invalid owner' };
        }

        await this.refreshTokenService.revoke(foundRefreshToken);
        if (Date.now() > foundRefreshToken.exp) {
            return { ok: false, error: 'Refresh token expired' };
        }

        const newAccessToken = await this.authDescription.createAccessToken(userId);
        const newRefreshToken = await this.refreshTokenService.issue(userId);
        return {
            ok: true,
            userId,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }
}

async function extractUserId(accessToken: string, verifyTokenStrat: VerifyAccessTokenStrategy) {
    const verifyResult = await verifyTokenStrat(accessToken);
    if (verifyResult.ok && verifyResult.authType === 'jwt') {
        return verifyResult.payload.userId;
    }
    return null;
}
