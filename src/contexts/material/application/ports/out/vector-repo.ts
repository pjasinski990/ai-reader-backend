import { LeafChunk } from '@/contexts/material/entities/chunk';

export interface VectorRepo {
    get(ids: string[]): Promise<LeafChunk[]>;
    getAll(): Promise<LeafChunk[]>;
    put(chunks: LeafChunk[]): Promise<LeafChunk[]>;
    delete(ids: string[]): Promise<string[]>;
    upsert(chunks: LeafChunk[]): Promise<LeafChunk[]>;
    query(embedding: number[], k: number): Promise<LeafChunk[]>;
}
