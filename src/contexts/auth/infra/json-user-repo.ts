import { UserRepo } from '@/contexts/auth/application/ports/out/user-repo';
import { User } from '@/contexts/auth/entities/user';
import path from 'path';
import { promises as fs } from 'fs';

export class JsonUserRepo implements UserRepo {
    private readonly dbPath: string;

    constructor() {
        this.dbPath = path.resolve(process.cwd(), 'mockdb', 'users.json');
    }

    async upsert(user: User): Promise<User> {
        const users = await this.readAll();
        const idx = users.findIndex(m => m.id === user.id);
        if (idx !== -1) {
            users[idx] = user;
        } else {
            users.push(user);
        }
        await this.writeAll(users);
        return Promise.resolve(user);
    }

    async getByEmail(email: string): Promise<User | null> {
        const users = await this.readAll();
        const user = users.find(s => s.email === email);
        return Promise.resolve(user ?? null);
    }

    async getById(id: string): Promise<User | null> {
        const users = await this.readAll();
        const user = users.find(s => s.id === id);
        return Promise.resolve(user ?? null);
    }

    private async ensureFileExists() {
        const dir = path.dirname(this.dbPath);
        await fs.mkdir(dir, { recursive: true });
        try {
            await fs.access(this.dbPath);
        } catch {
            await fs.writeFile(this.dbPath, '[]', 'utf-8');
        }
    }

    private async readAll(): Promise<User[]> {
        await this.ensureFileExists();
        const raw = await fs.readFile(this.dbPath, 'utf-8');
        try {
            return JSON.parse(raw) as User[];
        } catch {
            return [];
        }
    }

    private async writeAll(users: User[]): Promise<void> {
        await this.ensureFileExists();
        await fs.writeFile(this.dbPath, JSON.stringify(users, null, 2), 'utf-8');
    }
}
