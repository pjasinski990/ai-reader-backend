import { TextChunk } from '@/contexts/material/entities/chunk';

export interface TextChunker {
    chunk(text: string, chunkSize: number): TextChunk[];
}
