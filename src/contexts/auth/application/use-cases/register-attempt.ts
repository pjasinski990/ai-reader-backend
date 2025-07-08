import { RegisterAttempt } from '@/contexts/auth/application/ports/in/register-attempt';
import { RegisterResult } from '@/contexts/auth/entities/register-result';
import { UserRepo } from '@/contexts/auth/application/ports/out/user-repo';
import { v4 as uuidv4 } from 'uuid';
import { AuthDescription } from '@/contexts/auth/entities/auth-description';
import validator from 'validator';
import { nok, ok } from '@/shared/entities/result';
import { User } from '@/contexts/auth/entities/user';

export class RegisterAttemptUseCase implements RegisterAttempt {
    constructor(
        private readonly userRepo: UserRepo,
        private readonly authDescription: AuthDescription,
    ) { }

    async execute(email: string, password: string): Promise<RegisterResult> {
        if (!validator.isEmail(email)) {
            return nok('Invalid email address');
        }

        if (password.length < 8) {
            return nok('Password must be at least 8 characters');
        }

        email = email.toLowerCase();
        const existing = await this.userRepo.getByEmail(email);
        if (existing) {
            return nok('User with this email address already exists');
        }

        const passwordHash = await this.authDescription.hashPassword(password);
        const newUser = {
            id: uuidv4(),
            email,
            passwordHash,
        };

        await this.userRepo.upsert(newUser);
        return ok<User>(newUser);
    }
}
