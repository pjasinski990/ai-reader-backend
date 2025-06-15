import { ParsedContent } from '@/contexts/material/entities/pased-content';

export interface Material {
    id: string;
    userId: string;
    title: string;
    content: ParsedContent;
}
