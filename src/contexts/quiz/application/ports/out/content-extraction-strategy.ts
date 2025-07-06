import { MaterialRepo } from '@/contexts/material/application/ports/out/material-repo';

export interface ContentExtractionContext {
    projectTitle: string;
    materialIds: string[];
    options?: Record<string, unknown>;
}

export interface ContentExtractionStrategy {
    extractContent(
        context: ContentExtractionContext,
        materialRepo: MaterialRepo
    ): Promise<string>;
} 
