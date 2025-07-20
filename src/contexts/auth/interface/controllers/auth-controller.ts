import { LoginResult } from '@/contexts/auth/entities/login-result';
import { RegisterResult } from '@/contexts/auth/entities/register-result';
import { InMemoryUserRepo } from '@/contexts/auth/infra/in-memory-user-repo';
import { InMemoryRefreshTokenRepo } from '@/contexts/auth/infra/in-memory-refresh-token-repo';
import { LoginAttempt } from '@/contexts/auth/application/ports/in/login-attempt';
import { RegisterAttempt } from '@/contexts/auth/application/ports/in/register-attempt';
import { RefreshTokenService } from '@/contexts/auth/application/services/refresh-token-service';
import { LoginAttemptUseCase } from '@/contexts/auth/application/use-cases/login-attempt';
import { RegisterAttemptUseCase } from '@/contexts/auth/application/use-cases/register-attempt';
import { getAuthDescription } from '@/contexts/auth/application/services/get-auth-description';
import { RefreshAttempt } from '@/contexts/auth/application/ports/in/refresh-attempt';
import { RefreshAttemptUseCase } from '@/contexts/auth/application/use-cases/refresh-attempt';
import { GetLoggedInUser } from '@/contexts/auth/application/ports/in/get-logged-in-user';
import { GetLoggedInUserUseCase } from '@/contexts/auth/application/use-cases/get-logged-in-user';
import { WhoAmIResult } from '@/contexts/auth/entities/who-am-i-result';
import { LogoutUser } from '@/contexts/auth/application/ports/in/logout-user';
import { LogoutUserUseCase } from '@/contexts/auth/application/use-cases/logout-user';
import { LogoutResult } from '@/contexts/auth/entities/logout-result';
import { JsonUserRepo } from '@/contexts/auth/infra/json-user-repo';

export class AuthController {
    constructor(
        private readonly loginAttempt: LoginAttempt,
        private readonly refreshAttempt: RefreshAttempt,
        private readonly registerAttempt: RegisterAttempt,
        private readonly getLoggedInUser: GetLoggedInUser,
        private readonly logUserOut: LogoutUser,
    ) { }

    onLoginAttempt(email: string, password: string): Promise<LoginResult> {
        return this.loginAttempt.execute(email, password);
    }

    onRefreshAttempt(accessToken: string, refreshToken: string): Promise<LoginResult> {
        return this.refreshAttempt.execute(accessToken, refreshToken);
    }

    async onLogout(accessToken: string, refreshToken: string): Promise<LogoutResult> {
        return await this.logUserOut.execute(accessToken, refreshToken);
    }

    onRegisterAttempt(email: string, password: string): Promise<RegisterResult> {
        return this.registerAttempt.execute(email, password);
    }

    onWhoAmIRequest(accessToken: string): Promise<WhoAmIResult> {
        return this.getLoggedInUser.execute(accessToken);
    }
}

const userRepo = new JsonUserRepo();
const tokenRepo = new InMemoryRefreshTokenRepo();
const authDescription = getAuthDescription();
const refreshTokenService = new RefreshTokenService(tokenRepo, authDescription.createRefreshToken);

export const authController = new AuthController(
    new LoginAttemptUseCase(userRepo, refreshTokenService, authDescription),
    new RefreshAttemptUseCase(refreshTokenService, authDescription),
    new RegisterAttemptUseCase(userRepo, authDescription),
    new GetLoggedInUserUseCase(userRepo, authDescription),
    new LogoutUserUseCase(refreshTokenService, authDescription),
);
