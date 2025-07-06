import { User } from '@/contexts/auth/entities/user';
import { Result } from '@/shared/entities/result';

export type PublicUserData = Omit<User, 'passwordHash'>

export type WhoAmIResult = Result<PublicUserData, string>;
