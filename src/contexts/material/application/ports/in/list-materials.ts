import { MaterialPreview } from '@/contexts/material/entities/material';

export interface ListMaterials {
    execute(projectId: string): Promise<MaterialPreview[]>;
}
