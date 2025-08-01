import { ContentType, ParsedContent } from '@/contexts/material/entities/parsed-content';

// TODO add projectId
export interface Material {
    id: string;
    projectId: string;
    title: string;
    content: ParsedContent;
}

export interface MaterialPreview {
    id: string;
    projectId: string;
    title: string;
    metadata: Record<string, unknown>;
    type: ContentType;
}
