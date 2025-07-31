import { promises as fs } from 'fs';
import * as path from 'path';
import { MaterialRepo } from '@/contexts/material/application/ports/out/material-repo';
import { Material } from '@/contexts/material/entities/material';

export class JsonMaterialRepo implements MaterialRepo {
    private readonly dbPath: string;

    constructor() {
        this.dbPath = path.resolve(process.cwd(), 'mockdb', 'materials.json');
    }

    async upsert(material: Material): Promise<Material> {
        const materials = await this.readAll();
        const idx = materials.findIndex(m => m.id === material.id);
        if (idx !== -1) {
            materials[idx] = material;
        } else {
            materials.push(material);
        }
        await this.writeAll(materials);
        return material;
    }

    async getByIds(ids: string[]): Promise<Material[]> {
        const materials = await this.readAll();
        return materials.filter(m => ids.includes(m.id));
    }

    async getAll(): Promise<Material[]> {
        return this.readAll();
    }

    async getByProjectId(projectId: string): Promise<Material[]> {
        const materials = await this.readAll();
        return materials.filter(m => m.projectId === projectId);
    }

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

    private async readAll(): Promise<Material[]> {
        await this.ensureFileExists();
        const raw = await fs.readFile(this.dbPath, 'utf-8');
        try {
            return JSON.parse(raw) as Material[];
        } catch {
            return [];
        }
    }

    private async writeAll(materials: Material[]): Promise<void> {
        await this.ensureFileExists();
        await fs.writeFile(this.dbPath, JSON.stringify(materials, null, 2), 'utf-8');
    }
}
