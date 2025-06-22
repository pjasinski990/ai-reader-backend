import { Material } from '@/contexts/material/entities/material';

export interface GetMaterials {
    execute(
        ids: string[],
    ): Promise<Material[]>;
}
