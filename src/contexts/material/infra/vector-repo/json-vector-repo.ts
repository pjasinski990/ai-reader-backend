import { promises as fs } from 'fs';
import * as path from 'path';
import { VectorRepo } from '@/contexts/material/application/ports/out/vector-repo';
import { LeafChunk } from '@/contexts/material/entities/chunk';
import { cosineSimilarity } from '@/shared/utils/cosine-similarity';

export class JsonVectorRepo implements VectorRepo {
    private readonly dbPath: string;

    constructor() {
        this.dbPath = path.resolve(process.cwd(), 'mockdb', 'vector-repo.json');
    }

    async delete(ids: string[]): Promise<string[]> {
        const all = await this.readAll();
        const remaining = all.filter(chunk => !ids.includes(chunk.id));
        await this.writeAll(remaining);
        return ids;
    }

    async get(ids: string[]): Promise<LeafChunk[]> {
        const all = await this.readAll();
        return all.filter(chunk => ids.includes(chunk.id));
    }

    async getAll(): Promise<LeafChunk[]> {
        return this.readAll();
    }

    async put(chunks: LeafChunk[]): Promise<LeafChunk[]> {
        const all = await this.readAll();
        const map = new Map(all.map(c => [c.id, c]));
        for (const chunk of chunks) {
            map.set(chunk.id, chunk);
        }
        await this.writeAll(Array.from(map.values()));
        return chunks;
    }

    async upsert(chunks: LeafChunk[]): Promise<LeafChunk[]> {
        return this.put(chunks);
    }

    async query(embedding: number[], k: number = 5): Promise<LeafChunk[]> {
        const all = await this.readAll();
        return all
            .map(chunk => ({
                chunk,
                score: cosineSimilarity(chunk.embedding, embedding),
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, k)
            .map(e => e.chunk);
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

    private async readAll(): Promise<LeafChunk[]> {
        await this.ensureFileExists();
        const raw = await fs.readFile(this.dbPath, 'utf-8');
        try {
            return JSON.parse(raw) as LeafChunk[];
        } catch {
            return [];
        }
    }

    private async writeAll(chunks: LeafChunk[]): Promise<void> {
        await this.ensureFileExists();
        await fs.writeFile(this.dbPath, JSON.stringify(chunks, null, 2), 'utf-8');
    }
}
