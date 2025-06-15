import { TextChunk } from '@/shared/entities/chunk';

export interface TextChunker {
    chunk(text: string, chunkSize: number): TextChunk[];
}
