import { Request, Router } from 'express';
import { LoginRequest, LoginRequestSchema } from '@/contexts/auth/entities/login-request';
import { RegisterRequest, RegisterRequestSchema } from '@/contexts/auth/entities/register-request';
import { UnauthorizedError, ValidationError } from '@/shared/entities/http-errors';
import { authController } from '@/contexts/auth/interface/controllers/auth-controller';
import { getAuthDescription } from '@/contexts/auth/application/services/get-auth-description';

export const authRoutes = Router();

authRoutes.post('/login', async (req, res) => {
    const { email, password } = parseLoginData(req);
    const loginResult = await authController.onLoginAttempt(email, password);
    if (!loginResult.ok) {
        throw new ValidationError(`Invalid login details: ${loginResult.error}`);
    }
    const authDescription = getAuthDescription();
    await authDescription.setAccessToken(loginResult.accessToken, res);
    await authDescription.setRefreshToken(loginResult.refreshToken, res);
    res.json({ message: 'Login successful' });
});

authRoutes.get('/refresh', async (req, res) => {
    const at = await getAuthDescription().extractAccessToken(req);
    const rt = await getAuthDescription().extractRefreshToken(req);
    if (!at || !rt) {
        throw new UnauthorizedError('Missing token. Please log in again.');
    }
    const refreshResult = await authController.onRefreshAttempt(at, rt);
    if (!refreshResult.ok) {
        throw new ValidationError(`Error during refresh: ${refreshResult.error}`);
    }

    const authDescription = getAuthDescription();
    await authDescription.setAccessToken(refreshResult.accessToken, res);
    await authDescription.setRefreshToken(refreshResult.refreshToken, res);
    res.json({ message: 'Tokens refreshed.' });
});

authRoutes.post('/register', async (req, res) => {
    const { email, password } = parseRegisterData(req);
    const registerResult = await authController.onRegisterAttempt(email, password);
    if (!registerResult.ok) {
        throw new ValidationError(`Invalid register details: ${registerResult.error}`);
    }

    res.json({ message: 'Register successful. Please proceed to login.' });
});

authRoutes.get('/me', async (req, res) => {
    const at = await getAuthDescription().extractAccessToken(req);
    if (!at) {
        throw new UnauthorizedError('Missing token. Please log in again.');
    }
    const meResult = await authController.onWhoAmIRequest(at);
    if (!meResult.ok) {
        throw new UnauthorizedError(`Error processing "me" request: ${meResult.error}`);
    }
    res.json( { user: meResult.user });
});

function parseLoginData(req: Request): LoginRequest {
    const parseResult = LoginRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
        throw new ValidationError('Invalid login request', parseResult.error.flatten());
    }
    return parseResult.data;
}

function parseRegisterData(req: Request): RegisterRequest {
    const parseResult = RegisterRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
        throw new ValidationError('Invalid register request', parseResult.error.flatten());
    }
    return parseResult.data;
}
