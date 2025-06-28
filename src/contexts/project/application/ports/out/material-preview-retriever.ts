import { MaterialPreview } from '@/contexts/project/entities/material-preview';

export interface MaterialPreviewRetriever {
    execute(ids: string[]): Promise<MaterialPreview[]>;
}
