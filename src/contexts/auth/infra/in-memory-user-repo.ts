import { UserRepo } from '@/contexts/auth/application/ports/out/user-repo';
import { User } from '@/contexts/auth/entities/user';

export class InMemoryUserRepo implements UserRepo {
    users: User[] = [];

    upsert(user: User): Promise<User> {
        if (this.users.find(s => s.id === user.id)) {
            this.users = this.users.map(s => s.id === user.id ? user : s);
        } else {
            this.users.push(user);
        }
        return Promise.resolve(user);
    }

    getByEmail(email: string): Promise<User | null> {
        const user = this.users.find(s => s.email === email);
        return Promise.resolve(user ?? null);
    }

    getById(id: string): Promise<User | null> {
        const user = this.users.find(s => s.id === id);
        return Promise.resolve(user ?? null);
    }
}
