import { ParsedContent } from '@/contexts/material/entities/pased-content';

// TODO add projectId
export interface Material {
    id: string;
    title: string;
    content: ParsedContent;
}
