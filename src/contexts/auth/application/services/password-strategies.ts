import bcrypt from 'bcrypt';
import { HashPasswordStrategy, VerifyPasswordStrategy } from '@/contexts/auth/entities/auth-strategy';

export const bcryptVerifyStrategy: VerifyPasswordStrategy = async (password: string, hash: string) => {
    const match = await bcrypt.compare(password, hash);
    return match ? { ok: true, authType: 'generic' } : { ok: false, error: 'Invalid password' };
};

export const bcryptHashStrategy: HashPasswordStrategy = async (password: string) => {
    const SALT_ROUNDS = 10;
    return await bcrypt.hash(password, SALT_ROUNDS);
};

export const plainVerifyStrategy: VerifyPasswordStrategy = async (password: string, hash: string) => {
    const match = password === hash;
    return match ? { ok: true, authType: 'generic' } : { ok: false, error: 'Invalid password' };
};

export const plainHashStrategy: HashPasswordStrategy = async (password: string) => {
    return password;
};
