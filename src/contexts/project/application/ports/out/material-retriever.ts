import { MaterialPreview } from '@/contexts/project/entities/material-preview';

export interface MaterialRetriever {
    execute(ids: string[]): Promise<MaterialPreview[]>;
}
