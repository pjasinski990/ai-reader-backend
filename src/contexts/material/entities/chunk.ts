export interface Embeddable {
    text: string;
}

export interface Embedded  {
    embedding: number[];
}

export interface Summarizable {
    text: string;
}

export interface Summarized {
    summary: string;
}

export interface TextChunk extends Embeddable, Summarizable {
    id: string,
    parentId: string | null,
    childrenIds: string[],
    text: string,
    metadata: TextChunkMeta
}

export interface TextChunkMeta {
    level: number,
    startOffset: number,
    endOffset: number,
}

export interface SummarizedChunk extends TextChunk, Summarized { }

export interface LeafChunk extends TextChunk, Embedded { }

export interface LeafChunk extends TextChunk, Embedded, Summarized { }

export interface ParentChunk extends TextChunk, Summarized { }
