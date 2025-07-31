import { ListMaterials } from '@/contexts/material/application/ports/in/list-materials';
import { MaterialPreview } from '@/contexts/material/entities/material';
import { MaterialRepo } from '@/contexts/material/application/ports/out/material-repo';

export class ListMaterialsUseCase implements ListMaterials {
    constructor(
        private readonly materialRepo: MaterialRepo
    ) { }

    async execute(projectId: string): Promise<MaterialPreview[]> {
        const materials = await this.materialRepo.getByProjectId(projectId);
        return materials.map(m => {
            return {
                id: m.id,
                projectId: m.projectId,
                title: m.title,
                type: m.content.type,
                metadata: m.content.metadata ?? {},
            };
        });
    }
}
