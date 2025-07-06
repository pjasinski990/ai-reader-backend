import { cosineSimilarity } from '@/shared/utils/cosine-similarity';
import { VectorRepo } from '@/contexts/material/application/ports/out/vector-repo';
import { LeafChunk } from '@/contexts/material/entities/chunk';

export class InMemoryVectorRepo implements VectorRepo {
    private store: Map<string, LeafChunk> = new Map();

    async delete(ids: string[]): Promise<string[]> {
        for (const id of ids) {
            this.store.delete(id);
        }
        return ids;
    }

    async get(ids: string[]): Promise<LeafChunk[]> {
        return ids.map(id => this.store.get(id)).filter((v): v is LeafChunk => !!v);
    }

    async getAll(): Promise<LeafChunk[]> {
        return Array.from(this.store.values());
    }

    async put(chunks: LeafChunk[]): Promise<LeafChunk[]> {
        for (const chunk of chunks) {
            this.store.set(chunk.id, chunk);
        }
        return chunks;
    }

    async upsert(chunks: LeafChunk[]): Promise<LeafChunk[]> {
        for (const chunk of chunks) {
            this.store.set(chunk.id, chunk);
        }
        return chunks;
    }

    async query(embedding: number[], k: number = 5): Promise<LeafChunk[]> {
        const all = Array.from(this.store.values());
        return all
            .map(chunk => ({
                chunk,
                score: cosineSimilarity(chunk.embedding, embedding)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, k)
            .map(e => e.chunk);
    }
}
