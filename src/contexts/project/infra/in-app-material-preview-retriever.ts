import { MaterialPreviewRetriever } from '@/contexts/project/application/ports/out/material-preview-retriever';
import { GetMaterials } from '@/contexts/material/application/ports/in/get-materials';
import { MaterialPreview } from '@/contexts/project/entities/material-preview';

export class InAppMaterialPreviewRetriever implements MaterialPreviewRetriever {
    constructor(
        private readonly getMaterials: GetMaterials,
    ) {}

    async execute(ids: string[]): Promise<MaterialPreview[]> {
        const materials = await this.getMaterials.execute(ids);
        return materials.map(m => {
            return {
                id: m.id,
                title: m.title,
                type: m.content.type,
            };
        });
    }
}
