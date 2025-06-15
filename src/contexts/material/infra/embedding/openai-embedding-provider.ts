import { EmbeddingProvider } from '@/contexts/material/application/ports/out/embedding-provider';
import { OpenAI } from 'openai';
import { Embeddable, Embedded } from '@/contexts/material/entities/chunk';

export class OpenAIEmbeddingProvider implements EmbeddingProvider {
    private MODEL = 'text-embedding-3-small';
    private MAX_BATCH = 96;
    private openai: OpenAI;

    constructor(apiKey: string) {
        this.openai = new OpenAI({ apiKey });
    }

    async embed<T extends Embeddable>(chunks: T[]): Promise<(T & Embedded)[]> {
        const batches: T[][] = [];
        for (let i = 0; i < chunks.length; i += this.MAX_BATCH) {
            batches.push(chunks.slice(i, i + this.MAX_BATCH));
        }

        const batchResults = await Promise.all(
            batches.map(batch => this.embedBatch(batch))
        );
        return batchResults.flat();
    }

    async embedOne<T extends Embeddable>(chunk: T): Promise<T & Embedded> {
        const [result] = await this.embed([chunk]);
        return result;
    }

    private async embedBatch<T extends Embeddable>(batch: T[]): Promise<(T & Embedded)[]> {
        if (!batch.length) return [];
        if (batch.length > this.MAX_BATCH) {
            throw new Error(`Unexpected batch size - ${batch.length} is bigger than max ${this.MAX_BATCH}`);
        }
        const texts = batch.map(item => item.text);
        const res = await this.openai.embeddings.create({
            model: this.MODEL,
            input: texts,
        });

        if (!Array.isArray(res.data) || res.data.length !== batch.length) {
            throw new Error('Mismatch in batch embedding response size');
        }

        return batch.map((item, idx) => ({
            ...item,
            embedding: res.data[idx].embedding,
        }));
    }
}
