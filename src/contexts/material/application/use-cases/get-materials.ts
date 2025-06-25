import { GetMaterials } from '@/contexts/material/application/ports/in/get-materials';
import { Material } from '@/contexts/material/entities/material';
import { MaterialRepo } from '@/contexts/material/application/ports/out/material-repo';

export class GetMaterialsUseCase implements GetMaterials {
    constructor(
        private readonly materialRepo: MaterialRepo
    ) { }

    execute(ids: string[]): Promise<Material[]> {
        return this.materialRepo.getByIds(ids);
    }
}
