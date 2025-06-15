import { Summarizable, Summarized } from '@/shared/entities/chunk';

export interface Summarizer {
    summarize<T extends Summarizable>(chunks: T[]): Promise<(T & Summarized)[]>;
    summarizeOne<T extends Summarizable>(chunk: T): Promise<T & Summarized>;
}
