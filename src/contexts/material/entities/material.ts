import { ParsedContent } from '@/contexts/material/entities/pased-content';

export interface Material {
    id: string;
    title: string;
    content: ParsedContent;
}
