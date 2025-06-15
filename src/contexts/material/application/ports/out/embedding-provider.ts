import { Embeddable, Embedded } from '@/contexts/material/entities/chunk';

export interface EmbeddingProvider {
    embed<T extends Embeddable>(chunks: T[]): Promise<(T & Embedded)[]>;
    embedOne<T extends Embeddable>(chunk: T): Promise<T & Embedded>;
}
