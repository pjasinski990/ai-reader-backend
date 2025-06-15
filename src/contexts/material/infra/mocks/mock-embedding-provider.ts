import { EmbeddingProvider } from '@/contexts/material/application/ports/out/embedding-provider';
import { Embeddable, Embedded } from '@/contexts/material/entities/chunk';

export class MockEmbeddingProvider implements EmbeddingProvider {
    embed<T extends Embeddable>(chunks: T[]): Promise<(T & Embedded)[]> {
        const embedded = chunks.map((c, i ) => {
            const e = Array.from({ length: 32 }, () => i);
            return { ...c, embedding: e };
        });
        return Promise.resolve(embedded);
    }

    embedOne<T extends Embeddable>(chunk: T): Promise<T & Embedded> {
        const embedding = Array.from({ length: 32 }, () => 1);
        return Promise.resolve({ ...chunk, embedding });
    }
}
