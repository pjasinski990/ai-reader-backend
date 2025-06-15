export type ContentType = 'text' | 'image' | 'audio' | 'video';

export interface ParsedContentBase {
    type: ContentType;
    metadata?: Record<string, unknown>;
}

export interface TextContent extends ParsedContentBase {
    type: 'text';
    text: string;
}

export interface BinaryContent extends ParsedContentBase {
    type: 'image' | 'audio' | 'video';
    bits: Buffer;
}

export type ParsedContent = TextContent | BinaryContent;
