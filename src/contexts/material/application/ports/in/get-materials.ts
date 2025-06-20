import { MaterialRepo } from '@/contexts/material/application/ports/out/material-repo';
import { Material } from '@/contexts/material/entities/material';

export interface GetMaterials {
    execute(
        ids: string[],
        repo: MaterialRepo,
    ): Promise<Material[]>;
}
