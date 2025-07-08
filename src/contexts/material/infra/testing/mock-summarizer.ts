import { Summarizer } from '@/contexts/material/application/ports/out/summarizer';
import { Summarizable, Summarized } from '@/contexts/material/entities/chunk';

export class MockSummarizer implements Summarizer {
    summarize<T extends Summarizable>(chunks: T[]): Promise<(T & Summarized)[]> {
        const summarized = chunks.map(c => {
            return { ...c, summary: c.text };
        });
        return Promise.resolve(summarized);
    }

    summarizeOne<T extends Summarizable>(chunk: T): Promise<T & Summarized> {
        return Promise.resolve({ ...chunk, summary: chunk.text });
    }
}
