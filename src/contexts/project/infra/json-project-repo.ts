import { promises as fs } from 'fs';
import * as path from 'path';
import { ProjectRepo } from '@/contexts/project/application/ports/out/project-repo';
import { Project } from '@/contexts/project/entities/project';

export class JsonProjectRepo implements ProjectRepo {
    private readonly dbPath: string;

    constructor() {
        this.dbPath = path.resolve(process.cwd(), 'mockdb', 'projects.json');
    }

    async upsert(project: Project): Promise<void> {
        const projects = await this.readAll();
        const idx = projects.findIndex(m => m.id === project.id);
        if (idx !== -1) {
            projects[idx] = project;
        } else {
            projects.push(project);
        }
        await this.writeAll(projects);
    }

    async getById(id: string): Promise<Project | null> {
        const projects = await this.readAll();
        const project = projects.find(m => m.id === id);
        return project ?? null;
    }

    async getAll(): Promise<Project[]> {
        return this.readAll();
    }

    async getByOwnerId(userId: string): Promise<Project[]> {
        const projects = await this.readAll();
        return projects.filter(p => p.ownerId === userId);
    }

    async remove(id: string): Promise<void> {
        const projects = await this.readAll();
        const filtered = projects.filter(p => p.ownerId !== id);
        await this.clear();
        await this.writeAll(filtered);
    };

    async clear(): Promise<void> {
        try {
            await fs.unlink(this.dbPath);
        } catch (err: unknown) {
            // @ts-expect-error ignore file not existing
            if (err.code !== 'ENOENT') {
                throw err;
            }
        }
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

    private async readAll(): Promise<Project[]> {
        await this.ensureFileExists();
        const raw = await fs.readFile(this.dbPath, 'utf-8');
        try {
            return JSON.parse(raw) as Project[];
        } catch {
            return [];
        }
    }

    private async writeAll(materials: Project[]): Promise<void> {
        await this.ensureFileExists();
        await fs.writeFile(this.dbPath, JSON.stringify(materials, null, 2), 'utf-8');
    }
}
