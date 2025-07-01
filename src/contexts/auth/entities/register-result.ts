import { User } from '@/contexts/auth/entities/user';

export interface RegisterOk {
    ok: true;
    user: User
}

export interface RegisterFailed {
    ok: false;
    error: string;
}

export type RegisterResult = RegisterOk | RegisterFailed;
