import { User } from '@/contexts/auth/entities/user';

export type PublicUserData = Omit<User, 'passwordHash'>

export interface WhoAmIOk {
    ok: true;
    user: PublicUserData;
}

export interface WhoAmIError {
    ok: false;
    error: string;
}

export type WhoAmIResult = WhoAmIOk | WhoAmIError;
