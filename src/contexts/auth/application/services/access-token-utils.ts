import { VerifyAccessTokenStrategy } from '@/contexts/auth/entities/auth-strategy';

export async function extractUserId(accessToken: string, verifyTokenStrat: VerifyAccessTokenStrategy) {
    const verifyResult = await verifyTokenStrat(accessToken);
    if (verifyResult.ok && verifyResult.authType === 'jwt') {
        return verifyResult.payload.userId;
    }
    return null;
}
