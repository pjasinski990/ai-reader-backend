import { MaterialRetriever } from '@/contexts/project/application/ports/out/material-retriever';
import { GetMaterials } from '@/contexts/material/application/ports/in/get-materials';
import { MaterialPreview } from '@/contexts/project/entities/material-preview';

export class InAppMaterialRetriever implements MaterialRetriever {
    constructor(private readonly getMaterials: GetMaterials) {}

    async execute(ids: string[]): Promise<MaterialPreview[]> {
        const materials = await this.getMaterials.execute(ids);
        return materials.map(m => {
            return {
                id: m.id,
                // TODO what is description?
                description: 'TODO',
                name: m.title,
                // TODO this information should be available at this point
                type: 'text',
            };
        });
    }
}
