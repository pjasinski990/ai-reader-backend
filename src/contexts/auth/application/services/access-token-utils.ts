import {
    AuthenticatedData,
    JwtAuthenticatedData,
    VerifyAccessTokenStrategy
} from '@/contexts/auth/entities/auth-strategy';

export async function extractUserId(accessToken: string, verifyTokenStrat: VerifyAccessTokenStrategy) {
    const verifyResult = await verifyTokenStrat(accessToken);
    if (verifyResult.ok && isJwtAuthenticatedData(verifyResult.value)) {
        return verifyResult.value.payload.userId;
    }
    return null;
}

export function isJwtAuthenticatedData(data: AuthenticatedData): data is JwtAuthenticatedData {
    return data.authType === 'jwt';
}
