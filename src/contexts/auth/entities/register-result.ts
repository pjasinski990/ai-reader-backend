import { User } from '@/contexts/auth/entities/user';
import { Result } from '@/shared/entities/result';

export type RegisterResult = Result<User, string>
